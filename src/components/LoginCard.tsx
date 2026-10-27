import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Home, HardHat, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allowedOnPortal, portalHome, rolesQuery, type Portal } from "@/lib/data";

const copy = {
  landlord: {
    badge: "Landlord sign-in",
    path: "/auth",
    others: [
      { to: "/caretaker-login", text: "Caretaker? Use the caretaker sign-in" },
      { to: "/tenant-login", text: "Tenant? Use the tenant sign-in" },
    ],
  },
  caretaker: {
    badge: "Caretaker sign-in",
    path: "/caretaker-login",
    others: [
      { to: "/auth", text: "Landlord? Sign in here" },
      { to: "/tenant-login", text: "Tenant? Use the tenant sign-in" },
    ],
  },
  tenant: {
    badge: "Tenant sign-in",
    path: "/tenant-login",
    others: [
      { to: "/auth", text: "Landlord? Sign in here" },
      { to: "/caretaker-login", text: "Caretaker? Use the caretaker sign-in" },
    ],
  },
} as const;

export function LoginCard({ portal }: { portal: Portal }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const c = copy[portal];
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for the eye toggle

  /** Only let accounts that belong to this portal through. */
  const proceed = useCallback(
    async (quiet = false) => {
      qc.removeQueries({ queryKey: ["roles"] });
      const roles = await qc.fetchQuery(rolesQuery);
      if (allowedOnPortal(roles, portal)) return void navigate({ to: portalHome(portal) });
      if (quiet) return;
      await supabase.auth.signOut();
      qc.clear();
      const where = roles.includes("tenant")
        ? "tenant"
        : roles.includes("caretaker")
          ? "caretaker"
          : "landlord";
      toast.error(
        roles.length === 0
          ? "This account isn't linked yet. Ask your caretaker to add your email."
          : `This is a ${where} account. Please use the ${where} sign-in.`,
      );
    },
    [navigate, portal, qc],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) proceed(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "PASSWORD_RECOVERY") {
        setMode("reset");
        setBusy(false);
        return;
      }
      if (ev === "SIGNED_IN") setTimeout(() => proceed(), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [proceed]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "reset") {
      const { error } = await supabase.auth.updateUser({ password });
      setBusy(false);
      if (error) return void toast.error(error.message);
      toast.success("Your password has been updated.");
      navigate({ to: portalHome(portal) });
      return;
    }
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name, portal },
        },
      });
      setBusy(false);
      if (error) return void toast.error(error.message);
      toast.success("Check your email to confirm your account.");
      setMode("in");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) toast.error(error.message);
      // success is handled by the SIGNED_IN listener
    }
  };

  const google = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setBusy(false);
      toast.error("Google sign-in failed: " + error.message);
    }
  };

  const resetPassword = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address first.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("If an account exists for that email, a password reset link is on its way.");
  };

  const Icon = portal === "caretaker" ? HardHat : Home;
  return (
    <div className="grid min-h-screen place-items-center bg-[#f7f4eb] px-4 py-8">
      <div className="w-full max-w-[360px] rounded-[18px] border border-[#e7e1d6] bg-[#fffefa] p-6 shadow-[0_6px_18px_rgba(27,42,30,0.07)] sm:p-7">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#145632] text-[#fffefa]">
            <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="font-serif text-base font-semibold leading-tight text-[#17261c]">
              RentDesk
            </div>
            <div className="text-xs text-[#69746c]">{c.badge}</div>
          </div>
        </div>
        <h1 className="font-serif text-[22px] font-semibold tracking-tight text-[#17261c]">
          {mode === "reset"
            ? "Set a new password"
            : mode === "in"
              ? portal === "caretaker"
                ? "Caretaker portal"
                : "Welcome back"
              : portal === "caretaker"
                ? "Activate caretaker account"
                : "Create your account"}
        </h1>
        {mode === "up" && portal === "caretaker" && (
          <p className="mt-1 text-xs text-muted-foreground">
            Use the email your landlord added for you.
          </p>
        )}

        <form onSubmit={submit} className="mt-4 space-y-3">
          {mode === "up" && (
            <div className="space-y-1.5">
              <Label htmlFor="signup-name">Full name</Label>
              <Input
                id="signup-name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-xs font-medium text-[#36463a]">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-lg border-[#ded8cd] bg-[#fffefa] text-sm focus-visible:ring-[#145632]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-xs font-medium text-[#36463a]">
              {mode === "reset" ? "New password" : "Password"}
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "in" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg border-[#ded8cd] bg-[#fffefa] pr-10 text-sm focus-visible:ring-[#145632]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-[#69746c] hover:text-[#145632] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            className="h-10 w-full rounded-lg bg-[#145632] text-sm font-semibold text-white shadow-none hover:bg-[#104728] focus-visible:ring-[#145632]"
            disabled={busy}
          >
            {busy
              ? "Please wait…"
              : mode === "in"
                ? "Sign in"
                : mode === "reset"
                  ? "Update password"
                  : "Create account"}
          </Button>
        </form>

        {mode === "in" && (
          <button
            type="button"
            className="mt-2 w-full rounded py-1 text-center text-xs font-medium text-[#145632] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632] disabled:opacity-50"
            onClick={resetPassword}
            disabled={busy}
          >
            Forgot your password?
          </button>
        )}
        {mode === "in" && (
          <>
            <Button
              variant="outline"
              className="mt-2 h-10 w-full rounded-lg border-[#e4ded2] bg-[#f9f6ef] text-xs font-medium text-[#25382b] shadow-none hover:bg-[#f1ece2]"
              onClick={google}
              disabled={busy}
            >
              Continue with Google
            </Button>
            {c.others.map((o) => (
              <Link
                key={o.to}
                to={o.to}
                className="mt-2 block rounded text-center text-[11px] font-medium text-[#145632] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]"
              >
                {o.text}
              </Link>
            ))}
            <button
              type="button"
              className="mt-2 w-full rounded text-center text-[11px] font-medium text-[#69746c] hover:text-[#145632] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]"
              onClick={() => setMode("up")}
            >
              {portal === "caretaker" ? "First time? Activate your account" : "Create an account"}
            </button>
          </>
        )}
        {mode === "up" && (
          <button
            type="button"
            className="mt-4 w-full rounded text-center text-[11px] font-medium text-[#69746c] hover:text-[#145632] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#145632]"
            onClick={() => setMode("in")}
          >
            Have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
