## Purpose

Define multilingual content routing behavior for Spanish and English content, including localized public URLs, CMS filtering, navigation, translations, cache invalidation, and metadata.

## Requirements

### Requirement: Locales soportados y rutas publicas
El sistema SHALL soportar los locales `es` y `en`, usando `es` como locale por defecto sin prefijo de URL y `en` con prefijo publico `/en`.

#### Scenario: Home en locale por defecto
- **WHEN** un usuario visita `/`
- **THEN** el sistema renderiza la home en locale `es`

#### Scenario: Home en ingles
- **WHEN** un usuario visita `/en`
- **THEN** el sistema renderiza la home en locale `en`

#### Scenario: Blog en locale por defecto
- **WHEN** un usuario visita `/blog`
- **THEN** el sistema renderiza el listado de blog en locale `es`

#### Scenario: Blog en ingles
- **WHEN** un usuario visita `/en/blog`
- **THEN** el sistema renderiza el listado de blog en locale `en`

#### Scenario: Detalle de post por locale
- **WHEN** un usuario visita `/blog/un-post` o `/en/blog/a-post`
- **THEN** el sistema resuelve el detalle usando el locale de la ruta y el slug solicitado

### Requirement: Paginas dinamicas localizadas
El sistema SHALL renderizar paginas dinamicas para ambos locales, manteniendo `page.path` del CMS sin prefijo de locale y construyendo la URL publica segun el locale.

#### Scenario: Pagina dinamica en español
- **WHEN** un usuario visita `/nosotros`
- **THEN** el sistema consulta una pagina en locale `es` con `path` igual a `/nosotros`

#### Scenario: Pagina dinamica en ingles
- **WHEN** un usuario visita `/en/about`
- **THEN** el sistema consulta una pagina en locale `en` con `path` igual a `/about`

#### Scenario: Locale no duplicado en CMS path
- **WHEN** el sistema consulta una pagina en ingles para `/en/about`
- **THEN** el sistema MUST usar `/about` como `page.path` de CMS, no `/en/about`

### Requirement: Consultas CMS filtradas por locale
El sistema SHALL consultar posts y paginas filtrando por `_path STARTS_WITH` con la raiz de contenido correspondiente al locale y al tipo de contenido.

#### Scenario: Listado de posts en español
- **WHEN** el sistema carga posts para locale `es`
- **THEN** la consulta CMS filtra por `_path STARTS_WITH` con `/content/dam/weblog/es/posts`

#### Scenario: Listado de posts en ingles
- **WHEN** el sistema carga posts para locale `en`
- **THEN** la consulta CMS filtra por `_path STARTS_WITH` con `/content/dam/weblog/en/posts`

#### Scenario: Paginas en español
- **WHEN** el sistema carga paginas para locale `es`
- **THEN** la consulta CMS filtra por `_path STARTS_WITH` con `/content/dam/weblog/es/pages`

#### Scenario: Paginas en ingles
- **WHEN** el sistema carga paginas para locale `en`
- **THEN** la consulta CMS filtra por `_path STARTS_WITH` con `/content/dam/weblog/en/pages`

#### Scenario: Detalle de post aislado por idioma
- **WHEN** existen posts con el mismo slug en `es` y `en`
- **THEN** el sistema MUST devolver solo el post ubicado bajo la raiz CMS del locale solicitado

### Requirement: Contenido parcial por idioma
El sistema SHALL permitir que posts y paginas existan en un idioma sin requerir una version equivalente en el otro idioma.

#### Scenario: Post solo existe en español
- **WHEN** un post existe bajo `/content/dam/weblog/es/posts` pero no bajo `/content/dam/weblog/en/posts`
- **THEN** el sistema muestra el post en `/blog/<slug>` y no requiere un detalle equivalente en `/en/blog/<slug>`

#### Scenario: Pagina solo existe en ingles
- **WHEN** una pagina existe bajo `/content/dam/weblog/en/pages` pero no bajo `/content/dam/weblog/es/pages`
- **THEN** el sistema muestra la pagina en `/en/<path>` y no requiere una pagina equivalente sin prefijo

### Requirement: Interfaz y navegacion localizadas
El sistema SHALL mostrar textos fijos de interfaz y enlaces de navegacion en el idioma del locale activo.

#### Scenario: Navegacion en español
- **WHEN** un usuario navega una ruta en locale `es`
- **THEN** la navegacion muestra enlaces publicos sin prefijo, incluyendo `/` y `/blog`

#### Scenario: Navegacion en ingles
- **WHEN** un usuario navega una ruta en locale `en`
- **THEN** la navegacion muestra enlaces publicos con prefijo `/en`, incluyendo `/en` y `/en/blog`

