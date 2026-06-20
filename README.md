# WestSide Barbershop

A modern barber shop booking application built with Vite, React, Clerk authentication, and Supabase database.

## Features

- Online booking system
- Service selection and barber selection
- User authentication with Clerk
- Admin dashboard for managing bookings, services, and users
- Responsive design with mobile-first approach
- Hungarian language support

## Prerequisites

- Node.js 18+ and npm
- Clerk account (https://clerk.com/)
- Supabase account (https://supabase.com/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/barbershop.git
cd barbershop
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
Edit `.env` and fill in the required values:

### Clerk Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the Publishable Key and Secret Key
4. Add them to your `.env` file:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
```

### Supabase Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Project Settings > API
4. Copy the following values:
   - Project URL
   - anon public key
   - service_role key
5. Add them to your `.env` file:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres
```

### Default Admin User
Set up the default admin user in your `.env` file:
```
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD=your_strong_password
DEFAULT_ADMIN_NAME=Admin Name
```

## Database Setup

The project uses Prisma ORM with Supabase PostgreSQL. To set up the database:

1. Generate Prisma client:
```bash
npm run prisma:generate
```

2. Run migrations:
```bash
npm run prisma:migrate
```

3. Seed the database (optional):
```bash
npm run prisma:seed
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is deployment-agnostic and can be deployed to any static hosting platform.

### Supported Platforms
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting platform

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to your chosen hosting platform
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in your hosting platform's dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `DEFAULT_ADMIN_EMAIL`
   - `DEFAULT_ADMIN_PASSWORD`
   - `DEFAULT_ADMIN_NAME`
5. Deploy automatically on push

### Platform-Specific Notes

**Netlify:**
- Add SPA redirect rule: `/*` to `/index.html` with 200 status
- Configure environment variables in Site Settings > Environment Variables

**Vercel:**
- Add `rewrites` in `vercel.json` if needed for SPA routing
- Configure environment variables in Project Settings > Environment Variables

**Cloudflare Pages:**
- Add single-page application routing in build settings
- Configure environment variables in Pages Settings > Environment variables

## Security Notes

- Never commit `.env` files or any secrets to GitHub
- Use environment variables for all sensitive data
- Keep Clerk Secret Key and Supabase Service Role Key secure
- Use strong passwords for admin accounts
- Enable 2FA on Clerk and Supabase accounts
- Only `.env.example` should be committed to GitHub

## Project Structure

```
barbershop/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and contexts
│   ├── services/       # API services
│   └── main.jsx        # Application entry point
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Routing**: React Router DOM
- **UI Components**: Custom components with shadcn/ui patterns

## License

This project is private and proprietary.

## Support

For support, contact admin@westsidebarbershop.hu
