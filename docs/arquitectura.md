# Arquitectura objetivo Kontora POS

## Desarrollo

El desarrollo se realiza en Windows 11.

- Frontend: React + Vite.
- Backend: Spring Boot.
- Base de datos local opcional: PostgreSQL con Docker Compose.

## Producción

- Frontend: Vercel.
- Dominio frontend: https://kontora-pos.store
- Backend: Docker en VM Ubuntu Server.
- API pública: https://api.kontora-pos.store
- Exposición del backend: Cloudflare Tunnel.
- Base de datos: PostgreSQL en Supabase.

## Separación de responsabilidades

frontend/ contiene solo el cliente web.

backend/ contiene solo la API Spring Boot.

infra/ contiene archivos de despliegue.

database/ contiene respaldos, semillas y documentación de datos.

docs/ contiene documentación técnica del proyecto.