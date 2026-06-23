# DOCUMENTAÇÃO DE TCC: SISTEMA WEB DE GESTÃO MINISTERIAL

Este arquivo contém o texto integral da documentação acadêmica do projeto, estruturado conforme as normas da ABNT.

---

## CAPA (Estrutura ABNT)

**UNIVERSIDADE PARANAENSE - UNIPAR**
**ANÁLISE E DESENVOLVIMENTO DE SISTEMAS**

**SISTEMA WEB DE GESTÃO MINISTERIAL**
*Uma plataforma moderna para gerenciamento de escalas voluntárias e segurança no check-in do Espaço Kids com React e Supabase*

**Autor:** GUSTAVO HENRIQUE GOMES DOS SANTOS
**Cidade:** Cianorte - PR
**Ano:** 2026

---

## RESUMO

O presente trabalho descreve o planejamento, a modelagem e o desenvolvimento do **Sistema de Gestão Ministerial**, uma aplicação web do tipo Single Page Application (SPA) voltada à informatização dos processos administrativos de instituições religiosas e eclesiásticas. O foco central da solução concentra-se no gerenciamento dinâmico de escalas de voluntários e no controle rigoroso de presença e segurança para o Ministério Kids. 

Antes do desenvolvimento do sistema, a organização de equipes e a identificação de crianças no espaço infantil eram executadas manualmente por planilhas ou papel impresso, gerando problemas crônicos como duplicação de funções de voluntários, falhas de comunicação e insegurança jurídica na entrega de crianças aos responsáveis legais. 

A arquitetura tecnológica adotada baseia-se na biblioteca frontend **React 19** acoplada ao empacotador rápido **Vite 8** e estilizada com o framework utilitário **Tailwind CSS v4**. O backend opera no modelo Serverless via **Supabase**, servindo-se do banco de dados **PostgreSQL**, controle de autenticação integrado e segurança avançada baseada em políticas de **Row Level Security (RLS)**. Para operações restritas a administradores (operadores), criaram-se funções customizadas escritas em PL/pgSQL executadas com privilégio `SECURITY DEFINER`. 

**Palavras-chave:** Single Page Application. React. Supabase. Row Level Security. Gestão Eclesiástica. Segurança Kids.

---

## ABSTRACT

This paper describes the planning, modeling, and development of the **Ministerial Management System**, a Single Page Application (SPA) web platform aimed at computerizing administrative processes in ecclesiastical institutions. The core focus lies on the dynamic management of volunteer schedules and rigorous presence and security control for the Children's Ministry (Kids).

Prior to the system's creation, team organization and child identification in the nursery were performed manually via spreadsheets or printed papers, raising chronic issues such as double-booking volunteer shifts, communication breakdowns, and legal safety loopholes during child pickup.

The technological architecture leverages the **React 19** frontend library coupled with the high-performance **Vite 8** bundler, and styled using the utility framework **Tailwind CSS v4**. The backend operates in a Serverless design via **Supabase**, using a **PostgreSQL** database with built-in Authentication and security policies enforced through **Row Level Security (RLS)**. For restricted administrator (operator) operations, custom PL/pgSQL database functions executing with `SECURITY DEFINER` permissions were implemented.

**Keywords:** Single Page Application. React. Supabase. Row Level Security. Church Management. Kids Safety.

---

## 1. INTRODUÇÃO

Com o crescimento e a diversificação de atividades em comunidades eclesiásticas modernas, a administração manual de seus departamentos torna-se progressivamente inviável. Igrejas contemporâneas coordenam dezenas de voluntários divididos em múltiplos ministérios (som, iluminação, música, recepção, infraestrutura e ministério infantil), todos com disponibilidades de horários e funções muito distintas.

Um dos principais gargalos operacionais reside na criação e publicação de escalas de voluntários, as quais frequentemente colidem com ausências ou duplicidade de profissionais no mesmo horário. Outra demanda crítica refere-se ao **Espaço Kids**: o recebimento de dezenas de crianças durante cultos e programações comunitárias exige um fluxo rigoroso de check-in e check-out, onde alergias, dados de contato e a identificação do responsável legal que deixou a criança devem ser armazenados com segurança absoluta para evitar acidentes e retiradas indevidas por pessoas não autorizadas.

### 1.1 Problema de Pesquisa
Como informatizar de forma integrada, responsiva e segura o gerenciamento de escalas ministeriais e o controle de acesso de crianças no Espaço Kids em uma igreja, minimizando a incidência de erros humanos e garantindo conformidade com a segurança dos dados e o controle físico de menores?

