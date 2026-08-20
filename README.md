# Sergio Quiroga Fotografía

Plataforma web para el fotógrafo profesional Sergio Quiroga: sitio público
con portafolio y contacto, portal privado de entrega de galerías para
clientes (integrado con Google Drive) y panel de administración.

## Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Estilos**: Tailwind CSS v4, Framer Motion, Lucide Icons
- **Backend**: Route Handlers de Next.js + [`googleapis`](https://www.npmjs.com/package/googleapis)
- **Base de datos**: SQLite + Prisma ORM (fácilmente migrable a
  Postgres/Supabase, ver más abajo)
- **Autenticación**: cookies httpOnly firmadas con JWT (`jose`) — sesión de
  admin y sesión por galería de cliente

## Estructura del proyecto

```
src/
  app/
    (site)/              → sitio público: /, /portfolio, /sobre-mi, /contacto
    galeria/              → portal de clientes: /galeria, /galeria/[slug]
    admin/                 → panel admin: /admin, /admin/galerias/*, /admin/mensajes
    api/
      contact/             → guarda mensajes del formulario de contacto
      admin/                → login/logout y CRUD de galerías (protegido)
      galeria/[slug]/       → auth, listado de fotos, favoritos, miniaturas,
                               imagen completa y descarga .zip (protegido)
  components/
    site/                  → Navbar, Hero, PortfolioGrid, Lightbox, etc.
    gallery/               → PasswordGate, PhotoGrid, Slideshow, etc.
    admin/                 → AdminShell, GalleryForm, GalleryList, etc.
  lib/
    prisma.ts              → cliente de Prisma
    drive.ts               → integración con Google Drive API v3
    auth.ts / auth-guard.ts → sesiones y verificación de contraseñas
prisma/
  schema.prisma            → modelos Gallery, Favorite, ContactMessage
```

## Puesta en marcha

```bash
npm install
cp .env.example .env      # completar las variables (ver abajo)
npx prisma migrate dev    # crea la base SQLite local
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Ver [`.env.example`](./.env.example). Resumen:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión de Prisma. `file:./dev.db` en desarrollo. |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin`. |
| `SESSION_SECRET` | Secreto para firmar las cookies de sesión. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` | Credenciales de la Service Account de Google Drive. Ver [`GOOGLE_DRIVE_SETUP.md`](./GOOGLE_DRIVE_SETUP.md). |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio. |

### Integración con Google Drive

La guía paso a paso para crear el proyecto en Google Cloud, la Service
Account y compartir las carpetas de cada galería está en
[`GOOGLE_DRIVE_SETUP.md`](./GOOGLE_DRIVE_SETUP.md).

## Cómo funciona el portal de clientes

1. Desde `/admin`, el fotógrafo crea una galería: título, cliente, tipo de
   evento, fecha, **ID de carpeta de Google Drive** y contraseña de acceso.
2. Se genera un enlace único: `/galeria/<slug>`, que se comparte con el
   cliente (por email, WhatsApp, etc.).
3. El cliente abre el enlace, ingresa la contraseña y accede a una
   cuadrícula responsiva con lazy loading de todas las imágenes de esa
   carpeta de Drive (las miniaturas y las imágenes completas se sirven
   proxeadas por el backend, nunca con enlaces directos de Google).
4. Puede marcar fotos como **favoritas**, descargarlas individualmente,
   descargar la **galería completa en .zip**, o abrir una **vista de
   diapositivas** a pantalla completa con reproducción automática.
5. El fotógrafo ve en `/admin/galerias/<id>` la lista de fotos favoritas
   que marcó el cliente.

## Galerías organizadas por secciones (subcarpetas)

La carpeta de Drive de una galería puede tener subcarpetas anidadas — por
ejemplo, para una cobertura deportiva:

```
Pte Franco vs Hernandarias/      ← ID que se carga en /admin
├── Equipo A/
│   ├── Sub-15/
│   └── Sub-17/
└── Equipo B/
    ├── Sub-15/
    └── Sub-17/
```

El cliente ve automáticamente un explorador con breadcrumbs ("Inicio ›
Equipo A › Sub-15") y tarjetas para entrar a cada subcarpeta, sin que haya
que configurar nada extra — sólo compartir la carpeta raíz con la Service
Account, igual que siempre. Cada subcarpeta puede a su vez tener más
subcarpetas (sin límite práctico de niveles).

- Ver fotos y marcar favoritas funciona en cualquier nivel.
- El botón de descarga cambia según dónde estés parado: en la raíz descarga
  **toda la galería**; dentro de una sección descarga **sólo esa sección**
  (manteniendo la estructura de carpetas dentro del .zip).
- Si la carpeta no tiene subcarpetas, todo se ve exactamente igual que
  antes — no hay ningún paso adicional para las galerías simples.

## Comprobante de pago (habilitar descargas)

Al crear o editar una galería, el checkbox **"Requiere confirmar el pago
antes de habilitar las descargas"** activa este flujo:

1. La galería nace con las descargas bloqueadas (el cliente puede ver todas
   las fotos y marcar favoritas, pero los botones de descarga aparecen con
   un candado).
2. El cliente sube su comprobante de transferencia (JPG, PNG, WEBP o PDF,
   máx. 8MB) directamente desde su galería.
3. El fotógrafo lo revisa en `/admin/galerias/<id>` (miniatura o enlace al
   archivo completo) y hace clic en **"Aprobar pago y habilitar
   descargas"**.
4. A partir de ahí, la descarga individual y el .zip completo quedan
   habilitados para ese cliente. El admin puede volver a bloquearlas en
   cualquier momento.

El bloqueo se aplica también del lado del servidor (no sólo ocultando
botones), y el fotógrafo siempre puede descargar desde el panel admin sin
esta restricción. El comprobante se guarda como bytes directamente en la
base de datos (no en el disco del servidor), para que funcione en hosting
serverless como Vercel.

## Portafolio y servicios editables desde el panel

`/admin/portfolio` y `/admin/servicios` permiten actualizar el sitio
público sin tocar código:

- **Portafolio**: subir fotos nuevas (con su categoría y descripción),
  eliminar las existentes. Las categorías son libres — escribís el nombre
  y si ya existe una igual, se agrupa ahí; si no, se crea una nueva.
- **Servicios y precios**: agregar/editar/eliminar categorías (ej. Bodas,
  15 Años) y sus combos (nombre, precio, descripción, características,
  marcar como "Más elegido"). Los cambios se guardan con un botón
  "Guardar cambios" al final de la página.

Ambos se guardan en la base de datos y los cambios se reflejan al instante
en el sitio público (`/`, `/portfolio`, `/sobre-mi`) — no hace falta
volver a desplegar.

## Publicar el sitio (producción)

El proyecto usa SQLite en desarrollo por simplicidad. La guía completa para
publicarlo en internet (Vercel + Postgres/Supabase), llevar tus datos
actuales a producción, y usar el panel como app instalada en el celular
está en [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # servidor de producción
npm run lint     # linting
npx prisma studio  # explorar la base de datos con una UI
```
