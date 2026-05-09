# 🚀 TechSolutions App

Sistema de gestión empresarial desarrollado como aplicación web full-stack para administrar clientes, proyectos y tareas de manera eficiente.  
Incluye autenticación por roles, reportes PDF, analíticas, diagramas de Gantt y gestión completa de proyectos.

---

## 🌐 Demo en Producción

### Frontend
[TechSolutions Frontend](https://techsolutions-frontend-sand.vercel.app)

### Backend API
[TechSolutions Backend API](https://techsolutions-app-wve9.onrender.com)

### Repositorio
[Repositorio GitHub](https://github.com/Emanuel-Iglesias/techsolutions-app.git)

---

# 📸 Vista General

TechSolutions App permite:

- Gestionar usuarios con distintos roles
- Administrar clientes y proyectos
- Crear y asignar tareas
- Visualizar cronogramas con diagramas de Gantt
- Generar reportes PDF
- Consultar historial de cambios y sesiones
- Obtener analíticas del sistema
- Trabajar desde cualquier dispositivo gracias al diseño responsivo

---

# 🛠️ Tecnologías Utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| ORM | Prisma |
| Base de Datos | PostgreSQL |
| Autenticación | JWT + bcrypt |
| Despliegue Frontend | Vercel |
| Despliegue Backend | Render |

---

# ✨ Funcionalidades Principales

## 👥 Sistema de Roles

### 🔴 Administrador
- Acceso completo al sistema
- Gestión de usuarios
- Visualización de analíticas
- Consulta de historial de sesiones
- Generación de reportes

### 🟡 Empleado
- Crear y actualizar tareas
- Cambiar estados de tareas
- Ver proyectos asignados

### 🔵 Cliente
- Visualizar sus proyectos
- Consultar tareas relacionadas

---

# 📦 Módulos del Sistema

- ✅ Gestión de usuarios
- ✅ Gestión de clientes
- ✅ Gestión de proyectos
- ✅ Gestión de tareas
- ✅ Historial de sesiones
- ✅ Historial de cambios (Changelog)
- ✅ Soft Delete
- ✅ Analíticas avanzadas
- ✅ Exportación PDF
- ✅ Informes generales
- ✅ Diagrama de Gantt
- ✅ Diseño responsivo

---

# 🧩 Arquitectura del Proyecto

# 🧩 Arquitectura del Proyecto

```bash
techsolutions-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── client.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── changelog.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── client.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── changelog.routes.js
│   │   ├── prisma.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── assets/
    │   │   └── logo_tech.png
    │   ├── components/
    │   │   ├── GanttChart.jsx
    │   │   └── ResponsiveTable.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── admin/
    │   │   │   ├── UserList.jsx
    │   │   │   ├── UserForm.jsx
    │   │   │   ├── SessionLogs.jsx
    │   │   │   ├── ChangeLog.jsx
    │   │   │   ├── Analytics.jsx
    │   │   │   ├── History.jsx
    │   │   │   └── GeneralReport.jsx
    │   │   ├── clients/
    │   │   │   ├── ClientList.jsx
    │   │   │   └── ClientForm.jsx
    │   │   ├── projects/
    │   │   │   ├── ProjectList.jsx
    │   │   │   ├── ProjectForm.jsx
    │   │   │   └── ProjectDetail.jsx
    │   │   ├── tasks/
    │   │   │   ├── TaskList.jsx
    │   │   │   └── TaskForm.jsx
    │   │   └── Dashboard.jsx
    │   ├── utils/
    │   │   └── report.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json
    └── package.json
```

---

# ⚙️ Instalación Local

## 📋 Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

- Node.js 18+
- PostgreSQL
- Git

---

# 🔧 Configuración del Backend

## 1️⃣ Entrar al directorio backend

```bash
cd backend
```

## 2️⃣ Instalar dependencias

```bash
npm install
```

## 3️⃣ Configurar variables de entorno

Crear un archivo `.env`

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/techsolutions"

JWT_SECRET="tu_secret_key"

PORT=3000
```

## 4️⃣ Ejecutar migraciones

```bash
npx prisma migrate dev
```

## 5️⃣ Iniciar servidor

```bash
npm run dev
```

---

# 🎨 Configuración del Frontend

## 1️⃣ Entrar al directorio frontend

```bash
cd frontend
```

## 2️⃣ Instalar dependencias

```bash
npm install
```

## 3️⃣ Configurar variables de entorno

Crear archivo `.env`

```env
VITE_API_URL=http://localhost:3000
```

## 4️⃣ Iniciar aplicación

```bash
npm run dev
```

---

# 🔐 Variables de Entorno

## Backend `.env`

| Variable | Descripción |
|---|---|
| DATABASE_URL | URL de conexión PostgreSQL |
| JWT_SECRET | Clave secreta JWT |
| PORT | Puerto del servidor |

---

## Frontend `.env`

| Variable | Descripción |
|---|---|
| VITE_API_URL | URL del backend |

---

# 📡 API Endpoints

## 🔑 Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/users` | Obtener usuarios |
| GET | `/api/auth/sessions` | Historial de sesiones |

---

## 👥 Clientes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/clients` | Obtener clientes |
| POST | `/api/clients` | Crear cliente |
| PUT | `/api/clients/:id` | Actualizar cliente |
| DELETE | `/api/clients/:id` | Eliminar cliente |

---

## 📁 Proyectos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/projects` | Obtener proyectos |
| POST | `/api/projects` | Crear proyecto |
| PUT | `/api/projects/:id` | Actualizar proyecto |
| DELETE | `/api/projects/:id` | Eliminar proyecto |

---

## ✅ Tareas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/tasks` | Obtener tareas |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |

---

# 🔒 Seguridad Implementada

- Autenticación mediante JWT
- Contraseñas encriptadas con bcrypt
- Middleware de protección de rutas
- Control de acceso por roles
- Validación de permisos
- Soft delete para evitar pérdida permanente de datos

---

# 📊 Reportes y Analíticas

El sistema incluye:

- 📈 Analíticas generales
- 📅 Filtros por rango de fechas
- 📄 Exportación de reportes PDF
- 📋 Informes administrativos
- 🕒 Historial de actividad
- 📌 Seguimiento de cambios

---

# 📱 Diseño Responsivo

La aplicación está optimizada para:

- 💻 Escritorio
- 📱 Teléfonos móviles
- 📲 Tablets

---

# 👤 Credenciales de Prueba

```txt
Email: admin@techsolutions.com
Password: admin123
Rol: ADMIN
```

---

# 🚀 Despliegue

## Frontend en Vercel

```bash
npm run build
```

Configurar:

```env
VITE_API_URL=https://techsolutions-app-wve9.onrender.com
```

---

## Backend en Render

Variables necesarias:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

# 📚 Futuras Mejoras

- 🔔 Notificaciones en tiempo real
- 📧 Envío de correos automáticos
- 📎 Adjuntos en tareas
- 👥 Chat interno
- 📅 Calendario interactivo
- 📱 Aplicación móvil

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas.

## Pasos para contribuir

```bash
# Fork del proyecto

# Crear rama
git checkout -b feature/nueva-funcionalidad

# Commit
git commit -m "Agrega nueva funcionalidad"

# Push
git push origin feature/nueva-funcionalidad
```

Luego crear un Pull Request.

---

# 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

# 👨‍💻 Autor

Desarrollado por **Emanuel Iglesias**

GitHub:  
https://github.com/Emanuel-Iglesias

---

# ⭐ Support

Si te gusta este proyecto:

- Dale una estrella ⭐ al repositorio
- Comparte el proyecto
- Contribuye con mejoras

---

# 📌 Estado del Proyecto

🟢 Proyecto funcional y desplegado en producción.
