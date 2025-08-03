# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.5 application using React 19, TypeScript, and Tailwind CSS v4. The project uses the Next.js App Router architecture.

## Commands

### Development
```bash
npm run dev      # Start development server with Turbopack
```

### Build & Production
```bash
npm run build    # Build the application for production
npm run start    # Start the production server
```

### Code Quality
```bash
npm run lint     # Run ESLint
```

## Architecture

### Technology Stack
- **Framework**: Next.js 15.4.5 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Font**: Geist font family (Sans and Mono variants)
- **Linting**: ESLint 9 with Next.js configuration

### Project Structure
- `/src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind directives
- `/public/` - Static assets (SVG icons)
- TypeScript configuration uses strict mode with path alias `@/*` mapping to `./src/*`

### Key Configuration
- **TypeScript**: Strict mode enabled, using bundler module resolution
- **ESLint**: Configured with Next.js core-web-vitals and TypeScript rules
- **Tailwind CSS**: Version 4 with PostCSS plugin architecture