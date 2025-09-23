# Open Source Next ERP

A modern, full-featured Enterprise Resource Planning (ERP) system built with the latest web technologies. This open-source project provides a comprehensive solution for managing customers, products, invoices, and business operations.

## 🚀 Technology Stack

- **[Next.js 14](https://nextjs.org/)** - App Router with TypeScript for full-stack development
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database operations with PostgreSQL
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication with email/password support
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful and accessible UI components
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

## ✨ Features

### Authentication & Authorization
- ✅ Email/password authentication
- ✅ Secure session management
- ✅ Protected routes and layouts
- ✅ User onboarding flow

### Company Management
- ✅ Company registration and setup
- ✅ Multi-tenant architecture ready
- ✅ Company profile management

### Customer Management
- ✅ Complete customer CRUD operations
- ✅ Customer search and filtering
- ✅ Address management

### Product Management
- ✅ Product catalog with categories
- ✅ SKU and inventory tracking
- ✅ Product search and filtering

### Invoice Management
- ✅ Invoice creation and management
- ✅ Multiple invoice statuses (paid, unpaid, overdue)
- ✅ Invoice line items with products
- ✅ PDF generation ready

### Dashboard & Analytics
- ✅ Real-time business metrics
- ✅ Revenue and customer analytics
- ✅ Recent activity tracking

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ceedadev/next-erp.git
cd next-erp
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Add your PostgreSQL connection URL to the `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/next_erp"
```

3. **Initialize the database**
```bash
npm run db:push
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

## 🎯 User Journey

### New Users
1. Visit the homepage → Click "Get Started"
2. Create account with email/password → Sign up
3. Complete company registration → Provide business details
4. Access dashboard → Start managing your business

### Existing Users
1. Visit the homepage → Click "Sign In"
2. Enter credentials → Access dashboard immediately

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   │   ├── signin/        # Sign in page
│   │   ├── signup/        # Sign up page
│   │   └── register-company/ # Company registration
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── customers/     # Customer management
│   │   ├── products/      # Product management
│   │   ├── invoices/      # Invoice management
│   │   └── company/       # Company settings
│   └── _actions/          # Server actions
├── components/            # Reusable UI components
│   ├── forms/            # Form components
│   └── ui/               # shadcn/ui components
├── db/                   # Database configuration
│   └── schema.ts         # Drizzle schema definitions
└── lib/                  # Utility functions
    ├── auth.ts           # Better Auth configuration
    ├── auth-client.ts    # Client-side auth functions
    └── validations/      # Zod schemas
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style and patterns
4. **Test your changes**: Ensure all features work as expected
5. **Commit your changes**: `git commit -m 'Add some amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes and their benefits

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Implement proper error handling
- Add proper validation with Zod schemas
- Write clean, self-documenting code

## 📝 License

This project is open source and available under the MIT License. Feel free to fork, modify, and use it for your own purposes.

## 🌟 Support

If you find this project helpful, please consider giving it a star on GitHub! Your support helps us continue improving the project.

---

Built with ❤️ by the open source community
