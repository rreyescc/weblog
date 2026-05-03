# Weblog - Next.js Blog Frontend

Blog frontend construido con Next.js 16 que consume contenido de un CMS headless (AEM). Implementa rendering del lado del servidor con ISR (Incremental Static Regeneration) para rendimiento óptimo y actualización de contenido on-demand.

## Características

- **App Router** - Next.js 16 con App Router para routing moderno
- **ISR con cache tags** - Revalidación on-demand via webhook seguro
- **GraphQL** - Cliente CMS para consultas al endpoint headless
- **TypeScript** - Tipado completo con separación de tipos CMS vs dominio
- **Tailwind CSS v4** - Estilos con utilities classes y theme customization
- **Dark mode ready** - Sistema de temas configurado

## Stack

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 16.2.4 |
| Runtime | React 19.2.4 |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS v4 |
| Validación | Zod |
| Paquete | pnpm |

## Requisitos previos

- Node.js 18+
- pnpm 8+
- Acceso a CMS AEM headless (o configurar mock)

## Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd weblog-frontend

# Instalar dependencias
pnpm install

# Copiar configuración de entorno
cp .env.example .env.local
```

## Variables de entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `CMS_HOST` | Endpoint del CMS (e.g. `http://localhost:4502`) | Sí |
| `CMS_USERNAME` | Username para basic auth | No* |
| `CMS_PASSWORD` | Password para basic auth | No* |
| `REVALIDATE_SECRET` | Secret para firma HMAC del webhook de revalidación | Sí |
| `USE_MOCK_CMS` | Usar datos mock en lugar del CMS real | No |

*Solo requerido si el CMS requiere autenticación basic

## Scripts

```bash
# Desarrollo
pnpm dev          # Iniciar server en http://localhost:3000

# Producción
pnpm build        # Build de producción
pnpm start        # Iniciar server de producción

# Calidad
pnpm lint         # Ejecutar ESLint
```

## Estructura del proyecto

```
weblog-frontend/
├── app/                      # Next.js App Router
│   ├── [...path]/           # Catch-all para páginas dinámicas
│   ├── api/revalidate/      # Webhook de cache invalidation
│   ├── blog/                # Routes del blog
│   └── layout.tsx           # Root layout
├── components/              # Componentes UI reutilizables
├── features/                # Lógica de negocio por dominio
│   └── posts/               # Servicio + mapper de posts
├── integrations/            # Clientes externos
│   └── cms/                 # Cliente GraphQL del CMS
├── types/                   # Definiciones TypeScript
│   ├── post.ts              # Tipos de dominio (negocio)
│   └── cms/                 # Tipos de respuesta CMS (AEM)
└── contexts/                # React contexts (theme)
```

### Organización de tipos

El proyecto sigue el patrón **CMS types vs Domain types**:

- `types/cms/` - Tipos que reflejan la respuesta cruda del CMS (AEM)
- `types/post.ts` / `types/page.ts` - Tipos de negocio para componentes

Los mappers en `features/*/post.mapper.ts` transforman datos CMS → dominio.

## Revalidación ISR

El endpoint `POST /api/revalidate` permite actualizar el cache de páginas:

```bash
# Ejemplo: revalidar lista de posts
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-signature: sha256=<hmac-signature>" \
  -d '{"entity": "post", "event": "update", "slug": "my-post"}'
```

Generar firma:
```bash
echo -n '{"entity":"post","event":"update","slug":"my-post"}' | \
  openssl dgst -sha256 -hmac "REVALIDATE_SECRET"
```

## Deployment

### Vercel (recomendado)

```bash
vercel deploy
```

Configurar variables de entorno en el dashboard de Vercel.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Contribución

1. Crear feature branch: `git checkout -b feature/nueva-caracteristica`
2. Commitear cambios: `git commit -m 'feat: nueva caracteristica'`
3. Push: `git push origin feature/nueva-caracteristica`
4. Abrir Pull Request

## Licencia

Privado - Todos los derechos reservados