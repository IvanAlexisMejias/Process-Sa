<<<<<<< HEAD
# Process-Sa
Software de organizacion (aplicacion web) hecha en react, nest.js y postgresql
=======
# Sistema de Control de Tareas · Process S.A.

Solución full-stack que digitaliza la gestión de tareas, unidades y flujos operativos de Process S.A. El proyecto combina una **SPA en React 19** con un **API unificado NestJS 11 + Prisma** sobre **PostgreSQL**, asegurando trazabilidad, métricas y gobierno de seguridad basados en normas ISO/IEC y OWASP.

---

## Tabla de contenidos

1. [Resumen ejecutivo](#resumen-ejecutivo)
2. [Arquitectura de referencia](#arquitectura-de-referencia)
3. [Frontend (React + Vite)](#frontend-react--vite)
4. [Backend (NestJS + Prisma)](#backend-nestjs--prisma)
5. [Modelo de datos PostgreSQL](#modelo-de-datos-postgresql)
6. [Funcionalidades y HU cubiertas](#funcionalidades-y-hu-cubiertas)
7. [Estándares, métodos y buenas prácticas](#estándares-métodos-y-buenas-prácticas)
8. [Iteraciones y cronograma](#iteraciones-y-cronograma)
9. [Instalación y ejecución](#instalación-y-ejecución)
10. [Roadmap corto plazo](#roadmap-corto-plazo)
11. [Referencias bibliográficas](#referencias-bibliográficas)

---

## Resumen ejecutivo

- **Objetivo general:** desplegar un sistema que garantice eficiencia, trazabilidad y seguridad en la gestión de tareas de Process S.A., alineado con los RF/RNF definidos en la primera etapa del proyecto.
- **Alcance:** autenticación JWT, panel único con control por rol, administración de usuarios/unidades, tablero operativo (tareas propias vs. asignadas), panel de riesgos, diseñador e instanciación de flujos, reportes globales y módulo de perfil.
- **Valor agregado:** decisiones tecnológicas coherentes (React + Nest + Postgres) que facilitan mantenimiento, escalabilidad y futuras integraciones corporativas (Oracle, BI, mensajería).

---

## Arquitectura de referencia

| Capa | Descripción | Archivos clave |
| --- | --- | --- |
| Presentación | SPA React 19 + React Router 7. Guardián por rol y un layout dinámico que carga casi 10 vistas sin recargar el navegador. | `src/App.tsx`, `src/routes/appRoutes.tsx`, `src/components/layout/AppLayout.tsx` |
| Aplicación | API NestJS modular con JWT, guardias por rol y DTOs validados. Los módulos `auth`, `users`, `tasks` y `flows` siguen el patrón controller-service-repository. | `backend/src/**` |
| Dominio/Datos | Prisma ORM sobre PostgreSQL. El esquema contempla roles, unidades, usuarios, flujos, tareas, dependencias, subtareas e historial. | `backend/prisma/schema.prisma` |

Comunicación segura vía `Bearer Token` (JWT). El front se conecta a `http://localhost:4000/api` (configurable desde `.env`), mientras que el backend usa `DATABASE_URL` para enlazar con PostgreSQL y expone `PORT=4000`.

---

## Frontend (React + Vite)

- **Stack:** React 19, React Router 7, TypeScript 5.9, Vite 7, dayjs y clsx (`package.json`).
- **Contexto global:** `src/context/AppContext.tsx` centraliza sesión, catálogos (roles, unidades), tareas, flujos y notificaciones; también orquesta llamadas al API con `apiFetch`.
- **Layout único:** `AppLayout` + `Sidebar` + `TopBar` entregan navegación lateral, chips de casos de uso y paneles seccionales (general, admin, designer, tasks, reports).
- **Pantallas relevantes:**
  - `LoginPage`: autenticación con feedback.
  - `OverviewPage`: radar operativo, salud de flujos, semáforo SLA y alertas.
  - `MyTasksPage`, `AssignedTasksPage`, `AlertsPage`: ejecución diaria, tareas delegadas, riesgos.
  - `UsersPage`, `UnitsPage`: ABM de recursos maestros con formularios guiados.
  - `FlowsPage`: diseño/instanciado de procesos tipo.
  - `GlobalReportsPage`: cargas y métricas por unidad.
  - `ProfilePage`: actualización de datos personales y avatar.

---

## Backend (NestJS + Prisma)

- **Dependencias principales:** `@nestjs/common/core/jwt/passport`, `@prisma/client`, `class-validator`, `bcryptjs`, `passport-jwt`.
- **Autenticación y autorización:**
  - `AuthService` emite JWT y valida credenciales cifradas.
  - `JwtAuthGuard` + `RolesGuard` protegen cada endpoint; `Roles` decorator restringe operaciones sensibles.
  - `CurrentUser` decorator propaga el `userId` para auditoría.
- **Módulo de usuarios:** CRUD administrado, actualización de perfil, listado de roles y unidades, creación de unidades (`backend/src/users/**`).
- **Módulo de tareas:** creación con subtareas y tags, actualización completa o parcial, cambio de estado con historial, reporting de problemas, workload por usuario y alertas (`backend/src/tasks/**`).
- **Módulo de flujos:** creación de plantillas con etapas, instanciación automática de dueños, recalculo de avance y salud de cada flujo (`backend/src/flows/**`).
- **Seed reproducible:** `backend/prisma/seed.ts` limpia la base y carga roles, unidades, usuarios, plantillas, instancias y tareas de ejemplo.

---

## Modelo de datos PostgreSQL

Definido en `backend/prisma/schema.prisma`:

- **Roles/Permisos:** `Role`, `RolePermission`, enum `RoleKey { ADMIN, DESIGNER, FUNCTIONARY }`.
- **Organización:** `Unit` (jerarquía y lead), `User` (relaciones con rol, unidad, tareas, flujos, historial).
- **Tareas:** `Task`, `TaskDependency`, `SubTask`, `TaskProblem`, `TaskHistory`, `TaskTag`, con enums `TaskStatus`, `TaskPriority`, `ProblemStatus`.
- **Flujos:** `FlowTemplate`, `FlowStage`, `FlowInstance`, `FlowStageStatus`, enum `FlowHealth`.
- **Notificaciones:** `Notification` enlazable a usuarios, tareas y flujos.

Todas las relaciones clave están indexadas y mantienen integridad referencial mediante claves compuestas (`@@id`, `@@unique`), lo que facilita consultas agregadas y auditorías consistentes.

---

## Funcionalidades y HU cubiertas

| Grupo de HU | Evidencia |
| --- | --- |
| HU01-HU05: Autenticación, menú por rol, alta de usuarios/unidades | `AuthService`, `UsersController`, `UnitsPage`, `RoleGuard` |
| HU06-HU16: Ciclo de vida de tareas (crear, asignar, aceptar, devolver, finalizar) | `TasksController`, `TasksService`, `MyTasksPage`, `AssignedTasksPage` |
| HU17-HU24: Problemas, alertas, tablero global, flujos plantilla, notificaciones | `TasksService.alerts`, `OverviewPage`, `FlowsPage`, `GlobalReportsPage` |
| HU25-HU28: Reportes PDF, panel personal, evidencias, calendario | `GlobalReportsPage`, `ProfilePage`, componentes de tareas con attachments/calendario (wireframes en proceso) |

Cada endpoint añade entradas a `TaskHistory` y `Notification` cuando corresponde, garantizando trazabilidad para auditoría.

---

## Estándares, métodos y buenas prácticas

- **ISO/IEC 25010:** atributos cubiertos con arquitectura hexagonal, pruebas Jest, análisis estático y controles de seguridad.
- **ISO/IEC 12207:** iteraciones PMV1-3 documentadas con entregables verificables.
- **ISO/IEC 27001 + 27002:** gestión de accesos por rol, cifrado de contraseñas (bcrypt), uso de JWT, control de sesiones y auditoría `TaskHistory`.
- **IEEE 830:** DTOs y modelos Prisma garantizan requisitos completos, consistentes y verificables.
- **OWASP Top 10:** mitigación de inyecciones gracias a Prisma, sanitización en React, JWT con expiración y rate limiting (extensible), protección CSRF en operaciones críticas (en roadmap).
- **Scrum + GitFlow:** backlog dividido en PMVs, ramas `feature/*`, integración en `develop` y despliegues controlados en `main`.
- **Tooling:** ESLint + Prettier (`backend/package.json`), Jest (`backend/package.json`), Vite para DX rápida.

---

## Iteraciones y cronograma

| Iteración | Duración | Entregables principales |
| --- | --- | --- |
| **PMV1 (40%)** | Semanas 1-5 | Setup React/Nest/Prisma, login, tablero personal, seed inicial, gestión básica de tareas y usuarios. |
| **PMV2 (70%)** | Semanas 6-9 | Dependencias, subtareas, alertas, workload, ABM de unidades, integración Sonar/Jest. |
| **PMV3 (100%)** | Semanas 10-12 | Diseñador de flujos, instancias, reportes globales, perfil avanzado, hardening de seguridad y accesibilidad. |
| **Cierre** | Semana 13 | Documentación final, demo funcional y preparación para despliegue/productización. |

---

## Instalación y ejecución

1. **Frontend**
   ```bash
   cd "frontend process Sa trabajo"
   npm install
   npm run dev
   ```
   Configurar `VITE_API_URL` en `.env` si el backend corre en otra URL.

2. **Backend**
   ```bash
   cd "frontend process Sa trabajo/backend"
   npm install
   npx prisma migrate dev
   npm run prisma:seed
   npm run start:dev
   ```
   Variables requeridas: `DATABASE_URL`, `PORT`, `JWT_SECRET` (`backend/.env`).

3. **Base de datos**
   - PostgreSQL 14+ con un schema `processsa`.
   - Usuario y contraseña definidos en `DATABASE_URL`.

---

## Roadmap corto plazo

1. Integración con servicios de mensajería (Teams / Slack) para alertas en tiempo real.
2. Exportación de reportes PDF y dashboards BI (Power BI / Metabase).
3. Migración del datasource a Oracle para ambientes productivos.
4. Automatización CI/CD con GitHub Actions (lint + test + build + docker push).
5. Endurecimiento de seguridad: MFA opcional, rate limiting configurable, CSP estricta.

---

## Referencias bibliográficas

- Gorton, I. (2011). *Essential Software Architecture* (2nd ed.). Springer.
- IEEE. (1998). *IEEE Std 830-1998*.
- ISO/IEC 12207:2008. *Software life cycle processes*.
- ISO/IEC 25010:2011. *Software quality models*.
- ISO/IEC 27001:2013 y ISO/IEC 27002:2013. *Information security management*.
- NIST (2017). *SP 800-63B Digital Identity Guidelines*.
- OWASP Foundation (2021). *OWASP Top Ten 2021*.
- Pressman, R. S. (2010). *Ingeniería del software: un enfoque práctico*.
- Sommerville, I. (2011). *Ingeniería de software* (9ª ed.).
- Documentación oficial: React, NestJS, Prisma, PostgreSQL, GitHub y Vite.

---

**Equipo:** Patricia Llanquileo · Iván Mejías · Marina Velásquez

>>>>>>> fb24ea2 (docs: add project readme and project sources)
