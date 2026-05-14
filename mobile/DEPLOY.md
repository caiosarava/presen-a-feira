# Deploy do PWA na Vercel

## Visão Geral

Este projeto foi refatorado para funcionar como PWA (Progressive Web App) e pode ser acessado via navegador em `presenca-feira.vercel.app/mobile`.

## Funcionalidades PWA

- ✅ Responsivo para web (desktop e mobile)
- ✅ Mapa removido na web (substituído por mensagem informativa)
- ✅ Geolocalização via API do navegador
- ✅ Manifesto PWA para instalação
- ✅ Service Worker básico para cache
- ✅ Compatível com mobile nativo (Expo)

## Pré-requisitos

1. Ter o Node.js instalado (v18+)
2. Ter conta na Vercel
3. Ter a CLI da Vercel instalada: `npm install -g vercel`

## Passo a Passo para Deploy

### 1. Configurar Variáveis de Ambiente na Vercel

Acesse o dashboard da Vercel e adicione as variáveis:

```
EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 2. Fazer Build e Deploy

```bash
cd mobile

# Instalar dependências
npm install

# Exportar para web
npm run build:web

# Fazer deploy
vercel --prod
```

### 3. Configurar Rewrites (Opcional)

Se quiser usar `/mobile` como subpath, configure no `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/mobile/:path*", "destination": "/:path*" }
  ]
}
```

## Estrutura de Arquivos

```
mobile/
├── public/
│   ├── manifest.json       # Manifesto PWA
│   ├── index.html          # HTML base
│   ├── favicon.png         # Ícone
│   └── icons/              # Ícones PWA
├── src/
│   ├── components/         # Componentes (MapView condicional)
│   ├── screens/            # Telas do app
│   ├── hooks/              # Hooks (useLocation com web support)
│   └── services/           # Serviços (Supabase)
├── App.tsx                 # App principal
├── app.json                # Configuração Expo
├── package.json            # Dependências
└── vercel.json             # Configuração Vercel
```

## Diferenças Mobile vs Web

| Recurso | Mobile (Nativo) | Web (PWA) |
|---------|----------------|-----------|
| Mapa | ✅ react-native-maps | ❌ Mensagem informativa |
| Geolocalização | ✅ expo-location | ✅ navigator.geolocation |
| Notificações Push | ✅ expo-notifications | ⚠️ Web Push API |
| Instalação | App Store/Play Store | Adicionar à tela inicial |
| Offline | ⚠️ Parcial | ⚠️ Parcial |

## Testando Localmente

```bash
# Desenvolvimento web
npm run web

# Build de produção
npm run build:web

# Servir build localmente
npx serve dist
```

## Adicionar à Tela Inicial

### Chrome/Edge
1. Acessar `seusite.vercel.app/mobile`
2. Clicar no menu (3 pontos)
3. "Adicionar à tela inicial"

### Safari (iOS)
1. Acessar `seusite.vercel.app/mobile`
2. Clicar no botão compartilhar
3. "Adicionar à tela de Início"

## Limitações Web

- **Mapa**: Não disponível na web (API do Google Maps requer API Key paga)
- **Geolocalização**: Precisa de HTTPS ou localhost
- **Notificações**: Web Push API requer service worker avançado
- **Câmera**: Funciona via API do navegador

## Próximos Passos (Opcional)

1. **Service Worker Avançado**: Implementar cache offline com Workbox
2. **Google Maps API**: Adicionar mapa na web com API Key
3. **Web Push Notifications**: Implementar notificações push
4. **PWA Icons**: Gerar ícones em múltiplos tamanhos

## Solução de Problemas

### Erro: "Geolocation not supported"
- Verifique se está usando HTTPS (obrigatório para geolocalização)
- No Chrome: Configurações → Privacidade → Local → Permitir

### Erro: "Build failed"
- Verifique se todas as dependências estão instaladas
- Execute `npm install` novamente

### Mapa não carrega
- Na web, o mapa é intencionalmente removido
- Use o app nativo para funcionalidade completa de mapa

## Links Úteis

- [Vercel Documentation](https://vercel.com/docs)
- [Expo Web](https://docs.expo.dev/guides/what-is-expo/)
- [PWA Checklist](https://www.pwabuilder.com/)
- [Web Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
