# Guia Rapido - Como Rodar o Projeto

## 1. Instalar Dependencias

```bash
cd mobile
npm install
```

## 2. Configurar Supabase

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Va em SQL Editor e execute o SQL do `SETUP.md`
4. Copie a URL do projeto e a chave anonima (API keys)

## 3. Configurar .env

Crie arquivo `.env` na raiz do mobile:

```env
EXPO_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_AQUI
```

## 4. Criar Usuario Admin

No Supabase:
1. Authentication > Users > Add user
2. Email: `admin@presenca.com`
3. Senha: crie uma senha
4. No Table Editor > profiles, edite o usuario e mude `role` para `admin`

## 5. Rodar o App

```bash
npm start
```

Depois:
- **Android**: Pressione `a` ou use Expo Go
- **iOS**: Pressione `i` ou use Expo Go
- **Dispositivo fisico**: Scan no QR code com Expo Go

## 6. Testar

1. Faca login com usuario admin
2. Permita acesso a localizacao
3. Veja o mapa com o local mais proximo
4. Se estiver dentro do raio (100m), clique em "Registrar Entrada"

## Erros Comuns

### "Missing Supabase credentials"
- Verifique o `.env`
- Reinicie com `npm start -- --clear`

### "Localizacao nao disponivel"
- Ative GPS no dispositivo
- Em emulador, ajuste a localizacao nas configuracoes

### "Usuario nao autenticado"
- Faca logout e login novamente
- Verifique se o usuario existe no Supabase

## Proximos Passos

Apos testar o mobile:
1. Implementar painel admin (React + Vite)
2. Adicionar gestao de locais
3. Adicionar gestao de usuarios
4. Implementar exportacao CSV

## Links Uteis

- [Documentacao Expo](https://docs.expo.dev/)
- [Documentacao Supabase](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev/)