### 1.2 Objetivos

#### Objetivo Geral:
Desenvolver um sistema web intuitivo e responsivo que integre a gestão eclesiástica de membros, cargos, arquivos de mídia e escalas de trabalho, acoplado a um módulo de controle de fluxo de entrada e saída de crianças no Espaço Kids em tempo real.

#### Objetivos Específicos:
* Implementar uma interface administrativa unificada protegida por autenticação segura de operadores.
* Permitir o registro e controle de membros e suas respectivas funções funcionais na igreja.
* Oferecer uma ferramenta ágil para criar escalas semanais ou periódicas por ministério.
* Projetar o fluxo completo de check-in de crianças contendo informações críticas de saúde (alergias) e contatos telefônicos imediatos.
* Habilitar um painel público em tempo real (Painel de Transmissão) para visualização rápida das escalas e controle de status de crianças, visando monitores externos.
* Assegurar a privacidade e a integridade das informações utilizando regras avançadas de Row Level Security (RLS) diretamente no banco de dados.

### 1.3 Justificativa
O desenvolvimento desta ferramenta justifica-se pela urgente necessidade de profissionalização dos processos internos nas igrejas locais. A eliminação do retrabalho na montagem de escalas, a transparência obtida ao expor as escalas públicas via internet e a tranquilidade dos pais ao deixarem seus filhos em um ambiente monitorado digitalmente com controle rígido de saída constituem fatores de grande valor social e operacional.

---

## 2. FUNDAMENTAÇÃO TEÓRICA

### 2.1 React 19 e Single Page Applications (SPA)
O **React** é uma biblioteca Javascript declarativa baseada em componentes, amplamente consolidada para a construção de interfaces de usuário dinâmicas. Ao estruturar a aplicação como uma Single Page Application (SPA), o navegador carrega a página HTML inicial apenas uma vez. As atualizações subsequentes ocorrem de forma assíncrona por meio do DOM Virtual, proporcionando uma transição de telas fluida e instantânea aos usuários — aspecto essencial para computadores administrativos e dispositivos móveis (celulares) utilizados pelos porteiros do Espaço Kids.

### 2.2 Vite 8
O **Vite** atua como a ferramenta de build e servidor de desenvolvimento do projeto. Ao contrário de ferramentas legadas como o *Webpack*, o Vite utiliza módulos ES nativos (ESM) no navegador, entregando um Hot Module Replacement (HMR) extremamente rápido durante a programação, e otimizando o empacotamento final com Rollup para produção, gerando arquivos otimizados e minificados.

### 2.3 Supabase como Backend-as-a-Service (BaaS)
O **Supabase** foi integrado como a camada de backend da aplicação. Sendo uma alternativa open-source de alta performance ao Firebase, ele fornece um banco de dados relacional **PostgreSQL** completo, gerenciamento integrado de autenticação de usuários (JWT), e geração automática de APIs REST instantâneas a partir da estrutura de dados criada.

### 2.4 Row Level Security (RLS) e PostgreSQL
No coração da segurança do Supabase está o conceito de **Row Level Security (RLS)** do PostgreSQL. Essa tecnologia permite que regras de acesso a dados sejam aplicadas diretamente ao nível de linhas das tabelas do banco de dados, e não apenas nas rotas de aplicação de código. Desse modo, garante-se que usuários não autenticados (visitantes acessando o Painel Público) consigam apenas visualizar dados autorizados (escalas ativas e status das crianças), enquanto apenas operadores logados tenham permissão de inserção, edição e exclusão.

---

## 3. ANÁLISE E PROJETO DE SISTEMAS

### 3.1 Requisitos Funcionais (RF)

| Identificador | Descrição do Requisito |
|---|---|
| **RF-01** | O sistema deve autenticar operadores por meio de e-mail e senha. |
| **RF-02** | Os operadores autenticados devem criar, ler, editar e excluir membros e suas respectivas funções na igreja. |
| **RF-03** | Os operadores devem gerenciar escalas indicando data, ministério responsável, status de presença dos voluntários (Confirmada, Falta Justificada, Falta Sem Justificativa) e membros alocados. |
| **RF-04** | O sistema deve permitir o gerenciamento de mídias (incluindo upload, visualização, edição e exclusão) de conteúdos (texto/URLs) categorizados por ministério. |
| **RF-05** | O sistema deve possibilitar o check-in de crianças no Espaço Kids registrando dados do responsável, telefone de contato e alergias. |
| **RF-06** | O sistema deve gerenciar a saída (check-out) de crianças, calculando o tempo de permanência e arquivando-as no histórico permanente de presença. |
| **RF-07** | Disponibilizar um painel público e aberto com visualização das escalas, mídias/cifras para estudo e listagem de check-ins ativos (sem dados sensíveis) para acesso de pais e membros. |
| **RF-08** | O administrador deve poder gerenciar e cadastrar novos operadores, incluindo atualização de senhas e exclusão de contas. |
| **RF-09** | O sistema deve computar em tempo real e emitir relatórios de assiduidade e aproveitamento dos voluntários com base nas escalas. |

