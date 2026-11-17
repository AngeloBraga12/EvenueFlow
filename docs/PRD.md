# VenueFlow Studio

## Product Requirements Document (PRD)

**Versão:** 0.2  
**Status:** Em especificação  
**Posicionamento:** Plataforma profissional de planejamento espacial para eventos  
**Público:** Individual e empresarial

---

## 1. Identidade do produto

### 1.1 Nome

VenueFlow Studio.

### 1.2 Posicionamento

Uma plataforma de planejamento inteligente que conecta espaços físicos, mobiliário, convidados e circulação em um único ambiente de trabalho.

### 1.3 Proposta de valor

Planejar espaços para eventos com precisão, visualizar o resultado antes da montagem e otimizar a organização sem perder o controle das decisões.

### 1.4 Personalidade visual

A identidade deverá transmitir:

- Precisão.
- Organização.
- Tecnologia.
- Confiabilidade.
- Profissionalismo.
- Facilidade de utilização.

### 1.5 Direção estética

**Conceito:** Technical Professional.

A interface combinará elementos de ferramentas arquitetônicas e softwares profissionais com a simplicidade de um SaaS contemporâneo.

Paleta inicial proposta:

- Grafite escuro: superfícies principais.
- Cinza carvão: painéis e navegação.
- Branco suave: textos e elementos de destaque.
- Verde-lima discreto: ações positivas, seleção e destaques.
- Cinza neutro: elementos secundários.
- Vermelho e âmbar: alertas e problemas.

A paleta deverá ser validada em protótipos com testes de contraste e acessibilidade.

### 1.6 Linguagem visual

- Grades técnicas discretas.
- Linhas de precisão.
- Ícones consistentes.
- Tipografia legível.
- Painéis compactos.
- Hierarquia visual clara.
- Animações funcionais e discretas.
- Indicadores de estado em tempo real.

Evitar:

- Gradientes decorativos excessivos.
- Cartões arredondados em excesso.
- Glassmorphism generalizado.
- Sombras exageradas.
- Interfaces visualmente carregadas.
- Estética genérica de dashboard gerado por IA.

### 1.7 Experiência adaptativa

O produto deverá oferecer duas camadas de experiência:

**Modo simplificado:** interface guiada, ferramentas essenciais e operações acessíveis a iniciantes.

**Modo profissional:** controles avançados, propriedades geométricas, inventário, restrições, análise e ferramentas de otimização.

A mudança de modo não poderá remover dados ou funcionalidades do projeto.

---

## 2. Personas e necessidades

### 2.1 Organizador individual

Precisa montar um evento sem conhecimentos técnicos.

Necessidades:

- Criar um salão rapidamente.
- Escolher mesas e cadeiras.
- Organizar famílias e convidados.
- Visualizar o resultado.
- Saber se o espaço comporta todos.

### 2.2 Organizador profissional

Gerencia eventos com maior complexidade.

Necessidades:

- Precisão nas medidas.
- Controle de mobiliário.
- Comparação de layouts.
- Controle de circulação.
- Exportação profissional.
- Histórico e versões.

### 2.3 Administrador de buffet ou espaço

Gerencia vários espaços, funcionários e eventos.

Necessidades:

- Biblioteca de salões.
- Inventário compartilhado.
- Gestão de equipe.
- Permissões.
- Reutilização de projetos.
- Relatórios e acompanhamento.

### 2.4 Colaborador operacional

Precisa consultar e executar a montagem.

Necessidades:

- Visualizar a disposição final.
- Consultar quantidades.
- Identificar mesas e grupos.
- Acessar orientações de montagem.
- Receber atualizações autorizadas.

---

## 3. Arquitetura de navegação do produto

A navegação principal deverá conter:

1. Início.
2. Projetos.
3. Salões.
4. Eventos.
5. Inventário.
6. Relatórios.
7. Equipe e organização.
8. Configurações.

O acesso aos módulos deverá respeitar permissões e contexto da conta.

### 3.1 Tela inicial

