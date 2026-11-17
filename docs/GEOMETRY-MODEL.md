# VenueFlow Studio · Modelo geométrico do espaço

Este documento registra a primeira implementação do modelo geométrico do Venue Manager e do editor técnico 2D. O PRD v0.2 continua sendo a fonte de verdade do produto.

## Princípios

- A unidade canônica de comprimento é o milímetro (mm).
- A origem local do salão é o canto superior esquerdo da planta: X cresce para a direita e Y cresce para baixo na visualização 2D.
- A geometria persistida não depende de SVG, Canvas ou Three.js.
- A visualização 2D e a futura visualização 3D devem consumir o mesmo modelo persistido.
- Elementos são arquivados logicamente por `deleted_at`; não são removidos fisicamente pela interface.
- A autorização permanece no PostgreSQL por RLS. A validação de interface não substitui as políticas do banco.

## Entidades persistidas

| Entidade | Tabela | Representação |
| --- | --- | --- |
| Limite do salão | `venues` | `width_mm`, `height_mm`, `boundary` |
| Parede | `venue_walls` | Segmento entre `start_x_mm/start_y_mm` e `end_x_mm/end_y_mm`, espessura e altura |
| Porta, janela ou saída | `venue_openings` | Posição, largura, altura opcional, rotação e tipo |
| Obstáculo | `venue_obstacles` | Geometria JSON retangular e indicador `blocks_circulation` |
| Estrutura fixa | `venue_fixed_structures` | Geometria JSON retangular |

## Geometria JSON retangular

Obstáculos e estruturas fixas usam atualmente este contrato versionado:

```json
{
  "schema_version": 1,
  "kind": "rectangle",
  "x_mm": 1200,
  "y_mm": 800,
  "width_mm": 900,
  "height_mm": 600,
  "rotation_deg": 0
}
```

O contrato é validado na leitura antes da representação visual. A versão inicial do editor cria retângulos sem rotação para obstáculos e estruturas; a propriedade de rotação faz parte do contrato para compatibilidade futura, mas a validação de limites rotacionados ainda não foi implementada.

## Regras da primeira versão

- Segmentos de parede precisam ter pontos inicial e final distintos e dentro dos limites do salão.
- Aberturas precisam ter largura positiva e permanecer dentro dos limites após aplicação da rotação.
- Obstáculos e estruturas precisam caber integralmente no salão.
- Comprimentos informados em metros são convertidos para inteiros em milímetros.
- Paredes, aberturas, obstáculos e estruturas podem ser editados, movidos e arquivados.
- Paredes permitem ajuste de extremos e rotação pelo controle de manipulação.
- Aberturas permitem ajuste de largura e rotação.
- Retângulos permitem redimensionamento por oito alças e rotação por alça dedicada.
- Seleção múltipla permite mover, alinhar e distribuir elementos sem perder a geometria relativa.
- Encaixe em grade de 100 mm pode ser habilitado/desabilitado; a grade visual é independente.
- Zoom do canvas varia entre 50% e 200%.

## Limitações conhecidas e próximas decisões

1. A tabela de aberturas não possui uma chave estrangeira para uma parede específica. A posição e rotação são persistidas, mas a associação semântica com a parede ainda precisa de evolução do modelo.
2. A representação 2D atual é uma planta SVG proporcional, não um CAD completo.
3. Ainda não há cotas dinâmicas, seleção por janela, agrupamento lógico persistido, colisão avançada ou cálculo de circulação.
4. O modelo 3D deverá consumir as mesmas coordenadas e dimensões, sem persistir uma cópia geométrica independente.
5. A validação de geometria crítica deverá ser reforçada no servidor/banco antes de abrir edição colaborativa ou importação externa.

## Segurança

As cinco tabelas relacionadas ao espaço têm RLS habilitado e quatro políticas por tabela para leitura, inserção, edição e remoção. As políticas das entidades filhas usam `private.can_read_venue(venue_id)` e `private.can_edit_venue(venue_id)`. O cliente web usa somente a publishable key; nunca usar `service_role` no navegador.

## Manipulação direta no editor 2D

- Os retângulos exibem oito alças de redimensionamento e uma alça de rotação quando selecionados.
- Paredes exibem alças nos dois extremos e uma alça de rotação em torno do ponto médio.
- Aberturas exibem alça para alterar largura e alça de rotação.
- A seleção múltipla é feita com Ctrl/Cmd + clique. Os comandos de alinhamento usam bounding boxes; distribuição exige pelo menos três elementos.
- As operações são validadas no cliente contra o limite do salão. A política RLS continua sendo a fronteira de autorização no servidor.
- O histórico geométrico usa project_versions.snapshot com schema_version: 2, kind: project_venue_geometry, project_id, parent_version e os quatro conjuntos de elementos de todos os salões ativos do projeto. projects.current_version identifica o cursor atual. Versões anteriores são imutáveis; novas edições após desfazer criam um novo ramo por referência ao pai. Snapshots legados de escopo individual não são restaurados como se fossem snapshots de projeto.
- Desfazer/refazer restaura os registros com upsert e arquivamento lógico, preservando IDs. A restauração é feita por múltiplas operações REST e não constitui uma transação única; em falha parcial, a interface informa a necessidade de recarregar antes de continuar.

## Testes

- npm test: testes unitários Vitest para redimensionamento, rotação, limites, alinhamento e distribuição.
- npm run test:e2e: testes Playwright em Chromium para renderização do editor, redimensionamento, rotação, seleção múltipla e navegação no histórico.
- O workflow .github/workflows/ci.yml executa os testes de unidade e navegador, TypeScript, ESLint e build.