#### Scenario: Textos fijos en detalle de post
- **WHEN** un usuario visita un detalle de post en locale `en`
- **THEN** etiquetas como volver al blog, resumen y publicado se muestran en ingles

#### Scenario: Menu cambia al navegar client-side hacia ingles
- **WHEN** un usuario navega client-side desde una ruta en locale `es` hacia una ruta en locale `en`
- **THEN** el menu de navegacion muestra labels y enlaces del locale `en`
- **AND** las paginas CMS del menu provienen del arbol de contenido ingles

#### Scenario: Menu cambia al navegar client-side hacia español
- **WHEN** un usuario navega client-side desde una ruta en locale `en` hacia una ruta en locale `es`
- **THEN** el menu de navegacion muestra labels y enlaces del locale `es`
- **AND** las paginas CMS del menu provienen del arbol de contenido español

### Requirement: Selector visual de idioma
El sistema SHALL incluir un selector visual de idioma que permita alternar entre `es` y `en` usando URLs publicas validas.

#### Scenario: Selector en home
- **WHEN** un usuario usa el selector desde `/`
- **THEN** la opcion de ingles apunta a `/en`

#### Scenario: Selector en listado de blog
- **WHEN** un usuario usa el selector desde `/blog`
- **THEN** la opcion de ingles apunta a `/en/blog`

#### Scenario: Selector en detalle sin traduccion conocida
- **WHEN** un usuario usa el selector desde `/blog/<slug>` y no existe relacion de traduccion conocida
- **THEN** la opcion de ingles apunta a `/en/blog`

#### Scenario: Selector en detalle con traduccion existente
- **WHEN** un usuario usa el selector desde `/blog/arquitectura-frontend` y existe una traduccion en ingles relacionada por `translationKey`
- **THEN** la opcion de ingles apunta al detalle traducido en `/en/blog/<translatedSlug>`

#### Scenario: Selector en pagina dinamica sin traduccion conocida
- **WHEN** un usuario usa el selector desde `/en/about-us` y no existe relacion de traduccion conocida
- **THEN** la opcion de español apunta a `/`

#### Scenario: Selector de español a ingles en pagina dinamica con traduccion existente
- **WHEN** un usuario esta en `/sobre-nosotros`
- **AND** la pagina española tiene `translationKey` igual a `about-us`
- **AND** existe una pagina inglesa con `translationKey` igual a `about-us` y `path` igual a `/about-us`
- **WHEN** el usuario selecciona `en`
- **THEN** el sistema navega a `/en/about-us`

#### Scenario: Selector de ingles a español en pagina dinamica con traduccion existente
- **WHEN** un usuario esta en `/en/about-us`
- **AND** la pagina inglesa tiene `translationKey` igual a `about-us`
- **AND** existe una pagina española con `translationKey` igual a `about-us` y `path` igual a `/sobre-nosotros`
- **WHEN** el usuario selecciona `es`
- **THEN** el sistema navega a `/sobre-nosotros`

#### Scenario: Selector de español a ingles en pagina dinamica sin translationKey
- **WHEN** un usuario esta en `/sobre-nosotros`
- **AND** la pagina española no tiene `translationKey`
- **WHEN** el usuario selecciona `en`
- **THEN** el sistema navega a `/en`

#### Scenario: Selector de ingles a español en pagina dinamica sin translationKey
- **WHEN** un usuario esta en `/en/about-us`
- **AND** la pagina inglesa no tiene `translationKey`
- **WHEN** el usuario selecciona `es`
- **THEN** el sistema navega a `/`

### Requirement: Traducciones de posts por translationKey
El sistema SHALL usar `translationKey` opcional para resolver el detalle equivalente de un post en otro locale cuando exista.

#### Scenario: Buscar traduccion por translationKey
- **WHEN** un usuario visita `/blog/arquitectura-frontend` y el post tiene `translationKey` igual a `frontend-architecture`
- **THEN** el sistema busca un post en locale `en` con `translationKey` igual a `frontend-architecture`

#### Scenario: Resolver slug traducido
- **WHEN** existe un post en locale `en` con `translationKey` igual a `frontend-architecture` y `slug` igual a `frontend-architecture`
- **THEN** el sistema construye la URL publica `/en/blog/frontend-architecture`

#### Scenario: Fallback cuando no existe traduccion
- **WHEN** un post tiene `translationKey` pero no existe post equivalente en el locale destino
- **THEN** la opcion del selector apunta al listado de blog del locale destino

#### Scenario: Fallback cuando translationKey esta ausente
- **WHEN** un post no tiene `translationKey`
- **THEN** la opcion del selector apunta al listado de blog del locale destino

