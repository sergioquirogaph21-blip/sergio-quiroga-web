# Publicar el sitio en internet (y usarlo como app en el celular)

Ahora mismo el sitio sólo funciona en esta computadora (`localhost`). Para
que vos puedas abrir el panel de administración desde tu celular como si
fuera una app, y para que tus clientes puedan abrir el link de su galería
desde cualquier lado, hay que publicarlo en internet.

Recomiendo **Vercel** (gratis, hecho por los creadores de Next.js, la forma
más simple) + **Supabase** (base de datos Postgres gratis). Ninguna de las
dos cuestan nada para un sitio de este tamaño.

## 1. Crear la base de datos de producción (Supabase)

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta gratis.
2. Creá un nuevo proyecto (elegí una contraseña de base de datos segura y
   guardala).
3. Andá a **Project Settings → Database → Connection string** y copiá la
   que dice **URI** (modo "Transaction" o "Session", cualquiera sirve para
   empezar). Va a tener esta forma:
   ```
   postgresql://postgres.xxxxx:TU-PASSWORD@aws-0-xxxxx.pooler.supabase.com:5432/postgres
   ```
   Esa es tu `DATABASE_URL` de producción.

## 2. Preparar el código para Postgres

En [`prisma/schema.prisma`](prisma/schema.prisma), cambiá:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

por:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 3. Subir el código a GitHub

Si todavía no lo hiciste:

```bash
git init
git add .
git commit -m "Sitio Sergio Quiroga Fotografía"
```

Creá un repositorio en [github.com/new](https://github.com/new) (puede ser
privado) y subí el código siguiendo las instrucciones que te muestra
GitHub ahí mismo (`git remote add origin ...` y `git push`).

## 4. Desplegar en Vercel

1. Entrá a [vercel.com](https://vercel.com), creá una cuenta (podés
   entrar directo con tu cuenta de GitHub).
2. **Add New → Project**, elegí el repositorio que subiste.
3. En **Environment Variables**, cargá las mismas variables que tenés en tu
   `.env` local:

   | Variable | Valor |
   |---|---|
   | `DATABASE_URL` | la connection string de Supabase del paso 1 |
   | `ADMIN_PASSWORD` | una contraseña segura para el panel (no uses `admin123`) |
   | `SESSION_SECRET` | generá una nueva: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | el mismo que ya tenés |
   | `GOOGLE_PRIVATE_KEY` | la misma clave (pegala tal cual, con los `\n`) |
   | `NEXT_PUBLIC_SITE_URL` | la URL que te va a dar Vercel, ej. `https://sergioquiroga.vercel.app` |

4. En **Build Command**, poné:
   ```
   prisma migrate deploy && next build
   ```
   (esto crea las tablas en tu base de Supabase automáticamente en cada
   despliegue).
5. Hacé clic en **Deploy**. En un par de minutos tenés tu sitio online.

## 5. Llevar tus datos actuales a producción (una sola vez)

Tus fotos del portafolio, los precios/servicios y las galerías que ya
creaste están en tu base local. Para copiarlos a producción:

```bash
PROD_DATABASE_URL="postgresql://...tu connection string de Supabase..." npx tsx prisma/migrate-to-production.ts
```

Es seguro correrlo más de una vez — si ya hay datos en producción, no los
duplica.

## 6. Dominio propio (opcional)

Si querés algo como `www.sergioquirogafotografia.com` en vez del link de
Vercel: comprá el dominio donde prefieras (Namecheap, Google Domains, etc.)
y en Vercel andá a **Project → Settings → Domains** para conectarlo. Vercel
te da instrucciones exactas de qué configurar en tu proveedor de dominio.

## 7. Instalar el panel como app en tu celular

Una vez publicado (con HTTPS, que Vercel da automáticamente):

**Android (Chrome):**
1. Abrí `https://tu-sitio.vercel.app/admin` en Chrome.
2. Iniciá sesión.
3. Tocá el menú (⋮) → **"Instalar app"** o **"Agregar a pantalla de
   inicio"**.

**iPhone (Safari):**
1. Abrí el mismo link en Safari (tiene que ser Safari, no Chrome).
2. Tocá el ícono de compartir (□↑) → **"Agregar a pantalla de inicio"**.

Te va a quedar un ícono con tu logo que abre el panel a pantalla completa,
como una app nativa.

## El link para tus clientes

No necesita nada especial — es la URL de tu sitio publicado más
`/galeria/<slug-de-la-galería>`, por ejemplo:

```
https://tu-sitio.vercel.app/galeria/franco-vs-minga-xxxxx
```

Ese es el link que le compartís a cada cliente por WhatsApp o email; lo ves
en `/admin` con el botón de copiar (ícono de las dos hojitas) al lado de
cada galería.
