# Guia de Configuracao do Admin

## Passo 1: Instalar Dependencias

```bash
cd admin
npm install
```

## Passo 2: Configurar Variaveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA-CHAVE-ANONIMA
```

Para pegar as credenciais:
- Acesse o painel do Supabase
- Vá em Settings > API
- Copie a "Project URL" e "anon/public key"

## Passo 3: Criar Usuario Admin

### Opcao A: Pelo Painel do Supabase (Recomendado)

1. Acesse o painel do Supabase
2. Vá em **Authentication** > **Users**
3. Clique em **Add user**
4. Preencha:
   - **Email**: `daes.ecosol@gmail.com`
   - **Senha**: `olimpicodaes1`
   - **Auto Confirm**: Marque esta opcao
5. Clique em **Add user**

6. Agora va em **Table Editor** > **profiles**
7. Encontre o usuario `daes.ecosol@gmail.com` e edite:
   - Mude o campo `role` para `admin`

### Opcao B: Via SQL

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Primeiro, crie o usuario via Authentication > Users > Add user
-- Email: daes.ecosol@gmail.com
-- Senha: olimpicodaes1

-- Depois, atualize para admin:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'daes.ecosol@gmail.com';
```

## Passo 4: Rodar o Admin

```bash
npm run dev
```

O admin vai abrir em `http://localhost:5173`

## Passo 5: Fazer Login

1. Acesse `http://localhost:5173`
2. Use as credenciais:
   - **Email**: `daes.ecosol@gmail.com`
   - **Senha**: `olimpicodaes1`

## Passo 6: Testar as Funcionalidades

### Dashboard
- Visualiza resumo do dia
- Total de usuarios, presentes, locais e registros

### Locais

- **Cadastrar Local**:
  - Nome: "Escritorio Central"
  - Latitude: -23.561414 (ex: Sao Paulo)
  - Longitude: -46.655881
  - Raio: 100 metros
  - Endereco: Opcional

### Usuarios
- Lista todos os usuarios
- Edita nome e cargo (admin/user)

### Registros
- Visualiza todos os registros de ponto
- Filtros por data e usuario
- Exporta CSV

## Estrutura de Pastas

```
admin/
├── src/
│   ├── pages/
│   │   ├── Login.tsx         # Tela de login
│   │   ├── Dashboard.tsx     # Dashboard
│   │   ├── Locations.tsx     # Gestao de locais
│   │   ├── Users.tsx         # Gestao de usuarios
│   │   └── Attendance.tsx    # Registros
│   ├── services/
│   │   └── supabase.ts       # Integracao Supabase
│   ├── types/
│   │   └── index.ts          # Types TypeScript
│   └── App.tsx               # App principal
├── .env                      # Variaveis de ambiente
└── package.json
```

## Solucao de Problemas

### Erro: "Missing Supabase credentials"
- Verifique se o arquivo `.env` existe
- Confira se as variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estao preenchidas
- Reinicie o servidor: `npm run dev`

### Erro: "Usuario nao encontrado"
- Verifique se o usuario foi criado no Supabase
- Confira se o email esta correto: `daes.ecosol@gmail.com`
- Verifique se o usuario tem permissao de leitura na tabela `profiles`

### Erro: "Acesso negado"
- O usuario precisa ter role = 'admin' na tabela profiles
- Execute: `UPDATE profiles SET role = 'admin' WHERE email = 'daes.ecosol@gmail.com';`

## Proximos Passos

1. **Producao**:
   - Build: `npm run build`
   - Deploy na Vercel/Netlify

2. **Funcionalidades Adicionais**:
   - Adicionar foto no check-in
   - Relatorios personalizados
   - Notificacoes em tempo real
   - Gestao de horarios de trabalho

## Links Uteis

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
