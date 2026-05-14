# Admin - Painel Administrativo

Painel administrativo para gestão do sistema de Presenca.

## Funcionalidades

- [x] Dashboard com resumo dos registros
- [x] Gestao de Locais (CRUD completo)
- [x] Gestao de Usuarios
- [x] Visualizacao de Registros com filtros
- [x] Exportacao CSV
- [x] Autenticacao com Supabase

## Instalacao

1. **Instalar dependencias:**
```bash
cd admin
npm install
```

2. **Configurar variaveis de ambiente:**

Crie um arquivo `.env` na raiz do admin:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

3. **Rodar o projeto:**
```bash
npm run dev
```

## Usuario Admin

Para criar o usuario admin, execute este SQL no Supabase:

```sql
-- 1. Criar usuario na auth
-- Vá em Authentication > Users > Add user
-- Email: daes.ecosol@gmail.com
-- Senha: olimpicodaes1

-- 2. Apos criar, atualize o perfil para admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'daes.ecosol@gmail.com';
```

## Estrutura

```
admin/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Locations.tsx
│   │   ├── Users.tsx
│   │   └── Attendance.tsx
│   ├── services/
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
└── .env
```

## Paginas

### Dashboard
- Total de usuarios
- Presentes hoje
- Locais cadastrados
- Registros do dia

### Locais
- Cstrar novos locais
- Editar locais existentes
- Ativar/desativar locais
- Definir raio de abrangencia

### Usuarios
- Lista de todos os usuarios
- Editar nome e cargo
- Visualizar status

### Registros
- Todos os registros de ponto
- Filtros por data e usuario
- Exportacao CSV
- Visualizacao de check-in/check-out

## Stack

- React 19
- TypeScript
- React Router DOM
- Supabase
- Papa Parse (CSV)
- Vite
