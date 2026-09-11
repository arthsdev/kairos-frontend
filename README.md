# Kairos — Frontend

Interface web da plataforma Kairos, um sistema de monitoramento de risco ambiental que correlaciona denúncias da comunidade com dados climáticos externos para gerar alertas automáticos de risco.

Este repositório contém apenas o frontend (React + TypeScript). O backend (Spring Boot) vive em um repositório separado: [kairos](https://github.com/arthsdev/kairos).

Projeto pessoal de portfólio, desenvolvido como exercício de arquitetura frontend moderna: componentização por feature, gerenciamento de estado assíncrono com cache real, integração com mapas interativos, e consumo de uma API própria com autenticação OAuth2/JWT.

## Índice

- [Visão geral](#visão-geral)
- [Stack técnica](#stack-técnica)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Como rodar localmente](#como-rodar-localmente)
- [Decisões de design](#decisões-de-design)
- [Débitos técnicos e limitações conhecidas](#débitos-técnicos-e-limitações-conhecidas)
- [Roadmap](#roadmap)

## Visão geral

O Kairos existe para dar a comunidades expostas a eventos climáticos extremos (enchentes, deslizamentos) um jeito rápido de reportar incidentes e visualizar risco — não como uma lista de texto, mas como um mapa interativo que cruza denúncias reais com dados climáticos.

Este frontend cobre três fluxos principais:

1. **Usuário comum** — reporta ocorrências ambientais, escolhendo a localização exata num mapa arrastável, e acompanha o clima das cidades que monitora.
2. **Administrador** — modera ocorrências (verifica, resolve, edita, remove) alternando entre uma visão em lista e um mapa com todos os pontos, cada um colorido por severidade e com borda indicando o status de moderação.
3. **Assinatura** — fluxo de upgrade para o plano Premium via Stripe Checkout, com confirmação por polling após o retorno do pagamento.

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Estilização | TailwindCSS v4 |
| Estado assíncrono / cache | TanStack Query v5 |
| Roteamento | React Router v8 |
| Mapas | Leaflet + React-Leaflet |
| HTTP client | Axios |
| Ícones | lucide-react |
| Lint / Format | ESLint + Prettier |

## Estrutura do projeto

```
src/
├── features/
│   ├── auth/          → login, registro, refresh de token
│   ├── occurrences/   → CRUD de ocorrências, mapa, location picker
│   ├── cities/         → cidades monitoradas, dados climáticos
│   └── plans/          → planos e upgrade via Stripe
│       ├── components/
│       ├── hooks/
│       ├── api/
│       ├── types/
│       └── utils/
├── pages/              → páginas roteadas, orquestram as features
└── shared/              → componentes, hooks e utilitários genéricos
```

Cada feature é autocontida: componentes, hooks, chamadas de API e tipos específicos daquele domínio vivem juntos, evitando que uma feature precise importar detalhes internos de outra. Quando duas features precisam do mesmo tipo de dado (por exemplo, uma paleta de cores por nível de risco, usada tanto no mapa de ocorrências quanto nos cards de clima), a escolha deliberada foi duplicar a função em vez de criar um import cruzado — o acoplamento estrutural custa mais do que a pequena duplicação de valores.

## Funcionalidades

### Mapa de ocorrências (admin)

![Mapa de ocorrências no Admin Dashboard](./src/docs/Map%20Ocurrences.png)

Toggle entre visão em **Lista** e **Mapa**, ambos filtráveis por status (Pending / Verified / Resolved), com o mesmo estado de filtro alimentando as duas visões simultaneamente.

- Cada ponto no mapa é colorido pela **severidade** (azul/amarelo/laranja/vermelho), com um **ícone** indicando a **categoria** (enchente, deslizamento, queimada etc.) e uma **borda** indicando o **status de moderação** (tracejada e pulsante para pendente, sólida para verificada, esmaecida para resolvida).
- `fitBounds` enquadra automaticamente todos os pontos visíveis na tela, mesmo quando estão geograficamente distantes entre si — evita o problema de centralizar o mapa numa média de coordenadas sem sentido (por exemplo, calcular o "meio do caminho" entre uma ocorrência no Brasil e outra nos EUA resultaria num ponto órfão no meio do oceano).
- Clicar em um ponto abre um modal de detalhe somente leitura, com foto (quando disponível); a partir dele, se a ocorrência ainda permitir edição, é possível abrir o formulário de edição.

![Lista de ocorrências filtrada por status](./src/docs/Map%20Detail.png)

### Criação de ocorrência com seleção de localização no mapa

![Modal de criação com location picker](./src/docs/New%20Occurrence.png)

Ao criar uma ocorrência, a localização não é digitada manualmente — o usuário escolhe a cidade monitorada (o mapa já nasce centralizado nela) e então arrasta um marcador (ou clica em qualquer ponto do mapa) para marcar o local exato do incidente. Os campos de latitude/longitude continuam visíveis, mas em modo somente leitura, refletindo a posição do marcador em tempo real.

O mesmo componente (`LocationPickerMap`) é reutilizado, sem nenhuma alteração, na edição de uma ocorrência já existente.

### Cidades monitoradas com dados climáticos

![Cards de cidades monitoradas com clima](./src/docs/Monitored%20Cities.png)

Cada cidade monitorada exibe temperatura atual, volume de chuva, velocidade do vento e um selo de nível de risco calculado pelo backend — não apenas nome e coordenadas. Cidades recém-adicionadas, que ainda não tiveram um primeiro ciclo de coleta de dados, mostram um estado de "coletando dados" em vez de um erro ou campo vazio.

### Autenticação

Login e registro com refresh automático de token: um interceptor do Axios detecta um `401`, enfileira as requisições concorrentes que chegaram durante a renovação (evitando múltiplas chamadas de refresh simultâneas) e as reexecuta com o novo token assim que ele chega. A sessão sobrevive a um token expirado logo no carregamento da página, renovando silenciosamente antes de qualquer requisição visível ao usuário.

### Planos e upgrade (Stripe)

Card de upgrade para o plano Premium, oculto automaticamente para quem já é Premium ou é administrador. Após o retorno do Stripe Checkout, a confirmação do pagamento é feita por polling em `GET /plans` — o parâmetro `?upgrade=success` na URL nunca é tratado como confirmação por si só, é apenas um sinal de UX para iniciar a checagem real do estado do plano no backend.

## Como rodar localmente

Pré-requisitos: Node.js 18+, e o [backend do Kairos](https://github.com/arthsdev/kairos) rodando localmente (ou acessível em alguma URL).

```bash
# 1. Clone o repositório
git clone https://github.com/arthsdev/kairos-frontend.git
cd kairos-frontend

# 2. Instale as dependências
npm install

# 3. Copie o arquivo de variáveis de ambiente de exemplo
cp .env.example .env

# 4. Rode o servidor de desenvolvimento
npm run dev
```

O `.env` precisa apontar para onde o backend está rodando:

```dotenv
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

A aplicação sobe em `http://localhost:5173` (padrão do Vite).

Outros scripts disponíveis:

```bash
npm run build     # build de produção (type-check + bundle)
npm run lint      # ESLint
npm run preview   # serve o build de produção localmente
```

## Decisões de design

Algumas escolhas deliberadas, documentadas aqui porque costumam gerar boas perguntas em entrevista técnica:

- **DTOs enxutos por consumidor, não um único tipo "rico" reaproveitado em tudo.** O mapa de ocorrências consome um payload leve (`id`, coordenadas, categoria, severidade, status) — sem título, descrição ou foto — porque é tudo que um marcador precisa para ser desenhado. O detalhe completo só é buscado quando o usuário efetivamente clica em um ponto. O mesmo raciocínio se repete nas cidades monitoradas: a lista usada no seletor de cidade do formulário de criação não carrega dados climáticos, que ninguém ali precisa; um hook separado (`useMonitoredCitiesWithClimate`) existe especificamente para a tela que exibe isso.
- **Filtro client-side no mapa, filtro server-side na lista.** O endpoint do mapa não aceita parâmetros de filtro — o volume de pontos é pequeno o suficiente para filtrar em memória no navegador, e evita que cada troca de filtro dispare uma nova requisição de rede. Já a lista paginada filtra no backend, porque nela o volume de dados justifica reduzir o que trafega pela rede.
- **`fitBounds` em vez de centralizar por média de coordenadas.** A primeira versão do mapa centralizava a visão calculando a média de latitude/longitude de todos os pontos visíveis. Com ocorrências geograficamente espalhadas, isso produzia um centro sem nenhum ponto de referência real por perto. Substituído por `map.flyToBounds()`, que enquadra todos os pontos visíveis independentemente da dispersão.
- **`L.divIcon` com SVG inline em vez dos ícones padrão do Leaflet.** Os ícones PNG padrão do Leaflet dependem de um caminho de assets que frequentemente quebra sob bundlers como o Vite sem configuração extra. Optamos por construir os marcadores como HTML/SVG puro desde o início, o que também permitiu compor cor (severidade), ícone (categoria) e borda (status de moderação) livremente no mesmo marcador.
- **Verificação de permissão de edição feita a partir do dado já carregado, não por uma nova chamada de API.** Quando o clique em um marcador do mapa precisa decidir se mostra a opção de editar, a checagem (`OccurrenceActions.canEdit`) é resolvida a partir da lista de ocorrências que a página administrativa já carregou para renderizar a visão em lista — evitando tanto uma chamada de rede redundante quanto a necessidade de expor esse campo no payload leve do mapa.
- **Rótulos honestos sobre limitações reais.** A visão sem filtro de status na lista administrativa é rotulada "Last 100", não "All" — porque, sem paginação real implementada ainda, o endpoint de fato retorna apenas as cem ocorrências mais recentes. Preferimos um rótulo preciso a uma promessa de completude que a implementação atual não cumpre.
- **Reuso do modal de edição existente para localização, tanto na criação quanto na edição.** O componente `LocationPickerMap` não sabe nada sobre formulários, cidades ou ocorrências — ele só recebe uma coordenada atual e devolve uma nova via callback. Isso permitiu reutilizá-lo sem nenhuma modificação nos dois contextos onde localização precisa ser definida.

## Débitos técnicos e limitações conhecidas

- **Sem testes automatizados de frontend.** Toda validação de comportamento até agora foi manual. É a lacuna mais significativa deste repositório comparado ao backend, que tem cobertura extensiva.
- **Paginação real ainda não implementada na lista administrativa** — o `size=100` é um limite pragmático para o volume atual de dados de demonstração, não uma solução para escala de produção.
- **Mapa de ocorrências restrito a administradores.** Um mapa social para usuários comuns (ou um mapa de calor de risco agregado por região) foi cogitado, mas depende de decisões de produto ainda em aberto — se deve ou não variar por plano de assinatura, e do risk engine passar a persistir seus resultados de forma consultável (hoje ele calcula e descarta, disparando apenas um alerta pontual).
- **Foto da ocorrência não é editável após a criação.** Não há campo, endpoint ou interface para trocar a imagem de uma ocorrência já existente.
- **Provedor de tiles do mapa (OpenStreetMap público) não é adequado para tráfego de produção real**, conforme a própria política de uso da OSM Foundation — adequado para o estágio atual de portfólio/demonstração, mas trocar por um provedor dedicado (CartoDB, Maptiler) é necessário antes de qualquer deploy com tráfego real.
- **Sem atualização em tempo real.** A lista e o mapa administrativos usam polling de 30 segundos, não WebSocket/SSE — uma ocorrência criada por outro usuário pode levar até meio minuto para aparecer sem uma atualização manual.

## Roadmap

- [ ] Cobertura de testes automatizados (Vitest + Testing Library)
- [ ] Paginação real na lista administrativa
- [ ] Deploy em produção
- [ ] Polish visual da página de cidades monitoradas (ícone de condição climática, indicador de tendência, "atualizado há X min")
- [ ] Reorganização das páginas roteadas para dentro de cada `features/*/pages/`, por consistência estrutural