### 3.2 Requisitos Não Funcionais (RNF)

| Identificador | Descrição do Requisito |
|---|---|
| **RNF-01** | **Segurança:** O banco de dados PostgreSQL deve aplicar restrições de RLS para proibir escrita anônima. |
| **RNF-02** | **Desempenho:** O tempo de renderização de transições de rotas deve ser inferior a 200 milissegundos. |
| **RNF-03** | **Responsividade:** A interface web deve adaptar-se perfeitamente a dispositivos móveis, tablets e telas de computadores (Design Responsivo). |
| **RNF-04** | **Usabilidade:** O sistema não deve quebrar ou apresentar telas brancas em navegadores que utilizem tradutores automáticos (como Google Translate). |

---

## 4. DICIONÁRIO DE DADOS (DATABASE SCHEMA)

### Tabela: `funcoes`
Armazena as funções/cargos eclesiásticos.
* `id` (BIGSERIAL, PRIMARY KEY): Chave primária.
* `created_at` (TIMESTAMPTZ, DEFAULT now()): Timestamp de criação.
* `nome_funcao` (TEXT, UNIQUE NOT NULL): Nome da função.

### Tabela: `membros`
Armazena os membros e seu vínculo ministerial.
* `id` (BIGSERIAL, PRIMARY KEY): Chave primária.
* `created_at` (TIMESTAMPTZ, DEFAULT now()): Timestamp de criação.
* `nome` (TEXT, NOT NULL): Nome completo.
* `telefone` (TEXT): WhatsApp/Celular.
* `funcao_id` (BIGINT, REFERENCES funcoes(id) ON DELETE SET NULL): Chave estrangeira para função.

### Tabela: `repositorio_midias`
Armazena links de materiais, avisos e mídias de trabalho.
* `id` (BIGSERIAL, PRIMARY KEY): Chave primária.
* `created_at` (TIMESTAMPTZ, DEFAULT now()): Timestamp.
* `titulo` (TEXT, NOT NULL): Título descritivo.
* `tipo` (TEXT, NOT NULL): Categoria da mídia (Link, Vídeo, Áudio, Aviso).
* `ministerio` (TEXT, NOT NULL): Ministério responsável.
* `conteudo` (TEXT, NOT NULL): Link ou texto do arquivo.
* `data_upload` (TEXT): Data textual formatada.

### Tabela: `escalas`
Mapeia as escalas de cultos e voluntários escalados.
* `id` (BIGSERIAL, PRIMARY KEY): Chave primária.
* `created_at` (TIMESTAMPTZ, DEFAULT now()): Timestamp.
* `data_escala` (TIMESTAMPTZ, NOT NULL): Data e horário da escala.
* `ministerio_responsavel` (TEXT, NOT NULL): Nome do ministério.
* `status` (TEXT, NOT NULL): Confirmada, Pendente ou Cancelada.
* `detalhes_voluntarios` (TEXT, NOT NULL): String JSON contendo o array de voluntários alocados e seu respectivo status de presença (`{"id": number, "nome": string, "funcao": string, "presenca": string}`).

### Tabela: `kids_checkin`
Controla o fluxo ativo de crianças presentes no Espaço Kids.
* `id` (BIGSERIAL, PRIMARY KEY): Chave primária.
* `created_at` (TIMESTAMPTZ, DEFAULT now()): Timestamp.
* `nome_crianca` (TEXT, NOT NULL): Nome da criança.
* `responsavel` (TEXT, NOT NULL): Responsável legal na entrega.
* `telefone` (TEXT): Telefone de contato de emergência.
* `alergia` (TEXT, DEFAULT 'Nenhuma'): Alergias da criança.
* `status` (TEXT, DEFAULT 'Pendente'): Presente, Confirmada ou Pendente.
* `hora_entrada` (TEXT): Hora de entrada formatada (HH:MM).
* `hora_saida` (TEXT): Hora de saída formatada (HH:MM).

