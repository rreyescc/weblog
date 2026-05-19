## 1. Locales y rutas publicas

- [x] 1.1 Definir locales soportados `es` y `en`, locale por defecto `es`, y tipos/helpers compartidos de locale.
- [x] 1.2 Crear helpers para construir URLs publicas localizadas para home, blog, detalle de post y paginas dinamicas.
- [x] 1.3 Crear helpers para resolver `locale` y path interno desde rutas sin prefijo y rutas con `/en`.
- [x] 1.4 Crear helpers para obtener raices CMS por locale y tipo de contenido (`posts` y `pages`).

## 2. CMS, servicios y cache

- [x] 2.1 Actualizar queries de posts para filtrar por `_path STARTS_WITH` segun la raiz CMS del locale.
- [x] 2.2 Actualizar `getPosts`, `getPostBySlug` y `getPostSlugs` para recibir locale y usar cache tags por locale.
- [x] 2.3 Actualizar queries de paginas para filtrar por `_path STARTS_WITH` y `page.path` sin prefijo de locale.
- [x] 2.4 Actualizar `getPageByPath`, `getHomePage` y `getNavigationPages` para recibir locale y usar cache tags por locale.
- [x] 2.5 Ajustar tipos de posts, paginas o CMS si las queries requieren exponer `_path` u otros campos adicionales.
- [x] 2.6 Decidir y aplicar comportamiento de mock posts para locale `es` y `en`.

## 3. Rutas y render compartido

- [x] 3.1 Extraer render/carga compartida para home por locale y conectar la ruta `/` al locale `es`.
- [x] 3.2 Agregar ruta `/en` para renderizar home con locale `en`.
- [x] 3.3 Extraer render/carga compartida para listado de blog por locale y conectar `/blog` al locale `es`.
- [x] 3.4 Agregar ruta `/en/blog` para renderizar listado de blog con locale `en`.
- [x] 3.5 Extraer render/carga compartida para detalle de post por locale y conectar `/blog/[slug]` al locale `es`.
- [x] 3.6 Agregar ruta `/en/blog/[slug]` para renderizar detalle de post con locale `en`.
- [x] 3.7 Extraer render/carga compartida para paginas dinamicas por locale y conectar `/[...path]` al locale `es`.
- [x] 3.8 Agregar ruta `/en/[...path]` para renderizar paginas dinamicas con locale `en` usando path interno sin `/en`.

## 4. Interfaz localizada y selector de idioma

- [x] 4.1 Crear diccionario `es`/`en` para textos fijos de navegacion, blog, detalle, estados vacios y acciones.
- [x] 4.2 Actualizar navbar y footer para recibir/resolver locale, mostrar labels localizados y construir enlaces publicos correctos.
- [x] 4.3 Actualizar textos fijos en listado de blog, detalle de post, not found y estados de error para usar diccionario por locale.
- [x] 4.4 Implementar selector visual de idioma para home y listados con equivalencias directas.
- [x] 4.5 Implementar fallback del selector en detalles de post sin traduccion conocida hacia `/en/blog` o `/blog`.
- [x] 4.6 Implementar fallback del selector en paginas dinamicas sin traduccion conocida hacia `/en` o `/`.
- [x] 4.7 Ajustar estado activo del menu de navegacion para rutas con y sin prefijo de locale.

## 5. Revalidacion localizada

- [x] 5.1 Extender schemas de payload de `/api/revalidate` para aceptar y validar `locale` en posts y paginas.
- [x] 5.2 Actualizar generacion de tags de posts para revalidar `posts:list:<locale>` y `post:<locale>:<slug>`.
- [x] 5.3 Actualizar generacion de tags de paginas para revalidar `pages:list:<locale>` y `page:<locale>:<path>`.
- [x] 5.4 Mantener soporte de `previousSlug` y `previousPath` invalidando tags previos dentro del mismo locale.
- [x] 5.5 Actualizar ejemplos o documentacion local de revalidacion si existe payload de referencia.

## 6. Metadata y SEO basico

