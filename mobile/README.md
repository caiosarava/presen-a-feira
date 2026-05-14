# Presença Mobile - PWA

Aplicativo mobile de controle de ponto com geolocalização, agora com suporte a PWA (Progressive Web App).

## 🚀 Funcionalidades

- ✅ **Check-in/Check-out** com geolocalização
- ✅ **Validação de raio** de alcance do local
- ✅ **Histórico** de registros
- ✅ **Multi-lociais** de trabalho
- ✅ **PWA** - Funciona em navegadores web
- ✅ **Mobile First** - Otimizado para Android/iOS

## 📱 Como Usar

### Mobile (Nativo - Android/iOS)

1. Instale o **Expo Go** na sua loja de aplicativos
2. Acesse o app e escaneie o QR Code do desenvolvimento
3. Ou faça build nativo com `eas build`

### Web (PWA)

1. Acesse `seusite.vercel.app/mobile`
2. Para instalar:
   - **Chrome/Edge**: Menu → "Adicionar à tela inicial"
   - **Safari**: Compartilhar → "Adicionar à Tela de Início"

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm start

# Rodar na web
npm run web

# Build para produção
npm run build:web
```

## 📦 Deploy (Vercel)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer deploy
vercel --prod
```

**Variáveis de Ambiente:**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 📄 Estrutura

```
mobile/
├── public/              # Arquivos estáticos PWA
│   ├── manifest.json    # Configuração PWA
│   └── index.html       # HTML base
├── src/
│   ├── components/      # Componentes (MapView condicional)
│   ├── screens/         # Telas (Home, History, Profile, Login)
│   ├── hooks/           # Hooks (useLocation, useAuth)
│   ├── services/        # Serviços (Supabase)
│   └── utils/           # Utilitários
├── App.tsx              # App principal
├── app.json             # Configuração Expo
└── package.json         # Dependências
```

## 🔄 Diferenças Mobile vs Web

| Recurso | Mobile | Web |
|---------|--------|-----|
| Mapa | ✅ Nativo | ❌ Mensagem informativa |
| Geolocalização | ✅ expo-location | ✅ navigator.geolocation |
| Performance | ⚡ Ótima | ⚡ Boa |
| Offline | ⚠️ Parcial | ⚠️ Parcial |

## 📖 Mais Informações

- [DEPLOY.md](./DEPLOY.md) - Guia completo de deploy
- [README.md](../README.md) - Documentação geral do projeto

## 📝 Licença

MIT