Deverá apresentar:

- Projetos recentes.
- Eventos próximos.
- Salões cadastrados.
- Acesso rápido para criar projeto.
- Atividades recentes.
- Indicadores de sincronização.
- Alertas de projetos pendentes.

### 3.2 Estrutura de um projeto

Um projeto deverá conectar:

- Um salão.
- Um evento.
- Um ou mais layouts.
- Grupos de convidados.
- Inventário utilizado.
- Rotas e análises.
- Histórico de versões.

O sistema deverá permitir criar layouts sem convidados cadastrados, assim como projetos preliminares sem um evento formalmente definido.

---

## 4. Fluxo principal do usuário

### Fluxo A: criação de um projeto

1. Usuário acessa o painel.
2. Seleciona criar projeto.
3. Escolhe um salão existente ou cria um novo.
4. Define as dimensões e características.
5. Cria ou associa um evento.
6. Define a quantidade estimada de convidados.
7. Abre o editor.
8. Adiciona mobiliário.
9. Organiza grupos e mesas.
10. Analisa capacidade e circulação.
11. Salva o projeto.

### Fluxo B: otimização automática

1. Usuário abre um layout.
2. Define as condições desejadas.
3. Escolhe objetivos de otimização.
4. O motor gera propostas.
5. Usuário compara resultados.
6. Visualiza diferenças.
7. Seleciona uma proposta.
8. Confirma a aplicação.
9. O sistema cria uma nova versão.
10. A proposta é aplicada sem destruir o histórico anterior.

### Fluxo C: preparação para montagem

1. Usuário finaliza o layout.
2. Executa as verificações.
3. Consulta inventário.
4. Consulta distribuição de mesas e cadeiras.
5. Exporta a planta.
6. Gera relatório operacional.
7. Compartilha com colaboradores autorizados.

---

## 5. Módulos funcionais

### Módulo 01: Workspace

Responsável pela navegação, projetos, organizações e atividades.

### Módulo 02: Venue Manager

Responsável pela criação e manutenção dos salões.

### Módulo 03: Event Manager

Responsável por eventos, convidados, grupos e configurações.

### Módulo 04: Layout Editor

Responsável pela edição geométrica e visualização 2D/3D.

### Módulo 05: Furniture Manager

Responsável por mesas, cadeiras, mobiliário e inventário.

### Módulo 06: Layout Intelligence

Responsável por gerar, comparar e aplicar sugestões.

### Módulo 07: Flow Analysis

Responsável por circulação, rotas, obstáculos e gargalos.

### Módulo 08: Reports & Export

Responsável por plantas, relatórios e exportações.

### Módulo 09: Storage & Sync

Responsável por persistência local, nuvem e sincronização.

### Módulo 10: Identity & Access

Responsável por autenticação, organizações, permissões e auditoria.

---

## 6. Experiência do editor

O editor será o ambiente central do VenueFlow Studio.

### Estrutura proposta

**Barra superior:**

- Nome do projeto.
- Salvar e sincronização.
- Desfazer e refazer.
- Histórico.
- Alternância 2D/3D.
- Exportar.
- Compartilhar.

**Painel lateral esquerdo:**

- Seleção.
- Mesas.
- Cadeiras.
- Mobiliário.
- Paredes e estruturas.
- Portas e janelas.
- Áreas especiais.
- Grupos.
- Ferramentas de desenho.

**Área central:**

- Planta do salão.
- Grade.
- Objetos.
- Seleção e movimentação.
- Rotas.
- Indicadores espaciais.

**Painel lateral direito:**

- Propriedades do objeto.
- Dimensões.
- Rotação.
- Capacidade.
- Identificação.
- Agrupamento.
- Restrições.
- Configurações específicas.

**Barra inferior:**

- Escala.
- Coordenadas.
- Zoom.
- Quantidade de objetos.
- Alertas.
- Estado de análise.

### 6.1 Interação 2D/3D

O modelo geométrico será independente do mecanismo de renderização.

