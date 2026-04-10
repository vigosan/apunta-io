# Scripts

Utilidades de base de datos. Todas las credenciales se obtienen de 1Password — nunca se guardan en disco.

## Requisitos

- [1Password CLI](https://developer.1password.com/docs/cli/) instalado y con sesión activa (`op signin`)
- Items creados en 1Password: `Private → Apunta → apunta-dev-db` y `apunta-prod-db`

## db-migrate.mjs

Aplica las migraciones pendientes.

```bash
npm run db:migrate        # dev
npm run db:migrate:prod   # producción
```

## db-status.mjs

Muestra qué migraciones están aplicadas y cuáles están pendientes.

```bash
npm run db:status         # dev
npm run db:status:prod    # producción
```

---

## Workflow habitual

```bash
# 1. Modificar src/db/schema/lists.schema.ts
# 2. Generar el SQL de migración
npm run db:generate

# 3. Revisar el SQL generado en src/db/migrations/
# 4. Aplicar en dev
npm run db:migrate

# 5. Verificar
npm run db:status

# 6. Deploy + aplicar en prod
npm run db:migrate:prod
```
