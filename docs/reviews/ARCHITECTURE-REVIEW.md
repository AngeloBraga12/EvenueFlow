# Revisão crítica — ARCHITECTURE.md do VenueFlow Studio

Nov 17, 2026 · @ângelo

## Resumo executivo

A v0.1 tem a base certa: domínio isolado da interface, um único modelo geométrico para 2D e 3D e operações versionadas. Mas cinco lacunas precisam fechar antes de codar o editor e a sincronização.

1. **Inteiros em milímetros não bastam com rotação.** Colisão e contenção com ângulos livres geram valores fracionários, e falta política de arredondamento e tolerância.
2. **Comando, histórico e operação de sincronização estão separados.** Sem um contrato único, undo e colaboração divergem.
3. **O "servidor valida" não tem dono.** RLS controla acesso a linhas, mas não valida revisão nem regras de domínio. Falta definir onde isso roda, por exemplo numa função transacional no Postgres.
4. **Dados de convidados não têm política de privacidade.** Faltam base legal, retenção, exclusão e controle sobre o que sai em PDF, PNG e .vflow.
5. **Importações são entrada não confiável.** CSV, XLSX e .vflow precisam de limites, validação estrita e IDs regenerados.

Escopo: esta é uma revisão do texto da v0.1, sem código nem testes para validar. Os pontos sobre Supabase vêm de conhecimento geral e devem ser conferidos na documentação vigente antes de implementar.

## O que está sólido e deve ser mantido

- **Domínio sem dependência de React, Konva ou Three.js.** Permite testar geometria sem interface e trocar o renderizador sem tocar nas regras.
- **Modelo único para 2D e 3D.** Evita a divergência clássica entre duas versões do mesmo projeto.
- **Operações com `baseRevision` em vez de snapshots.** É a base correta para offline e detecção de conflito.
- **Otimização cria nova versão e nunca sobrescreve.** Mantém a decisão final com o usuário e o histórico intacto.
- **IA generativa fora da garantia de geometria e rotas.** Segurança física fica em algoritmo determinístico e testável.
- **Nunca declarar "sincronizado" antes da confirmação do servidor.** Torna o estado da interface honesto.
- **A interface não é fronteira de segurança.** Autorização no servidor e no banco é o princípio certo.
- **Circulação como análise técnica, não certificação normativa.** Reduz risco jurídico e de expectativa.
- **CRDT adiado até haver testes de consistência geométrica.** Evita complexidade antes de ela ser necessária.

## Modelo geométrico e editor 2D/3D

Sete achados, do mais para o menos urgente. Cada um traz o problema e o que recomendo decidir.

### 1. Milímetros inteiros não sobrevivem à rotação

Inteiros em mm eliminam erro acumulado de soma e comparação de posições. Mas rotação em ângulo livre, mesas redondas e escala produzem valores fracionários, e é exatamente aí que ficam as regras críticas: colisão e contenção no salão. Se os vértices forem derivados em ponto flutuante, a vantagem dos inteiros some justo onde importava.

**Recomendação:** persistir só posição em mm inteiros e rotação em unidade discreta (por exemplo, décimos de grau). Tratar a geometria derivada como cálculo em float, nunca persistida, com tolerância ε em mm e política de arredondamento num único módulo. Cobrir com testes de propriedade (transformar e inverter volta ao original dentro de ε). Em JavaScript, inteiros são exatos até 2^53; o cuidado de faixa está só no tipo da coluna no Postgres.

### 2. Sistemas de coordenadas diferentes entre Konva e Three.js

O documento define Y no plano e Z como altura. Mas o canvas do Konva cresce o eixo Y para baixo, e a câmera padrão do Three.js usa Y para cima. Sem uma convenção explícita, o resultado típico é planta espelhada no 3D ou rotação com sinal invertido.

**Recomendação:** fixar uma convenção do modelo (por exemplo, destra com Z para cima) e escrever um adaptador único por renderizador, com testes de ida e volta. Nenhum componente converte coordenadas por conta própria.

### 3. Comando, histórico e operação de sincronização são três conceitos

