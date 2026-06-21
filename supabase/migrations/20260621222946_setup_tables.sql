-- 1. Tabela: funcoes
CREATE TABLE IF NOT EXISTS public.funcoes (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nome_funcao TEXT UNIQUE NOT NULL
);

-- Habilitar RLS para funcoes
ALTER TABLE public.funcoes ENABLE ROW LEVEL SECURITY;

-- 2. Tabela: membros
CREATE TABLE IF NOT EXISTS public.membros (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nome TEXT NOT NULL,
    telefone TEXT,
    funcao_id BIGINT REFERENCES public.funcoes(id) ON DELETE SET NULL
);

-- Habilitar RLS para membros
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- 3. Tabela: repositorio_midias
CREATE TABLE IF NOT EXISTS public.repositorio_midias (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    ministerio TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    data_upload TEXT
);

-- Habilitar RLS para repositorio_midias
ALTER TABLE public.repositorio_midias ENABLE ROW LEVEL SECURITY;

-- 4. Tabela: escalas
CREATE TABLE IF NOT EXISTS public.escalas (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    data_escala TIMESTAMPTZ NOT NULL,
    ministerio_responsavel TEXT NOT NULL,
    status TEXT NOT NULL,
    detalhes_voluntarios TEXT NOT NULL
);

-- Habilitar RLS para escalas
ALTER TABLE public.escalas ENABLE ROW LEVEL SECURITY;

-- 5. Tabela: kids_checkin
CREATE TABLE IF NOT EXISTS public.kids_checkin (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    nome_crianca TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    telefone TEXT,
    alergia TEXT DEFAULT 'Nenhuma',
    status TEXT DEFAULT 'Pendente',
    hora_entrada TEXT
);

-- Habilitar RLS para kids_checkin
ALTER TABLE public.kids_checkin ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança RLS (Permitir todas as ações para usuários autenticados)
DO $$
DECLARE
    t text;
    tables text[] := ARRAY['funcoes', 'membros', 'repositorio_midias', 'escalas', 'kids_checkin'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Allow all actions for authenticated users" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
    END LOOP;
END $$;
