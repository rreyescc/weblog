## 1. Configuracion e integracion OpenSearch

- [ ] 1.1 Definir variables de entorno server-side para `OPENSEARCH_NODE`, credenciales y aliases/indices por locale.
- [ ] 1.2 Agregar cliente server-only para OpenSearch bajo `integrations/search/`.
- [ ] 1.3 Implementar seleccion de indice/alias por locale `es` y `en`.
- [ ] 1.4 Asegurar que la integracion solo expone operaciones read-only de busqueda.

## 2. Servicio de busqueda de posts

- [ ] 2.1 Crear tipos de dominio para resultado de busqueda, paginacion y parametros de busqueda.
- [ ] 2.2 Crear `searchPosts` para normalizar `q`, `page`, `limit` y traducirlos a `from`/`size`.
- [ ] 2.3 Construir query OpenSearch con `multi_match` sobre `title^3` e `intro`.
- [ ] 2.4 Mapear hits de OpenSearch a resultados renderizables con `slug`, `title`, `intro`, `publishedAt` y `href` si existe.
- [ ] 2.5 Construir `href` con helpers de locale cuando el documento no incluya `href`.
- [ ] 2.6 Manejar errores de OpenSearch devolviendo un estado controlado para la UI.

## 3. Rutas y renderizado de blog

- [ ] 3.1 Actualizar `app/blog/page.tsx` para leer `searchParams` y pasarlos al render compartido con locale `es`.
- [ ] 3.2 Actualizar `app/en/blog/page.tsx` para leer `searchParams` y pasarlos al render compartido con locale `en`.
- [ ] 3.3 Actualizar `renderBlogPage` para mantener el listado normal cuando `q` este ausente o vacio.
- [ ] 3.4 Actualizar `renderBlogPage` para consultar OpenSearch cuando `q` tenga contenido.
- [ ] 3.5 Renderizar resultados de busqueda sin depender del listado completo del CMS.

## 4. UI de busqueda y paginacion

- [ ] 4.1 Crear componente cliente de input de busqueda con valor inicial desde `q`.
- [ ] 4.2 Implementar debounce antes de actualizar la URL con `q` y `page=1`.
- [ ] 4.3 Preservar la ruta localizada al actualizar la URL desde `/blog` y `/en/blog`.
- [ ] 4.4 Crear UI de resumen de resultados para indicar la query actual.
- [ ] 4.5 Crear estado sin resultados.
- [ ] 4.6 Crear estado de error de busqueda sin exponer detalles internos.
- [ ] 4.7 Crear controles de paginacion anterior/siguiente preservando `q`.
- [ ] 4.8 Normalizar o bloquear paginas invalidas para evitar errores de renderizado.

## 5. Localizacion y documentacion

- [ ] 5.1 Agregar textos `es` y `en` para label del buscador, placeholder, resultados, sin resultados, error y paginacion.
- [ ] 5.2 Documentar variables de entorno de OpenSearch en README o documentacion local equivalente.
- [ ] 5.3 Documentar que la indexacion, webhooks de AEM y administracion de indices quedan fuera de este frontend.

## 6. Verificacion

- [ ] 6.1 Verificar que `/blog` sin `q` mantiene el listado normal en español.
- [ ] 6.2 Verificar que `/en/blog` sin `q` mantiene el listado normal en ingles.
- [ ] 6.3 Verificar que `/blog?q=react&page=1` consulta el indice/alias español y renderiza resultados paginados.
- [ ] 6.4 Verificar que `/en/blog?q=react&page=1` consulta el indice/alias ingles y renderiza resultados paginados.
- [ ] 6.5 Verificar que el input aplica debounce y reinicia `page` a `1` al cambiar la query.
- [ ] 6.6 Verificar estados sin resultados y error de busqueda en ambos locales.
- [ ] 6.7 Verificar que el browser no recibe credenciales ni endpoint privado de OpenSearch.
- [ ] 6.8 Ejecutar `pnpm lint`.
- [ ] 6.9 Ejecutar `pnpm build`.
