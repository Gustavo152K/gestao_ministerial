-- Criar a tabela de histórico do Espaço Kids
CREATE TABLE IF NOT EXISTS public.kids_historico (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nome_crianca TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    telefone TEXT,
    alergia TEXT DEFAULT 'Nenhuma',
    data_registro DATE DEFAULT CURRENT_DATE,
    hora_entrada TEXT,
    hora_saida TEXT
);

-- Habilitar RLS
ALTER TABLE public.kids_historico ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.kids_historico;
CREATE POLICY "Allow all actions for authenticated users" ON public.kids_historico
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select for anonymous users" ON public.kids_historico;
CREATE POLICY "Allow select for anonymous users" ON public.kids_historico
    FOR SELECT TO anon USING (true);
