# Guía de Diseño de APIs RESTful

**Autor:** Sergio Mesa
**Fecha:** 2024-12-06
**Versión:** 1.0.0
**Contacto:** smesa[at]lean-tech.io

Esta guía detalla los principios y mejores prácticas para diseñar APIs RESTful siguiendo las directrices de Zalando. Incluye ejemplos claros y justificaciones para cada punto, con el objetivo de garantizar consistencia, mantenibilidad y escalabilidad.

---

## Tabla de Contenidos
1. [Principios Fundamentales](#principios-fundamentales)
2. [Directrices Generales](#directrices-generales)
3. [Estructura de URLs](#estructura-de-urls)
4. [Manejo de Datos](#manejo-de-datos)
5. [Seguridad](#seguridad)
6. [Errores y Respuestas](#errores-y-respuestas)
7. [Versionado y Evolución](#versionado-y-evolución)
8. [Hipermedia y HATEOAS](#hipermedia-y-hateoas)
9. [Documentación](#documentación)
10. [Mejores Prácticas](#mejores-prácticas)

---

## Principios Fundamentales

### 1. **API como Producto**
- Diseña las APIs como un producto independiente.  
- Prioriza la simplicidad, claridad y consistencia.  
- Considera a los desarrolladores como tus clientes: la experiencia del usuario es esencial.

**Justificación:** Una API bien diseñada es fácil de usar, lo que fomenta la adopción y reduce errores.

---

### 2. **API First**
- Define la API antes de comenzar la implementación.
- Utiliza especificaciones como OpenAPI.
- Realiza revisiones tempranas con otros equipos.

**Ejemplo:**
```yaml
openapi: 3.0.1
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Lista de usuarios
      responses:
        '200':
          description: Lista obtenida exitosamente
```

---

## Directrices Generales

### 3. **Nomenclatura Consistente**
- Usa `kebab-case` en las rutas (`/user-preferences`).
- Evita verbos en las URLs, manteniéndolas orientadas a recursos.

**Incorrecto:**  
```
POST /createUser
```

**Correcto:**  
```
POST /users
```

### 4. **Filtrado, Ordenamiento y Paginación**
- **Filtrado:** `/products?category=electronics&price_range=100-200`  
- **Ordenamiento:** `/users?sort=lastName,asc`  
- **Paginación:** `/products?page=2&page_size=20`

**Ejemplo de respuesta paginada:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 2,
    "pageSize": 20,
    "totalPages": 10
  }
}
```

---

## Estructura de URLs

### 5. **Diseño de Rutas**
- Usa sustantivos en plural para colecciones.
- Incluye subrecursos si es necesario:
```
GET /users/{userId}/orders
```

**Ejemplo de subrecursos:**  
Un usuario puede tener múltiples pedidos. Usa rutas como `/users/{userId}/orders` para acceder a los pedidos de un usuario.

---

## Manejo de Datos

### 6. **Formato de Datos**
- Usa JSON como estándar.
- Emplea `snake_case` para los nombres de las propiedades:
```json
{
  "user_id": 123,
  "email": "user@example.com"
}
```

### 7. **Estandarización de Fechas y Tiempos**
- Usa el formato ISO 8601 (`2023-12-06T10:00:00Z`).
- Siempre maneja tiempos en UTC.

---

## Seguridad

### 8. **Autenticación y Autorización**
- Implementa HTTPS siempre.
- Usa OAuth 2.0 con tokens Bearer para la autenticación.
- Protege endpoints sensibles mediante permisos específicos.

**Ejemplo:**  
```yaml
security:
  - BearerAuth: []
```

---

## Errores y Respuestas

### 9. **Códigos HTTP**
- **200:** Operación exitosa.
- **400:** Solicitud inválida.
- **401:** No autorizado.
- **500:** Error interno del servidor.

### 10. **Formato de Respuestas de Error**
Usa el formato `problem+json`:
```json
{
  "type": "https://api.example.com/errors/invalid-input",
  "title": "Invalid Input",
  "status": 400,
  "detail": "El campo email es obligatorio."
}
```

---

## Versionado y Evolución

### 11. **Versionado de APIs**
- Usa versionado semántico en las URLs:
```
GET /v1/users
GET /v2/users
```

---

## Hipermedia y HATEOAS

### 12. **Incluir Enlaces Relacionados**
Facilita la navegación mediante enlaces:
```json
{
  "data": {
    "id": "123",
    "type": "orders",
    "attributes": {
      "status": "pending"
    },
    "_links": {
      "self": "/orders/123",
      "customer": "/customers/456"
    }
  }
}
```

---

## Documentación

### 13. **Uso de OpenAPI**
- Documenta cada endpoint, parámetros y respuestas posibles.
- Incluye ejemplos prácticos.

**Ejemplo:**
```yaml
paths:
  /users:
    get:
      summary: Lista de usuarios
      parameters:
        - name: page
          in: query
          description: Número de página
          schema:
            type: integer
      responses:
        '200':
          description: Lista obtenida exitosamente
```

---

## Mejores Prácticas

### 14. **Evita el Acoplamiento**
Diseña APIs desacopladas que permitan cambios internos sin afectar a los consumidores.

### 15. **Soporte para Operaciones en Lote**
Proporciona endpoints para procesar múltiples recursos:
```json
POST /users/batch
{
  "users": [
    { "name": "Usuario 1", "email": "usuario1@example.com" },
    { "name": "Usuario 2", "email": "usuario2@example.com" }
  ]
}
```

---

