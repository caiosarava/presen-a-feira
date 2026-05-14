-- =====================================================
-- SCRIPT PARA CRIAR USUARIO ADMIN
-- =====================================================
-- Este script cria o usuario admin no Supabase
-- Execute no SQL Editor do Supabase

-- 1. Criar usuario na authentication
-- No painel do Supabase:
--   Authentication > Users > Add user
--   Email: daes.ecosol@gmail.com
--   Senha: olimpicodaes1
--   Auto Confirm: true

-- 2. Apos criar o usuario, execute este comando para tornar admin:

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'daes.ecosol@gmail.com';

-- 3. Verificar se o usuario foi criado corretamente:

SELECT id, email, role, created_at 
FROM profiles 
WHERE email = 'daes.ecosol@gmail.com';

-- =====================================================
-- SCRIPT ALTERNATIVO (se preferir criar via SQL)
-- =====================================================
-- Se quiser criar diretamente via SQL (nao recomendado):

-- Primeiro, crie o usuario no sistema de auth:
-- (isso deve ser feito via API ou painel do Supabase)

-- Depois, insira o perfil manualmente:
-- INSERT INTO profiles (id, email, name, role)
-- VALUES ('UUID-DO-USUARIO', 'daes.ecosol@gmail.com', 'Administrador', 'admin');

-- =====================================================
-- VERIFICACAO
-- =====================================================
-- Para verificar todos os admins:

SELECT * FROM profiles WHERE role = 'admin';

-- =====================================================
-- CRIAR LOCAIS INICIAIS (OPCIONAL)
-- =====================================================
-- Exemplo de locais para teste:

INSERT INTO locations (name, latitude, longitude, radius_meters, address, active)
VALUES 
  ('Escritorio Central', -23.561414, -46.655881, 100, 'Av. Paulista, 1000 - Sao Paulo, SP', true),
  ('Filial Rio de Janeiro', -22.906847, -43.172896, 100, 'Av. Rio Branco, 100 - Rio de Janeiro, RJ', true);
