# Configuración de la API de Google Drive

Esta plataforma usa **Google Drive** como repositorio de imágenes para las
galerías privadas de clientes. El backend se conecta mediante una **Service
Account** (cuenta de servicio) de Google Cloud, que es el método recomendado
porque no requiere que ningún usuario inicie sesión manualmente ni renueve
tokens OAuth.

Seguí estos pasos una única vez para dejar todo configurado.

---

## 1. Crear un proyecto en Google Cloud Console

1. Entrá a [console.cloud.google.com](https://console.cloud.google.com/).
2. En el selector de proyectos (arriba a la izquierda), hacé clic en **New
   Project**.
3. Poné un nombre, por ejemplo `sergio-quiroga-fotografia`, y creá el
   proyecto.
4. Asegurate de tener el proyecto recién creado seleccionado antes de
   continuar.

## 2. Habilitar la API de Google Drive

1. En el menú lateral, andá a **APIs & Services → Library**.
2. Buscá **Google Drive API**.
3. Hacé clic en **Enable**.

## 3. Crear la Service Account

1. Andá a **APIs & Services → Credentials**.
2. Hacé clic en **Create Credentials → Service account**.
3. Completá:
   - **Service account name**: `fotografia-drive` (o el nombre que
     prefieras).
   - Dejá los campos de rol/permisos de proyecto en blanco (no son
     necesarios; los permisos reales se otorgan a nivel de carpeta de Drive,
     ver paso 5).
4. Hacé clic en **Done**.
5. En la lista de **Service Accounts**, hacé clic en la que acabás de crear
   para abrir su detalle. Copiá el valor de **Email** — vas a necesitarlo
   más adelante (es el `GOOGLE_SERVICE_ACCOUNT_EMAIL`).

## 4. Generar la clave privada (JSON)

1. Dentro del detalle de la Service Account, andá a la pestaña **Keys**.
2. Hacé clic en **Add Key → Create new key**.
3. Elegí el tipo **JSON** y confirmá.
4. Se descargará un archivo `.json` a tu computadora. **Guardalo en un
   lugar seguro y nunca lo subas a un repositorio Git público** — contiene
   credenciales que dan acceso a tu Drive.

El archivo JSON tiene una forma similar a esta:

```json
{
  "type": "service_account",
  "project_id": "tu-proyecto",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n",
  "client_email": "fotografia-drive@tu-proyecto.iam.gserviceaccount.com",
  ...
}
```

De ahí necesitás dos campos:

- `client_email` → variable de entorno `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → variable de entorno `GOOGLE_PRIVATE_KEY`

## 5. Compartir las carpetas de Drive con la Service Account

La Service Account **no tiene acceso a tu Drive personal por defecto**.
Tenés que compartir explícitamente cada carpeta de galería con ella, igual
que compartirías una carpeta con otra persona:

1. En [Google Drive](https://drive.google.com), creá (o abrí) la carpeta
   que contiene las fotos de un evento/cliente.
2. Clic derecho → **Share** (Compartir).
3. Pegá el **email de la Service Account** (el `client_email` del paso
   anterior, algo como
   `fotografia-drive@tu-proyecto.iam.gserviceaccount.com`).
4. Dale permiso de **Viewer** (Lector) — es suficiente, ya que la app solo
   lee y descarga archivos, nunca escribe en Drive.
5. Enviar / Compartir.

Repetí este paso para **cada carpeta de galería** que quieras publicar. Si
preferís no repetirlo cada vez, podés crear una carpeta raíz "Galerías
Clientes", compartirla una sola vez con la Service Account, y crear las
subcarpetas de cada evento adentro — los permisos se heredan.

### Obtener el ID de la carpeta

Abrí la carpeta en Drive y mirá la URL:

```
https://drive.google.com/drive/folders/1AbCDefGhIJkLmNoPQRstuVWxyz
                                        └──────────── ID ────────────┘
```

Ese fragmento (`1AbCDefGhIJkLmNoPQRstuVWxyz`) es el **ID de carpeta** que
vas a pegar en el panel admin al crear una galería.

## 6. Configurar las variables de entorno

En la raíz del proyecto, copiá `.env.example` a `.env` (si todavía no lo
hiciste) y completá:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL="fotografia-drive@tu-proyecto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"
```

**Importante sobre `GOOGLE_PRIVATE_KEY`:**

- Copiá el valor de `private_key` del JSON tal cual, incluyendo los `\n`
  literales (no reemplaces por saltos de línea reales) y las líneas
  `-----BEGIN PRIVATE KEY-----` / `-----END PRIVATE KEY-----`.
- Andá entre comillas dobles.
- El código (`src/lib/drive.ts`) ya se encarga de convertir los `\n`
  literales en saltos de línea reales al leer la variable.

En **producción** (Vercel, Railway, etc.), cargá estas mismas variables
desde el panel de variables de entorno del proveedor — no subas el archivo
`.env` al repositorio.

## 7. Probar la conexión

1. Iniciá el proyecto (`npm run dev`).
2. Entrá al panel admin (`/admin`) con la contraseña definida en
   `ADMIN_PASSWORD`.
3. Creá una nueva galería, pegando el **ID de carpeta** del paso 5 y una
   contraseña de acceso para el cliente.
4. Abrí el enlace público de la galería (`/galeria/<slug>`), ingresá la
   contraseña y verificá que las fotos de esa carpeta de Drive se muestren
   correctamente.

Si ves el error *"No se pudo conectar con Google Drive"*, revisá:

- Que `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY` estén bien
  copiados en `.env` (sin comillas de más, sin espacios extra).
- Que la carpeta esté efectivamente compartida con ese email como
  **Viewer**.
- Que el **ID de carpeta** guardado en la galería sea correcto.
- Que reiniciaste el servidor de desarrollo después de editar `.env`
  (Next.js sólo lee las variables de entorno al arrancar).

---

## Notas de seguridad

- La Service Account sólo necesita permiso de **lectura** (Viewer) — nunca
  le des rol de Editor/Owner sobre tus carpetas.
- El backend valida que cada foto solicitada (miniatura, imagen completa,
  descarga) pertenezca efectivamente a la carpeta de la galería
  correspondiente, para que una sesión de un cliente no pueda acceder a
  archivos de la galería de otro cliente aunque adivine un ID de archivo.
- Las miniaturas y las imágenes completas nunca se sirven con enlaces
  directos de Google — todo pasa proxeado por el backend, protegido por la
  sesión (cookie) del cliente autenticado.
