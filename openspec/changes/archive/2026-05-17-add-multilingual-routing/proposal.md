## Why

El weblog necesita publicar contenido en español e ingles sin duplicar rutas publicas ni mezclar contenido entre idiomas. El sitio actual asume español globalmente, consulta posts y paginas sin locale, y no tiene forma de mostrar navegacion, paginas dinamicas, revalidacion ni URLs publicas por idioma.

## What Changes

- Agregar soporte multi idioma para `es` y `en`, con `es` como idioma por defecto sin prefijo de URL.
- Mantener las rutas actuales en español: `/`, `/blog`, `/blog/[slug]` y paginas dinamicas sin prefijo.
- Agregar rutas publicas en ingles con prefijo `/en`: `/en`, `/en/blog`, `/en/blog/[slug]` y `/en/[...path]`.
- Consultar posts y paginas desde el CMS filtrando por `_path STARTS_WITH` segun el idioma, usando `/content/dam/weblog/es/...` y `/content/dam/weblog/en/...`.
- Mantener `page.path` en el CMS sin locale, por ejemplo `/about`; la aplicacion construye la URL publica `/en/about` para ingles.
- Permitir que posts y paginas existan solo en un idioma, sin exigir traducciones 1:1.
- Agregar soporte opcional para relacionar traducciones de posts mediante `translationKey`, permitiendo que el selector de idioma navegue al detalle equivalente cuando exista.
- Agregar soporte opcional para relacionar traducciones de paginas dinamicas mediante `translationKey`, permitiendo que el selector de idioma navegue a la pagina equivalente cuando exista; por ejemplo `/sobre-nosotros` debe cambiar a `/en/about-us` y `/en/about-us` debe cambiar a `/sobre-nosotros` cuando ambas paginas comparten `translationKey`.
- Agregar textos de interfaz localizados para navegacion, listados, detalle de posts, estados vacios y acciones basicas.
- Asegurar que el menu de navegacion actualice labels y paginas CMS al cambiar de idioma durante navegacion client-side.
- Agregar un selector visual de idioma; en paginas de detalle sin `translationKey` o sin traduccion equivalente, el selector debe mandar al listado o home del otro idioma.
- Separar cache tags e invalidacion ISR por idioma para evitar invalidaciones cruzadas.
- Extender la revalidacion para aceptar idioma en payloads de posts y paginas.
- Ajustar metadata basica por idioma, incluyendo `html lang`, canonical y alternates donde exista una correspondencia conocida.

## Capabilities

### New Capabilities

- `multilingual-content-routing`: Cubre rutas localizadas, resolucion de idioma, consultas CMS filtradas por idioma, navegacion localizada y reactiva al cambio de idioma, selector visual de idioma, resolucion opcional de traducciones de posts y paginas dinamicas por `translationKey`, cache/revalidacion por locale y metadata basica para contenido multi idioma.

### Modified Capabilities

- Ninguna. No existen specs base que modificar.

## Impact

- Afecta rutas App Router en `app/`, incluyendo home, blog, detalle de post y paginas dinamicas.
- Afecta servicios y queries de posts y paginas en `features/posts/`, `features/pages/` e `integrations/cms/`.
- Afecta tipos y queries de posts para incluir `translationKey` y resolver posts equivalentes entre locales.
- Afecta tipos y queries de paginas para incluir `translationKey` y resolver paginas dinamicas equivalentes entre locales.
- Afecta componentes compartidos de layout y navegacion, especialmente navbar, footer y menu de navegacion.
- Afecta tipos de dominio y CMS para incorporar locale donde corresponda.
- Afecta `/api/revalidate` para invalidar contenido por idioma.
- Afecta cache tags ISR para posts, paginas, listados y detalles.
- Afecta SEO basico y metadata por idioma.
