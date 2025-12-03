# Syllabus Tracker

A modern, efficient application to track your exam syllabi and study progress.

## Features

-   **Subject Management**: Create and manage multiple subjects.
-   **Smart Syllabus Parsing**: Paste your syllabus text, and the app automatically detects topics and structure.
-   **Progress Tracking**: Mark topics as completed and visualize your progress with dynamic progress bars.
-   **Resource Linking**: Add links to study resources for each topic.
-   **Responsive Design**: Beautiful, glassmorphism-inspired UI that works on all devices.
-   **Dark/Light Mode**: (Coming soon/Integrated)

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **UI Components**: Custom components with Lucide React icons

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anujkdotexe/syllabus-tracker.git
    cd syllabus-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    -   Ensure you have PostgreSQL running.
    -   Create a `.env` file based on `.env.example` (or set `DATABASE_URL`).
    -   Run migrations:
        ```bash
        npx prisma migrate dev
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
