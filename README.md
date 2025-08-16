# MicroTask Manager - Sistema de Gestión de Tareas

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**MicroTask Manager** es un sistema de gestión de tareas desarrollado como prueba técnica para **Inlaze**. El proyecto está implementado con **NestJS** bajo una arquitectura de microservicios, siguiendo las mejores prácticas de desarrollo backend para crear una solución escalable, segura y resiliente.

El sistema utiliza bases de datos heterogéneas (**PostgreSQL** y **MongoDB**) optimizadas para las necesidades de cada dominio y se despliega fácilmente gracias a **Docker** y **Docker Compose**.

---

## 🎯 Objetivos del Proyecto

* **Diseñar un sistema distribuido:** Implementar una solución robusta y desacoplada para la gestión de tareas.
* **Aplicar arquitectura de microservicios:** Separar las responsabilidades del negocio en servicios independientes con comunicación clara.
* **Integrar bases de datos múltiples:** Utilizar PostgreSQL para datos relacionales (usuarios) y MongoDB para datos no estructurados (tareas).
* **Garantizar la seguridad:** Proteger los endpoints con autenticación JWT y un sistema de autorización basado en roles.
* **Fomentar la mantenibilidad:** Documentar y estructurar el proyecto de forma clara y profesional.

---

## 🚀 Funcionalidades Principales

* **Gestión Completa de Tareas:**
    * Crear tareas con título, descripción, fecha límite y estado (`todo`, `in_progress`, `done`).
    * Actualizar y eliminar tareas existentes.
    * Asignar tareas a usuarios específicos.
    * Cambiar el estado de las tareas.
* **Gestión de Usuarios y Roles:**
    * Sistema de CRUD para usuarios.
    * Roles definidos (`user`, `equipo`, `admin`) para controlar el acceso a los recursos.
* **Autenticación Segura:**
    * Login de usuarios y emisión de tokens **JWT** para sesiones seguras.

---

## 🏗️ Arquitectura del Sistema

El proyecto se compone de tres microservicios principales que se comunican a través de una API REST. Esta arquitectura desacoplada permite que cada servicio escale de forma independiente y sea mantenido por equipos diferentes.



[Image of microservices architecture diagram]


* **`AuthService`**: Responsable de la autenticación de usuarios y la generación de tokens JWT. Es el guardián del sistema.
* **`UsersService`**: Gestiona toda la lógica relacionada con los usuarios, incluyendo el CRUD y la asignación de roles. Utiliza **PostgreSQL** por la naturaleza relacional de los datos de usuario.
* **`TasksService`**: Maneja el CRUD de tareas y sus asignaciones. Utiliza **MongoDB** para ofrecer flexibilidad en la estructura de las tareas y facilitar futuras expansiones.

Se aplica el patrón **CQRS** (Command and Query Responsibility Segregation) para separar la lógica de escritura (comandos) de la de lectura (consultas), optimizando el rendimiento y la escalabilidad de la base de datos.

---

## 🛠️ Tecnologías y Herramientas

| Categoría | Tecnología/Herramienta | Propósito |
| :--- | :--- | :--- |
| **Backend** | `NestJS`, `TypeScript` | Framework principal y lenguaje para construir la API. |
| **Servidor HTTP** | `Express.js` | Servidor web subyacente para NestJS. |
| **Bases de Datos** | `PostgreSQL`, `MongoDB` | Persistencia de datos (Usuarios y Tareas respectivamente). |
| **ORM / ODM** | `TypeORM`, `Mongoose` | Mapeo de objetos y modelado de datos para SQL y NoSQL. |
| **Seguridad** | `Passport.js`, `JWT`, `bcrypt` | Autenticación, autorización y encriptación de contraseñas. |
| **Validación** | `class-validator` | Validación estricta de DTOs para proteger los endpoints. |
| **DevOps** | `Docker`, `Docker Compose` | Contenerización y orquestación para el despliegue. |
| **Testing** | `Jest`, `Supertest` | Pruebas unitarias y de integración. |
| **Calidad de Código**| `ESLint`, `Prettier` | Linting y formateo de código para mantener un estilo consistente. |

---

## 🐳 Despliegue con Docker

Sigue estos pasos para levantar todo el entorno de desarrollo localmente.

### Requisitos Previos

* Tener instalado [Docker](https://www.docker.com/get-started)
* Tener instalado [Docker Compose](https://docs.docker.com/compose/install/)

### Pasos para el Despliegue

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/JonhatanCorona/MicroTask-Manager.git](https://github.com/JonhatanCorona/MicroTask-Manager.git)
    cd MicroTask-Manager

2.  **Configura las variables de entorno:**
    Copia el archivo de ejemplo y personalízalo con tus propias credenciales.

    cp .env.example .env

    Asegúrate de revisar y llenar las variables dentro del archivo `.env` (ver sección `⚙️ Variables de Entorno`).

3.  **Levanta los servicios:**
    Este comando construirá las imágenes de Docker y levantará todos los contenedores (servicios y bases de datos) en segundo plano.

    docker-compose up --build -d


Una vez completado, los servicios estarán disponibles en los puertos configurados:

| Servicio | Puerto Local | Documentación API |
| :--- | :--- | :--- |
| `auth-service` | `http://localhost:3000` | `http://localhost:3000/api` |
| `users-service`| `http://localhost:3001` | `http://localhost:3001/api` |
| `tasks-service`| `http://localhost:3002` | `http://localhost:3002/api` |

---

## ⚙️ Variables de Entorno (.env)

El archivo `.env` es crucial para la configuración del proyecto. A continuación se detallan las variables necesarias.

```ini
# ========================================
# 📦 Base de datos PostgreSQL
# Utilizada por UsersService
# ========================================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=microtask
POSTGRES_PORT=5432
DB_HOST=microtask-postgres # Nombre del servicio en docker-compose

# ========================================
# 🔐 Autenticación y JWT
# Utilizadas por AuthService
# ========================================
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=3600s

# ========================================
# 🌐 Puertos de los Microservicios
# ========================================
AUTH_SERVICE_PORT=3000
USERS_SERVICE_PORT=3001
TASKS_SERVICE_PORT=3002

# ========================================
# 🗄 Cadenas de Conexión a Bases de Datos
# ========================================
# PostgreSQL (para TypeORM en UsersService)
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

# MongoDB (para Mongoose en TasksService)
MONGODB=mongodb+srv://your_mongo_user:your_mongo_password@cluster0.mongodb.net/microtask?retryWrites=true&w=majority

## 📚 Documentación y Uso de la API

Para una guía detallada con colecciones de Postman, puedes consultar la [documentación completa en Notion](https://www.notion.so/250691e2efa0802ca379faaf4d0ddc37?v=250691e2efa08094978c000c32ace05c&source=copy_link).

### Ejemplo: Login de Usuario

Para obtener un token de acceso, envía una petición `POST` al endpoint `/auth/login`.

**Request Body**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
Respuesta Exitosa

JSON

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi..."
}

## ✅ Puntos Clave Cumplidos
Arquitectura de Microservicios: Sistema desacoplado en servicios independientes y especializados.

Bases de Datos Heterogéneas: Uso de PostgreSQL para datos relacionales (usuarios) y MongoDB para datos flexibles (tareas).

Autenticación Segura con JWT: Endpoints protegidos mediante JSON Web Tokens y un sistema de autorización basado en roles.

Funcionalidad CRUD Completa: Implementación total de operaciones para la gestión de usuarios y tareas.

Despliegue con Docker Compose: Entorno completo listo para producción con un solo comando.

Código Limpio y Documentado: Estructura clara que facilita su mantenimiento y escalabilidad.
