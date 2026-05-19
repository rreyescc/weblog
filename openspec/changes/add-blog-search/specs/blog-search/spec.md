## ADDED Requirements

### Requirement: Busqueda URL-based en blog
El sistema SHALL permitir buscar publicaciones desde las paginas de blog usando parametros URL `q` y `page`.

#### Scenario: Buscar en blog español
- **WHEN** un usuario visita `/blog?q=react&page=1`
- **THEN** el sistema interpreta `q` como el texto de busqueda
- **AND** interpreta `page` como la pagina de resultados solicitada
- **AND** renderiza resultados para locale `es`

#### Scenario: Buscar en blog ingles
- **WHEN** un usuario visita `/en/blog?q=react&page=1`
- **THEN** el sistema interpreta `q` como el texto de busqueda
- **AND** interpreta `page` como la pagina de resultados solicitada
- **AND** renderiza resultados para locale `en`

#### Scenario: Listado normal sin busqueda
- **WHEN** un usuario visita `/blog` sin parametro `q`
- **THEN** el sistema renderiza el listado normal de publicaciones para locale `es`
- **AND** no requiere consultar OpenSearch para mostrar el listado base

#### Scenario: Query vacio mantiene listado normal
- **WHEN** un usuario visita `/blog?q=`
- **THEN** el sistema trata la busqueda como ausente
- **AND** renderiza el listado normal de publicaciones

### Requirement: Input de busqueda con debounce
El sistema SHALL mostrar un input de busqueda en `/blog` y `/en/blog` que actualice los parametros URL despues de un debounce.

#### Scenario: Usuario escribe texto de busqueda
- **WHEN** un usuario escribe `react` en el input de busqueda en `/blog`
- **THEN** el sistema espera el intervalo de debounce configurado
- **AND** actualiza la URL a una ruta equivalente con `q=react` y `page=1`

#### Scenario: Cambiar query reinicia paginacion
- **WHEN** un usuario esta en `/blog?q=next&page=3`
- **AND** cambia el texto de busqueda a `react`
- **THEN** el sistema actualiza la URL con `q=react`
- **AND** reinicia `page` a `1`

#### Scenario: Input refleja query actual
- **WHEN** un usuario visita `/en/blog?q=react&page=2`
- **THEN** el input de busqueda muestra `react` como valor inicial

### Requirement: Consulta server-only a OpenSearch
El sistema SHALL consultar OpenSearch solo desde codigo server-side y nunca desde el navegador.

#### Scenario: Render de resultados desde Server Components
- **WHEN** una pagina de blog recibe un parametro `q` no vacio
- **THEN** el sistema consulta OpenSearch desde un servicio server-only
- **AND** renderiza los resultados en la pagina solicitada

#### Scenario: Credenciales no expuestas al browser
- **WHEN** el sistema consulta OpenSearch
- **THEN** usa variables de entorno disponibles solo en servidor
- **AND** no expone credenciales ni endpoint privado de OpenSearch al codigo cliente

#### Scenario: OpenSearch es read-only para el frontend
- **WHEN** el frontend interactua con OpenSearch
- **THEN** solo ejecuta operaciones de busqueda
- **AND** no crea, actualiza ni elimina documentos del indice

### Requirement: Seleccion de indice por locale
El sistema SHALL seleccionar el indice o alias de OpenSearch segun el locale activo.

#### Scenario: Indice de busqueda español
- **WHEN** el sistema busca desde `/blog?q=react`
- **THEN** consulta el indice o alias configurado para locale `es`
- **AND** no mezcla resultados del locale `en`

#### Scenario: Indice de busqueda ingles
- **WHEN** el sistema busca desde `/en/blog?q=react`
- **THEN** consulta el indice o alias configurado para locale `en`
- **AND** no mezcla resultados del locale `es`

#### Scenario: Configuracion de indices requerida
- **WHEN** el sistema inicializa una busqueda
- **THEN** obtiene el indice o alias desde la configuracion server-side correspondiente al locale

### Requirement: Campos buscables de publicaciones
El sistema SHALL buscar publicaciones solo por los campos indexados `title` e `intro`.

#### Scenario: Coincidencia por titulo
- **WHEN** un usuario busca un texto que coincide con el `title` de una publicacion
- **THEN** el sistema puede devolver esa publicacion en los resultados

#### Scenario: Coincidencia por intro
- **WHEN** un usuario busca un texto que coincide con el `intro` de una publicacion
- **THEN** el sistema puede devolver esa publicacion en los resultados

#### Scenario: Contenido completo fuera de alcance
- **WHEN** un texto solo coincide con el cuerpo completo de una publicacion y no con `title` ni `intro`
- **THEN** el frontend no requiere devolver esa publicacion por esa coincidencia

#### Scenario: Titulo con mayor relevancia
- **WHEN** OpenSearch calcula relevancia para resultados de busqueda
- **THEN** el sistema solicita que `title` tenga mayor peso que `intro`

### Requirement: Resultados paginados
El sistema SHALL renderizar resultados de busqueda paginados usando el parametro URL `page`.

#### Scenario: Primera pagina por defecto
- **WHEN** un usuario visita `/blog?q=react` sin parametro `page`
- **THEN** el sistema usa `page=1`

#### Scenario: Pagina invalida
- **WHEN** un usuario visita `/blog?q=react&page=abc`
- **THEN** el sistema normaliza la pagina a un valor valido
- **AND** renderiza resultados sin fallar

#### Scenario: Navegar a siguiente pagina
- **WHEN** existen mas resultados despues de la pagina actual
- **THEN** el sistema muestra un enlace o control para navegar a la siguiente pagina preservando `q`

#### Scenario: Navegar a pagina anterior
- **WHEN** el usuario esta en una pagina mayor a `1`
- **THEN** el sistema muestra un enlace o control para navegar a la pagina anterior preservando `q`

### Requirement: Estados localizados de busqueda
El sistema SHALL mostrar textos localizados para el formulario, resultados, estados vacios y errores de busqueda.

#### Scenario: Estado con resultados
- **WHEN** una busqueda devuelve resultados en `/blog?q=react`
- **THEN** el sistema muestra un encabezado localizado indicando la busqueda realizada
- **AND** renderiza tarjetas o enlaces de publicaciones encontradas

#### Scenario: Estado sin resultados
- **WHEN** una busqueda no devuelve resultados
- **THEN** el sistema muestra un mensaje localizado de busqueda sin resultados

#### Scenario: Error de OpenSearch
- **WHEN** OpenSearch no responde o devuelve error
- **THEN** el sistema muestra un mensaje localizado de error de busqueda
- **AND** no expone detalles internos de OpenSearch al usuario

#### Scenario: Textos en ingles
- **WHEN** un usuario busca desde `/en/blog?q=react`
- **THEN** labels, mensajes y controles de busqueda se muestran en ingles

### Requirement: Alcance frontend-only
El sistema SHALL limitar esta capacidad al consumo read-only de resultados de busqueda desde el frontend Next.js.

#### Scenario: Sin indexacion en frontend
- **WHEN** se implementa la busqueda del blog
- **THEN** el frontend no agrega endpoints para recibir eventos de AEM
- **AND** no indexa fragmentos de contenido en OpenSearch

#### Scenario: Sin administracion de indices
- **WHEN** se implementa la busqueda del blog
- **THEN** el frontend no crea ni modifica indices, mappings, aliases ni procesos de full reindex

#### Scenario: Servicio indexer externo
- **WHEN** el indice de OpenSearch necesita documentos actualizados
- **THEN** esa responsabilidad pertenece a un servicio externo fuera de este repositorio
