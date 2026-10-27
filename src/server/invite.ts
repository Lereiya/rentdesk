import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const inviteInput = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  role: z.enum(["caretaker", "tenant"]),
  propertyId: z.string().uuid().optional(),
});

export const inviteStaff = createServerFn({ method: "POST" })
  .validator(inviteInput)
  .handler(async ({ data }) => {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secretKey) {
      throw new Error("Missing Supabase URL or Secret Key in .env file.");
    }

    // Admin client bypasses all RLS and security checks
    const supabaseAdmin = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Invite the user
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      redirectTo: 'http://localhost:3000/auth',
    });

    if (inviteError) throw new Error(inviteError.message);
    if (!inviteData.user) throw new Error("Failed to create user.");

    // 2. Assign the role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: inviteData.user.id, role: data.role });

    if (roleError) throw new Error(roleError.message);

    // 3. Link to property (Only if caretaker and propertyId is provided)
    if (data.role === "caretaker" && data.propertyId) {
      // Note: We use 'staff_email' because that is what your SQL migration created.
      // If your table uses 'email', change 'staff_email' to 'email' below.
      const { error: staffError } = await supabaseAdmin.from("property_staff").insert({
        property_id: data.propertyId,
        staff_email: data.email,
      });
      
      if (staffError) throw new Error(staffError.message);
    }

    return { success: true };
  });