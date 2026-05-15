# Deploy Unificado - Vite + Vercel

## Estrutura Unificada

O projeto agora possui uma única base de código Vite que suporta:
- `/admin` - Painel administrativo
- `/mobile` - Versão web do app mobile
- `/login/admin` e `/login/mobile` - Páginas de login compartilhadas

## Passos para Deploy na Vercel

### 1. Preparar o Repositório

```bash
cd "C:\Users\PC3\Desktop\presença-feira"
git add .
git commit -m "refactor: unified admin and mobile into single Vite app"
git push
```

### 2. Configurar Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Importe o repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite (detectado automaticamente)
   - **Root Directory**: `.` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Variáveis de Ambiente

Adicione as seguintes variáveis no painel da Vercel:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anonima do Supabase |

### 4. Deploy

Clique em **"Deploy"** e aguarde o build (1-2 minutos).

### 5. Acessar a Aplicação

- **Home**: `https://seu-projeto.vercel.app/`
- **Admin**: `https://seu-projeto.vercel.app/admin`
- **Mobile**: `https://seu-projeto.vercel.app/mobile`
- **Login Admin**: `https://seu-projeto.vercel.app/login/admin`
- **Login Mobile**: `https://seu-projeto.vercel.app/login/mobile`

## Domínio Personalizado

Para usar um único domínio:

1. No dashboard da Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `presenca.com`)
3. Configure o DNS conforme instruções
4. Use as rotas:
   - `presenca.com/admin` para admin
   - `presenca.com/mobile` para mobile
   - `presenca.com/login/admin` para login admin
   - `presenca.com/login/mobile` para login mobile

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## Estrutura de Pastas

```
presença-feira/
├── src/
│   ├── shared/          # Código compartilhado
│   │   ├── services/
│   │   ├── types/
│   │   └── Login.tsx
│   ├── admin/           # Páginas admin
│   │   └── pages/
│   ├── mobile/          # Telas mobile
│   │   ├── screens/
│   │   ├── components/
│   │   └── hooks/
│   ├── App.tsx          # App principal unificado
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── vercel.json
└── tsconfig.json
```

## Vantagens da Unificação

1. **Código compartilhado**: Services, types e componentes reutilizáveis
2. **Login único**: Mesma tela de login para ambos
3. **Deploy único**: Uma única configuração na Vercel
4. **Mesmo domínio**: Admin e mobile no mesmo domínio com rotas diferentes
5. **Manutenção simplificada**: Atualizações simultâneas
6. **Build otimizado**: Dependências compartilhadas

## Rotas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Redireciona para login ou admin |
| `/login/admin` | Login para admin |
| `/login/mobile` | Login para mobile |
| `/admin` | Dashboard admin |
| `/admin/locations` | Gestão de locais |
| `/admin/users` | Gestão de colaboradores |
| `/admin/attendance` | Histórico de registros |
| `/mobile` | Home do mobile |
| `/mobile/history` | Histórico mobile |
| `/mobile/profile` | Perfil do usuário |
