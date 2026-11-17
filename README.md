# VenueFlow Studio

Plataforma profissional de planejamento espacial para eventos. O produto conecta espaços físicos, mobiliário, convidados e circulação em um ambiente de trabalho único.

> **Documento de referência:** [PRD VenueFlow Studio v0.2](docs/PRD.md). As decisões de produto, arquitetura, UX, regras de negócio e critérios de aceite devem permanecer alinhadas a esse documento.

## Stack

- React + TypeScript + Vite
- React Router
- Supabase Auth e PostgreSQL
- Tipos TypeScript gerados a partir do schema Supabase
- Lucide React

## Direção de produto

**Technical Professional**: interface técnica, compacta e legível, com grafite, carvão, branco suave e verde-lima discreto. O produto deverá oferecer modo simplificado e modo profissional sem remover funcionalidades ou alterar dados.

## Módulos

1. Workspace
2. Venue Manager
3. Event Manager
4. Layout Editor
5. Furniture Manager
6. Layout Intelligence
7. Flow Analysis
8. Reports & Export
9. Storage & Sync
10. Identity & Access

## Prioridades

- **P0:** identidade e autenticação, projetos e salões, modelo geométrico, editor 2D, representação 3D básica, mesas e cadeiras, salvamento, histórico básico e isolamento de dados.
- **P1:** grupos de convidados, inventário, sugestões, comparação e aplicação autorizada, circulação e exportação.
- **P2:** equipes e permissões avançadas, relatórios, sincronização offline e colaboração.
- **P3:** integrações, gestão comercial, catálogo, modelos compartilhados e SaaS billing.

A ordem de entrega não autoriza adiar decisões arquiteturais necessárias para segurança, persistência, versionamento e compatibilidade.

## Desenvolvimento local

Requisitos: Node.js LTS e npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure no arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Nunca coloque `service_role`, secret keys ou credenciais administrativas em variáveis `VITE_*`, no navegador ou no repositório.

## Verificações

```bash
npm run typecheck
npm run lint
npm run build
```

Os comandos estão configurados, mas só devem ser considerados aprovados após execução em ambiente local ou CI.

## Segurança e dados

- A autorização deve ser aplicada no servidor pelo Supabase RLS, não apenas pela interface.
- Toda consulta deve respeitar o escopo da organização e as permissões do usuário.
- O cliente usa apenas a publishable key.
- Não exponha schemas internos na Data API.
- Operações relevantes devem preservar trilha de auditoria e histórico.
- Otimizações devem gerar propostas comparáveis e nunca sobrescrever silenciosamente o layout vigente.

## Estado de implementação

A fundação do frontend inclui autenticação por e-mail/senha, rotas protegidas, cliente Supabase tipado e a primeira tela de workspace com listagem e criação de projetos.

O editor geométrico 2D/3D, Venue Manager completo, Event Manager, inventário, motor de otimização, análise de circulação, exportação, colaboração, testes automatizados e sincronização offline ainda exigem implementação e validação. O produto não deve ser considerado pronto até que os critérios de aceite do PRD sejam demonstrados.

Consulte [supabase/README.md](supabase/README.md) para a configuração do projeto e do banco.