A seção 6 fala em comandos e histórico; a seção 10 fala em operações com `baseRevision`. Se forem estruturas separadas, o undo local vai desfazer algo que outro usuário já alterou, e a fila offline vai reenviar coisas que o histórico não conhece.

**Recomendação:** um contrato único: Comando produz uma ou mais Operações serializáveis, cada uma com `operationId` (idempotência no reenvio) e operação inversa. Undo gera uma nova operação, o que combina com "preservar histórico". Durante um arrasto, o estado é transitório e não entra no histórico nem na sincronização; ao soltar, vira uma única operação.

### 4. Grupos têm duas fontes de verdade para posição

`LayoutGroup` guarda `anchor` e `transform`, e cada objeto guarda a própria posição. Quem manda? Além disso, a regra 5 diz que objetos bloqueados não mudam, mas não diz o que acontece quando se move um grupo com um membro bloqueado.

**Recomendação:** membros guardam posição absoluta; o grupo guarda só associação e metadados. Mover o grupo é um comando que gera uma operação por objeto, o que também deixa o conflito granular por objeto. Definir a semântica tudo-ou-nada para membro bloqueado, e se um objeto pode estar em mais de um grupo.

### 5. Altura, boundary e catálogo estão subespecificados

`dimensions` é genérico, sem altura nem elevação (Z base). Sem isso, o 3D não representa lustre, palco ou viga, e a colisão não distingue o que realmente conflita. O `boundary` precisa aceitar polígonos côncavos e furos (pilares), e `walls` e `boundary` precisam de uma fonte de verdade única. Por fim, `FurnitureObject` tem `furnitureTypeId` e `dimensions` ao mesmo tempo: se o catálogo mudar, layouts antigos mudam?

**Recomendação:** `dimensions` como largura, profundidade e altura, mais `elevation`. Declarar se a colisão do MVP é só de footprint 2D. Copiar as dimensões do catálogo no momento da inserção (snapshot), o que também torna o .vflow reproduzível.

### 6. Estado central único sem estratégia de desempenho

Um store Zustand compartilhado entre Konva e React Three Fiber é correto, mas com muitos objetos qualquer atualização de arrasto re-renderiza demais. Colisão ingênua é O(n²), e o documento não fixa meta de desempenho.

**Recomendação:** objetos normalizados por id (`Record<id, objeto>`), seletores granulares, estado transitório de arrasto fora do store de domínio e índice espacial (R-tree ou grade uniforme) no motor geométrico para hit-test e colisão. Definir um orçamento de desempenho (quadros por segundo com N objetos, em dispositivo móvel de referência) e medir cedo, em vez de otimizar depois.

### 7. Validação a cada movimento vs. validação ao confirmar

A regra 7 exige validar toda transformação antes de confirmar. Aplicada literalmente a cada evento de arrasto, custa caro e trava a interface.

**Recomendação:** dois níveis. Durante o arrasto, validação leve (feedback visual de colisão). Ao confirmar, validação completa e determinística, a mesma que roda nos testes unitários.

## Segurança e Supabase

Oito achados. Os pontos sobre recursos do Supabase refletem conhecimento geral e precisam de conferência na documentação vigente antes de virarem decisão.

### 1. Multi-tenancy e papéis ainda não têm esquema

O documento diz que dados individuais e empresariais ficam separados por propriedade e associação organizacional, mas não define organizações, membros, papéis nem compartilhamento. Sem isso, as políticas RLS não podem ser escritas nem testadas.

**Recomendação:** modelar `organizations`, `memberships` (com papel), `projects` (dono individual ou organização) e `project_members`. Papéis mínimos: dono, editor, visualizador e convidado externo. Escrever políticas por operação (select, insert, update, delete) com `with check`, apoiadas em funções auxiliares como `can_edit(project_id)`. Ligar RLS em todas as tabelas do schema exposto, indexar as colunas usadas nas políticas e, pela orientação da Supabase, chamar `auth.uid()` dentro de um `select` para o Postgres não reavaliar por linha. Tornar testes negativos um bloqueio de CI: o usuário A nunca lê nem altera o projeto do usuário B.

