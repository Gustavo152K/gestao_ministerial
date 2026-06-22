-- Permitir leitura pública (SELECT) para usuários anônimos (anon) na tabela escalas
DROP POLICY IF EXISTS "Allow select for anonymous users" ON public.escalas;
CREATE POLICY "Allow select for anonymous users" ON public.escalas 
    FOR SELECT TO anon USING (true);

-- Permitir leitura pública (SELECT) para usuários anônimos (anon) na tabela kids_checkin
DROP POLICY IF EXISTS "Allow select for anonymous users" ON public.kids_checkin;
CREATE POLICY "Allow select for anonymous users" ON public.kids_checkin 
    FOR SELECT TO anon USING (true);
