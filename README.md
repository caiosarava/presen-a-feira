# Presenca - Sistema de Registro de Ponto com Geolocalizacao

Sistema completo para registro de presenca (ponto) com validacao por geolocalizacao, composto por:
- **Aplicativo Mobile** (React Native/Expo) para usuarios registrarem presenca
- **Painel Admin** (React/Vite) para gestao de locais, usuarios e registros

## Estrutura do Projeto

```
presenca-feira/
├── mobile/           # Aplicativo React Native
│   ├── src/
│   │   ├── screens/  # Telas (Login, Home, History, Profile)
│   │   ├── services/ # Integracao Supabase
│   │   ├── hooks/    # Hooks (useAuth, useLocation)
│   │   ├── utils/    # Utilitarios (distance, date)
│   │   └── types/    # Types TypeScript
│   ├── README.md     # Instrucoes mobile
│   └── SETUP.md      # Setup do Supabase
├── admin/            # Painel Admin React
│   ├── src/
│   │   ├── pages/    # Paginas (Dashboard, Locations, Users, Attendance)
│   │   ├── services/ # Servicos Supabase
│   │   └── types/    # Types
│   ├── README.md     # Instrucoes admin
│   └── create-admin.sql  # SQL para criar admin
├── ADMIN-SETUP.md    # Guia de setup do admin
└── README.md         # Este arquivo
```

## Usuario Admin

**Credenciais para acesso ao admin:**
- **Email**: `daes.ecosol@gmail.com`
- **Senha**: `olimpicodaes1`

### Como Criar o Usuario Admin

1. Acesse o painel do Supabase
2. Vá em **Authentication** > **Users** > **Add user**
3. Preencha:
   - Email: `daes.ecosol@gmail.com`
   - Senha: `olimpicodaes1`
   - Auto Confirm: ✓
4. No **Table Editor** > **profiles**, edite o usuario e mude `role` para `admin`

Ou execute o SQL em `admin/create-admin.sql`

## Funcionalidades

### Aplicativo Mobile
- [x] Login com email/senha
- [x] Check-in/Check-out com validacao de localizacao
- [x] Mapa com localizacao atual e locais permitidos
- [x] Calculo de distancia em tempo real (Haversine)
- [x] Historico de registros
- [x] Perfil do usuario

### Painel Admin
- [x] Dashboard com resumo dos registros
- [x] Gestao de Locais (CRUD completo)
- [x] Gestao de Usuarios
- [x] Visualizacao de todos os registros
- [x] Filtros por data e usuario
- [x] Exportacao CSV
- [x] Autenticacao segura

## Instalacao Rapida

### 1. Mobile

```bash
cd mobile
npm install
cp .env.example .env
# Edite .env com suas credenciais do Supabase
npm start
```

### 2. Admin

```bash
cd admin
npm install
cp .env.example .env
# Edite .env com suas credenciais do Supabase
npm run dev
```

## Stack Tecnologico

### Mobile
- React Native + Expo
- TypeScript
- Supabase (Auth + Database)
- expo-location
- react-native-maps
- date-fns

### Admin
- React 19 + Vite
- TypeScript
- React Router DOM
- Supabase
- Papa Parse (CSV)

## Configuracao do Supabase

1. Crie projeto em [supabase.com](https://supabase.com)
2. Execute o SQL de `mobile/SETUP.md` para criar as tabelas
3. Copie as credenciais para `.env` do mobile e admin

## Scripts

### Mobile
```bash
npm start          # Inicia Expo
npm run android    # Android
npm run ios        # iOS
```

### Admin
```bash
npm run dev        # Desenvolvimento
npm run build      # Build producao
npm run preview    # Preview
```

## Regras de Negocio

1. **Geolocalizacao**: Usuario so registra presenca dentro do raio (padrao: 100m)
2. **Entrada/Saida**: 2 registros por dia (check-in e check-out)
3. **Validacao**: Distancia calculada via formula de Haversine
4. **Registro livre**: Sem horario fixo

## Implantacao

### Mobile (Expo)
```bash
eas build --platform android  # APK Android
eas build --platform ios      # IPA iOS
```

### Admin (Vercel)
```bash
npm run build
vercel deploy
```

## License

MIT

## Suporte

Para duvidas e problemas, abra uma issue no repositorio.
