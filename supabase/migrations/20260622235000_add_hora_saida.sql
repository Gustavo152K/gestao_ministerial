-- Adicionar a coluna hora_saida na tabela kids_checkin
ALTER TABLE public.kids_checkin ADD COLUMN IF NOT EXISTS hora_saida TEXT;
