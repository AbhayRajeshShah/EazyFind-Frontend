# EAZYFIND - Restaurant Finder Application

<i>This repo is scoped to the <b>frontend</b> of EAZYFIND.</i>

The Backend implementation for this project can be found [here](https://github.com/AbhayRajeshShah/EazyFind-Backend).

Eazyfind is a restaurant finder application built with Next.js and TypeScript. It allows users to search for restaurants, apply various filters, and view restaurant details.

## Technologies Used

- Next.js
- TypeScript
- Ant Design
- TailwindCSS

## Core Features:

- Smart search: Find restaurants using multiple filters.
- Nearby restaurants: Get recommendations based on your current location.
- Paginated listings: Load restaurants incrementally for faster performance.
- Debounced filters: Filters update smoothly without unnecessary API calls.
- URL-synced filters: Share filtered views or bookmark them for later.
- Server-side rendering: Fast initial load and SEO-friendly content.

## Prerequisites

- `Node.js >= 18.x`
- `npm >= 9.x`

## Getting Started

First, install the necessary dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Refer to the [.env.example](.env.example) file for environment variable configurations.

## End to End Tests

To run the end-to-end tests written in Playwright, use the following command:

```bash
 npm run test:e2e
```
