# EduManage — Student Management System

A beginner-friendly full-stack CodSoft internship project built with Next.js (React), Node.js route handlers, Prisma ORM, and a SQLite database.

## Features
- Create, view, edit, and delete student records
- Search by student name, email, or course
- Record course, year, attendance, and marks
- Dashboard statistics for student count, average attendance, and average marks
- Input validation and duplicate-email handling
- Local SQLite database

## Requirements
Install Node.js 20.9 or newer and VS Code. Verify installation in a terminal:

```bash
node -v
npm -v
```

## Run the project
Open the project folder in VS Code. In Terminal > New Terminal, run each command separately:

```bash
npm install
```

Then create the database and Prisma client:

```bash
npx prisma generate
npx prisma db push
```

Start the website:

```bash
npm run dev
```

Open this address in your browser:

http://localhost:3000

Keep the terminal running while using the site. Stop the server with Ctrl+C.

## Folder guide
- `app/page.tsx` — main dashboard and student form
- `app/globals.css` — visual design and responsive layout
- `app/api/students/route.ts` — list and create student records
- `app/api/students/[id]/route.ts` — update and delete a record
- `prisma/schema.prisma` — database structure
- `lib/prisma.ts` — shared Prisma database client
- `.env` — local SQLite database connection

## Test checklist
1. Add a student with a unique email.
2. Search for that student.
3. Edit the student's course, attendance, or marks.
4. Delete the student after confirming.
5. Try adding the same email twice; the app should show an error.
6. Refresh the page and confirm saved students remain in the database.

## Suggested GitHub repository description
EduManage is a student management web application built with Next.js, Node.js, Prisma, and SQLite. It supports student record management, attendance and marks tracking, search, and dashboard statistics.

## Notes
- The `.env` file uses `DATABASE_URL="file:./dev.db"` for local development.
- This starter project is intended for a learning/demo environment. Before public production use, add authentication, authorization, rate limiting, secure deployment environment variables, and appropriate privacy protections. Do not store real student personal data in a public demo.
- If a dependency version is no longer available from your registry, use a compatible stable version of Next.js 15, React 19, and Prisma 6.
