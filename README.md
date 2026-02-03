🛒 NexBuy – Frontend
<p align="center"> <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white" /> <img src="https://img.shields.io/badge/TailwindCSS-UI-38B2AC?logo=tailwindcss&logoColor=white" /> <img src="https://img.shields.io/badge/Context_API-State-61DAFB?logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" /> </p>

🔗 Deploy:
👉 https://nexbuy-frontend-omega.vercel.app/login

📌 Sobre o Projeto

O NexBuy é uma aplicação de compras desenvolvida como um exercício intencional de engenharia de software, simulando um cenário real de produto.
O objetivo principal foi aplicar boas práticas de arquitetura frontend, organização de código, tipagem forte e integração com uma API segura.

Mais do que entregar telas, o foco foi construir uma base escalável, legível e de fácil manutenção, próxima do que é exigido em ambientes profissionais.

🧠 Principais Objetivos Técnicos

Construir uma aplicação moderna e performática

Garantir previsibilidade e segurança através de tipagem

Manter uma arquitetura organizada e escalável

Facilitar manutenção e evolução do código

Simular comunicação real com backend (API REST)

🛠️ Stack Utilizada
⚙️ Core

React 18+ – Componentização e reutilização

TypeScript – Tipagem forte e previsibilidade

Vite – Build rápido e ótima DX

🎨 Estilização

Tailwind CSS – Estilização utilitária, responsiva e consistente

🔄 Estado e Arquitetura

Context API – Gerenciamento de estado global (auth, usuário, sessão)

Hooks personalizados – Separação de lógica e reutilização

Arquitetura modular – Organização por responsabilidade

🚀 Deploy

Vercel – Deploy contínuo e otimizado para React/Vite

🧱 Arquitetura e Organização

A estrutura do projeto foi pensada para facilitar leitura, manutenção e escala:

src/
├── components/     Componentes reutilizáveis
├── contexts/       Context API (Auth, User, etc.)
├── hooks/          Hooks personalizados
├── pages/          Páginas da aplicação
├── services/       Integração com API (Axios)
├── routes/         Definição de rotas
├── styles/         Configurações globais
├── types/          Tipagens globais
└── utils/          Funções auxiliares

🧼 Clean Code aplicado

Componentes pequenos e coesos

Responsabilidade única

Nomes claros e semânticos

Separação entre UI, lógica e serviços

Tipagem explícita sempre que possível

🔐 Autenticação e Integração

O frontend consome uma API REST segura, com:

Autenticação via JWT

Integração com login tradicional e OAuth

Persistência de sessão controlada

Proteção de rotas no frontend

A comunicação com a API é centralizada em services, facilitando manutenção e testes.

📈 Aprendizados Principais

Durante o desenvolvimento do NexBuy, os principais aprendizados foram:

A importância de pensar arquitetura antes de codar

Como tipagem forte reduz bugs silenciosos

Organização de pastas impacta diretamente a escalabilidade

Frontend não é apenas UI — é engenharia

Decisões simples hoje evitam problemas grandes amanhã

Esse projeto reforçou minha visão de que software de qualidade nasce da intenção, não do improviso.

▶️ Como Rodar Localmente
# Clone o repositório
git clone https://github.com/gabr1elcodes/nexbuy-frontend.git

# Entre na pasta
cd nexbuy-frontend

# Instale as dependências
npm install

# Rode o projeto
npm run dev

🤝 Contribuições e Feedback

Feedbacks técnicos são muito bem-vindos, especialmente sobre:

Arquitetura frontend

Organização de estado

Boas práticas com React, TypeScript e Organização!

Se você é dev, tech lead ou recrutador, fico aberto a trocar ideias 🚀

👨‍💻 Autor

Gabriel Oliveira
Desenvolvedor Full Stack React + Node.js
🔗 GitHub: https://github.com/gabr1elcodes
- Linkedin: https://www.linkedin.com/in/gabriel-oliveira-871b06359/
