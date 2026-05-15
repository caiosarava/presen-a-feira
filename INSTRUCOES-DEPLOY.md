# 🚀 Instruções de Deploy - Projeto Unificado

## ✅ Refatoração Concluída

O código do **admin** e **mobile** foi unificado em uma única aplicação Vite com:

### Estrutura Unificada
```
presença-feira/
├── src/
│   ├── shared/           # Serviços, tipos e Login compartilhados
│   ├── admin/            # Páginas do admin (Dashboard, Locations, Users, Attendance)
│   └── mobile/           # Telas mobile (Home, History, Profile)
├── src/App.tsx           # App principal com rotas unificadas
├── src/shared/Login.tsx  # Tela de login única para ambos
└── ...
```

### Rotas Disponíveis
- `/` → Redireciona para login ou admin
- `/login/admin` → Login para admin
- `/login/mobile` → Login para mobile  
- `/admin` → Dashboard administrativo
- `/admin/locations` → Gestão de locais
- `/admin/users` → Colaboradores
- `/admin/attendance` → Histórico
- `/mobile` → Home do mobile
- `/mobile/history` → Histórico mobile
- `/mobile/profile` → Perfil

---

## 📦 Passo a Passo para Deploy na Vercel

### 1. Preparar o Repositório (Já feito!)
```bash
✅ Código unificado e commitado
✅ package.json atualizado
✅ Configuração Vite pronta
✅ vercel.json configurado
```

### 2. Acessar Vercel
1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**

### 3. Importar Repositório
1. Selecione o repositório `presenca-feira`
2. Clique em **"Import"**

### 4. Configurar Build
- **Framework Preset**: Vite (detectado automaticamente)
- **Root Directory**: `.` (deixe em branco)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 5. Adicionar Variáveis de Ambiente
Clique em **"Environment Variables"** e adicione:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://SEU-PROJETO.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `SUA-CHAVE-ANONIMA` |

**Como pegar as credenciais do Supabase:**
1. Acesse https://supabase.com
2. Entre no seu projeto
3. Vá em **Settings** (engrenagem) → **API**
4. Copie **Project URL** e **anon/public key**

### 6. Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (1-2 minutos)
3. Pronto! ✅

---

## 🌐 Acessar Aplicação

Após deploy, a Vercel mostrará:
- **URL**: `https://projeto-xxx.vercel.app`

### URLs de Acesso:
```
https://projeto-xxx.vercel.app/              → Home (redireciona)
https://projeto-xxx.vercel.app/admin          → Admin Dashboard
https://projeto-xxx.vercel.app/login/admin    → Login Admin
https://projeto-xxx.vercel.app/mobile         → Mobile Home
https://projeto-xxx.vercel.app/login/mobile   → Login Mobile
```

---

## 🔗 Domínio Personalizado (Opcional)

Para usar um domínio único:

1. **Adicionar Domínio**
   - Vá em **Settings** → **Domains**
   - Adicione: `presenca.com` (exemplo)
   - Siga instruções para configurar DNS

2. **Acessar com Domínio**
   ```
   https://presenca.com/admin
   https://presenca.com/mobile
   https://presenca.com/login/admin
   https://presenca.com/login/mobile
   ```

---

## 🛠 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Acessar http://localhost:5173
# - Admin: http://localhost:5173/admin
# - Mobile: http://localhost:5173/mobile
# - Login: http://localhost:5173/login/admin

# Build de produção
npm run build

# Preview local
npm run preview
```

---

## 📋 Checklist de Validação

Após deploy, teste:

- [ ] Login admin funciona
- [ ] Dashboard carrega
- [ ] Páginas de Locais, Usuários, Histórico funcionam
- [ ] Login mobile funciona
- [ ] Home mobile carrega
- [ ] Histórico mobile funciona
- [ ] Logout funciona
- [ ] Dados do Supabase aparecem

---

## 🎯 Vantagens da Unificação

1. ✅ **Código compartilhado**: Services e types em um só lugar
2. ✅ **Login único**: Mesma tela para admin e mobile
3. ✅ **Deploy único**: Uma configuração na Vercel
4. ✅ **Mesmo domínio**: Ambos no mesmo lugar
5. ✅ **Manutenção fácil**: Atualizações simultâneas
6. ✅ **Build otimizado**: Dependências compartilhadas

---

## 🆘 Solução de Problemas

### Erro: "Missing Supabase credentials"
- Adicione as variáveis de ambiente na Vercel
- Redeploy necessário

### Erro: "Page not found" em rotas
- O arquivo `vercel.json` já corrige isso
- Certifique-se que o rewrite está configurado

### Erro: "Build failed"
- Verifique logs na Vercel
- Teste build local: `npm run build`

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/docs

---

**Deploy realizado com sucesso! 🎉**
