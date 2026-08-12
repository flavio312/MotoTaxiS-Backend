#  Moto Taxi Seguro BackEnd – API REST
Esta API REST es de uso Privado para la aplicación de MotoTaxi Seguro el cual es para la gestión y monitoreo de servicios (Viajes, envio de paquetes, gestión de usuarios en tiempo real).

La API REST esta desarrollada con **Node.js, Express y MySQL con Socket.io** para la gestión de usuarios, propietarios, conductores y vehículos con monitoreo de servicios en tiempo real.
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
* **Socket.io**
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
│   ├── admin.controller.ts
│   ├── direcciones.controller.ts
│   ├── login.controller.ts
│   ├── usuario.controller.ts
│   ├── propietario.controller.ts
│   ├── persona.controller.ts
│   ├── conductores.controller.ts
│   ├── servicio.controller.ts
│   └── vehiculo.controller.ts
│
├── middlewares
|   ├── upload.ts
│   └── auth.middleware.ts
│
├── models
│   ├── usuario.model.ts
│   ├── propietario.model.ts
│   ├── domicilio.model.ts
│   ├── persona.model.ts
│   ├── servicio.model.ts
│   ├── conductores.model.ts
│   └── vehiculo.model.ts
│
├── routes
│   ├── auth.routes.ts
│   ├── admin.routes.ts
│   ├── conductores.routes.ts
│   ├── usuario.routes.ts
│   ├── login.routes.ts
│   ├── propietario.routes.ts
│   ├── servicio.routes.ts
│   ├── persona.routes.ts
│   └── vehiculo.routes.ts
│
├── services
|   ├── cloudinary.service.ts
│   └── socket.service.ts
|
├── types
│   └── index.ts
├── app.ts
└── index.ts
```

---

# Instalación

Clonar el repositorio

```bash
git clone https://github.com/flavio312/MotoTaxiS-Backend.git
```

Entrar al proyecto

```bash
cd MotoTaxiS-Backend
```

Instalar dependencias

```bash
pnpm install
```

Ejecutar el servidor

```bash
pnpm run dev
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
  * Acceso limitado a servicio de transporte

* **Usuario**

  * Acceso limitado a solicitar transporte

---

# Pruebas

Las pruebas de endpoints se realizaron usando:

* **Postman**