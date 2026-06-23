-- Permitir leitura pública (SELECT) para usuários anônimos (anon) na tabela repositorio_midias
DROP POLICY IF EXISTS "Allow select for anonymous users" ON public.repositorio_midias;
CREATE POLICY "Allow select for anonymous users" ON public.repositorio_midias 
    FOR SELECT TO anon USING (true);
