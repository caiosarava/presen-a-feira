# Configuração do Banco de Dados - Supabase

## ⚠️ Erro: "Could not find the table 'public.locations'"

Este erro ocorre quando as tabelas do banco de dados ainda não foram criadas no Supabase.

## 📋 Passo a Passo para Corrigir

### 1️⃣ Acesse o Supabase Dashboard

1. Vá para [https://supabase.com](https://supabase.com)
2. Login na sua conta
3. Selecione seu projeto

### 2️⃣ Execute o SQL de Criação

1. No menu lateral, clique em **SQL Editor**
2. Clique em **+ New Query**
3. Copie e cole o conteúdo do arquivo `CREATE-DATABASE.sql`
4. Clique em **Run** para executar

### 3️⃣ Verifique as Tabelas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver 3 tabelas:
   - `profiles`
   - `locations`
   - `attendance_records`

### 4️⃣ Crie o Usuário Admin

#### Opção A: Pelo Dashboard do Supabase

1. Vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Preencha:
   - **Email**: `daes.ecosol@gmail.com`
   - **Senha**: `olimpicodaes1`
   - **Auto Confirm**: ✅ (marque esta opção)
4. Clique em **Add user**

#### Opção B: Via SQL

No SQL Editor, execute:

```sql
-- Criar usuário via SQL (não recomendado, use o dashboard)
-- Melhor criar via Authentication > Users > Add user
```

### 5️⃣ Atualize o Perfil para Admin

Após criar o usuário, execute no SQL Editor:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'daes.ecosol@gmail.com';
```

### 6️⃣ Verifique se Funcionou

1. No menu lateral, clique em **Table Editor**
2. Clique na tabela `profiles`
3. Verifique se o usuário foi criado e se o `role` está como `admin`

## 🔧 Solução de Problemas

### Erro: "relation 'public.locations' does not exist"

**Solução**: Execute o SQL do arquivo `CREATE-DATABASE.sql` no Supabase.

### Erro: "permission denied for table"

**Solução**: Verifique se as policies de RLS foram criadas corretamente.

### Erro: "user not authenticated"

**Solução**: 
1. Faça logout do admin
2. Faça login novamente
3. Verifique se o usuário tem role 'admin' na tabela profiles

## 📊 Estrutura do Banco

```
profiles
├── id (UUID, PK)
├── email (TEXT)
├── name (TEXT)
├── role (TEXT: 'admin' | 'user')
└── created_at (TIMESTAMPTZ)

locations
├── id (UUID, PK)
├── name (TEXT)
├── latitude (DECIMAL)
├── longitude (DECIMAL)
├── radius_meters (INTEGER)
├── address (TEXT)
├── active (BOOLEAN)
└── created_at (TIMESTAMPTZ)

attendance_records
├── id (UUID, PK)
├── user_id (UUID, FK)
├── location_id (UUID, FK)
├── check_in (TIMESTAMPTZ)
├── check_out (TIMESTAMPTZ)
├── latitude (DECIMAL)
├── longitude (DECIMAL)
├── distance_meters (INTEGER)
└── created_at (TIMESTAMPTZ)
```

## 🚀 Após Configurar

1. Acesse o admin em `https://seu-projeto.vercel.app`
2. Login com:
   - Email: `daes.ecosol@gmail.com`
   - Senha: `olimpicodaes1`
3. Vá em "Locais" e cadastre um novo local
4. Agora o erro não aparecerá mais!

## 📞 Precisa de Ajuda?

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
