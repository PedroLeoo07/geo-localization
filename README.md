# 🗺️ Sistema de Geolocalização e Mapas

Sistema interativo desenvolvido com Next.js para explorar recursos de geolocalização e mapeamento usando a API do Mapbox.

## ✨ Funcionalidades

### 🏠 Home

- Interface inicial com navegação para as páginas de funcionalidades
- Design moderno com cards informativos

### 📍 Page 1 - Geolocalização

- Detecta automaticamente sua localização atual
- Exibe um marcador vermelho no mapa
- **Popup personalizado** com:
  - Coordenadas precisas (latitude e longitude)
  - Nível de precisão da localização
  - Altitude (quando disponível)
  - Data e hora da detecção
- Painel lateral com informações detalhadas

### 🚗 Page 2 - Traçar Rotas

- Busca inteligente de endereços e locais
- Sugestões em tempo real enquanto você digita
- Traçado automático de rotas otimizadas
- Exibição de:
  - Distância total da rota
  - Tempo estimado de viagem
  - Trajeto visualizado no mapa
- Marcadores de origem (azul) e destino (vermelho)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd geo-localization
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o token do Mapbox

1. Acesse [mapbox.com](https://www.mapbox.com/) e crie uma conta gratuita
2. Vá para [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)
3. Copie seu token de acesso
4. Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_aqui
```

### 4. Execute o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca JavaScript
- **Mapbox GL JS** - API de mapas interativos
- **Mapbox Geocoding API** - Busca de endereços
- **Mapbox Directions API** - Cálculo de rotas
- **CSS Modules** - Estilização

## 📱 Funcionalidades Detalhadas

### Geolocalização API

O projeto utiliza a API de Geolocalização do navegador para obter a posição atual do usuário:

- Precisão em metros
- Coordenadas (latitude/longitude)
- Altitude (quando disponível)
- Timestamp da detecção

### Sistema de Rotas

- Busca com autocompletar
- Múltiplas sugestões de endereços
- Cálculo de rota otimizado
- Visualização do trajeto no mapa
- Informações de distância e tempo

## 🔒 Permissões Necessárias

O aplicativo precisa de permissão para acessar sua localização. Certifique-se de permitir quando o navegador solicitar.

## 📝 Estrutura do Projeto

```text
src/
  app/
    ├── page.jsx              # Home
    ├── page.module.css       # Estilos da home
    ├── page1/
    │   ├── page.jsx          # Geolocalização
    │   └── page1.module.css  # Estilos
    └── page2/
        ├── page.jsx          # Traçar Rotas
        └── page2.module.css  # Estilos
```

## 🤝 Contribuindo

Sinta-se à vontade para contribuir com melhorias!

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
