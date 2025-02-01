# Race The Rails

Race The Rails is a web application built with Next.js that allows users to race against the Washington DC Metro system. The application is hosted at [racetherails.com](https://racetherails.com).

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Analytics**: Vercel Analytics and Speed Insights
- **Language**: TypeScript
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/racetherails.git
   cd racetherails
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint for code linting

## Project Structure

```
racetherails/
├── app/                # Next.js 14 app directory (App Router)
├── public/            # Static files (images, etc.)
├── scripts/           # Utility scripts
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js  # PostCSS configuration
└── tsconfig.json     # TypeScript configuration
```

## Deployment

This project is deployed on Vercel. The production site is available at [racetherails.com](https://racetherails.com).

To deploy your own instance:

1. Push your code to a GitHub repository
2. Import your repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect it as a Next.js project and set up the build configuration
4. Your site will be deployed and you'll get a URL to access it

## Development

The project uses:

- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Next.js App Router for routing and server components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.
