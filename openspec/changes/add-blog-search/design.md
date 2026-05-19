## Context

El blog actualmente renderiza `/blog` y `/en/blog` cargando publicaciones desde el CMS mediante `getPosts(locale)`. Esa estrategia es adecuada para listados normales, pero no para buscar sobre un volumen superior a 500 mil publicaciones porque implicaria depender del CMS o del runtime de Next.js para filtrar datos que deben resolverse en un indice de busqueda.

La indexacion de fragmentos de contenido desde AEM queda fuera de este repositorio. Un servicio Node.js separado sera responsable de recibir eventos de AEM, obtener el fragmento completo, transformar el contenido y escribir documentos en OpenSearch. Este frontend solo consumira OpenSearch en modo read-only para renderizar resultados de busqueda.

La aplicacion ya soporta locales `es` y `en`, con `/blog` para español y `/en/blog` para ingles. La busqueda debe preservar ese modelo y seleccionar el indice o alias de OpenSearch segun el locale activo.

## Goals / Non-Goals

**Goals:**

- Agregar busqueda de publicaciones en `/blog` y `/en/blog` usando parametros URL `q` y `page`.
- Consultar OpenSearch exclusivamente desde codigo server-side de Next.js.
- Buscar solo por `title` e `intro`.
- Seleccionar indice o alias por locale para no mezclar resultados entre idiomas.
- Mostrar resultados paginados y estados localizados de busqueda.
- Mantener el listado actual del blog cuando `q` este ausente o vacio.
- Mantener credenciales de OpenSearch fuera del browser.

**Non-Goals:**

- No implementar indexacion desde AEM.
- No crear webhooks de AEM ni endpoints de reindexacion en este frontend.
- No administrar indices, mappings, aliases ni full reindex de OpenSearch desde este repo.
- No buscar dentro del contenido completo del post.
- No agregar autocomplete ni search-as-you-type con resultados parciales en esta primera version.
- No conectar el browser directamente a OpenSearch.

## Decisions

### Busqueda basada en URL

Usar `q` para el texto de busqueda y `page` para paginacion:

- `/blog?q=react&page=1`
- `/en/blog?q=react&page=1`

Esto permite refrescar, compartir URLs, navegar con back/forward y renderizar los resultados desde Server Components. El input sera un componente cliente que aplica debounce antes de actualizar la URL con `router.replace` o `router.push`.

Alternativa considerada: mantener el estado de busqueda solo en cliente y consultar una API mientras el usuario escribe. Se descarta para esta primera version porque complica el render inicial, reduce compartibilidad de URLs y no es necesario para una busqueda paginada de blog.

### Consulta server-side a OpenSearch

Crear una integracion server-only con OpenSearch, probablemente bajo `integrations/search/`, y un servicio de dominio para posts, probablemente `features/posts/post-search.service.ts`.

El flujo esperado es:

1. `app/blog/page.tsx` o `app/en/blog/page.tsx` lee `searchParams`.
2. `renderBlogPage(locale, searchParams)` decide si renderiza listado normal o resultados de busqueda.
3. Si `q` tiene contenido, llama a `searchPosts({ locale, query, page })`.
4. `searchPosts` consulta OpenSearch con el indice/alias del locale.
5. La UI renderiza hits paginados.

Alternativa considerada: exponer `/api/search/posts` y consultar desde el cliente. Se descarta como camino principal porque la busqueda URL-based puede resolverse en Server Components y porque las credenciales de OpenSearch deben permanecer en servidor. Un endpoint interno podria agregarse mas adelante si se decide implementar autocomplete.

### OpenSearch read-only desde el frontend

Este repo solo debe ejecutar consultas de lectura. Las credenciales configuradas para Next.js deben tener permisos minimos sobre los aliases de busqueda necesarios.

Variables esperadas, sujetas al mecanismo final de autenticacion:

- `OPENSEARCH_NODE`
- `OPENSEARCH_USERNAME`
- `OPENSEARCH_PASSWORD`
- `OPENSEARCH_POSTS_INDEX_ES`
- `OPENSEARCH_POSTS_INDEX_EN`

Alternativa considerada: que Next.js tambien escriba o actualice documentos. Se descarta porque la indexacion pertenece al servicio Node.js separado y mezclar responsabilidades haria mas dificil operar, probar y escalar la busqueda.

### Indices o aliases por locale

