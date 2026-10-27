import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Home, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function SimpleShell({
  portal,
  title,
  subtitle,
  children,
}: {
  portal: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const signOut = async () => {
    await qc.cancelQueries();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.clear();
    navigate({
      to: portal.startsWith("Caretaker")
        ? "/caretaker-login"
        : portal.startsWith("Tenant")
          ? "/tenant-login"
          : "/auth",
      replace: true,
    });
  };
  return (
    <div className="min-h-screen bg-[#f7f4eb] text-[#17261c]">
      <header className="bg-[#0c2918] text-[#f7f4eb]">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]">
              <Home aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="truncate font-serif text-lg font-semibold">RentDesk</div>
              <div className="text-xs text-[#aebcaf]">{portal}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="h-9 border-white/20 bg-transparent text-xs text-[#f7f4eb] shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#17261c] sm:text-[2.4rem]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-[#69746c]">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export function IssueBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-danger-soft text-destructive",
    in_progress: "bg-warning-soft text-warning",
    resolved: "bg-success-soft text-success",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}
