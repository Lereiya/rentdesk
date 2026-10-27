ALTER TABLE public.tenants ADD COLUMN water_balance numeric NOT NULL DEFAULT 0;
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER documents_owner BEFORE INSERT ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_owner_from_property();
CREATE POLICY "landlord documents" ON public.documents FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()));
CREATE POLICY "staff documents" ON public.documents FOR ALL TO authenticated USING (public.is_staff(property_id)) WITH CHECK (public.is_staff(property_id));
CREATE POLICY "tenant documents" ON public.documents FOR SELECT TO authenticated USING (tenant_id IN (SELECT public.my_tenant_ids()) OR (tenant_id IS NULL AND property_id IN (SELECT public.my_tenant_properties())));