Seleccionar el indice o alias segun locale:

- `es` -> `OPENSEARCH_POSTS_INDEX_ES`
- `en` -> `OPENSEARCH_POSTS_INDEX_EN`

Esto evita filtrar todos los documentos por idioma despues de consultar y permite que OpenSearch use analyzers o configuraciones especificas por idioma si el equipo del indexer los define.

Alternativa considerada: usar un unico indice con campo `locale`. Es viable, pero para este frontend es mas simple depender de un alias por locale y dejar al indexer/infraestructura la decision real de mappings y versionado.

### Campos de busqueda y ranking

La busqueda se limita a `title` e `intro`. La consulta debe ponderar mas el titulo que el intro, por ejemplo con `title^3` e `intro`.

Documento minimo esperado en OpenSearch:

```ts
type SearchPostHit = {
  id: string;
  locale: "es" | "en";
  slug: string;
  title: string;
  intro: string;
  publishedAt?: string;
  href?: string;
};
```

Si `href` no esta presente, el frontend puede construirlo desde `locale + slug` usando helpers existentes. El contrato preferido es que `slug`, `title` e `intro` siempre esten disponibles.

Alternativa considerada: incluir `contentText`. Se descarta por alcance; buscar en el cuerpo completo requiere decisiones adicionales de indexacion, highlights y relevancia que pertenecen al servicio indexer y a una version posterior.

### Paginacion inicial con `from` y `size`

Usar paginacion con `page` y un limite fijo, por ejemplo 12 resultados por pagina. El servicio traduce `page` a `from` y `size` para OpenSearch.

Se debe normalizar `page` para evitar valores invalidos. Una primera version puede limitar la paginacion a un rango razonable si se quiere evitar paginacion profunda.

Alternativa considerada: usar `search_after`. Es mejor para paginacion profunda, pero complica URLs y estado. Para resultados paginados de blog, `from/size` es suficiente como primera version.

### Comportamiento cuando no hay query

Si `q` esta ausente o vacio, `/blog` y `/en/blog` mantienen el comportamiento actual y renderizan el listado normal desde `getPosts(locale)`. OpenSearch solo se consulta cuando hay una busqueda real.

Esto preserva la experiencia existente y evita depender de OpenSearch para la pagina base del blog.

## Risks / Trade-offs

- OpenSearch no disponible -> Mostrar estado de error localizado y no exponer detalles internos al usuario.
- Indices desactualizados respecto a AEM -> El frontend no puede corregirlo; documentar que la consistencia depende del servicio indexer externo.
- Credenciales con permisos excesivos -> Usar credenciales read-only y variables de entorno solo server-side.
- Paginacion profunda lenta con `from/size` -> Limitar pagina maxima o migrar a `search_after` si aparece la necesidad.
- Divergencia entre contrato del indice y UI -> Definir claramente campos minimos esperados (`slug`, `title`, `intro`) y fallbacks controlados.
- Debounce demasiado agresivo o lento -> Usar un valor inicial moderado, por ejemplo 300 ms, y ajustar segun UX real.

## Migration Plan

1. Agregar cliente server-only de OpenSearch y configuracion por variables de entorno.
2. Crear servicio `searchPosts` con seleccion de indice por locale, normalizacion de `q` y paginacion.
3. Actualizar rutas de blog para leer `searchParams` y pasarlos al render compartido.
4. Actualizar renderizado de blog para alternar entre listado normal y resultados de busqueda.
5. Agregar input de busqueda con debounce y actualizacion de URL.
6. Agregar UI de resultados, estado sin resultados, estado de error y paginacion.
7. Agregar textos localizados de busqueda.
8. Documentar variables de entorno y contrato read-only con OpenSearch.
9. Ejecutar `pnpm lint` y `pnpm build`.

Rollback: retirar el input y la rama de busqueda del render de blog, dejando `/blog` y `/en/blog` con el listado normal basado en CMS. Como este frontend no escribe en OpenSearch, el rollback no requiere cambios de indice.

## Open Questions

- Confirmar nombres finales de aliases o indices OpenSearch para `es` y `en`.
- Confirmar mecanismo de autenticacion a OpenSearch: basic auth, AWS SigV4 u otro.
- Confirmar limite de resultados por pagina, inicialmente sugerido en 12.
- Confirmar si el documento indexado incluira `href` o si el frontend siempre debe construirlo desde `locale + slug`.
