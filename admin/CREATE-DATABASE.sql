-- =====================================================
-- CRIAÇÃO DO BANCO DE DADOS - PRESENCE APP
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com/dashboard/project/SEU-PROJETO/sql

-- 1. Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de locais (locations)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100,
  address TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de registros de presença
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_meters INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_checkin ON attendance_records(check_in);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(active);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- 6. Policies para profiles
DROP POLICY IF EXISTS "Usuarios podem ver seu proprio perfil" ON profiles;
CREATE POLICY "Usuarios podem ver seu proprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin pode ver todos os perfis" ON profiles;
CREATE POLICY "Admin pode ver todos os perfis"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Policies para locations
DROP POLICY IF EXISTS "Usuarios podem ver locais ativos" ON locations;
CREATE POLICY "Usuarios podem ver locais ativos"
  ON locations FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "Admin pode gerenciar locais" ON locations;
CREATE POLICY "Admin pode gerenciar locais"
  ON locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Policies para attendance_records
DROP POLICY IF EXISTS "Usuarios podem ver seus registros" ON attendance_records;
CREATE POLICY "Usuarios podem ver seus registros"
  ON attendance_records FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios podem inserir seus registros" ON attendance_records;
CREATE POLICY "Usuarios podem inserir seus registros"
  ON attendance_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios podem atualizar seus registros" ON attendance_records;
CREATE POLICY "Usuarios podem atualizar seus registros"
  ON attendance_records FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin pode ver todos os registros" ON attendance_records;
CREATE POLICY "Admin pode ver todos os registros"
  ON attendance_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================
-- Inserir locais de exemplo
INSERT INTO locations (name, latitude, longitude, radius_meters, address, active)
VALUES 
  ('Escritório Central', -23.561414, -46.655881, 100, 'Av. Paulista, 1000 - São Paulo, SP', true),
  ('Filial Rio de Janeiro', -22.906847, -43.172896, 100, 'Av. Rio Branco, 100 - Rio de Janeiro, RJ', true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Verificar se as tabelas foram criadas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Verificar locais
SELECT * FROM locations;

-- Verificar perfis
SELECT * FROM profiles;

-- =====================================================
-- CRIAR USUÁRIO ADMIN
-- =====================================================
-- 1. Vá em Authentication > Users > Add user
-- 2. Email: daes.ecosol@gmail.com
-- 3. Senha: olimpicodaes1
-- 4. Auto Confirm: true
-- 5. Depois execute:
-- UPDATE profiles SET role = 'admin' WHERE email = 'daes.ecosol@gmail.com';