A alteração de posição, rotação ou dimensão em uma visualização deverá refletir na outra.

O sistema deverá manter um único estado geométrico canônico, evitando divergências entre representações.

### 6.2 Seleção e movimentação

- Seleção individual.
- Seleção múltipla.
- Agrupamento lógico.
- Movimentação de grupo.
- Movimentação individual dentro do grupo.
- Bloqueio de objetos.
- Duplicação.
- Alinhamento.
- Distribuição.
- Rotação.
- Encaixe magnético configurável.

---

## 7. Regras de negócio fundamentais

### RN-001: preservação de layout

Nenhuma otimização poderá sobrescrever silenciosamente uma organização existente.

### RN-002: histórico

Alterações relevantes deverão ser recuperáveis.

### RN-003: capacidade

Capacidade sugerida, ajustada e efetivamente posicionada deverão ser informações independentes.

### RN-004: inventário

A quantidade disponível deverá ser considerada antes de recomendar mobiliário.

### RN-005: agrupamento

Mover um grupo deverá preservar a disposição relativa de seus elementos, salvo alteração explícita.

### RN-006: circulação

Rotas deverão considerar obstáculos e largura livre, não apenas distância entre pontos.

### RN-007: privacidade

Todo acesso a projetos deverá passar por autorização validada no servidor.

### RN-008: sincronização

Conflitos entre versões locais e remotas deverão ser identificados e tratados explicitamente.

### RN-009: geometria

Todas as dimensões deverão utilizar unidades físicas padronizadas internamente, com conversão de apresentação.

### RN-010: visualização

2D e 3D deverão representar o mesmo projeto, não cópias independentes.

---

## 8. Escopo e prioridades

### P0: Fundação obrigatória

- Identidade e autenticação.
- Projetos e salões.
- Modelo geométrico.
- Editor 2D.
- Representação 3D básica.
- Mesas e cadeiras.
- Salvamento.
- Histórico básico.
- Segurança e isolamento de dados.

### P1: Operação inteligente

- Grupos de convidados.
- Inventário.
- Sugestões automáticas.
- Comparação de layouts.
- Aplicação autorizada.
- Análise de circulação.
- Exportação.

### P2: Operação profissional

- Equipes e permissões avançadas.
- Relatórios detalhados.
- Sincronização offline completa.
- Colaboração.
- Gestão de múltiplos espaços.
- Recursos empresariais.

### P3: Expansão

- Integrações externas.
- Gestão comercial e financeira.
- Catálogo de mobiliário.
- Modelos compartilhados.
- Recursos avançados de análise.
- Planos e faturamento SaaS.

As prioridades indicam ordem de implementação, não autorização para ignorar requisitos arquiteturais de segurança, persistência e compatibilidade.

---

## 9. Critérios de aceite gerais

O produto não será considerado funcionalmente pronto se:

- O modelo 2D e 3D apresentar divergências.
- O usuário perder alterações após uma falha de conexão.
- A otimização destruir um layout anterior.
- O inventário permitir alocação inconsistente.
- Grupos perderem suas relações espaciais ao serem movidos.
- Rotas atravessarem obstáculos sem sinalização.
- Usuários acessarem projetos sem permissão.
- Exportações produzirem plantas incompatíveis com o projeto.
- O sistema não conseguir recuperar uma versão válida.

Cada módulo deverá ter seus próprios testes unitários, de integração e de ponta a ponta.

---

## 10. Indicadores de produto

Indicadores a serem acompanhados:

- Tempo para criar um primeiro layout.
- Tempo para concluir um projeto.
- Quantidade de ajustes manuais após otimização.
- Número de conflitos geométricos detectados.
- Taxa de sucesso de exportação.
- Taxa de sincronização bem-sucedida.
- Frequência de recuperação de versões.
- Erros por módulo.
- Desempenho do editor em projetos de diferentes tamanhos.

Os indicadores serão medidos após a existência de uma implementação funcional e de instrumentação adequada.
