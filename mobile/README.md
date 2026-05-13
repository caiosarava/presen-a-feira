# Presenca Mobile - Registro de Ponto com Geolocalizacao

Aplicativo mobile para registro de presenca (ponto) com validacao por geolocalizacao.

## Funcionalidades

- [x] Login com email e senha
- [x] Check-in e Check-out com validacao de localizacao
- [x] Mapa mostrando a localizacao atual e o local permitido
- [x] Calculo de distancia em tempo real
- [x] Historico de registros
- [x] Perfil do usuario
- [x] Integracao com Supabase

## Pre-requisitos

- Node.js (v18 ou superior)
- Expo CLI
- Conta no Supabase
- Dispositivo Android/iOS ou emulador

## Instalacao

1. **Instale as dependencias:**
```bash
cd mobile
npm install
```

2. **Configure o Supabase:**

Crie um projeto em [supabase.com](https://supabase.com) e execute o SQL do arquivo `SETUP.md`

3. **Configure as variaveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:
```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

4. **Inicie o aplicativo:**
```bash
npm start
```

5. **Rode no seu dispositivo:**
- Android: `npm run android` ou use o Expo Go
- iOS: `npm run ios` ou use o Expo Go

## Estrutura do Projeto

```
mobile/
├── src/
│   ├── screens/       # Telas do app
│   │   ├── LoginScreen/
│   │   ├── HomeScreen/
│   │   ├── HistoryScreen/
│   │   └── ProfileScreen/
│   ├── services/      # Servicos (Supabase)
│   ├── hooks/         # Hooks personalizados
│   ├── utils/         # Funcoes utilitarias
│   └── types/         # Types TypeScript
├── assets/            # Imagens e icones
├── App.tsx            # Ponto de entrada
└── package.json
```

## Stack Tecnologico

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Supabase** - Backend as a Service
- **TypeScript** - Tipagem estatica
- **react-native-maps** - Mapas
- **expo-location** - Geolocalizacao
- **date-fns** - Formatacao de datas

## Regras de Negocio

1. **Geolocalizacao**: Usuario so registra presenca dentro do raio permitido (padrao: 100m)
2. **Entrada/Saida**: Apenas 2 registros por dia (entrada e saida)
3. **Validacao**: Distancia calculada via formula de Haversine
4. **Registro livre**: Sem horario fixo, o usuario registra quando chega

## Próximos Passos

- [ ] Criar painel admin (React + Vite)
- [ ] Adicionar exportacao CSV
- [ ] Implementar gestao de locais no admin
- [ ] Implementar gestao de usuarios no admin
- [ ] Adicionar foto no check-in (opcional)

## Licenca

MIT