### Requirement: Traducciones de paginas dinamicas por translationKey
El sistema SHALL usar `translationKey` opcional para resolver la pagina dinamica equivalente en otro locale cuando exista.

#### Scenario: Buscar pagina traducida por translationKey
- **WHEN** un usuario visita `/sobre-nosotros` y la pagina tiene `translationKey` igual a `about-us`
- **THEN** el sistema busca una pagina en locale `en` con `translationKey` igual a `about-us`

#### Scenario: Resolver path traducido de español a ingles
- **WHEN** existe una pagina en locale `en` con `translationKey` igual a `about-us` y `path` igual a `/about-us`
- **THEN** el sistema construye la URL publica `/en/about-us`

#### Scenario: Resolver path traducido de ingles a español
- **WHEN** un usuario visita `/en/about-us` y la pagina tiene `translationKey` igual a `about-us`
- **AND** existe una pagina en locale `es` con `translationKey` igual a `about-us` y `path` igual a `/sobre-nosotros`
- **THEN** el sistema construye la URL publica `/sobre-nosotros`

#### Scenario: Fallback cuando no existe pagina traducida
- **WHEN** una pagina tiene `translationKey` pero no existe pagina equivalente en el locale destino
- **THEN** la opcion del selector apunta a la home del locale destino

#### Scenario: Fallback cuando translationKey de pagina esta ausente
- **WHEN** una pagina no tiene `translationKey`
- **THEN** la opcion del selector apunta a la home del locale destino

### Requirement: Cache e invalidacion por locale
El sistema SHALL separar cache tags ISR por locale para posts, paginas, listados y detalles.

#### Scenario: Cache tag de listado de posts
- **WHEN** el sistema cachea un listado de posts para locale `en`
- **THEN** usa un tag especifico del locale como `posts:list:en`

#### Scenario: Cache tag de detalle de post
- **WHEN** el sistema cachea un detalle de post en locale `es` con slug `mi-post`
- **THEN** usa un tag especifico del locale y slug como `post:es:mi-post`

#### Scenario: Cache tag de pagina dinamica
- **WHEN** el sistema cachea una pagina en locale `en` con path `/about`
- **THEN** usa un tag especifico del locale y path como `page:en:/about`

### Requirement: Revalidacion localizada
El endpoint de revalidacion SHALL aceptar `locale` para payloads de posts y paginas, validar que sea un locale soportado y revalidar solo los tags correspondientes a ese idioma.

#### Scenario: Revalidar post en ingles
- **WHEN** el endpoint recibe un payload valido para post con `locale` igual a `en` y `slug` igual a `my-post`
- **THEN** revalida los tags `posts:list:en` y `post:en:my-post`

#### Scenario: Revalidar pagina en español
- **WHEN** el endpoint recibe un payload valido para pagina con `locale` igual a `es` y `path` igual a `/nosotros`
- **THEN** revalida los tags `pages:list:es` y `page:es:/nosotros`

#### Scenario: Rechazar locale no soportado
- **WHEN** el endpoint recibe un payload con `locale` distinto de `es` o `en`
- **THEN** responde con error de validacion y no revalida tags

### Requirement: Metadata basica por idioma
El sistema SHALL emitir metadata basica coherente con el locale renderizado, incluyendo `html lang`, canonical y alternates cuando exista una equivalencia conocida.

#### Scenario: Html lang en español
- **WHEN** el sistema renderiza una ruta en locale `es`
- **THEN** el documento usa `lang="es"`

#### Scenario: Html lang en ingles
- **WHEN** el sistema renderiza una ruta en locale `en`
- **THEN** el documento usa `lang="en"`

#### Scenario: Alternates en paginas con equivalencia conocida
- **WHEN** el sistema renderiza home o listado de blog
- **THEN** expone alternates para `es` y `en` usando las URLs publicas correspondientes

#### Scenario: Alternate en detalle con traduccion conocida
- **WHEN** el sistema renderiza un detalle de post con traduccion equivalente conocida por `translationKey`
- **THEN** expone alternate hacia la URL del detalle traducido

#### Scenario: Alternate en pagina dinamica con traduccion conocida
- **WHEN** el sistema renderiza una pagina dinamica con traduccion equivalente conocida por `translationKey`
- **THEN** expone alternate hacia la URL de la pagina traducida

#### Scenario: Sin alternate inventado en detalle no enlazado
- **WHEN** el sistema renderiza un detalle de post sin traduccion equivalente por `translationKey`
- **THEN** no expone un alternate hacia un detalle equivalente inexistente

#### Scenario: Sin alternate inventado en pagina dinamica no enlazada
- **WHEN** el sistema renderiza una pagina dinamica sin traduccion equivalente por `translationKey`
- **THEN** no expone un alternate hacia una pagina equivalente inexistente
