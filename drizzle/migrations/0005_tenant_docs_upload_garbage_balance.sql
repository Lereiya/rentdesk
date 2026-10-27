ALTER TABLE public.tenants ADD COLUMN garbage_balance numeric NOT NULL DEFAULT 0;
ALTER TABLE public.documents ADD COLUMN kind text NOT NULL DEFAULT 'other';
ALTER TABLE public.documents ADD COLUMN uploaded_by uuid DEFAULT auth.uid();
CREATE POLICY "tenant uploads documents" ON public.documents FOR INSERT TO authenticated
  WITH CHECK (tenant_id IN (SELECT public.my_tenant_ids()));
CREATE POLICY "tenant doc files upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'tenant-docs' AND (storage.foldername(name))[1] IN (SELECT id::text FROM public.my_tenant_ids() id));
CREATE POLICY "tenant doc files read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'tenant-docs' AND (
    (storage.foldername(name))[1] IN (SELECT id::text FROM public.my_tenant_ids() id)
    OR EXISTS (SELECT 1 FROM public.tenants t WHERE t.id::text = (storage.foldername(name))[1] AND (public.is_staff(t.property_id) OR t.owner_id = auth.uid()))
  ));