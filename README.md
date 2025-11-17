# TheWeekendWorld Website

A modern, professional Next.js website showcasing products, blog posts, and resources. Built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## Features

- **Public Pages**: Homepage, Products listing/detail, Blog listing/detail, Contact page
- **Admin Panel**: Protected admin interface for managing content
- **Product Management**: Create, edit, and manage products with features, testimonials, and media
- **Blog Management**: Write and publish blog posts with markdown support
- **GitHub Integration**: Real-time GitHub star counts for repositories
- **SEO Optimized**: Sitemap, robots.txt, and proper metadata
- **Modern UI**: Professional design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown with remark-gfm

## Getting Started

### Prerequisites

- Bun (latest version)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd theweekendworld
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/theweekendworld
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
GITHUB_TOKEN=your_github_token (optional)
```

4. Set up the database:
```bash
# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate
```

5. Create an admin user:
```bash
bun run create-admin
```

6. Start the development server:
```bash
bun run dev
```

Visit `http://localhost:3000` to see the website.

## Project Structure

```
theweekendworld/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Products pages
│   │   ├── blog/          # Blog pages
│   │   └── contact/       # Contact page
│   ├── admin/             # Admin panel (protected)
│   │   ├── login/         # Admin login
│   │   ├── products/      # Product management
│   │   ├── blog/          # Blog management
│   │   └── settings/      # Site settings
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── products/      # Products API
│   │   ├── blog/          # Blog API
│   │   ├── contact/       # Contact API
│   │   └── github/        # GitHub API proxy
│   ├── sitemap.ts         # Sitemap generation
│   └── robots.ts          # Robots.txt
├── components/
│   ├── layout/            # Header, Footer
│   ├── product/           # Product components
│   ├── blog/              # Blog components
│   └── providers/         # React providers
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # NextAuth config
│   ├── github.ts          # GitHub API client
│   └── utils.ts           # Utilities
├── prisma/
│   └── schema.prisma      # Database schema
└── scripts/
    └── create-admin.ts    # Admin user creation script
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Prisma Studio
- `bun run create-admin` - Create admin user

## Admin Panel

Access the admin panel at `/admin`. You'll be redirected to `/admin/login` if not authenticated.

The admin panel allows you to:
- Manage products (create, edit, delete)
- Manage blog posts
- Configure site settings
- View contact submissions

## Database Schema

The application uses the following main models:
- **Product**: Products with features, testimonials, and media
- **BlogPost**: Blog articles with markdown content
- **Testimonial**: Product testimonials
- **ContactSubmission**: Contact form submissions
- **SiteSetting**: Site configuration
- **AdminUser**: Admin authentication

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Make sure to set:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app` or `https://yourdomain.com`)
- `GITHUB_TOKEN` (optional) - For GitHub API integration
- `NEXT_PUBLIC_BASE_URL` (optional) - Only needed if using fetch in client components

**Note:** With `trustHost: true` in NextAuth config, Vercel can auto-detect the URL, but it's recommended to set `NEXTAUTH_URL` explicitly for production.

## Environment Variables

See `env.example` for all required environment variables.

## License

MIT
