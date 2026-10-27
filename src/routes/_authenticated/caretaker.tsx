import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { inviteStaff } from "@/server/invite";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/caretaker")({
  component: CaretakerPage,
});

function CaretakerPage() {
  const [email, setEmail] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("You must be signed in to invite staff.");

      await inviteStaff({
        data: {
          email,
          role: "caretaker",
          propertyId,
          accessToken: sessionData.session.access_token,
        },
      });
      toast.success("Invite sent! Check your email.");
      setEmail("");
      setPropertyId("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
            : String(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Invite Caretaker</h1>

      <form onSubmit={handleInvite} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="caretaker-email">Email Address</Label>
          <Input
            id="caretaker-email"
            type="email"
            placeholder="caretaker@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="caretaker-property">Property ID</Label>
          <Input
            id="caretaker-property"
            placeholder="Enter property ID"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Invite Caretaker"}
        </Button>
      </form>
    </div>
  );
}
