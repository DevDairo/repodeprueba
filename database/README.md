# Database

Esta carpeta se usa para respaldos, semillas y documentación de base de datos.

La fuente principal de migraciones del sistema está en:

backend/src/main/resources/db/migration/

El backend ejecuta las migraciones con Flyway al iniciar.

## Estructura

- backups/: respaldos exportados con pg_dump.
- seeds/: datos iniciales o archivos SQL de carga.
- schema/: documentación o exportaciones de estructura.