## Context

El sitio usa Next.js App Router con rutas existentes para `/`, `/blog`, `/blog/[slug]` y paginas dinamicas mediante `/[...path]`. El layout declara `html lang="es"`, la navegacion usa enlaces absolutos sin locale, y los servicios de posts y paginas consultan el CMS sin distinguir idioma.

El CMS expone contenido mediante GraphQL y el contenido por idioma estara separado por `_path`, con raices como `/content/dam/weblog/es/posts`, `/content/dam/weblog/en/posts`, `/content/dam/weblog/es/pages` y `/content/dam/weblog/en/pages`. El campo `page.path` no debe incluir locale; representa la ruta interna dentro del idioma, por ejemplo `/about`, mientras la aplicacion construye la URL publica `/en/about`.

## Goals / Non-Goals

**Goals:**

- Soportar `es` y `en`, con `es` como idioma por defecto sin prefijo de URL.
- Resolver el idioma desde la ruta publica y usarlo para UI, CMS, cache, revalidacion y metadata.
- Mantener compatibilidad de URLs actuales en español.
- Agregar rutas publicas con prefijo `/en` para contenido en ingles.
- Filtrar posts y paginas del CMS por `_path STARTS_WITH` segun el idioma.
- Permitir contenido parcial por idioma, sin requerir traducciones 1:1.
- Proveer selector visual de idioma que navegue al detalle traducido de un post o a la pagina dinamica traducida cuando exista relacion por `translationKey`, y use fallback a listado/home solo cuando falte `translationKey` o no exista traduccion equivalente.

**Non-Goals:**

- No se requiere que todos los posts tengan traduccion equivalente ni `translationKey`.
- No se requiere que todas las paginas dinamicas tengan traduccion equivalente ni `translationKey`.
- No se agregara deteccion automatica por `Accept-Language` ni redireccion basada en navegador.
- No se agregaran idiomas adicionales fuera de `es` y `en`.
- No se migrara el CMS para guardar locale dentro de `page.path`.

## Decisions

### Locale en URL publica

Usar `es` como default sin prefijo y `en` con prefijo `/en`.

Alternativas consideradas: prefijar tambien español con `/es`, o usar cookies/deteccion de navegador sin prefijo. Prefijar ambos idiomas es mas uniforme pero rompe las URLs actuales. Usar cookies o navegador perjudica SEO y complica cache ISR porque la misma URL podria renderizar diferentes idiomas.

### Separar ruta publica de path CMS

Mantener `page.path` sin locale en el CMS. La aplicacion agrega o remueve el prefijo publico segun el idioma.

Alternativas consideradas: guardar `path: /en/about` en el CMS. Se descarta porque duplica el idioma entre `_path` y `path`, acopla el CMS a las URLs publicas de Next.js y complica normalizacion, revalidacion y cambios futuros de estrategia de rutas.

### Filtro CMS por raiz de idioma

Construir queries de posts y paginas usando `_path STARTS_WITH` con una raiz derivada del locale y del tipo de contenido.

Ejemplos de raices:

- `es` posts: `/content/dam/weblog/es/posts`
- `en` posts: `/content/dam/weblog/en/posts`
- `es` pages: `/content/dam/weblog/es/pages`
- `en` pages: `/content/dam/weblog/en/pages`

El detalle de post se identifica por `locale + slug`. La pagina dinamica se identifica por `locale + path`.

### Rutas duplicadas con logica compartida

Agregar rutas explicitas para ingles bajo `app/[locale]/...` y conservar las rutas actuales para español. La logica de carga y render debe compartirse en funciones o componentes comunes para evitar divergencia entre idiomas.

Alternativas consideradas: mover todo a una unica estructura `[locale]` y redirigir `/` a `/es`. Se descarta porque el requisito es que español siga viviendo en `/`.

### Diccionario simple para UI

Usar diccionarios locales para textos fijos de interfaz como navegacion, encabezados, estados vacios y etiquetas de detalle. No se requiere una dependencia externa de i18n para esta primera version porque el alcance es limitado y el contenido principal viene del CMS.

### Navegacion reactiva al cambio de idioma

El App Router puede conservar el root layout durante navegacion client-side. Por eso, una navbar renderizada solo desde el servidor con el locale inicial puede quedar stale despues de cambiar entre `/...` y `/en/...`: la pagina cambia de idioma, pero el menu puede conservar labels o paginas CMS del locale anterior.

La navegacion debe poder derivar el locale activo desde el pathname actual en cliente y seleccionar los items correspondientes a ese locale. Para evitar fetches client-side directos al CMS, el servidor puede entregar los items necesarios para los locales soportados a un componente cliente responsable de elegir el set activo con `usePathname()`.

El footer puede seguir el mismo criterio si depende de labels o enlaces por locale visibles durante navegacion client-side.

### Selector visual sin traducciones enlazadas

El selector debe construir equivalencias conocidas para home y listados. En detalle de post o pagina dinamica, si existe una relacion de traduccion conocida por `translationKey`, debe mandar al contenido traducido. Si falta `translationKey` o no existe una traduccion equivalente en el locale destino, debe mandar al listado o home del otro idioma.

Comportamiento inicial:

- `/` <-> `/en`
- `/blog` <-> `/en/blog`
- `/blog/[slug]` -> si existe traduccion por `translationKey`, `/en/blog/[translatedSlug]`; si no, `/en/blog`
- `/en/blog/[slug]` -> si existe traduccion por `translationKey`, `/blog/[translatedSlug]`; si no, `/blog`
- pagina dinamica en español -> si existe traduccion por `translationKey`, `/en/[translatedPath]`; si no, `/en`
- pagina dinamica en ingles -> si existe traduccion por `translationKey`, `/[translatedPath]`; si no, `/`
- `/sobre-nosotros` -> si la pagina española tiene `translationKey` y existe pagina inglesa equivalente con `path = /about-us`, seleccionar `en` navega a `/en/about-us`
- `/en/about-us` -> si la pagina inglesa tiene `translationKey` y existe pagina española equivalente con `path = /sobre-nosotros`, seleccionar `es` navega a `/sobre-nosotros`

