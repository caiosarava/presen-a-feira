# 🚀 Deploy do PWA - Guia Rápido

## ✅ O que foi feito

Seu app mobile agora está configurado como PWA e pronto para deploy na Vercel!

### Arquivos Criados/Modificados

- ✅ `mobile/package.json` - Scripts web adicionados
- ✅ `mobile/app.json` - Configuração PWA
- ✅ `mobile/public/` - Pasta com manifest, icons, index.html, sw.js
- ✅ `mobile/src/components/MapView.tsx` - Componente condicional (web não mostra mapa)
- ✅ `mobile/src/hooks/useLocation.ts` - Suporte a geolocalização web
- ✅ `mobile/vercel.json` - Configuração de deploy
- ✅ `mobile/DEPLOY.md` - Guia completo de deploy
- ✅ `mobile/README.md` - Documentação do projeto

---

## 📋 Como Fazer Deploy

### Opção 1: Deploy Automático (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Navegar até pasta mobile
cd mobile

# 3. Fazer deploy
vercel --prod
```

A Vercel vai:
- Detectar automaticamente o Expo
- Rodar `npm install`
- Rodar `expo export --platform web`
- Fazer deploy da pasta `dist/`

### Opção 2: Deploy via GitHub

1. **Push no GitHub** (já feito):
   ```
   git push
   ```

2. **Acesse Vercel**:
   - https://vercel.com/new
   - Importar repositório: `presença-feira`
   - Root Directory: `mobile`
   - Framework: **Outro** (Expo)

3. **Configurar Build**:
   - Build Command: `expo export --platform web`
   - Output Directory: `dist`

4. **Variáveis de Ambiente**:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://rqlirjqyzggsifnpyeew.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **Deploy!**

---

## 🌐 Acessar o PWA

Após o deploy, seu app estará disponível em:

``
https://presenca-feira.vercel.app/mobile
``

Ou, se configurado como subpath:

``
https://seusite.vercel.app/mobile
``

---

## 📱 Instalar PWA

### Chrome/Edge (Desktop/Mobile)

1. Acessar `seusite.vercel.app/mobile`
2. Menu (3 pontos) → "Instalar aplicativo" ou "Adicionar à tela inicial"
3. O app aparecerá na área de trabalho ou menu de apps

### Safari (iOS)

1. Acessar `seusite.vercel.app/mobile`
2. Botão Compartilhar
3. "Adicionar à Tela de Início"
4. Adicionar

### Android (Chrome)

1. Acessar `seusite.vercel.app/mobile`
2. Menu → "Adicionar à tela inicial"
3. O app será instalado como um app nativo

---

## 🔧 Testar Localmente

```bash
cd mobile

# Desenvolvimento web
npm run web

# Build de produção
npm run build:web

# Servir localmente (teste de produção)
npx serve dist
```

---

## 📊 Estrutura do Build PWA

``
mobile/
├── public/
│   ├── manifest.json      → Informações do PWA
│   ├── index.html         → HTML base
│   ├── sw.js              → Service Worker (cache)
│   ├── favicon.png        → Ícone
│   └── icons/             → Ícones PWA
├── dist/                  → Build final (gerado)
└── vercel.json           → Configuração Vercel
``

---

## 🎯 Funcionalidades PWA

| Recurso | Status |
|---------|--------|
| Manifesto | ✅ |
| Service Worker | ✅ |
| Geolocalização | ✅ (via navegador) |
| Mapa | ❌ (removido na web) |
| Offline | ⚠️ Básico |
| Push Notifications | ❌ (futuro) |

---

## 🐛 Solução de Problemas

### Erro: "Geolocation not supported"

- **Causa**: Navegador requer HTTPS
- **Solução**: Use HTTPS ou localhost

### Erro: "Build failed"

```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install
```

### App não carrega

1. Verifique variáveis de ambiente na Vercel
2. Confira se `EXPO_PUBLIC_*` estão corretas
3. Teste build local: `npm run build:web`

---

## 📝 Próximos Passos (Opcional)

1. **Gerar ícones PWA**:
   - Use https://www.pwabuilder.com/
   - Gere ícones em todos os tamanhos

2. **Otimizar Service Worker**:
   - Adicionar Workbox
   - Cache estratégico

3. **Google Maps API**:
   - Adicionar mapa na web
   - Requer API Key

4. **Web Push Notifications**:
   - Implementar notificações push
   - Usar OneSignal ou similar

---

## 📞 Suporte

- **DEPLOY.md**: Guia completo de deploy
- **README.md**: Documentação do projeto
- **Vercel Docs**: https://vercel.com/docs

---

**Status**: ✅ PWA pronto para deploy!

**URL de Teste Local**: `http://localhost:8081` (após `npm run web`)

**URL de Produção**: `https://presenca-feira.vercel.app/mobile` (após deploy)
