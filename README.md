# SkySage

## 🧭 Sobre o Projeto

SkySage é um sistema completo de coleta, processamento e visualização de dados climáticos.  
Ele integra **Collector (Python)**, **RabbitMQ**, **Worker (Go)**, **Backend (NestJS + MongoDB)** e **Frontend (React + Vite + Tailwind + shadcn/ui)** para entregar:

- Coleta periódica de clima via **OpenWeatherMap**
- Armazenamento estruturado no MongoDB
- Dashboard moderno com visualização dos dados
- Sistema de autenticação
- Exportação de dados (CSV / XLSX)
- Integração com API externa (Quotable)

O objetivo é oferecer uma base sólida para aplicações que exigem coleta automatizada, processamento assíncrono e visualização em tempo real.

___

![Dashboard](https://i.imgur.com/rxhu18o.png)

---

## 🏗️ Arquitetura Geral

```
/dashboard   → React + Vite
/backend     → NestJS
/Worker      → Go
/Collector   → Python
```

---

## 🔁 Fluxo do Sistema

![Diagram](https://i.imgur.com/7ZhIrAG.png)

### 1️⃣ Cadastro e Login
1. Usuário cria conta no frontend  
2. O frontend envia as credenciais ao backend  
3. O backend:  
   - Valida o usuário  
   - Gera hash da senha  
   - Cria um **JWT**  
   - Retorna o token via **HttpOnly cookie**

### 2️⃣ Requisições Autenticadas
- O frontend envia o JWT no header  
- O backend valida o token  
- Apenas dados autorizados são retornados  
- Logout adiciona o UUID do token à **blacklist**

### 3️⃣ Coleta de Dados (Collector - Python)
- Executado periodicamente (30min)  
- Consulta OpenWeatherMap  
- Envia dados para a fila no RabbitMQ  

### 4️⃣ Processamento (Worker - Go)
- Consome mensagens da fila  
- Valida e transforma os dados  
- Envia para API NestJS  

### 5️⃣ Backend (NestJS)
- Persiste dados no MongoDB  
- Fornece endpoints para clima, usuários e integrações  

### 6️⃣ Dashboard (React)
Consome:  
- `/api/weather/` → dados recentes  
- `/api/users/me` → usuário autenticado  

### 7️⃣ Exportação
Endpoints:  
- `/weather/export/csv`  
- `/weather/export/xlsx`

---

## 🚀 Stack Completa

### Backend
- NestJS  
- Mongoose + MongoDB  
- JWT + Passport  
- Bcrypt  
- Swagger  

### Worker (Go)
- Zap (logs estruturados)  
- Lumberjack (gerenciamento de logs)  

### Collector (Python)
- Requests / Scheduling  

### Frontend
- React + Vite  
- TailwindCSS  
- shadcn/ui  
- React Hook Form  
- Axios  
- React Router DOM  
- Zustand
- Zod

---

## 🔌 Rotas da API

### 📘 Documentação (Swagger)

A API possui documentação interativa via **Swagger UI**, permitindo:
- Visualizar todas as rotas disponíveis
- Testar endpoints diretamente no navegador
- Validar autenticação baseada em **cookie HttpOnly**

📍 **URL**: /api/docs

> ⚠️ **Observação**  
> A autenticação utiliza **cookie HttpOnly**.  
> Após executar o login (`/api/auth/login`) pelo Swagger, o cookie é armazenado automaticamente pelo navegador e reutilizado nas demais rotas de autenticação (ex: `/api/auth/me`).

### **/auth**
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Valida token |

### **/users**
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users/` | Retorna usuários |
| POST | `/api/users/` | Cria usuário |
| DELETE | `/api/users/:id` | Deleta usuário |
| PUT | `/api/users/:id` | Atualiza usuário |

### **/weather**
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/weather/` | Inserção (Worker) |
| GET | `/api/weather/` | Clima mais recente |
| GET | `/api/weather/insight` | Insight via Gemini |
| GET | `/api/csv` | Exporta CSV |
| GET | `/api/xlsx` | Exporta XLSX |

### **/quotable**
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/quotable` | Consulta API externa |

---

## ▶️ Como Rodar Localmente

### ⚙️ Variáveis de Ambiente Necessárias

Antes de iniciar os serviços, crie um arquivo **`.env`** na raiz do projeto contendo:

```env
OPENWEATHER_KEY=sua_key_da_openweather
GEMINI_APIKEY=sua_key_da_gemini
JWT_SECRET=seu_secret
```
### Na raiz do projeto, execute:

```bash
docker compose up -d
```

### Serviços Disponíveis:

| Serviço | URL |
|--------|-----|
| Frontend | `http://localhost:4173` |
| API | `http://localhost:3000` |
| Mongo Express | `http://localhost:8081` |
| RabbitMQ | `http://localhost:15672` |

---

## 📦 Estrutura Simplificada do Projeto

```
SkySage/
 ├─ backend/
 ├─ collector/
 ├─ worker/
 ├─ dashboard/
 └─ docker-compose.yml
```

