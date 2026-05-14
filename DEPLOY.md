# Guia de Deploy - Painel Admin na Vercel

## Visao Geral

Este guia ensina como fazer deploy do **Painel Admin** na Vercel.

**Importante**: O aplicativo mobile (React Native/Expo) NAO é implantado na Vercel. Para o mobile, use o EAS Build ou Expo Application Services.

---

## 📋 Pre-requisitos

1. Conta na Vercel (gratuita em [vercel.com](https://vercel.com))
2. Projeto do Supabase configurado
3. Credenciais do Supabase (URL e Anon Key)
4. Git instalado e projeto versionado

---

## 🚀 Passo a Passo - Deploy na Vercel

### Passo 1: Preparar o Projeto

1. **Certifique-se de que o projeto esta no Git:**

```bash
cd "C:\Users\PC3\Desktop\presença-feira"
git status
git add .
git commit -m "feat: prepare for deployment"
git push
```

2. **Verifique se o admin esta no repositorio:**
```bash
git log --oneline -5
```

### Passo 2: Criar Conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Use sua conta do GitHub para login (recomendado)
4. Aceite os termos

### Passo 3: Importar Projeto

1. No dashboard da Vercel, clique em **"Add New Project"**
2. Em **"Import Git Repository"**, selecione seu repositório:
   - Procure por `presenca-feira` ou `presen-a-feira`
3. Clique em **"Import"**

### Passo 4: Configurar Build

1. Na tela de configuracao do projeto:
   - **Framework Preset**: Vite (deve ser detectado automaticamente)
   - **Root Directory**: Clique em **"Edit"** e digite `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

2. **NÃO altere as demais configuracoes**

### Passo 5: Adicionar Variaveis de Ambiente

1. Na mesma tela de configuracao, clique em **"Environment Variables"**

2. Adicione as seguintes variaveis:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR...` (sua chave anonima) |

3. Para pegar as credenciais:
   - Acesse o painel do Supabase
   - Vá em **Settings** (engrenagem) > **API**
   - Copie **Project URL** e **anon/public key**

4. Clique em **"Add"** para cada variavel

### Passo 6: Implantar

1. Clique em **"Deploy"**
2. Aguarde o build (cerca de 1-2 minutos)
3. Quando concluir, voce vera:
   - ✅ **Build completed**
   - URL do projeto: `https://projeto-xxx.vercel.app`

### Passo 7: Acessar o Admin

1. Clique em **"Visit"** para abrir o projeto
2. Faca login com:
   - **Email**: `daes.ecosol@gmail.com`
   - **Senha**: `olimpicodaes1`

---

## 🔧 Configuracoes Adicionais

### Dominio Personalizado (Opcional)

1. No dashboard do projeto na Vercel:
2. Vá em **Settings** > **Domains**
3. Adicione seu dominio (ex: `admin.presenca.com`)
4. Siga as instrucoes para configurar DNS no seu provedor

### Variaveis de Ambiente

Para adicionar/editar variaveis apos o deploy:

1. Vá em **Settings** > **Environment Variables**
2. Clique em **"Add Variable"** ou edite as existentes
3. Clique em **"Redeploy"** para aplicar as mudancas

### Logs e Monitoramento

1. **Build Logs**: 
   - Vá em **Activity** > Clique no deploy > **View Build Logs**

2. **Runtime Logs**:
   - Vá em **Logs** para ver erros em tempo real

---

## 📱 Deploy do Aplicativo Mobile

O aplicativo mobile **NAO** é implantado na Vercel. Siga estas etapas:

### Opcao 1: Expo Application Services (EAS)

1. **Instalar EAS CLI:**
```bash
npm install -g eas-cli
cd mobile
```

2. **Configurar EAS:**
```bash
eas build:configure
```

3. **Criar build Android:**
```bash
eas build --platform android --profile preview
```

4. **Criar build iOS:**
```bash
eas build --platform ios --profile preview
```

### Opcao 2: Expo Go (Desenvolvimento)

1. **Iniciar Expo:**
```bash
cd mobile
npm start
```

2. **Scan no QR Code** com Expo Go no celular

### Opcao 3: Publicar na Expo

```bash
cd mobile
eas submit --platform android  # Envia para Google Play
eas submit --platform ios      # Envia para App Store
```

---

## 🔐 Seguranca

### Boas Praticas

1. **Nunca compartilhe suas chaves do Supabase**
2. **Use RLS (Row Level Security)** no Supabase
3. **Mantenha as chaves no ambiente** (nao no codigo)
4. **Use HTTPS** (Vercel fornece automaticamente)

### Proteger Rotas Admin

O admin ja possui autenticacao via Supabase. Para maior seguranca:

1. **Ativar 2FA** na conta Supabase
2. **Criar politicas RLS** restritivas
3. **Limitar IPs** (recurso pago da Vercel)

---

## 🚨 Solucao de Problemas

### Erro: "Build failed"

**Causa**: Dependencias nao instaladas ou erro no build

**Solucao**:
```bash
cd admin
npm install
npm run build
# Verifique se ha erros
```

### Erro: "Missing Supabase credentials"

**Causa**: Variaveis de ambiente nao configuradas

**Solucao**:
1. Vá em **Settings** > **Environment Variables**
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Redeploy

### Erro: "Page not found" ao acessar rotas

**Causa**: SPA (Single Page App) sem configuracao de rewrite

**Solucao**: O arquivo `vercel.json` ja foi configurado para corrigir isso.

### Erro: "Usuario nao autenticado"

**Causa**: Usuario nao existe ou nao tem role 'admin'

**Solucao**:
```sql
-- No SQL Editor do Supabase:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'daes.ecosol@gmail.com';
```

---

## 📊 Monitoramento

### Acessos

- Vá em **Analytics** para ver estatisticas de acesso
- **Visits**: Total de visitas
- **Unique Visitors**: Visitantes unicos

### Performance

- Vá em **Speed Insights** para ver metricas de performance
- **Core Web Vitals**: LCP, FID, CLS

### Logs

- Vá em **Logs** para ver erros e avisos
- Filtre por **Environment** (Production/Preview)

---

## 🔄 Atualizar Deploy

Sempre que fizer alteracoes:

```bash
git add .
git commit -m "feat: sua alteracao"
git push
```

A Vercel detecta automaticamente e faz deploy!

### Deploy Manual

```bash
cd admin
vercel --prod
```

---

## 💡 Dicas

1. **Use branches** para testes:
   - Crie branch `feature/nova-funcionalidade`
   - A Vercel cria um preview automatico
   - Faca merge na `main` quando pronto

2. **Preview Deployments**:
   - Cada PR vira um deploy de preview
   - URL: `https://projeto-xxx-git-branch.vercel.app`

3. **Rollback**:
   - Vá em **Activity** > Clique no deploy anterior > **Redeploy**

4. **Custom Domains**:
   - Dominios personalizados sao gratis na Vercel
   - Adicione em **Settings** > **Domains**

---

## 📞 Suporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Discord**: [discord.gg/vercel](https://discord.gg/vercel)

---

## ✅ Checklist Final

- [ ] Projeto importado na Vercel
- [ ] Root directory configurado como `admin`
- [ ] Variaveis de ambiente adicionadas
- [ ] Build concluido com sucesso
- [ ] Login funcionando
- [ ] Todas as paginas acessiveis
- [ ] Exportacao CSV funcionando
- [ ] Dominio configurado (opcional)

**Projeto no ar! 🎉**