- [x] 6.1 Ajustar estructura de layout o layouts localizados para emitir `html lang` segun locale renderizado.
- [x] 6.2 Agregar canonical para rutas localizadas principales.
- [x] 6.3 Agregar alternates `es` y `en` para home y listado de blog.
- [x] 6.4 Evitar alternates detalle a detalle cuando no exista relacion de traduccion conocida.

## 7. Traducciones de posts por translationKey

- [x] 7.1 Agregar `translationKey` opcional a tipos CMS y dominio de posts.
- [x] 7.2 Incluir `translationKey` en queries de listado y detalle de posts cuando el CMS lo exponga.
- [x] 7.3 Crear query/servicio para buscar un post por `locale + translationKey`.
- [x] 7.4 Resolver href del selector en detalle de post usando el slug traducido cuando exista.
- [x] 7.5 Mantener fallback del selector hacia listado de blog cuando no exista traduccion o falte `translationKey`.
- [x] 7.6 Agregar alternates SEO en detalle de post cuando exista traduccion equivalente.
- [x] 7.7 Actualizar mocks para cubrir un post con traduccion enlazada y otro sin traduccion.

## 8. Traducciones de paginas por translationKey

- [x] 8.1 Agregar `translationKey` opcional a tipos CMS y dominio de paginas.
- [x] 8.2 Incluir `translationKey` en queries de listado y detalle de paginas cuando el CMS lo exponga.
- [x] 8.3 Crear query/servicio para buscar una pagina por `locale + translationKey`.
- [x] 8.4 Resolver href del selector en pagina dinamica usando el path traducido cuando exista.
- [x] 8.5 Mantener fallback del selector hacia home cuando no exista traduccion o falte `translationKey`.
- [x] 8.6 Agregar alternates SEO en pagina dinamica cuando exista traduccion equivalente.
- [x] 8.7 Actualizar mocks o fixtures si existen para cubrir una pagina dinamica con traduccion enlazada y otra sin traduccion.

## 9. Verificacion

- [x] 9.1 Actualizar navbar para seleccionar labels y paginas CMS segun el locale activo durante navegacion client-side.
- [x] 9.2 Actualizar footer si sus labels o enlaces pueden quedar stale durante navegacion client-side.
- [x] 9.3 Verificar manualmente que cambiar de `/sobre-nosotros` a `/en/about-us` actualiza el menu a ingles sin recargar toda la pagina.
- [x] 9.4 Verificar manualmente que cambiar de `/en/about-us` a `/sobre-nosotros` actualiza el menu a español sin recargar toda la pagina.
- [x] 9.5 Verificar manualmente que `/`, `/blog`, `/blog/[slug]` y paginas dinamicas existentes siguen funcionando como español.
- [x] 9.6 Verificar manualmente que `/en`, `/en/blog`, `/en/blog/[slug]` y `/en/[...path]` usan contenido ingles y paths internos sin `/en`.
- [x] 9.7 Verificar que posts o paginas existentes solo en un idioma no requieren equivalente en el otro idioma.
- [x] 9.8 Verificar que el selector visual apunta a posts y paginas traducidas cuando existe `translationKey` y a fallbacks cuando no existe.
- [x] 9.9 Verificar payloads validos e invalidos de `/api/revalidate` para locales `es`, `en` y un locale no soportado.
- [x] 9.10 Ejecutar `pnpm lint`.
- [x] 9.11 Ejecutar `pnpm build`.
- [x] 9.12 Corregir el selector de idioma para resolver paginas dinamicas por `translationKey` usando el pathname activo, incluso despues de navegacion client-side.
- [x] 9.13 Verificar que seleccionar `en` desde `/sobre-nosotros` navega a `/en/about-us` cuando existe una pagina inglesa con el mismo `translationKey`.
- [x] 9.14 Verificar que seleccionar `es` desde `/en/about-us` navega a `/sobre-nosotros` cuando existe una pagina española con el mismo `translationKey`.
- [x] 9.15 Verificar que seleccionar `en` desde una pagina española sin `translationKey` o sin traduccion equivalente navega a `/en`.
- [x] 9.16 Verificar que seleccionar `es` desde una pagina inglesa sin `translationKey` o sin traduccion equivalente navega a `/`.
