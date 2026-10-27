import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  LogOut,
  Building,
  Users,
  Wrench,
  Megaphone,
  Plus,
  Trash2,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Droplets,
  Receipt,
  Calculator,
  FolderOpen,
  FileText,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/caretaker/dashboard")({
  head: () => ({ meta: [{ title: "Caretaker dashboard | RentDesk" }] }),
  component: CaretakerDashboard,
});

const DOC_KINDS: Record<string, string> = {
  lease: "Lease agreement",
  id: "National ID",
  other: "Other",
};
const PREFIX = "tenant-docs:";

function CaretakerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "tenants" | "billing" | "finances" | "issues" | "notices" | "documents"
  >("tenants");

  const [profile, setProfile] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);

  // Financial Stats
  const [stats, setStats] = useState({
    collectedThisMonth: 0,
    expectedRentThisMonth: 0,
    totalArrears: 0,
  });
  const [financeMonth, setFinanceMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const [newTenant, setNewTenant] = useState({
    name: "",
    phone: "",
    unit: "",
    rent: 0,
    water: 0,
    garbage: 0,
  });
  const [notice, setNotice] = useState({ target: "all", title: "", content: "" });

  // Billing state
  const [billingMonth, setBillingMonth] = useState(new Date().toISOString().slice(0, 7));
  const [waterRates, setWaterRates] = useState<{ [key: string]: number }>({});

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate({ to: "/caretaker-login" });

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (profileData) setProfile(profileData);

      const { data: staffData, error: staffError } = await supabase
        .from("property_staff")
        .select("property_id, property:properties(name, location, owner_id)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (staffError) throw new Error(staffError.message);
      if (!staffData) {
        throw new Error(
          `No property is assigned to ${user.email ?? "this account"}. Ask your landlord to add this exact sign-in account under Properties > Caretaker Portal Access, then sign out and sign in again.`,
        );
      }

      setProperty(staffData.property);
      setLoadError(null);
      const propId = staffData.property_id;

      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("*")
        .eq("property_id", propId)
        .order("name");

      if (tenantError) throw new Error(tenantError.message);
      if (tenantData) setTenants(tenantData);

      const { data: issueData } = await supabase
        .from("issues")
        .select("*, tenant:tenants(name)")
        .eq("property_id", propId)
        .order("created_at", { ascending: false });

      if (issueData)
        setIssues(issueData.map((i: any) => ({ ...i, tenant_name: i.tenant?.name || "Unknown" })));

      if (tenantData && tenantData.length > 0) {
        const tenantIds = tenantData.map((t) => t.id);

        // Calculate Expected Rent
        const expectedRent = tenantData.reduce((sum, t) => sum + Number(t.rent), 0);

        // Calculate Total Arrears
        const totalArrears = tenantData.reduce((sum, t) => sum + Number(t.balance), 0);

        // Calculate Collected This Month (Filtered by current month)
        const { data: payments } = await supabase
          .from("payments")
          .select("amount, paid_on")
          .in("tenant_id", tenantIds)
          .gte("paid_on", `${financeMonth}-01`)
          .lte("paid_on", `${financeMonth}-31`);

        const collected = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        setStats({
          collectedThisMonth: collected,
          expectedRentThisMonth: expectedRent,
          totalArrears: totalArrears,
        });
      }
    } catch (err: unknown) {
      console.error("Dashboard fetch error:", err);
      const message = err instanceof Error ? err.message : "Could not load caretaker dashboard.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [financeMonth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/caretaker-login" });
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    // Re-fetch the exact property_id from property_staff to prevent "Unknown property" errors
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("Your session expired. Please sign in again.");
    const { data: staffData } = await supabase
      .from("property_staff")
      .select("property_id")
      .eq("user_id", user.id)
      .single();

    if (!staffData) return toast.error("Could not verify property");

    const { error } = await supabase.from("tenants").insert({
      property_id: staffData.property_id, // Use the verified ID
      owner_id: property.owner_id,
      name: newTenant.name,
      phone: newTenant.phone,
      unit: newTenant.unit,
      rent: newTenant.rent,
      water: newTenant.water,
      garbage: newTenant.garbage,
      balance: newTenant.rent + newTenant.water + newTenant.garbage,
    });
    if (error) return toast.error(error.message);
    toast.success("Tenant added successfully");
    setNewTenant({ name: "", phone: "", unit: "", rent: 0, water: 0, garbage: 0 });
    fetchData();
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return;
    const { error } = await supabase.from("tenants").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Tenant deleted");
    fetchData();
  };

  const handleResolveIssue = async (id: string) => {
    await supabase.from("issues").update({ status: "resolved" }).eq("id", id);
    toast.success("Issue marked as resolved");
    fetchData();
  };

  const handleSendNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !notice.content) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: staffData } = await supabase
      .from("property_staff")
      .select("property_id")
      .eq("user_id", user.id)
      .single();
    if (!staffData) return toast.error("Could not verify property ID");

    const { error } = await supabase.from("announcements").insert({
      property_id: staffData.property_id,
      owner_id: property.owner_id,
      author_id: user.id,
      title: notice.title,
      body: notice.content,
    });
    if (error) return toast.error(error.message);
    toast.success("Notice sent!");
    setNotice({ target: "all", title: "", content: "" });
  };

  const handleGenerateBill = async (tenant: any) => {
    const units = waterRates[tenant.id] || 0;
    const waterCharge = units * 150;
    const totalBill = Number(tenant.rent) + waterCharge + Number(tenant.garbage);

    const { error: updateError } = await supabase
      .from("tenants")
      .update({ water: waterCharge, balance: Number(tenant.balance) + totalBill })
      .eq("id", tenant.id);

    if (updateError) return toast.error(updateError.message);
    toast.success(`Bill of KES ${totalBill} generated for ${tenant.name}`);
    setWaterRates({ ...waterRates, [tenant.id]: 0 });
    fetchData();
  };

  if (loading)
    return (
      <div className="portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] p-10 text-center text-[#69746c]">
        Loading caretaker portal...
      </div>
    );
  if (!property)
    return (
      <div className="portal-theme grid min-h-screen place-items-center bg-[#f7f4eb] p-6 text-center font-medium text-red-700">
        <div>
          <AlertCircle className="h-10 w-10 mx-auto mb-4" />
          <h2 className="mb-2 font-serif text-xl font-bold">Dashboard Error</h2>
          <p className="mx-auto max-w-xl text-sm leading-6">
            {loadError || "Your caretaker property could not be loaded."}
          </p>
          <Button
            onClick={handleLogout}
            className="mt-6 bg-[#145632] text-white hover:bg-[#104728]"
          >
            Sign out
          </Button>
        </div>
      </div>
    );

  return (
    <div className="portal-theme flex min-h-screen flex-col bg-[#f7f4eb] text-[#17261c]">
      <header className="sticky top-0 z-10 border-b border-[#1e422b] bg-[#0c2918] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]">
              <Building className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold leading-tight text-[#f7f4eb]">
                RentDesk
              </p>
              <h1 className="truncate text-sm font-medium text-[#c2cec4]">
                {property.name} <span className="px-1 text-[#8fa193]">·</span>{" "}
                {profile?.full_name || "Caretaker"}
              </h1>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-9 shrink-0 rounded-lg border-white/20 bg-transparent text-xs font-medium text-[#f7f4eb] shadow-none hover:bg-white/10 hover:text-white focus-visible:ring-[#d6aa59]"
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <div className="border-b border-[#1e422b] bg-[#0c2918] px-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
          {[
            { id: "tenants", label: "Tenants", icon: Users },
            { id: "billing", label: "Monthly Billing", icon: Receipt },
            { id: "finances", label: "Finances", icon: DollarSign },
            { id: "issues", label: "Maintenance", icon: Wrench },
            { id: "documents", label: "Documents", icon: FolderOpen },
            { id: "notices", label: "Notices", icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d6aa59] sm:text-sm ${
                activeTab === tab.id
                  ? "border-[#d6aa59] text-[#f7f4eb]"
                  : "border-transparent text-[#aebcaf] hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
        {/* TENANTS TAB */}
        {activeTab === "tenants" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" /> Add Tenant
              </h2>
              <form onSubmit={handleAddTenant} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    required
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    required
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    className="bg-slate-50"
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    required
                    placeholder="e.g. A1"
                    value={newTenant.unit}
                    onChange={(e) => setNewTenant({ ...newTenant, unit: e.target.value })}
                    className="bg-slate-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Rent</Label>
                    <Input
                      type="number"
                      required
                      value={newTenant.rent || ""}
                      onChange={(e) => setNewTenant({ ...newTenant, rent: Number(e.target.value) })}
                      className="bg-slate-50"
                    />
                  </div>
                  <div>
                    <Label>Water</Label>
                    <Input
                      type="number"
                      value={newTenant.water || ""}
                      onChange={(e) =>
                        setNewTenant({ ...newTenant, water: Number(e.target.value) })
                      }
                      className="bg-slate-50"
                    />
                  </div>
                  <div>
                    <Label>Garbage</Label>
                    <Input
                      type="number"
                      value={newTenant.garbage || ""}
                      onChange={(e) =>
                        setNewTenant({ ...newTenant, garbage: Number(e.target.value) })
                      }
                      className="bg-slate-50"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                >
                  Save Tenant
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-bold text-slate-900">Registered Tenants ({tenants.length})</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {tenants.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        {t.name}{" "}
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          Unit {t.unit}
                        </span>
                      </p>
                      <p className="text-sm text-slate-500 mt-1">{t.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Balance
                        </p>
                        <p
                          className={`font-bold ${t.balance > 0 ? "text-red-600" : "text-emerald-600"}`}
                        >
                          KES {t.balance.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTenant(t.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {tenants.length === 0 && (
                  <p className="p-10 text-center text-slate-500">No tenants found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === "billing" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="h-5 w-5" /> Monthly Billing
              </h2>
              <div className="flex items-center gap-2">
                <Label className="text-xs font-semibold">Billing Month</Label>
                <Input
                  type="month"
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(e.target.value)}
                  className="w-40 h-8 text-sm"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {tenants.map((t) => {
                const units = waterRates[t.id] || 0;
                const waterCost = units * 150;
                const totalBill = Number(t.rent) + waterCost + Number(t.garbage);

                return (
                  <div
                    key={t.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        {t.name}{" "}
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          Unit {t.unit}
                        </span>
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-slate-500">
                          Rent: <strong className="text-slate-800">KES {t.rent}</strong>
                        </span>
                        <span className="text-slate-500">
                          Garbage: <strong className="text-slate-800">KES {t.garbage}</strong>
                        </span>
                        <span className="text-red-500">
                          Arrears: <strong>KES {t.balance}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <div>
                        <Label className="text-xs font-semibold text-blue-800 flex items-center gap-1">
                          <Droplets className="h-3 w-3" /> Water Units Used
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={units || ""}
                          onChange={(e) =>
                            setWaterRates({ ...waterRates, [t.id]: Number(e.target.value) })
                          }
                          className="w-24 h-8 mt-1 bg-white border-blue-200"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-blue-600">Cost @ 150/unit</p>
                        <p className="font-bold text-blue-900 text-sm">
                          KES {waterCost.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <div className="text-right mb-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          New Total Due
                        </p>
                        <p className="font-bold text-slate-900 text-lg">
                          KES {totalBill.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleGenerateBill(t)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        <Receipt className="h-4 w-4 mr-2" /> Generate Bill
                      </Button>
                    </div>
                  </div>
                );
              })}
              {tenants.length === 0 && (
                <p className="p-10 text-center text-slate-500">No tenants found.</p>
              )}
            </div>
          </div>
        )}

        {/* FINANCES TAB */}
        {activeTab === "finances" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Financial Overview</h2>
              <div className="flex items-center gap-2">
                <Label>Month:</Label>
                <Input
                  type="month"
                  value={financeMonth}
                  onChange={(e) => setFinanceMonth(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Expected Rent
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  KES {stats.expectedRentThisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-2">Based on monthly rent of all tenants.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Collected This Month
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  KES {stats.collectedThisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Only payments received in the selected month.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Total Arrears
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  KES {stats.totalArrears.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Total unpaid balance across all tenants.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ISSUES TAB */}
        {activeTab === "issues" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Maintenance Requests</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900">{issue.title}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Reported by: {issue.tenant_name} •{" "}
                      {new Date(issue.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${issue.status === "open" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {issue.status === "open" ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : (
                        <CheckCircle className="h-3 w-3" />
                      )}{" "}
                      {issue.status.toUpperCase()}
                    </span>
                    {issue.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveIssue(issue.id)}
                        className="border-slate-200 text-slate-600"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {issues.length === 0 && (
                <p className="p-10 text-center text-slate-500">No maintenance issues reported.</p>
              )}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tenant Documents</h2>
            {tenants.map((tenant) => (
              <TenantDocumentList key={tenant.id} tenant={tenant} />
            ))}
          </div>
        )}

        {/* NOTICES TAB */}
        {activeTab === "notices" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" /> Send Notice
            </h2>
            <form onSubmit={handleSendNotice} className="space-y-5">
              <div>
                <Label>Send To</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  value={notice.target}
                  onChange={(e) => setNotice({ ...notice, target: e.target.value })}
                >
                  <option value="all">All Tenants in Building</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      Unit {t.unit} - {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  required
                  placeholder="e.g. Water Maintenance"
                  value={notice.title}
                  onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                  className="bg-slate-50 mt-1"
                />
              </div>
              <div>
                <Label>Message</Label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  placeholder="e.g. Water will be shut off tomorrow..."
                  value={notice.content}
                  onChange={(e) => setNotice({ ...notice, content: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Send Notice
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Sub-component to handle Documents per tenant ---
function TenantDocumentList({ tenant }: { tenant: any }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false });
    if (data) setDocuments(data);
  };

  useEffect(() => {
    fetchDocs();
  }, [tenant.id]);

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first");
    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = `${tenant.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const s = await supabase.storage.from("Documents").upload(path, file, { upsert: false });

    if (s.error) {
      toast.error(s.error.message);
      setUploading(false);
      return;
    }

    const { error } = await supabase.from("documents").insert({
      owner_id: tenant.owner_id,
      property_id: tenant.property_id,
      tenant_id: tenant.id,
      kind: "lease",
      title: `Lease Agreement — ${tenant.name}`,
      url: `tenant-docs:${path}`,
    });

    setUploading(false);
    if (error) return toast.error(error.message);

    toast.success("Document uploaded");
    setFile(null);
    fetchDocs();
  };

  const handleOpenDoc = async (url: string) => {
    if (!url.startsWith("tenant-docs:")) return window.open(url, "_blank");
    const { data, error } = await supabase.storage
      .from("Documents")
      .createSignedUrl(url.slice(12), 300);
    if (error) return toast.error(error.message);
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-4">
        {tenant.name} (Unit {tenant.unit})
      </h3>

      <div className="flex gap-2 mb-4">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="bg-slate-50 max-w-sm"
        />
        <Button onClick={handleUpload} disabled={uploading} className="bg-slate-900 text-white">
          <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Post Agreement"}
        </Button>
      </div>

      <div className="divide-y divide-slate-100 border rounded-lg">
        {documents.map((doc) => (
          <div key={doc.id} className="p-3 flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 font-medium">
              <FileText className="h-4 w-4 text-slate-400" /> {doc.title}
            </span>
            <Button variant="link" size="sm" onClick={() => handleOpenDoc(doc.url)}>
              View / Download
            </Button>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="p-3 text-slate-500 text-sm text-center">
            No documents uploaded for this tenant yet.
          </p>
        )}
      </div>
    </div>
  );
}