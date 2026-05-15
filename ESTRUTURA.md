# Estrutura do Projeto Unificado

## Visão Geral

```
presença-feira/
│
├── 📁 src/
│   │
│   ├── 📁 shared/              # CÓDIGO COMPARTILHADO
│   │   ├── services/
│   │   │   └── supabase.ts     # Auth, CRUD, etc.
│   │   ├── types/
│   │   │   └── index.ts        # Typescript types
│   │   └── Login.tsx           # Componente de login único
│   │
│   ├── 📁 admin/               # MÓDULO ADMIN
│   │   └── pages/
│   │       ├── Dashboard.tsx   # Painel admin
│   │       ├── Locations.tsx   # Gestão de locais
│   │       ├── Users.tsx       # Gestão de usuários
│   │       └── Attendance.tsx  # Histórico
│   │
│   ├── 📁 mobile/              # MÓDULO MOBILE
│   │   ├── screens/
│   │   │   ├── HomeScreen/
│   │   │   ├── HistoryScreen/
│   │   │   ├── ProfileScreen/
│   │   │   └── LoginScreen/
│   │   ├── components/
│   │   │   └── MapView.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLocation.ts
│   │   └── utils/
│   │       ├── date.ts
│   │       └── distance.ts
│   │
│   ├── App.tsx                 # App principal (rotas)
│   ├── main.tsx                # Ponto de entrada
│   └── index.css               # Estilos globais
│
├── 📁 node_modules/            # Dependências
│
├── 📄 package.json             # Config do projeto
├── 📄 vite.config.ts           # Config do Vite
├── 📄 tsconfig.json            # Config TypeScript
├── 📄 vercel.json              # Config Vercel
├── 📄 index.html               # HTML base
├── 📄 .env.example             # Exemplo de env
│
├── 📄 README-DEPLOY.md         # Guia de deploy
├── 📄 INSTRUCOES-DEPLOY.md     # Instruções passo a passo
└── 📄 ESTRUTURA.md             # Este arquivo
```

---

## Fluxo de Navegação

### Admin
```
/ → /login/admin → /admin
                          ├→ /admin/locations
                          ├→ /admin/users
                          └→ /admin/attendance
```

### Mobile
```
/ → /login/mobile → /mobile
                          ├→ /mobile/history
                          └→ /mobile/profile
```

---

## Componente Login.tsx (Compartilhado)

O componente `Login` aceita uma prop `mode`:

```tsx
// Para admin
<Login mode="admin" onLogin={checkUser} />

// Para mobile
<Login mode="mobile" onLogin={checkUser} />
```

**Diferenças:**
- `mode="admin"` → Redireciona para `/admin`
- `mode="mobile"` → Redireciona para `/mobile`

---

## Rotas (App.tsx)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Redirect | Redireciona para login ou admin |
| `/login/admin` | Login (mode: admin) | Login admin |
| `/login/mobile` | Login (mode: mobile) | Login mobile |
| `/admin/*` | AdminLayout | Dashboard admin |
| `/admin/locations` | Locations | Locais |
| `/admin/users` | Users | Usuários |
| `/admin/attendance` | Attendance | Histórico |
| `/mobile/*` | MobileLayout | App mobile web |
| `/mobile/history` | History | Histórico mobile |
| `/mobile/profile` | Profile | Perfil |

---

## Services (Compartilhado)

Local: `src/shared/services/supabase.ts`

**Funções disponíveis:**
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Usuário atual
- `getProfile(userId)` - Perfil
- `getLocations()` - Listar locais
- `createLocation(data)` - Criar local
- `updateLocation(id, data)` - Atualizar local
- `deleteLocation(id)` - Remover local
- `getUsers()` - Listar usuários
- `updateUser(id, data)` - Atualizar usuário
- `getAttendanceRecords(filters)` - Registros de ponto
- `updateAttendanceRecord(id, data)` - Atualizar registro

---

## Tipos (Compartilhado)

Local: `src/shared/types/index.ts`

```typescript
interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  address?: string;
  active: boolean;
  created_at: string;
}

interface AttendanceRecord {
  id: string;
  user_id: string;
  location_id: string;
  check_in: string;
  check_out?: string;
  latitude?: number;
  longitude?: number;
  distance_meters?: number;
  created_at: string;
}
```

---

## Variáveis de Ambiente

Arquivo: `.env` (não versionado, use `.env.example`)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Dev server (porta 5173)

# Build
npm run build            # Build de produção
npm run build:admin      # Build apenas admin
npm run build:mobile     # Build apenas mobile

# Preview
npm run preview          # Preview do build

# Lint
npm run lint             # ESLint
```

---

## Dependências

### Produção
- `react` ^19.2.6
- `react-dom` ^19.2.6
- `react-router-dom` ^7.6.2
- `@supabase/supabase-js` ^2.55.0
- `papaparse` ^5.5.3
- `date-fns` ^4.1.0

### Desenvolvimento
- `typescript` ~5.9.2
- `vite` ^6.0.0
- `@vitejs/plugin-react` ^4.3.0
- `@types/react` ^19.2.14
- `@types/react-dom` ^19.2.3
- `@types/papaparse` ^5.3.15

---

## Configurações Importantes

### vite.config.ts
- Port: 5173
- History API: true (SPA)
- Aliases: `@`, `@shared`, `@admin`, `@mobile`
- Code splitting configurado

### vercel.json
- Rewrites para SPA
- Build command: `npm run build`
- Output: `dist`

### tsconfig.json
- Path aliases configurados
- Strict mode: true
- Module resolution: bundler

---

## Próximos Passos (Sugestões)

1. [ ] Adicionar testes unitários
2. [ ] Configurar CI/CD
3. [ ] Adicionar loading skeleton
4. [ ] Otimizar bundle size
5. [ ] Adicionar PWA support
6. [ ] Tradução i18n

---

**Projeto unificado e pronto para deploy! 🚀**
