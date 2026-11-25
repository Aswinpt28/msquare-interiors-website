# M² Interiors — International Editorial Website

A premium, image-led interior design studio website built with Next.js 15, React 19 and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Included

- Home, Projects, Services and Contact pages
- Responsive navigation and project category filters
- Editorial, full-bleed homepage hero and large-format typography
- Original M² Interiors logo, supplied project photography and two supplied videos
- Local media assets in `public/images` and `public/videos`

Business contact details and the live enquiry delivery integration should be added before launch.


## Hero video quality update
The second uploaded film is used as the homepage hero background in its original Full HD 1920x1080 H.264 source quality. The hero video CSS no longer applies a brightness/saturation filter, and the overlay has been reduced to preserve image detail.


## Latest website update
- The second uploaded film remains the homepage hero background.
- The second film has been removed from the fourth (film showcase) section.
- The fourth section now showcases only the first uploaded film.
- The full portfolio gallery and category filters are on the homepage.
- The separate `/projects` page has been removed; navigation now points to the homepage portfolio section.
- Shared styling has been refined across the homepage, services page, contact page, navigation and footer.


## Studio admin panel

The project includes a private admin panel at `/admin`.

### Features
- Password-protected studio login using `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- Upload portfolio photos and studio videos to Cloudinary.
- Browse uploaded media in the admin media library.
- Add furniture product photos with title, description, category and optional price.
- Furniture products uploaded with the Furniture Product type appear on `/furniture`.
- Furniture page shows a considered coming-soon message until products are uploaded.
- The old Projects section and standalone Projects page are removed from the public navigation/homepage.
- Footer includes the M² light logo and the supplied business address.

### Required environment variables
Copy `.env.example` to `.env.local` for local development, or add the same variables in your hosting provider's environment settings:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` — use a unique random secret, at least 64 characters
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Create a Cloudinary account at https://cloudinary.com/ and copy the cloud name, API key and API secret from the Cloudinary dashboard. Never expose the API secret in client-side code or commit `.env.local`.

### Run locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000/admin` to sign in.

### Deploy
Add all five environment variables to the deployment environment (for example, Vercel → Project → Settings → Environment Variables), then redeploy. The admin upload endpoints use Cloudinary for persistent media storage; they do not write to the server filesystem.

### Furniture sales phase
The furniture catalogue is prepared as a product showcase, not a checkout system. It currently supports product photography, description, category and optional displayed price. Payment, inventory, shipping and order management should be added when the company decides to launch online sales.
