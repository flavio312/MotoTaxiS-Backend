#  Moto Taxi Seguro BackEnd – API REST
Esta API REST es de uso Privado para la aplicación de MotoTaxi Seguro el cual es para la gestión y monitoreo de servicios (Viajes, envio de paquetes).

La API REST esta desarrollada con **Node.js, Express y MySQL** para la gestión de usuarios, propietarios, conductores y vehículos.
Incluye autenticación mediante **JSON Web Token (JWT)** y control de roles para permitir diferentes niveles de acceso.

## 📌 Características

* Autenticación con **JWT**
* Gestión de **usuarios**
* Gestión de **propietarios**
* Gestión de **conductores**
* Gestión de **vehículos**
* Arquitectura modular
* Uso de **TypeScript**
* Manejo de **transacciones en MySQL**

---

# Tecnologías utilizadas

* **Node.js**
* **Express**
* **TypeScript**
* **MySQL**
* **JWT (Json Web Token)**
* **Postman** para pruebas de endpoints

---

# Estructura del proyecto

```
src
│
├── config
│   └── db.config.ts
│
├── controllers
│   ├── auth.controller.ts
│   ├── usuario.controller.ts
│   ├── propietario.controller.ts
│   ├── conductor.controller.ts
│   └── vehiculo.controller.ts
│
├── middlewares
│   └── auth.middleware.ts
│
├── models
│   ├── usuario.model.ts
│   ├── propietario.model.ts
│   ├── conductor.model.ts
│   └── vehiculo.model.ts
│
├── routes
│   ├── auth.routes.ts
│   ├── usuario.routes.ts
│   ├── propietario.routes.ts
│   ├── conductor.routes.ts
│   └── vehiculo.routes.ts
│
└── app.ts
```

---

# Instalación

Clonar el repositorio

```bash
git clone https://github.com/tuusuario/nombre-del-repositorio.git
```

Entrar al proyecto

```bash
cd nombre-del-repositorio
```

Instalar dependencias

```bash
npm install
```

Ejecutar el servidor

```bash
npm run dev
```

---

# 🔐 Autenticación

La API utiliza **JWT** para proteger los endpoints.

Después de iniciar sesión se obtiene un token:

```
Authorization: Bearer TOKEN
```

Este token debe enviarse en los endpoints protegidos.

---

# Roles del sistema

El sistema contempla diferentes tipos de usuario:

* **Administrador**

  * Puede ver todos los usuarios
  * Gestionar propietarios
  * Gestionar conductores
  * Gestionar vehículos

* **Propietario**

  * Gestiona sus propios vehículos

* **Conductor**

  * Acceso limitado a vehículos asignados

---

# Pruebas

Las pruebas de endpoints se realizaron usando:

* **Postman**