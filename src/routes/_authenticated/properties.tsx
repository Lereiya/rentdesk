import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Building, MapPin, User, X, Plus, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/properties")({
  head: () => ({ meta: [{ title: "Properties | RentDesk" }] }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const [properties, setProperties] = useState<Tables<"properties">[]>([]);
  const [staff, setStaff] = useState<Tables<"property_staff">[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStaffEmail, setNewStaffEmail] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch properties
    const { data: props } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id)
      .order("name");
    if (props) setProperties(props);

    // Fetch all staff for these properties
    const { data: staffData } = await supabase
      .from("property_staff")
      .select("*")
      .eq("owner_id", user.id);
    if (staffData) setStaff(staffData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStaff = async (propertyId: string) => {
    const email = newStaffEmail[propertyId]?.trim().toLowerCase();
    if (!email) return toast.error("Please enter an email");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Insert the new caretaker
    const { error } = await supabase.from("property_staff").insert({
      property_id: propertyId,
      owner_id: user.id, // This fixes the RLS error!
      email: email,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Caretaker added successfully");
      setNewStaffEmail({ ...newStaffEmail, [propertyId]: "" });
      fetchData(); // Refresh list
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm("Remove this caretaker?")) return;
    const { error } = await supabase.from("property_staff").delete().eq("id", staffId);
    if (error) return toast.error(error.message);
    toast.success("Caretaker removed");
    fetchData();
  };

  if (loading) {
    return (
      <AppShell title="Properties" subtitle="Loading your properties...">
        <p role="status" className="p-10 text-center text-[#69746c]">
          Loading properties...
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Properties" subtitle={`${properties.length} properties under management`}>
      <div className="portal-theme">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {properties.map((prop) => {
            const propStaff = staff.filter((s) => s.property_id === prop.id);

            return (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{prop.name}</h2>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {prop.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Vacant</p>
                    <p className="font-bold text-slate-900">{prop.units - prop.occupied} units</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Arrears</p>
                    <p className="font-bold text-red-600">KES 0</p>
                  </div>
                </div>

                {/* Staff Management Section */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" /> Caretaker Portal Access
                  </p>

                  {/* List of existing staff */}
                  <div className="space-y-2 mb-3">
                    {propStaff.map((s) => (
                      <div
                        key={s.id}
                        className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-md border border-slate-100"
                      >
                        <span className="text-sm font-medium text-slate-700">{s.email}</span>
                        <button
                          onClick={() => handleRemoveStaff(s.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {propStaff.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No caretakers assigned yet.</p>
                    )}
                  </div>

                  {/* Add new staff */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="caretaker@email.com"
                      value={newStaffEmail[prop.id] || ""}
                      onChange={(e) =>
                        setNewStaffEmail({ ...newStaffEmail, [prop.id]: e.target.value })
                      }
                      className="bg-slate-50 text-sm"
                    />
                    <Button
                      onClick={() => handleAddStaff(prop.id)}
                      className="bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
