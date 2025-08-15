📌 MicroTask Manager – Prueba Técnica BackEnd

Sistema de gestión de tareas desarrollado como prueba técnica para Inlaze, implementado con NestJS bajo una arquitectura de microservicios y siguiendo las mejores prácticas de desarrollo backend.

El proyecto está diseñado para ser escalable, seguro y fácil de desplegar gracias al uso de Docker y Docker Compose.

🎯 Objetivos de la Prueba

✅ Diseñar e implementar un sistema distribuido para la gestión de tareas.
✅ Aplicar arquitectura de microservicios y comunicación clara entre ellos.
✅ Integrar PostgreSQL y MongoDB para manejar datos según el dominio.
✅ Garantizar autenticación y autorización seguras con JWT y roles.
✅ Documentar y estructurar el proyecto de forma clara y profesional.

🚀 Funcionalidades Implementadas
1. Gestión de Tareas

✅ Crear nuevas tareas con título, descripción, fecha límite y estado (por hacer, en progreso, completada).

✅ Actualizar tareas existentes (título, descripción, fecha límite, estado).

✅ Asignar tareas a usuarios o equipos.

✅ Marcar tareas como completadas y revertir a estado anterior.

✅ Eliminar tareas existentes.

2. Arquitectura de Microservicios

✅ AuthService → Autenticación y emisión de tokens JWT.

✅ UsersService → CRUD de usuarios, gestión de roles (user, equipo, admin).

✅ TasksService → CRUD de tareas y asignaciones.

✅ Comunicación vía REST API (preparado para eventos asincrónicos).

✅ Aplicación del patrón CQRS para separar comandos y consultas.

3. Escalabilidad y Tolerancia a Fallos

✅ Servicios desacoplados, preparados para escalado horizontal.

✅ Despliegue mediante Docker Compose con redes y volúmenes.

✅ Configuración independiente por servicio.

4. Seguridad

✅ Autenticación con JWT.

✅ Autorización basada en roles (user, equipo, admin).

✅ Protección de rutas y validación de datos con DTOs.

✅ Buenas prácticas para evitar inyecciones y vulnerabilidades comunes.

🏗 Arquitectura del Sistema

          +-------------------+
          |   AuthService     |
          | - JWT Auth        |
          | - Roles           |
          +-------------------+
                  ^
                  | REST / Eventos
          +-------------------+
          |   UsersService    |
          | - CRUD Usuarios   |
          | - Roles           |
          +-------------------+
                  ^
                  | REST / Eventos
          +-------------------+
          |   TasksService    |
          | - CRUD Tareas     |
          | - Asignaciones    |
          +-------------------+
                  ^
                  | REST / Eventos
          +-------------------+
          | Frontend / API GW |
          +-------------------+



Bases de datos:

PostgreSQL → Usuarios y roles.

MongoDB → Tareas y asignaciones.

🐳 Despliegue con Docker

Requisitos previos

Tener instalado Docker y Docker Compose.

Pasos:

# 1. Clonar el repositorio
git clone https://github.com/usuario/microtask-manager.git
cd microtask-manager

# 2. Levantar los servicios
docker-compose up --build


Esto levantará:

auth-service (NestJS + JWT)

users-service (NestJS + PostgreSQL)

tasks-service (NestJS + MongoDB)

Bases de datos y redes necesarias.

📚 Documentación de Endpoints

En la [Documentacion](https://www.notion.so/250691e2efa0802ca379faaf4d0ddc37?v=250691e2efa08094978c000c32ace05c&source=copy_link)encontrarás documentación detallada por servicio y ejemplos de uso para Postman.

Ejemplo Login (POST /auth/login):

{
  "email": "usuario@swaplyar.com",
  "password": "123456"
}


Respuesta:

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
}


📌 Puntos Clave Cumplidos

✔ Arquitectura de microservicios.
✔ PostgreSQL + MongoDB según dominio.
✔ Autenticación JWT y roles.
✔ CRUD de usuarios y tareas.
✔ Docker Compose para despliegue.
✔ Documentación clara y estructurada.