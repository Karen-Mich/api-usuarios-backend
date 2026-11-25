# API de Usuarios

API REST para registrar usuarios, iniciar sesión y administrar usuarios con autenticación por token JWT. Está hecha con Node.js, Express y Sequelize sobre MySQL.

Es el backend de [front_usuarios](https://github.com/Karen-Mich/front_usuarios), una interfaz en React que consume estos endpoints.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

## Funcionalidades

- Registro de usuarios con la contraseña cifrada con **bcrypt**.
- Inicio de sesión que devuelve un **token JWT** válido por 1 día.
- Rutas protegidas: listar, consultar, editar y eliminar usuarios requiere el token.
- Listado con **paginación, ordenamiento y filtros** por nombre, apellido, correo y rol.
- Dos roles: `admin` y `usuario`. El rol viaja dentro del token.
- Errores con un formato único: `{ "error": "mensaje" }` y el código HTTP correspondiente.
- La contraseña nunca se devuelve en las respuestas.

## Estructura

```
src/
├── index.js                  # Conecta con MySQL y levanta el servidor
├── app.js                    # Configuración de Express, CORS y rutas
├── config/database.js        # Conexión de Sequelize
├── models/user.js            # Modelo "usuarios"
├── routes/usuarios.js        # Definición de endpoints
├── controllers/              # Lógica de cada endpoint
├── middlewares/
│   ├── auth.js               # Verifica el token JWT (Bearer)
│   ├── rbac.js               # Autorización por rol
│   ├── validator.js          # Valida el body con un esquema Joi
│   └── errorHandler.js       # Respuesta de error centralizada
├── validators/               # Esquemas Joi de usuario
├── errors/ApiError.js        # Errores HTTP (400, 401, 403, 404)
└── utils/queryParser.js      # Paginación, orden y filtros
```

## Requisitos

- Node.js 18 o superior
- MySQL 8

## Instalación

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone https://github.com/Karen-Mich/api-usuarios-backend.git
   cd api-usuarios-backend
   npm install
   ```

2. Crea la base de datos y la tabla. La API no crea la tabla por sí sola:

   ```sql
   CREATE DATABASE IF NOT EXISTS usuarios_db;
   USE usuarios_db;

   CREATE TABLE usuarios (
     id        INT AUTO_INCREMENT PRIMARY KEY,
     nombre    VARCHAR(255) NOT NULL,
     apellido  VARCHAR(255) NOT NULL,
     email     VARCHAR(255) NOT NULL UNIQUE,
     password  VARCHAR(255) NOT NULL,
     rol       ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
     createdAt DATETIME NOT NULL,
     updatedAt DATETIME NOT NULL
   );
   ```

3. Copia `.env.example` como `.env` y completa tus datos:

   ```bash
   cp .env.example .env
   ```

   | Variable | Descripción |
   |:--|:--|
   | `PORT` | Puerto del servidor (por defecto `3000`) |
   | `DB_HOST` | Host de MySQL |
   | `DB_PORT` | Puerto de MySQL |
   | `DB_NAME` | Nombre de la base de datos |
   | `DB_USER` | Usuario de MySQL |
   | `DB_PASS` | Contraseña de MySQL |
   | `JWT_SECRET` | Clave para firmar los tokens |

4. Inicia el servidor:

   ```bash
   npm run dev   # modo desarrollo, se reinicia al guardar (nodemon)
   npm start     # modo normal
   ```

   La API queda disponible en `http://localhost:3000`.

> El CORS solo acepta peticiones desde `http://localhost:5174`, el puerto del frontend en Vite. Si tu frontend usa otro origen, cámbialo en `src/app.js`.

## Endpoints

Todas las rutas empiezan con `/usuarios`.

| Método | Ruta | Autenticación | Descripción |
|:--|:--|:--:|:--|
| `POST` | `/usuarios/login` | No | Inicia sesión y devuelve el token |
| `POST` | `/usuarios` | No | Registra un usuario |
| `GET` | `/usuarios` | Sí | Lista usuarios con paginación y filtros |
| `GET` | `/usuarios/:id` | Sí | Obtiene un usuario |
| `PUT` | `/usuarios/:id` | Sí | Actualiza un usuario |
| `DELETE` | `/usuarios/:id` | Sí | Elimina un usuario |

Las rutas protegidas necesitan el encabezado:

```
Authorization: Bearer <token>
```

### Registrar un usuario

```http
POST /usuarios
Content-Type: application/json

{
  "nombre": "Ana",
  "apellido": "Torres",
  "email": "ana@correo.com",
  "password": "secreto123",
  "rol": "usuario"
}
```

Respuesta `201`: el usuario creado, sin la contraseña. Si el correo ya existe responde `400`.

### Iniciar sesión

```http
POST /usuarios/login
Content-Type: application/json

{ "email": "ana@correo.com", "password": "secreto123" }
```

Respuesta `200`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "nombre": "Ana", "apellido": "Torres", "email": "ana@correo.com", "rol": "usuario" }
}
```

Con credenciales incorrectas responde `401`.

### Listar usuarios

```http
GET /usuarios?page=1&limit=10&sort=nombre:asc&rol=admin
Authorization: Bearer <token>
```

| Parámetro | Ejemplo | Descripción |
|:--|:--|:--|
| `page` | `1` | Página (por defecto 1) |
| `limit` | `10` | Resultados por página (por defecto 10) |
| `sort` | `nombre:desc` | Campo y dirección del orden (por defecto `id:asc`) |
| `nombre`, `apellido`, `email` | `ana` | Búsqueda parcial |
| `rol` | `admin` | Coincidencia exacta |

Respuesta `200`:

```json
{ "total": 25, "page": 1, "limit": 10, "data": [ { "id": 1, "nombre": "Ana", "...": "..." } ] }
```

### Actualizar y eliminar

- `PUT /usuarios/:id` recibe solo los campos a cambiar. Si incluye `password`, se vuelve a cifrar.
- `DELETE /usuarios/:id` responde `{ "mensaje": "Usuario eliminado correctamente" }`.
- Ambos responden `404` si el usuario no existe.

## Próximos pasos

- [ ] Corregir `src/validators/usuariosValidators.js` (al final usa `body` y `validationErrorHandler` de express-validator sin importarlos) y conectar sus esquemas Joi a las rutas con el middleware `validate`.
- [ ] Aplicar `rbac.js` para que solo `admin` pueda listar, editar y eliminar usuarios.
- [ ] Impedir que un registro público elija el rol `admin`.
- [ ] Activar `helmet` y `morgan`, que ya están instalados.
- [ ] Leer el origen permitido de CORS desde una variable de entorno.
- [ ] Agregar pruebas automatizadas.

## Autora

**Karen Guatumillo** · [GitHub](https://github.com/Karen-Mich)
