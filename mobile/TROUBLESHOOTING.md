# 🚨 Solução de Problemas de Build

## Erro: "Command 'expo export --platform web' exited with 1"

### Causas Comuns

1. **Dependências conflitantes** - Resolvido com `--legacy-peer-deps`
2. **Componentes nativos** - react-native-maps não funciona bem na web
3. **Configuração complexa** - app.json com muitas opções PWA

### Soluções Aplicadas

✅ Simplificado app.json (removido PWA complexo)
✅ Adicionado babel.config.js
✅ Adicionado metro.config.js
✅ Usar `--legacy-peer-deps` no install
✅ Corrigido versões do TypeScript

## Se o Build Ainda Falhar

### Opção 1: Build Alternativo (Recomendado)

```bash
# No seu computador
cd mobile
npm install --legacy-peer-deps
npx expo export -p web

# Se funcionar, fazer deploy manual
vercel --prod
```

### Opção 2: Usar Create React App

Se o Expo Web continuar falhando, crie um projeto React puro:

```bash
npx create-react-app presenca-web --template typescript
cd presenca-web
npm install @supabase/supabase-js
```

### Opção 3: Manter Apenas Mobile

Focar apenas no app nativo e usar o admin web existente:

```
admin/ → Painel administrativo (completo)
mobile/ → App nativo (Expo)
```

## Status Atual

- ✅ App Admin: 100% funcional
- ✅ Mobile Nativo: 100% funcional
- ⚠️ Mobile Web (PWA): Em testes

## Próximos Passos

1. **Testar build localmente**:
   ```bash
   cd mobile
   npm install --legacy-peer-deps
   npx expo export -p web
   ```

2. **Se falhar**, usar Opção 2 (Create React App)

3. **Se funcionar**, fazer deploy na Vercel

## Variáveis de Ambiente

Certifique-se de configurar na Vercel:

```
EXPO_PUBLIC_SUPABASE_URL=https://rqlirjqyzggsifnpyeew.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

## Contato

Se nada funcionar, considere:
- Usar apenas o app nativo (mobile)
- Usar apenas o admin web (admin/)
- Criar um PWA separado com React puro
