import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'

export const inviteCaretaker = createServerFn({ method: 'POST' })
  .validator((data: { email: string; propertyId: string }) => data)
  .handler(async ({ data }) => {
    // 1. Use the SERVICE_ROLE_KEY (Admin client) - Must be server-side only!
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL!, 
      process.env.SUPABASE_SECRET_KEY! 
    )

    // 2. Invite the user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      redirectTo: `http://localhost:3000/auth`, // They will land here to set their password
    })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error("Failed to create user")

    // 3. Assign the role in the public.user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: authData.user.id, role: 'caretaker' })

    if (roleError) throw new Error(roleError.message)

    // 4. Link them to the property
    await supabaseAdmin.from('property_staff').insert({
      property_id: data.propertyId,
      staff_email: data.email,
      role: 'caretaker'
    })

    return { success: true }
  })