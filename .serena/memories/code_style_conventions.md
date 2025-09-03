# Code Style & Conventions

## TypeScript Standards
- **Strict mode enabled** in tsconfig.json
- **No explicit any types** - use proper typing
- **Interface over type** for object definitions
- **Enum usage** for predefined constants (UserRole, ComicStatus, etc.)
- **Path aliases**: Use `@/` for src imports

## React/Next.js Patterns
- **Server Components by default** - use "use client" only when needed
- **App Router conventions** - file-based routing in `/app` directory
- **Async Server Components** - await data directly in components
- **Route Handlers** - API endpoints in `/api` directories
- **Middleware-first auth** - server-side session validation

## Component Conventions
- **PascalCase** for component names and files
- **Functional components** with TypeScript
- **Props interfaces** defined inline or separate
- **Export default** for main components
- **Named exports** for utilities and hooks

## Database Patterns
- **Prisma ORM** with strict schema validation
- **Transaction wrapping** for atomic operations
- **Soft deletes** where appropriate (cascade on relationships)
- **Indexed fields** for performance (userId, createdAt)
- **Snake_case** for database table names, camelCase for fields

## API Design
- **RESTful conventions** for route structure
- **Zod validation** for all inputs
- **Consistent error responses** with proper HTTP status codes
- **Session-based auth** with NextAuth integration
- **Server-side authorization** checks in all protected routes

## Security Practices
- **Server-side validation** for all security-critical operations
- **Role-based access control** enforced at API level
- **Input sanitization** with Zod schemas
- **Wallet signature verification** for Web3 operations
- **Rate limiting** implementation ready (Upstash Redis)

## File Naming
- **kebab-case** for route files and API endpoints
- **PascalCase** for React component files
- **camelCase** for utility files and functions
- **UPPER_CASE** for environment variables and constants

## Import Organization
1. React/Next.js imports
2. Third-party library imports
3. Internal component imports (UI, then feature components)
4. Utility and type imports
5. Relative imports

## Error Handling
- **Try-catch blocks** in all async operations
- **Consistent error logging** with context
- **User-friendly error messages** in UI
- **HTTP status codes** matching error types
- **Graceful degradation** for Web3 features