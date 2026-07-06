# CRM System — Implementation Plan
**Stack:** Angular 21 · Spring Boot · PostgreSQL · Microsoft Azure

---

## 1. How the Abstract Maps to a Build Plan

The abstract defines 7 "Capsule Projects." Treat each as a milestone, built roughly in this order (some run in parallel once the API contract is fixed):

| # | Capsule | What it really means to build |
|---|---------|-------------------------------|
| 1 | Angular UI | Component library, layout, routing |
| 2 | Form Validation | Reactive Forms + validators |
| 3 | Spring Boot Backend | REST APIs, service/repo layers |
| 4 | PostgreSQL Database | Schema, relationships, indexing |
| 5 | System Integration | Frontend ↔ backend wiring, auth |
| 6 | Azure Deployment | CI/CD, hosting, monitoring |
| 7 | Overall Benefits | Polish, docs, demo, reporting |

The dependency order is: **Database → Backend → Frontend (parallel with #2) → Integration → Deployment.**

---

## 2. Architecture Overview

```
┌─────────────────────┐        HTTPS/REST (JSON)        ┌──────────────────────┐
│   Angular 21 SPA     │ ───────────────────────────────▶│   Spring Boot API     │
│  (Standalone Comps,  │◀─────────────────────────────── │  Controller→Service→  │
│   Reactive Forms,    │         JWT in headers           │  Repository layers    │
│   Router + Guards)   │                                  └──────────┬────────────┘
└─────────────────────┘                                             │ Spring Data JPA
        │ hosted on                                                 ▼
        ▼                                                ┌──────────────────────┐
 Azure Static Web Apps                                    │  PostgreSQL (Azure    │
 (or App Service)                                          │  Database for Postgres)│
                                                            └──────────────────────┘
        Backend hosted on Azure App Service / AKS
        CI/CD via Azure DevOps or GitHub Actions
```

---

## 3. Database Design (PostgreSQL)

Core tables to design first, since backend and frontend both depend on this contract:

- **users** — id, name, email, password_hash, role (ADMIN/SALES/SUPPORT), created_at
- **customers** — id, name, company, email, phone, address, owner_user_id, created_at
- **leads** — id, customer_id, source, status (NEW/CONTACTED/QUALIFIED/WON/LOST), value, assigned_to
- **contacts** — id, customer_id, name, role, email, phone
- **interactions** — id, customer_id, user_id, type (CALL/EMAIL/MEETING/NOTE), notes, timestamp
- **activities** — id, customer_id, type, due_date, status, assigned_to

Design notes:
- Use foreign keys with `ON DELETE CASCADE`/`RESTRICT` as appropriate for referential integrity.
- Add indexes on `customers.email`, `leads.status`, `interactions.customer_id`.
- Use Flyway or Liquibase for versioned schema migrations (important to call out in a training project — shows DB lifecycle management).

---

## 4. Backend Plan (Spring Boot)

**Layered architecture:**
```
controller/   → REST endpoints (thin, no business logic)
service/      → business logic, transactions
repository/   → Spring Data JPA interfaces
dto/          → request/response objects (never expose entities directly)
entity/       → JPA-mapped domain models
config/       → security, CORS, Swagger/OpenAPI
exception/    → global exception handler (@ControllerAdvice)
```

**Core REST endpoints to build:**
- `POST /api/auth/login`, `POST /api/auth/register` — JWT-based auth
- `GET/POST/PUT/DELETE /api/customers`
- `GET/POST/PUT/DELETE /api/leads`
- `GET/POST /api/interactions`
- `GET/POST /api/activities`
- `GET /api/users/me`

**Cross-cutting concerns:**
- Spring Security + JWT filter chain, role-based `@PreAuthorize`
- Bean Validation (`@Valid`, `@NotNull`, etc.) on DTOs
- Global exception handler returning consistent error JSON
- Springdoc OpenAPI for auto-generated API docs (useful evidence for a training submission)
- Unit tests with JUnit + Mockito; integration tests with Testcontainers (spins up real PostgreSQL)

---

## 5. Frontend Plan (Angular 21)

**Structure (standalone components, no NgModules):**
```
src/app/
  core/          → auth guard, interceptors, services (ApiService, AuthService)
  shared/        → reusable UI components (buttons, tables, modals)
  features/
    dashboard/
    customers/
    leads/
    contacts/
    activities/
    auth/
```

**Key techniques to demonstrate:**
- Standalone components + `provideRouter` with lazy-loaded routes per feature
- Reactive Forms with custom validators (e.g., email/phone format, required-if-status-is-X)
- `HttpInterceptor` to attach JWT and handle 401 refresh/logout
- Route guards (`CanActivate`) for role-based UI access
- Signals or RxJS `BehaviorSubject` for shared state (e.g., current user, selected customer)
- Bootstrap (or Angular Material, if you want richer components) for responsive layout

---

## 6. Integration & Security

- Define the API contract (OpenAPI spec) **before** frontend work starts, so both sides build against the same shapes.
- CORS configuration on Spring Boot to allow the Angular dev origin (and later, the Azure Static Web App domain).
- JWT issued on login, stored in memory (not localStorage, to reduce XSS risk) or an HttpOnly cookie if you want to go further.
- Centralize error handling on the frontend (interceptor catches 4xx/5xx and surfaces toast notifications).

---

## 7. Azure Deployment Plan

| Component | Azure Service |
|---|---|
| Angular build (static files) | Azure Static Web Apps |
| Spring Boot API | Azure App Service (Linux, Java 21) or AKS if you want container orchestration experience |
| Database | Azure Database for PostgreSQL (Flexible Server) |
| CI/CD | GitHub Actions or Azure DevOps Pipelines |
| Secrets | Azure Key Vault (DB credentials, JWT secret) |
| Monitoring | Azure Application Insights |

**Suggested pipeline stages:** build → test → containerize (optional) → deploy to staging slot → smoke test → swap to production.

---

## 8. Suggested Timeline (6–8 week training project)

| Week | Focus |
|---|---|
| 1 | Requirements finalization, ER diagram, API contract (OpenAPI), Angular/Spring Boot project scaffolding |
| 2 | PostgreSQL schema + migrations; Spring Boot entity/repository layer |
| 3 | Spring Boot services + REST controllers + Swagger docs; start Angular core/shared modules |
| 4 | Auth (JWT) end-to-end; Angular customer & lead features with Reactive Forms |
| 5 | Activities/interactions features; integration testing; polish validation & error handling |
| 6 | Azure environment setup (App Service, Static Web Apps, PostgreSQL Flexible Server) |
| 7 | CI/CD pipeline, deploy, monitoring/logging setup |
| 8 | Bug fixing, documentation, demo prep, final report (Capsule 7) |

---

## 9. Deliverables Checklist (maps to Capsule Projects 1–7)

- [ ] ER diagram + PostgreSQL schema scripts
- [ ] OpenAPI/Swagger spec
- [ ] Spring Boot service with auth, CRUD APIs, tests
- [ ] Angular app with routing, forms, guards, responsive UI
- [ ] Deployed, publicly accessible URL (frontend + backend)
- [ ] CI/CD pipeline configuration (YAML)
- [ ] README + architecture diagram + final report/demo

---

## 10. Suggested Next Steps

Pick whichever you want to start with, and I can generate it in detail:
1. Full PostgreSQL DDL scripts for the schema above
2. Spring Boot project skeleton (entities, repos, controllers) as code
3. Angular project skeleton (standalone components, routing, forms)
4. OpenAPI spec draft
5. Azure DevOps/GitHub Actions pipeline YAML
