[![CodeQL](https://github.com/gsaivinay/awesome-chatbot/actions/workflows/codeql.yml/badge.svg)](https://github.com/gsaivinay/awesome-chatbot/actions/workflows/codeql.yml)

Simple and functional chat bot created with NextJs, uses [mistralai/Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) model for generating responses.

## Getting Started

Create `.env.local` file and add you Huggingface API Key.

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Build application:

```bash
pnpm build
```

Analyze bundle:

```bash
pnpm build:analyze
```

---

## Features

- Autoscroll and scroll to bottom functionalities
- Highly efficient markdown rendering with combination of `memo` and `useEffect`
- Supports Github flavoured markdown rendering
- Auto code language detection in case of code block without any language tag
- Support LaTeX syntax rendering for mathematical formulas
- Continue functionality when text generation stopped because of max token length
- Regenerate last response
- Panel to modify generation settings
- Chat threads stored in browser local storage
- Rename or delete chats
- Themes

---

## Techincal Details
- Zustand for state management
- Complete written in typescript
- Streaming API for text generation

---
## In Progress
- [ ] Responsive design for mobile and small screens
- [ ] Clear all conversation at once
- [ ] Connect to self hosted LLMs
- [ ] File upload and chat with file data
- [ ] User login and authentication
- [ ] Save chat history in database
- [x] Unit tests