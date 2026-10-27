import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: location.pathname.startsWith("/caretaker") ? "/caretaker-login" : location.pathname.startsWith("/portal") ? "/tenant-login" : "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