### Tabela: `kids_historico`
Auditoria e histórico definitivo de presenças do espaço infantil.
* `id` (BIGSERIAL, PRIMARY KEY): Chave primária.
* `created_at` (TIMESTAMPTZ, DEFAULT now()): Timestamp.
* `nome_crianca` (TEXT, NOT NULL): Nome do menor.
* `responsavel` (TEXT, NOT NULL): Responsável legal.
* `telefone` (TEXT): Telefone.
* `alergia` (TEXT): Alergias.
* `data_registro` (DATE, DEFAULT CURRENT_DATE): Data do dia de check-in.
* `hora_entrada` (TEXT): Hora de entrada formatada.
* `hora_saida` (TEXT): Hora de saída formatada.

---

## 5. SEGURANÇA E MECANISMOS DO BANCO DE DADOS

### 5.1 Políticas de Row Level Security (RLS)
O banco foi isolado com RLS. Usuários logados têm permissões completas via regras JWT (`authenticated`). Usuários visitantes/anônimos (`anon`) têm permissão somente de leitura (`SELECT`) em `escalas`, `kids_checkin` e `kids_historico`. Isso previne modificações não autorizadas.

### 5.2 Procedures Administrativas Seguras (SECURITY DEFINER)
Para gerenciar outros operadores autenticados sem expor chaves `service_role` (que poderiam ser capturadas no frontend), implementaram-se funções PL/pgSQL na base de dados com `SECURITY DEFINER` (as permissões rodam com privilégios de sistema/admin), mas o acesso direto do público foi revogado, restando exclusivo a usuários autenticados:

* `list_users()`: Recupera IDs, e-mails e datas de criação de operadores da tabela restrita `auth.users`.
* `delete_user_by_id(user_uuid)`: Remove um operador do auth do Supabase.
* `update_user_password(user_uuid, new_password)`: Utiliza a extensão `pgcrypto` para atualizar de forma segura e criptografada a senha de login do operador.

---

## 6. DETALHES DE IMPLEMENTAÇÃO E RESOLUÇÃO DE ERROS

### 6.1 Estrutura do Frontend
O código React foi desenvolvido de forma modular:
* `/components/ConfirmModal.jsx`: Confirmações de exclusão.
* `/components/ProtectedRoute.jsx`: Proteção de rotas verificando sessão de autenticação.
* `/components/SidebarLayout.jsx`: Menu unificado lateral com controle de navegação e logout.
* `/pages/`: Telas específicas de login, painéis, check-in kids, mídias e cadastros.

### 6.2 Resolução de Conflitos Críticos de Produção

#### A. Erro de DOM 'removeChild' com Tradutores Automáticos
* **Problema:** Quando o tradutor de navegadores (como Google Translate) reescrevia textos dentro da tela de "Carregando...", o React falhava e apresentava tela branca após o carregamento dos dados, emitindo o erro `NotFoundError: Failed to execute 'removeChild' on 'Node'`.
* **Solução:** Adicionaram-se chaves (`key="loading-..."`) nos elementos que renderizam condicionalmente no React. Isso força o motor de renderização do React a destruir e recriar completamente as tags em vez de tentar conciliar as diferenças de sub-nós alterados pelas extensões externas.

#### B. Erro de Recarregamento de Rotas (404 Not Found)
* **Problema:** Acessar diretamente uma rota (ex: `/escalas`) ou dar F5 disparava erro 404 da Vercel.
* **Solução:** Criação de arquivo `vercel.json` na raiz do projeto com regras de reescrita (`rewrites`) para redirecionar todas as requisições à raiz do aplicativo (`index.html`), permitindo que o React Router controle as sub-rotas internamente.

---

## 7. CONCLUSÃO E REFERÊNCIAS BIBLIOGRÁFICAS

O projeto foi concluído com sucesso e está operando em ambiente de produção na Vercel conectado à infraestrutura de nuvem do Supabase. A ferramenta otimiza o tempo operacional de elaboração de escalas e eleva consideravelmente a segurança no trânsito de menores no Espaço Kids.

### Referências
* FLANAGAN, David. **JavaScript: O Guia Definitivo**. 7. ed. Porto Alegre: Bookman, 2021.
* POSTGRESQL GLOBAL DEVELOPMENT GROUP. **PostgreSQL 16 Documentation**. Disponível em: <https://www.postgresql.org/docs/>.
* REACT. **React Documentation (v19)**. Disponível em: <https://react.dev/>.
* SUPABASE. **Supabase Security and Row Level Security Guides**. Disponível em: <https://supabase.com/docs/>.
