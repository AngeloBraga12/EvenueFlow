# VenueFlow

> Planejamento inteligente de espaços para eventos.

O **VenueFlow** é um produto web em concepção para planejar salões e espaços de eventos. A proposta combina uma planta interativa 2D/3D, gestão de mesas e cadeiras, organização manual e automática, análise de circulação e relatórios de inventário.

O objetivo é ajudar desde pessoas organizando eventos particulares até profissionais e empresas de buffet, cerimonial e espaços de eventos a responder, com clareza: **onde cada mesa ficará, quantas pessoas poderão sentar e se os caminhos de circulação permanecem desobstruídos?**

> **Estado do repositório:** documentação inicial do produto e revisão técnica. Este repositório ainda não representa uma aplicação implementada. Não há, neste momento, comprovação de editor funcional, banco provisionado, algoritmos executáveis, testes aprovados ou deploy.

## Sumário

- [Visão do produto](#visão-do-produto)
- [Decisões de produto](#decisões-de-produto)
- [Público e modelo de negócio](#público-e-modelo-de-negócio)
- [Fluxo principal](#fluxo-principal)
- [Módulos funcionais](#módulos-funcionais)
- [Experiência 2D e 3D](#experiência-2d-e-3d)
- [Motor de organização](#motor-de-organização)
- [Flow Engine: circulação](#flow-engine-circulação)
- [Inventário e capacidade](#inventário-e-capacidade)
- [Arquitetura técnica proposta](#arquitetura-técnica-proposta)
- [Modelo de dados conceitual](#modelo-de-dados-conceitual)
- [Offline, sincronização e exportação](#offline-sincronização-e-exportação)
- [Segurança e privacidade](#segurança-e-privacidade)
- [Qualidade e critérios de aceite](#qualidade-e-critérios-de-aceite)
- [Roadmap](#roadmap)
- [Documentação](#documentação)
- [Decisões técnicas ainda abertas](#decisões-técnicas-ainda-abertas)

## Visão do produto

O VenueFlow transforma dimensões do espaço, mobiliário disponível e grupos de convidados em uma planta visual editável. O usuário poderá:

1. Selecionar um modelo de salão ou criar e salvar um espaço personalizado.
2. Informar dimensões, paredes, portas, pilares, obstáculos e áreas reservadas.
3. Cadastrar mesas redondas, quadradas e retangulares, além de cadeiras e outros elementos.
4. Organizar os objetos manualmente ou solicitar propostas automáticas.
5. Agrupar mesas para famílias e grupos sem perder a identidade individual de cada mesa.
6. Visualizar o mesmo projeto em 2D e 3D.
7. Analisar caminhos de convidados e equipe de serviço.
8. Conferir quantidades utilizadas, capacidade, sobras e alertas.
9. Salvar na nuvem, continuar trabalhando localmente e exportar uma cópia do projeto.

O produto deve priorizar precisão geométrica, previsibilidade, facilidade de edição e transparência dos resultados. A automação sugere e executa apenas mediante autorização; ela não deve retirar o controle do usuário.

## Decisões de produto

| Área | Decisão |
|---|---|
| Público | Individual e empresarial |
| Modelo de negócio | SaaS preparado para pessoas e organizações |
| Planta | 2D e 3D |
| Organização | Híbrida: manual e automática |
| Sugestões | Propostas comparáveis: capacidade, conforto e equilíbrio |
| Aplicação automática | Disponível mediante autorização explícita |
| Formatos de salão | Modelos predefinidos e espaços personalizados salvos |
| Formatos de mesa | Redonda, quadrada e retangular |
| Capacidade | Cálculo automático sugerido, com ajuste manual |
| Mobiliário | Posicionamento automático e manual de mesas e cadeiras |
| Armazenamento | Nuvem e cópia local/exportável |
| Exportação | PDF, PNG e formato de projeto .vflow |

## Público e modelo de negócio

### Uso individual

- Criar eventos particulares.
- Manter uma biblioteca de salões.
- Cadastrar mobiliário próprio ou disponível para o evento.
- Salvar, duplicar e exportar projetos.

### Uso empresarial

- Criar uma organização e convidar membros.
- Compartilhar biblioteca de salões e inventário.
- Atribuir permissões por projeto.
- Manter histórico de alterações e projetos de diferentes eventos.
- Evoluir para recursos de equipe e gestão comercial.

O desenho do banco e da autorização deve contemplar contas individuais e organizações desde a fundação. Planos, limites comerciais, cobrança e faturamento ainda não estão especificados.

## Fluxo principal

1. **Criar evento:** nome, data, tipo e estimativa de convidados.
2. **Escolher o espaço:** selecionar um modelo ou abrir um salão personalizado salvo.
3. **Configurar o salão:** dimensões, paredes, portas, pilares, áreas de apoio e restrições.
4. **Definir inventário:** quantidades, dimensões e capacidades dos modelos de mobiliário.
5. **Cadastrar grupos:** famílias, convidados gerais e equipes, minimizando dados pessoais.
6. **Gerar propostas:** solicitar alternativas automáticas ou iniciar a montagem manual.
7. **Editar a planta:** mover, girar, agrupar, separar, duplicar e ajustar objetos.
8. **Analisar circulação:** visualizar rotas, gargalos, obstáculos e áreas livres.
9. **Validar e comparar:** revisar avisos e escolher uma versão.
10. **Finalizar:** consultar inventário e relatórios, salvar e exportar.

## Módulos funcionais

### 1. Espaços e salões

- Biblioteca de modelos: quadrado, retangular, em L, circular e outros formatos.
- Editor de espaços personalizados.
- Dimensões e área calculada.
- Paredes, divisórias, portas, janelas, pilares e obstáculos.
- Áreas reservadas para buffet, palco, cozinha, banheiros e apoio.
- Pontos de entrada, saída e destinos relevantes para circulação.
- Reutilização de salões em diferentes eventos.

A geometria deve aceitar limites côncavos e furos quando necessário. A relação entre paredes e limite do salão precisa ter uma fonte de verdade inequívoca.

### 2. Mobiliário e inventário

- Mesas redondas, quadradas e retangulares.
- Cadeiras individuais ou distribuídas automaticamente.
- Dimensões, altura, elevação e capacidade configuráveis.
- Quantidade total, reservada e utilizada.
- Modelos reutilizáveis de mobiliário.
- Snapshot das dimensões e propriedades no momento em que um objeto é inserido no layout, para preservar projetos antigos quando o catálogo mudar.

### 3. Editor de planta

Ferramentas previstas:

- Seleção simples e múltipla.
- Arrastar, mover e girar.
- Duplicar e excluir.
- Agrupar e desagrupar mesas.
- Alinhar e distribuir.
- Bloquear objetos.
- Grade magnética e guias de alinhamento.
- Zoom, pan e medição.
- Desfazer e refazer.
- Histórico de versões.
- Propriedades e dimensões do objeto selecionado.

Cada mesa continua sendo um objeto físico independente mesmo quando pertence a um grupo. O grupo representa associação e metadados, não uma nova mesa. A movimentação de um grupo deverá respeitar uma regra explícita para objetos bloqueados e manter a posição individual dos membros.

### 4. Organização automática

O motor deverá produzir propostas comparáveis:

- **Capacidade:** busca acomodar os grupos e aproveitar o espaço sem violar restrições.
- **Conforto:** prioriza espaçamento e circulação.
- **Equilíbrio:** pondera capacidade e conforto.

Restrições obrigatórias incluem limites do salão, obstáculos, inventário, áreas proibidas e requisitos de circulação configurados. O algoritmo não deve apresentar como válida uma solução que viole uma restrição obrigatória.

A otimização gera uma nova versão. Nunca substitui silenciosamente o layout atual. O usuário escolhe a proposta e autoriza sua aplicação.

### 5. Flow Engine: circulação

Camadas planejadas:

- Rotas de convidados.
- Rotas de serviço/buffet.
- Acessos, saídas e áreas que precisam permanecer desobstruídas.

O motor deverá considerar pontos de origem e destino, obstáculos, largura livre, rotas alternativas, distâncias e gargalos. A representação visual poderá usar linhas luminosas inspiradas em fibra óptica, com alternativas de alto contraste e impressão.

A análise de circulação é uma ferramenta técnica de apoio. **Não é certificação de acessibilidade, aprovação do Corpo de Bombeiros ou garantia de conformidade normativa.** Requisitos legais devem ser verificados conforme o local, o tipo de evento e a orientação profissional competente.

### 6. Relatórios

- Planta 2D com legenda.
- Visualização 3D para apresentação.
- Mesas utilizadas por formato.
- Cadeiras posicionadas e disponíveis.
- Capacidade total e lugares previstos.
- Mobiliário reservado, utilizado e restante.
- Grupos e distribuição.
- Alertas e pendências.
- Exportação PDF, PNG e .vflow.

## Experiência 2D e 3D

Os dois modos devem representar o mesmo modelo de domínio, sem manter cópias divergentes do layout.

### 2D

- Planta técnica vista de cima.
- Medidas reais e grade.
- Edição precisa de objetos.
- Rotas e áreas de circulação.
- Ferramentas de alinhamento e seleção.

### 3D

- Paredes, altura e elevação.
- Mesas e cadeiras em modelos tridimensionais.
- Portas, janelas, pilares e estruturas.
- Câmera com rotação e zoom.
- Materiais e iluminação.
- Visualização espacial das rotas.

A conversão de coordenadas deve ficar em adaptadores isolados por renderizador. Nenhum componente de interface deve implementar conversões geométricas próprias.

## Motor de organização

O motor deve ser independente de React, Konva e Three.js. Deve receber dados de domínio e restrições, e produzir propostas determinísticas e testáveis.

Etapas conceituais:

1. Validar entradas e inventário.
2. Construir representação geométrica do espaço.
3. Identificar regiões disponíveis e áreas proibidas.
4. Gerar configurações candidatas de mesas e grupos.
5. Avaliar colisões, contenção, capacidade e circulação.
6. Pontuar alternativas conforme o objetivo escolhido.
7. Retornar propostas, métricas e justificativas.
8. Criar uma nova versão somente após a escolha/autorização do usuário.

IA generativa não deve ser responsável por garantir colisões, dimensões ou rotas. Essas garantias pertencem a algoritmos determinísticos com testes.

## Inventário e capacidade

A capacidade calculada é uma sugestão baseada em dimensões, formato, lados utilizáveis, espaçamento e configuração de cadeiras. O usuário pode ajustar a capacidade manualmente.

Devem ser mantidos como valores distintos:

- Capacidade sugerida.
- Capacidade manual definida.
- Número de cadeiras efetivamente posicionadas.
- Número de lugares ocupados ou previstos.

O inventário diferencia quantidade existente, reservada para evento e efetivamente utilizada no layout. Agrupar objetos nunca altera a contagem física.

## Arquitetura técnica proposta

A stack abaixo é uma proposta inicial, não uma implementação já validada:

| Camada | Tecnologia proposta | Responsabilidade |
|---|---|---|
| Linguagem | TypeScript | Tipagem compartilhada |
| Frontend | React + Vite | Aplicação web |
| Editor 2D | Konva.js / React Konva | Interação e renderização 2D |
| Renderização 3D | Three.js + React Three Fiber | Cena 3D |
| Modelos 3D | glTF / GLB | Ativos tridimensionais |
| Estado de interface | Zustand | Estado visual e seleção |
| Validação de dados | Zod | Schemas de entrada/saída |
| Geometria | Módulo próprio | Transformações, colisões e medidas |
| Rotas | A* e representação espacial | Caminhos e análise de circulação |
| Backend e autenticação | Supabase | Serviços, identidade e dados |
| Banco | PostgreSQL | Persistência relacional |
| Offline | IndexedDB + Service Worker | Cache e dados locais |
| Testes unitários | Vitest | Domínio e algoritmos |
| Testes E2E | Playwright | Fluxos de usuário |
| Hospedagem proposta | Netlify | Frontend e configuração de deploy |

### Princípios arquiteturais

- Domínio sem dependência de framework de interface.
- Um único modelo geométrico para 2D e 3D.
- Coordenadas e unidades documentadas.
- Operações serializáveis e versionadas.
- Otimização cria novas versões.
- Validação leve durante interação e validação completa ao confirmar.
- Índice espacial para colisão e hit-testing quando necessário.
- Persistência local não depende de disponibilidade imediata da nuvem.
- A interface não é fronteira de segurança.

## Modelo de dados conceitual

| Entidade | Finalidade |
|---|---|
| profiles | Perfil do usuário |
| organizations | Empresas e equipes |
| memberships | Vínculo e papel de cada membro |
| venues | Salões salvos |
| venue_elements | Paredes, portas, pilares e obstáculos |
| furniture_types | Catálogo de mobiliário |
| furniture_inventory | Quantidade disponível por proprietário/organização |
| events | Eventos planejados |
| guests | Dados mínimos de convidados, quando necessários |
| guest_groups | Famílias e grupos |
| event_reservations | Mobiliário reservado |
| projects | Projetos e titularidade individual ou empresarial |
| project_members | Acesso compartilhado |
| layouts | Versões de planta |
| layout_objects | Mesas, cadeiras e elementos posicionados |
| layout_groups | Associação lógica de objetos |
| circulation_routes | Rotas calculadas |
| layout_reports | Relatórios gerados |
| project_operations | Operações versionadas e idempotentes |
| audit_logs | Eventos relevantes de auditoria |

O esquema final depende das decisões técnicas abertas listadas adiante. Não se deve criar migrations definitivas antes de fechar essas escolhas.

## Offline, sincronização e exportação

### Persistência híbrida

- IndexedDB mantém dados de trabalho local.
- Supabase mantém dados sincronizados na nuvem.
- O usuário pode continuar editando sem conexão.
- A interface distingue alterações locais pendentes de alterações confirmadas pelo servidor.
- A sincronização detecta revisões incompatíveis e não sobrescreve alterações silenciosamente.
- Logout deve limpar dados pessoais locais conforme a política definida.

### Operações e histórico

O contrato de comandos, operações, histórico e sincronização deve ser único. Cada operação deverá possuir identificador idempotente, revisão-base e operação inversa quando aplicável. Undo cria uma nova operação, preservando o histórico. O arrasto é transitório durante o movimento e se torna uma operação ao ser confirmado.

### Formato .vflow

O arquivo exportável deverá ter versão explícita de schema, estrutura validada, limites de tamanho e migrações entre versões. Importações devem regenerar IDs para evitar colisões e não confiar em hashes como prova de autenticidade.

## Segurança e privacidade

O produto poderá tratar dados de convidados e informações de eventos. A implementação deverá observar a LGPD e aplicar minimização de dados desde o desenho.

Requisitos:

- RLS em todas as tabelas expostas.
- Autorização por proprietário, organização e associação ao projeto.
- Papéis e permissões explícitos.
- Operações críticas validadas no servidor.
- Segredos nunca incluídos no bundle frontend ou em variáveis públicas VITE_*.
- Canais de colaboração privados, se colaboração em tempo real for habilitada.
- Links externos com token aleatório, expiração e revogação.
- Limites e validação estrita para CSV, XLSX e .vflow.
- Neutralização de fórmulas em exportações tabulares.
- Logs sem dados pessoais desnecessários.
- Política de retenção, exclusão e exportação de dados.
- Exportação anonimizada quando possível.
- Cabeçalhos de segurança e política de cache apropriada.
- Auditoria de login, compartilhamento, exportação e exclusão.
- Backup e restauração testados antes da produção.

O papel do VenueFlow como controlador ou operador, as bases legais, os prazos de retenção e os direitos dos titulares precisam de análise jurídica adequada. Esta documentação técnica não é parecer jurídico.

## Qualidade e critérios de aceite

Uma funcionalidade só deve ser considerada concluída após implementação e evidência de testes.

| Área | Critério |
|---|---|
| Geometria | Transformações consistentes e tolerância numérica documentada |
| Coordenadas | Conversões 2D/3D testadas nos dois sentidos |
| Inventário | Agrupamento não altera quantidade física |
| Capacidade | Sugestão e ajuste manual permanecem distintos |
| Editor | Objetos respeitam limites e obstáculos |
| Histórico | Undo/redo preserva consistência e gera operações corretas |
| Otimização | Gera nova versão e nunca substitui sem autorização |
| Circulação | Rotas não atravessam obstáculos e respeitam largura configurada |
| Offline | Edição local continua disponível sem rede |
| Sincronização | Conflitos são detectados e não há falso estado de sincronizado |
| Segurança | Testes negativos comprovam isolamento entre usuários e organizações |
| Importação | Arquivos inválidos ou excessivos são rejeitados com segurança |
| Exportação | Planta exportada corresponde à versão selecionada |
| Responsividade | Fluxos essenciais funcionam em desktop, tablet e celular |
| Acessibilidade | Contraste, teclado, foco e alternativas aos sinais visuais são verificados |

Metas de desempenho devem ser definidas e medidas com quantidade representativa de objetos e dispositivos de referência, antes de serem tratadas como garantias.

## Roadmap

### Etapa 0 — Fechamento técnico

- Resolver decisões de persistência, rotação e colisão.
- Fixar convenção de coordenadas.
- Definir contrato de operações e revisão.
- Definir multi-tenancy, papéis e compartilhamento.
- Definir política de dados pessoais.

### Etapa 1 — Fundação e domínio

- Configurar monorepositório e ferramentas.
- Implementar schemas e modelo de domínio.
- Implementar geometria e testes.
- Criar migrations e políticas de acesso.
- Definir design system e estrutura da aplicação.

### Etapa 2 — Editor 2D

- Criar salões e elementos estruturais.
- Inserir, mover, girar e agrupar mobiliário.
- Implementar inventário e capacidade.
- Implementar histórico e persistência local.

### Etapa 3 — Motor de organização

- Gerar propostas automáticas.
- Comparar capacidade, conforto e equilíbrio.
- Validar colisões e restrições.
- Criar versões sem sobrescrita silenciosa.

### Etapa 4 — Circulação e 3D

- Implementar rotas e análise de largura.
- Adicionar visualização 3D baseada no mesmo modelo.
- Testar adaptadores de coordenadas.
- Incluir exportações técnicas e de apresentação.

### Etapa 5 — Sincronização e colaboração

- Sincronização offline/online.
- Resolução explícita de conflitos.
- Organizações, membros e permissões.
- Compartilhamento controlado.

### Etapa 6 — Preparação para produção

- Testes unitários, integração e E2E.
- Testes de segurança e isolamento.
- Acessibilidade e desempenho.
- Observabilidade, backup e restauração.
- Documentação operacional e deploy.

## Documentação

A revisão crítica da arquitetura está em [docs/reviews/ARCHITECTURE-REVIEW.md](docs/reviews/ARCHITECTURE-REVIEW.md). Ela identifica lacunas em geometria, operações e histórico, validação no servidor, multi-tenancy, importações, privacidade e sincronização.

A revisão declara expressamente que analisa o texto da v0.1, sem código ou testes. Seus pontos sobre recursos do Supabase são conhecimento geral e devem ser conferidos na documentação oficial vigente antes da implementação.

Documentos planejados para as próximas etapas:

| Documento | Conteúdo |
|---|---|
| docs/product/PRD.md | Requisitos do produto |
| docs/architecture/ARCHITECTURE.md | Decisões e desenho técnico |
| docs/architecture/EDITOR.md | Editor 2D/3D |
| docs/algorithms/LAYOUT_ENGINE.md | Distribuição e otimização |
| docs/algorithms/FLOW_ENGINE.md | Rotas e circulação |
| docs/database/DATABASE.md | Modelo relacional e políticas |
| docs/security/SECURITY.md | Segurança e privacidade |
| docs/architecture/OFFLINE_SYNC.md | Persistência e sincronização |
| docs/TESTING.md | Estratégia de testes |
| docs/ROADMAP.md | Etapas e dependências |

Esses documentos são planejados; apenas os arquivos efetivamente presentes no repositório devem ser tratados como publicados.

## Decisões técnicas ainda abertas

Os itens abaixo foram identificados na revisão técnica e precisam de decisão antes de fechar o contrato de implementação:

- [ ] **Persistência:** documento JSON por layout ou uma linha por objeto?
- [ ] **Rotação:** livre ou em passos fixos?
- [ ] **Colisão no MVP:** footprint 2D ou colisão considerando altura (Z)?
- [ ] **Colaboração simultânea:** entra no MVP ou fica para fase posterior, com colaboração assíncrona e conflito detectado?
- [ ] **Acesso a dados de convidados:** quem pode visualizar e exportar esses dados?
- [ ] **LGPD:** definição de controlador e operador por tipo de conta e relação contratual.
- [ ] **Catálogo de mobiliário:** global, por organização ou por projeto? Como versionar?
- [ ] **Residência dos dados:** existe exigência de armazenamento no Brasil?

Outros pontos técnicos a fechar incluem a convenção de coordenadas, tolerância geométrica, semântica de grupos e objetos bloqueados, dono da validação transacional no servidor, limites de importação e metas mensuráveis de desempenho.

## Contribuição e desenvolvimento

Enquanto o projeto estiver em especificação, mudanças de arquitetura devem ser registradas nos documentos correspondentes e acompanhadas de critérios de aceite.

Quando a implementação começar:

1. Trabalhe em branches curtas e commits focados.
2. Atualize migrations e documentação junto das mudanças de domínio.
3. Inclua testes para regras geométricas, permissões e sincronização.
4. Não declare testes, deploys ou validações executados sem evidência.
5. Não armazene segredos, dados reais de convidados ou credenciais no Git.
6. Revise impactos sobre compatibilidade de arquivos .vflow e versões existentes.

### Estado atual

- [x] Direção do produto e público definidos.
- [x] Escopo funcional inicial documentado.
- [x] Revisão crítica da arquitetura registrada.
- [ ] Decisões técnicas abertas resolvidas.
- [ ] Aplicação implementada.
- [ ] Testes automatizados executados e aprovados.
- [ ] Deploy de produção validado.

---

**VenueFlow** — planejar melhor o espaço para que o evento flua.