### 2. RLS não valida regras de domínio, e o "servidor valida" não tem dono

A seção 11 diz que o servidor valida a operação contra a revisão atual. Com Supabase não há servidor próprio por padrão, e RLS decide acesso a linhas, não `baseRevision`, inventário nem geometria. Um cliente comprometido poderia gravar um layout inválido, e em edição colaborativa isso afeta terceiros.

**Recomendação:** aplicar operações por uma RPC transacional no Postgres: ela compara a revisão, incrementa, grava a operação e o estado de forma atômica, e rejeita com conflito explícito. Declarar o que o servidor garante (autorização, integridade, revisão, limites de tamanho, schema) e o que só o cliente verifica (colisão e circulação). Se o servidor precisar revalidar geometria, usar Edge Function e compartilhar os schemas Zod.

### 3. Tempo real precisa de canais privados

A seção 10 prevê presença e transmissão de operações. Canais de broadcast abertos deixam qualquer cliente com a chave pública entrar numa sala, e mensagens entre clientes não passam por validação.

**Recomendação:** usar canais privados com autorização baseada em RLS (o Supabase oferece isso para Realtime; confirmar na documentação). Tratar o broadcast como otimista: a operação só vira estado confirmado depois do servidor. Limitar o que a presença expõe (nome e cursor, nunca e-mail) a membros do projeto.

### 4. Importação de CSV e XLSX é superfície de ataque

A seção 12 descreve bem as etapas de usuário, mas não os limites técnicos. XLSX é um zip de XML (risco de arquivo que expande demais), e CSV com células iniciadas por `=`, `+`, `-` ou `@` vira fórmula quando reexportado para planilha.

**Recomendação:** limitar tamanho de arquivo, linhas, colunas e tempo de leitura; ler no navegador dentro de um Web Worker, sem enviar o arquivo bruto ao servidor. Validar cada linha com Zod, enviar só linhas validadas em lotes por RPC e neutralizar fórmulas em qualquer exportação tabular. Tratar codificação pt-BR (UTF-8 e Windows-1252) e avaliar advisories da biblioteca de leitura de XLSX antes de fixar a versão.

### 5. O .vflow é entrada não confiável

A seção 14 pede validar estrutura, versão, integridade e tamanho. Falta tratar o arquivo como o que ele é: dados de terceiros. Um hash detecta corrupção, não adulteração, porque quem altera recalcula o hash.

**Recomendação:** schema Zod estrito (rejeitar campos desconhecidos, inclusive `__proto__`), limites de bytes, de número de objetos e de profundidade, migrações explícitas por versão e regeneração de todos os IDs na importação, para não colidir com registros existentes nem reaproveitar identificadores de outro projeto. Só assinar o arquivo se houver necessidade real de autenticidade.

### 6. Dados de convidados sem política de privacidade (LGPD)

O documento só diz para não registrar dados pessoais em logs. Faltam base legal, finalidade, retenção, exclusão a pedido do titular e quem é controlador e quem é operador. Restrições alimentares podem revelar saúde ou religião, o que tende a exigir cuidado reforçado. PDF, PNG e .vflow podem carregar nomes de convidados para fora do sistema, e o IndexedDB guarda dados pessoais sem criptografia num navegador possivelmente compartilhado.

**Recomendação:** minimizar (o layout precisa de nome e grupo, raramente de e-mail), referenciar convidados por ID, oferecer exportação anonimizada, limpar o cache local no logout e avaliar a região de hospedagem do projeto (há região em São Paulo, a confirmar). Definir retenção e fluxo de exclusão. Isto é revisão técnica, não parecer jurídico: validar com assessoria especializada.

### 7. Compartilhamento e convidados externos não têm modelo

Os testes E2E listam "compartilhar projeto", mas o documento não define links, expiração nem acesso do cliente do evento. UUID difícil de adivinhar ajuda contra enumeração, mas não é controle de acesso; quem controla é a RLS.

**Recomendação:** links de leitura com token aleatório, expiração e revogação, sem PII de convidados por padrão. Registrar na auditoria quem criou, usou e revogou links.

