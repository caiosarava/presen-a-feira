# Solucao de Problemas de Deploy na Vercel

## Erro de Dependencia (ERESOLVE)

Se voce receber um erro como:
```
npm error ERESOLVE unable to resolve dependency tree
npm error ERESOLVE could not resolve
```

### ✅ Solucao Aplicada

O projeto ja foi atualizado com as versoes compativeis:
- **Vite**: `^6.0.0` (compativel com plugin-react)
- **@vitejs/plugin-react**: `^4.3.0`
- **.npmrc**: Adicionado com `legacy-peer-deps=true`

### Se o erro persistir:

1. **Verifique as versoes no package.json:**
```json
{
  "devDependencies": {
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

2. **Facas as seguintes alteracoes:**

```bash
cd admin
npm install vite@^6.0.0 @vitejs/plugin-react@^4.3.0 --save-dev
```

3. **Atualize o git:**
```bash
git add .
git commit -m "fix: update vite versions"
git push
```

4. **Na Vercel, faca um redeploy:**
   - Vá em **Activity**
   - Clique nos 3 pontinhos do ultimo deploy
   - Clique em **Redeploy**

## Erro: Build Failed

Se o build falhar com outros erros:

### Verifique os Logs

1. Vá em **Activity** > Clique no deploy falho
2. Clique em **View Build Logs**
3. Procure por linhas com `error`

### Erros Comuns

#### 1. Variaveis de ambiente faltando
```
Error: Missing VITE_SUPABASE_URL
```
**Solucao**: Adicione em Settings > Environment Variables

#### 2. Erro de TypeScript
```
error TS2304: Cannot find name 'xyz'
```
**Solucao**: Verifique se todos os tipos estao importados corretamente

#### 3. Erro de importacao
```
Error: Cannot find module '@/components/xyz'
```
**Solucao**: Verifique se os paths estao corretos no `tsconfig.json`

## Build Local

Para testar o build localmente antes de enviar:

```bash
cd admin
npm install
npm run build
```

Se o build local funcionar, o deploy na Vercel tambem funcionara.

## Redeploy Manual

Se precisar forcar um novo deploy:

### Opcao 1: Via Git
```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

### Opcao 2: Via Vercel CLI
```bash
vercel --prod
```

### Opcao 3: Via Dashboard
1. Vá em **Activity**
2. Clique nos 3 pontinhos do deploy
3. Clique em **Redeploy**

## Verificar Status do Deploy

1. **Em Andamento**: Build em progresso
2. **Ready**: Deploy concluido com sucesso
3. **Error**: Falha no build - clique para ver logs
4. **Queued**: Aguardando na fila de builds

## Logs em Tempo Real

Para ver logs em tempo real:

```bash
vercel logs seu-projeto.vercel.app
```

Ou no dashboard:
- **Logs** > **Real-time**

## Contatar Suporte

Se nenhum problema acima resolver:

1. **Vercel Status**: https://status.vercel.com
2. **Vercel Discord**: https://discord.gg/vercel
3. **GitHub Issues**: https://github.com/vercel/vercel/issues

## Checklist de Troubleshooting

- [ ] Versoes do Vite e plugin-react compativeis
- [ ] .npmrc com legacy-peer-deps
- [ ] Build local funciona
- [ ] Variaveis de ambiente configuradas
- [ ] Logs verificados
- [ ] Redeploy tentado

Se tudo falhar, tente criar um novo projeto na Vercel do zero.
