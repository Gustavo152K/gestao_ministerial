-- Certificar que a extensão pgcrypto existe para fins de hash de senha
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Função para listar usuários do auth
CREATE OR REPLACE FUNCTION public.list_users()
RETURNS TABLE (id uuid, email text, created_at timestamptz)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT u.id, u.email::text, u.created_at FROM auth.users u;
END;
$$ LANGUAGE plpgsql;

-- 2. Função para excluir usuário do auth
CREATE OR REPLACE FUNCTION public.delete_user_by_id(user_uuid uuid)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- 3. Função para atualizar senha de usuário do auth
CREATE OR REPLACE FUNCTION public.update_user_password(user_uuid uuid, new_password text)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users 
  SET encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf'))
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Permissões de Execução Seguras: Revogar acesso público e conceder apenas a autenticados
REVOKE EXECUTE ON FUNCTION public.list_users() FROM public;
GRANT EXECUTE ON FUNCTION public.list_users() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.delete_user_by_id(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.delete_user_by_id(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.update_user_password(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.update_user_password(uuid, text) TO authenticated;