### Traducciones de posts por translationKey

Los posts pueden exponer un campo opcional `translationKey` que identifica el grupo logico de traducciones. El `slug` sigue siendo la URL localizada de cada idioma; `translationKey` es estable y compartido entre traducciones.

Cuando un detalle de post tenga `translationKey`, el selector de idioma intentara buscar un post en el locale destino usando `locale + translationKey`. Si existe, apuntara al detalle traducido. Si no existe o el post actual no tiene `translationKey`, mantendra el fallback hacia el listado del blog del otro idioma.

Ejemplo:

- `es`: `slug = arquitectura-frontend`, `translationKey = frontend-architecture`
- `en`: `slug = frontend-architecture`, `translationKey = frontend-architecture`

Alternativas consideradas: usar el mismo slug entre idiomas o guardar un objeto `translations` con todos los slugs. Se descarta depender del mismo slug porque reduce SEO localizado. `translations` directo es util pero obliga a mantener listas cruzadas; `translationKey` escala mejor para mas idiomas.

### Traducciones de paginas dinamicas por translationKey

Las paginas dinamicas pueden exponer un campo opcional `translationKey` que identifica el grupo logico de traducciones. El `path` sigue siendo la ruta localizada de cada idioma; `translationKey` es estable y compartido entre traducciones.

Cuando una pagina dinamica tenga `translationKey`, el selector de idioma intentara buscar una pagina en el locale destino usando `locale + translationKey`. Si existe, apuntara a la URL publica construida desde el `path` traducido. Si no existe o la pagina actual no tiene `translationKey`, mantendra el fallback hacia la home del otro idioma (`/en` al cambiar desde español a ingles, `/` al cambiar desde ingles a español).

Ejemplo:

- `es`: `path = /sobre-nosotros`, `translationKey = about-us`
- `en`: `path = /about-us`, `translationKey = about-us`

Alternativas consideradas: conservar el mismo path entre idiomas. Se descarta como regla general porque reduce URLs localizadas y puede generar 404 cuando el path del idioma destino es distinto.

### Cache y revalidacion por locale

Los cache tags deben incluir locale para evitar invalidaciones cruzadas entre idiomas. El endpoint de revalidacion debe aceptar `locale` en payloads de posts y paginas.

Ejemplos de tags:

- `posts:list:es`
- `posts:list:en`
- `post:es:<slug>`
- `post:en:<slug>`
- `pages:list:es`
- `pages:list:en`
- `page:es:<path>`
- `page:en:<path>`

### Metadata basica por idioma

El atributo `html lang` debe reflejar el locale renderizado. Las paginas con equivalencia conocida deben exponer canonical y alternates basicos. En detalles sin traduccion enlazada no se debe inventar `hreflang` hacia contenido no equivalente.

## Risks / Trade-offs

- `translationKey` faltante o duplicado -> El selector podria no encontrar o encontrar una traduccion incorrecta. Mitigacion: tratar `translationKey` como opcional, mantener fallback a listado/home y validar unicidad en CMS si es posible.
- Rutas duplicadas para español e ingles -> Riesgo de logica divergente. Mitigacion: centralizar carga/render en helpers o componentes compartidos.
- Dependencia de convenciones `_path` del CMS -> Si cambia la estructura del DAM, fallan las consultas por idioma. Mitigacion: encapsular raices CMS en helpers/configuracion unica.
- Revalidacion requiere locale correcto -> Payloads incompletos podrian invalidar tags incorrectos o ser rechazados. Mitigacion: validar `locale` contra locales soportados y documentar payloads.
- SEO parcial en detalles -> Sin relaciones de traduccion no habra alternates detalle a detalle. Mitigacion: usar canonical correcto y alternates solo cuando la equivalencia sea segura.

## Migration Plan

1. Introducir helpers de locale, rutas publicas y raices CMS sin cambiar comportamiento visible.
2. Actualizar servicios y queries para aceptar locale, manteniendo español como default en rutas existentes.
3. Agregar rutas `/en` y conectar UI/diccionarios/navegacion por locale.
4. Actualizar cache tags y revalidacion para incluir locale.
5. Agregar resolucion opcional de traducciones de posts por `translationKey`.
6. Agregar resolucion opcional de traducciones de paginas dinamicas por `translationKey`.
7. Hacer que navbar/footer seleccionen labels y paginas CMS desde el locale activo durante navegacion client-side.
8. Agregar metadata basica y selector visual.
9. Validar con contenido CMS bajo las raices `es` y `en`.

Rollback: retirar rutas `/en`, volver a servicios sin parametro locale y conservar las rutas españolas existentes. Como `page.path` no cambia en el CMS, el rollback no requiere migracion de contenido.

## Open Questions

- Confirmar si el CMS expone `_path` directamente en `postList` y `pageList` como campo filtrable en todos los modelos necesarios.
- Confirmar si el modelo CMS de posts expone `translationKey` como campo opcional y si puede mantenerse unico por locale.
- Confirmar si el modelo CMS de paginas expone `translationKey` como campo opcional y si puede mantenerse unico por locale.
- Confirmar si los mock posts deben cubrir ambos idiomas o si basta mantenerlos como fallback español durante la primera implementacion.
