# Open Source Next ERP

This is an opensource ERP project that designed to leverage the latest technologies using :

- [NextJS](https://nextjs.org/) App Router, with TypeScript.
- [DrizzleORM](https://orm.drizzle.team/) and PostgresQL.
- [ShadCN](https://ui.shadcn.com/) component library.
- [Auth.js](https://authjs.dev/) for the authentication.

This project is for educational purposes, you are free to contribute or fork to make your own version.

## Getting Started

You will need a PostgresQL server, and Github OAuth Application for AuthJS.

Clone the Repository and install dependencies:

```bash
git clone https://github.com/ceedadev/next-erp.git
npm install
```

Prepare environment variable

```bash
cp .env.example .env
```

and copy your postgres connection url to .env file

Perform DB Push

```bash
npm run db:push
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

We welcome contributions from the community! If you'd like to contribute, please make a branch and pull request when you are done.

## Feature Todo List

- [ ] Product Page
  - [x] List All Product
  - [x] Add Product
  - [ ] Edit Product
- [ ] Customer Page
  - [ ] List All Customer
  - [ ] Add Customer
  - [ ] Edit Customer
- [ ] Invoice Page
  - [x] List All Invoice
  - [x] Add Invoice
  - [ ] Edit Invoice
  - [ ] Payment details in invoice

and more...
