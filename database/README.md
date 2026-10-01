# Configuración de Base de Datos (Supabase)

Esta guía explica paso a paso cómo configurar la base de datos para la aplicación de invitaciones de boda.

## 1. Crear una cuenta y proyecto en Supabase

1. Ve a [Supabase](https://supabase.com/) y haz clic en "Start your project" o "Sign in".
2. Si no tienes cuenta, crea una (puedes usar tu cuenta de GitHub).
3. Una vez en el panel (Dashboard), haz clic en **"New Project"**.
4. Selecciona la organización (tu cuenta) e ingresa un **Nombre** para el proyecto (ej. "Boda RM").
5. Crea una **Contraseña de Base de Datos** segura y guárdala.
6. Selecciona una región cercana a ti.
7. Haz clic en **"Create new project"**. Esto tomará un par de minutos.

## 2. Ejecutar los scripts SQL

Una vez creado el proyecto, ve al menú izquierdo y selecciona **"SQL Editor"**. Haz clic en **"New query"**.

Debes ejecutar los siguientes scripts **en orden**. Copia el contenido de cada archivo de esta carpeta y pégalo en el editor SQL, luego haz clic en "Run":

1.  **Ejecuta `001_create_invitados.sql`**
    *   *Propósito:* Crea la tabla principal `invitados`, habilita RLS (Row Level Security) y añade un trigger para fechas.
2.  **Ejecuta `002_insert_invitados_demo.sql`**
    *   *Propósito:* Crea tres invitados de prueba con códigos específicos (ej. 7F92K) para que puedas probar la aplicación inmediatamente.
3.  **Ejecuta `003_policies.sql`**
    *   *Propósito:* Configura la seguridad RLS para que los invitados puedan ver su invitación y confirmar su asistencia sin poder ver los datos de los demás.

## 3. Obtener credenciales de API

Ve al menú izquierdo y selecciona **"Project Settings"** (el icono de engranaje).
Luego, en el submenú, selecciona **"API"**. Necesitarás copiar tres valores:

1.  **Project URL**: Lo encontrarás bajo "Project URL".
2.  **Project API Keys - `anon` `public`**: Es la clave pública para el navegador.
3.  **Project API Keys - `service_role` `secret`**: Es la clave secreta para el panel de administración. **¡NUNCA expongas esta clave públicamente!**

## 4. Configurar variables de entorno locales

En la raíz del proyecto (junto al archivo `package.json`), busca o crea un archivo llamado `.env.local` (o `.env`).

Copia las credenciales obtenidas en el paso anterior de la siguiente manera:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_aqui

# Contraseña para acceder al panel de administración (puedes inventar una)
ADMIN_PASSWORD=boda2026
```

## 5. Ejecutar y Probar

1.  Ejecuta el proyecto localmente con `npm run dev`.
2.  Abre en tu navegador `http://localhost:3000/invitacion/7F92K` para probar un invitado.
3.  Para crear más invitados, entra a `http://localhost:3000/admin` usando la contraseña que configuraste.

## 6. Despliegue en Vercel o Netlify

Cuando estés listo para publicar la página en internet:

1.  Sube tu código a un repositorio en GitHub.
2.  Entra a Vercel o Netlify y conecta tu cuenta de GitHub.
3.  Selecciona el repositorio de tu proyecto.
4.  **¡MUY IMPORTANTE!** En la configuración del despliegue (Environment Variables), debes agregar exactamente las mismas 4 variables de entorno que pusiste en tu archivo `.env.local`.
5.  Haz clic en "Deploy".