### 8. Segredos, cabeçalhos, service worker e auditoria

O documento proíbe a chave administrativa no frontend, o que está certo, mas não cobre o entorno. No Vite, variáveis com prefixo `VITE_` são embutidas no pacote público, então nenhum segredo pode usá-lo. Também faltam cabeçalhos no Netlify (Content-Security-Policy, `frame-ancestors`, Referrer-Policy) e uma regra de cache para o service worker, que não deve guardar respostas autenticadas da API sem critério. A auditoria é citada, mas sem definição de formato.

**Recomendação:** segredos só em Edge Functions e variáveis de ambiente do servidor; CSP e demais cabeçalhos definidos no `netlify.toml`; cache do service worker restrito a arquivos estáticos e a dados do próprio usuário, com invalidação por versão. Tabela de auditoria somente de inserção (sem update nem delete para usuários), cobrindo login, compartilhamento, exportação e exclusão. Confirmar o que o plano contratado do Supabase oferece de backup e testar uma restauração antes da produção.

## Plano de ação priorizado

Seis itens devem ser decididos antes de escrever código, porque mudam o modelo de dados. O resto cabe no MVP ou depois.

| Item | Prioridade | Esforço | Quando |
| --- | --- | --- | --- |
| Convenção de coordenadas (destra, Z para cima) e adaptadores Konva/Three.js com testes de ida e volta | Alta | P | Antes de codar |
| Rotação em unidade discreta, tolerância ε e separação entre dados persistidos e geometria derivada | Alta | M | Antes de codar |
| Contrato único Comando → Operação (inversa, idempotência, coalescência de arrasto) | Alta | M | Antes de codar |
| Semântica de grupos: posição absoluta nos membros, regra para membro bloqueado | Média | P | Antes de codar |
| Onde o servidor valida operações (RPC transacional) e o que ele garante | Alta | G | Antes de codar |
| Modelo de organizações, papéis e compartilhamento, com políticas RLS | Alta | G | Antes de codar |
| Testes negativos de RLS como bloqueio de CI | Alta | M | MVP |
| Limites e validação de importação (CSV, XLSX e .vflow) | Alta | M | MVP |
| Privacidade de convidados: minimização, retenção, exclusão, exportação anonimizada, limpeza local no logout | Alta | M | MVP |
| Altura e elevação, boundary com furos, snapshot de dimensões do catálogo | Média | M | MVP |
| Índice espacial e orçamento de desempenho medido cedo | Média | M | MVP |
| Canais Realtime privados e presença limitada a membros | Média | M | MVP, se houver edição simultânea |
| Cabeçalhos de segurança, CSP, cache do service worker e gestão de segredos | Média | P | MVP |
| Auditoria somente de inserção e teste de restauração de backup | Média | M | Depois do MVP |

Esforço é estimativa relativa (P, M, G) feita sobre o texto, não medida; ajuste ao tamanho da equipe.

## Decisões em aberto para a v0.2

As respostas abaixo fecham os itens "Antes de codar" do plano. Marque cada uma quando decidir.

- [ ] **Persistência do projeto:** documento por layout (jsonb) ou uma linha por objeto? Muda conflito por objeto, granularidade de RLS e tamanho de payload.
- [ ] **Rotação:** livre (qualquer ângulo) ou em passos fixos? Mesas retangulares costumam precisar de ângulos arbitrários.
- [ ] **Colisão no MVP:** só footprint 2D ou considerando altura (Z)?
- [ ] **Edição simultânea:** entra no MVP, ou o MVP tem só colaboração assíncrona com conflito detectado na sincronização?
- [ ] **Quem vê dados de convidados:** só o dono, também editores e visualizadores, e o cliente do evento (acesso externo)?
- [ ] **Papel na LGPD:** o VenueFlow é operador dos dados de empresas clientes, controlador direto de usuários individuais, ou os dois?
- [ ] **Catálogo de mobiliário:** global, por organização ou por projeto, e versionado?
- [ ] **Região dos dados:** há exigência de residência no Brasil?