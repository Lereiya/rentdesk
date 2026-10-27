import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DOC_KINDS: Record<string, string> = { lease: "Lease agreement", id: "National ID", other: "Other" };
const PREFIX = "tenant-docs:";

type Doc = { id: string; title: string; url: string; kind?: string; created_at: string };

export async function openDoc(url: string) {
  if (!url.startsWith(PREFIX)) { window.open(url, "_blank", "noopener"); return; }
  
  const { data, error } = await supabase.storage.from("Documents").createSignedUrl(url.slice(PREFIX.length), 300);
  
  if (error) { toast.error(error.message); return; }
  window.open(data.signedUrl, "_blank", "noopener");
}

export function DocRow({ d, extra }: { d: Doc; extra?: string }) {
  return (
    <li className="flex items-center justify-between gap-3 py-3 text-sm">
      <span className="flex min-w-0 items-center gap-2">
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0">
          <span className="block truncate font-medium">{d.title}</span>
          <span className="block text-xs text-muted-foreground">{DOC_KINDS[d.kind ?? "other"] ?? "Other"}{extra ? ` · ${extra}` : ""} · {new Date(d.created_at).toLocaleDateString("en-KE")}</span>
        </span>
      </span>
      {d.url && <Button variant="link" size="sm" onClick={() => openDoc(d.url)}>Open</Button>}
    </li>
  );
}

export function TenantUpload({ tenantId, propertyId }: { tenantId: string; propertyId: string }) {
  const qc = useQueryClient();
  const [kind, setKind] = useState("lease");
  const [file, setFile] = useState<File | null>(null);
  
  const up = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a file first");
      
      // Explicitly get user and check if they exist to satisfy TypeScript
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to upload documents.");

      const path = `${tenantId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      
      // 1. Upload to the 'Documents' bucket (explicitly set upsert to false)
      const s = await supabase.storage.from("Documents").upload(path, file, {
        upsert: false
      });
      if (s.error) throw new Error(`Storage Error: ${s.error.message}`);
      
      // 2. Save the record to the database
      const { error } = await supabase.from("documents").insert({
        owner_id: user.id, // Now guaranteed to be a string
        property_id: propertyId, 
        tenant_id: tenantId,
        kind, 
        title: `${DOC_KINDS[kind]} — ${file.name}`, 
        url: PREFIX + path,
      });
      
      if (error) throw new Error(`Database Error: ${error.message}`);
    },
    onSuccess: () => { 
      toast.success("Document uploaded — your caretaker can now see it"); 
      setFile(null); 
      qc.invalidateQueries({ queryKey: ["documents"] }); 
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="mb-4 grid gap-2 rounded-xl border bg-muted/40 p-3 sm:grid-cols-[160px_minmax(0,1fr)_auto]">
      <Select value={kind} onValueChange={setKind}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{Object.entries(DOC_KINDS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
      </Select>
      
      <Input key={file ? "f" : "e"} type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      
      <Button disabled={up.isPending} onClick={() => up.mutate()}>
        <Upload className="h-4 w-4 mr-2" />{up.isPending ? "Uploading…" : "Upload"}
      </Button>
    </div>
  );
}