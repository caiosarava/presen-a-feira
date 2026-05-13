# Configuracao do Supabase

## Passo 1: Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faca login
3. Clique em "New Project"
4. Preencha as informacoes:
   - Name: `presenca-app`
   - Database Password: (guarde esta senha)
   - Region: Escolha a mais proxima (ex: East US)
5. Clique em "Create new project"

## Passo 2: Executar SQL

No painel do Supabase, va para **SQL Editor** e execute o seguinte SQL:

```sql
-- Tabela de perfis
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de locais
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100,
  address TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de registros de presenca
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES locations(id),
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_meters INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX idx_attendance_user ON attendance_records(user_id);
CREATE INDEX idx_attendance_checkin ON attendance_records(check_in);
CREATE INDEX idx_locations_active ON locations(active);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Usuarios podem ver seu proprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin pode ver todos os perfis"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies para locations
CREATE POLICY "Usuarios podem ver locais ativos"
  ON locations FOR SELECT
  USING (active = true);

CREATE POLICY "Admin pode gerenciar locais"
  ON locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies para attendance_records
CREATE POLICY "Usuarios podem ver seus registros"
  ON attendance_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem inserir seus registros"
  ON attendance_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar seus registros"
  ON attendance_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin pode ver todos os registros"
  ON attendance_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir um local de exemplo (ajuste as coordenadas)
-- Exemplo: Sao Paulo - Av. Paulista
INSERT INTO locations (name, latitude, longitude, radius_meters, address)
VALUES 
  ('Escritorio Central', -23.561414, -46.655881, 100, 'Av. Paulista, 1000 - Sao Paulo, SP'),
  ('Filial Rio', -22.906847, -43.172896, 100, 'Av. Rio Branco, 100 - Rio de Janeiro, RJ');
```

## Passo 3: Pegar Credenciais

1. Va para **Settings** (engrenagem no menu lateral)
2. Clique em **API**
3. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave publica)

## Passo 4: Configurar .env

Na raiz do projeto mobile, crie um arquivo `.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

## Passo 5: Criar Primeiro Usuario Admin

No painel do Supabase:

1. Va para **Authentication** > **Users**
2. Clique em **Add user**
3. Preencha:
   - Email: `admin@presenca.com`
   - Senha: (sua senha)
4. Apos criar, va para **Table Editor** > **profiles**
5. Edite o perfil do usuario e mude o `role` para `admin`

## Passo 6: Testar

1. No app, faca login com o usuario admin
2. Va para a tela inicial
3. O app deve mostrar o local mais proximo
4. Se estiver dentro do raio (100m), pode fazer check-in

## Solucao de Problemas

### Erro: "Missing Supabase credentials"
- Verifique se o arquivo `.env` existe
- Confira se as variaveis estao corretas
- Reinicie o Expo: `npm start -- --clear`

### Erro: "Permissao negada"
- Verifique se o usuario tem permissao no perfil
- Confira se o RLS esta configurado corretamente

### Erro: "Localizacao nao disponivel"
- No emulador Android, use o Device Manager para definir localizacao
- No iOS Simulator, use Debug > Location
- Em dispositivo real, ative o GPS

## Coordenadas de Exemplo

Para testes, use estas coordenadas:

- **Sao Paulo (Av. Paulista)**: -23.561414, -46.655881
- **Rio de Janeiro (Centro)**: -22.906847, -43.172896
- **Brasilia (Esplanada)**: -15.794021, -47.882714

Para mudar sua localizacao no emulador, use estas coordenadas no Google Maps para pegar as coordenadas exatas do seu local.
