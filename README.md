# Security Hub

Security Hub is an application that integrates Convex and Clerk to provide a secure platform for managing no-go areas on a map. This project was inspired by the [Web Dev Challenge Hackathon: Monsters!](https://www.learnwithjason.dev/blog/web-dev-challenge-hackathon-monsters/) and was built within a 4-hour timeframe.

## Challenge Details

This project was created as part of a 4-hour coding challenge with the following rules:

1. 30 minutes for planning
2. 4 hours for building
3. Use of Convex and/or Clerk (both used in this project)
4. Public GitHub repository
5. Deployed to a public URL (to follow)

The theme of the challenge was to build an app that helps out in a world where monsters have arrived. Security Hub interprets this as a tool to mark and manage "no-go zones" where monster activity has been reported.

## Features

- User authentication with Clerk
- Interactive no-go area map
- Ability to add no-go zones
- Real-time data synchronization with Convex

## Getting Started

### Prerequisites

- Node.js
- pnpm
- Clerk Account, create a project
- Convex Account, create a project

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/additionaddict/monsters-have-arrived.git
   cd monsters-have-arrived
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Clerk and Convex credentials:

   ```sh
    CONVEX_DEPLOYMENT=dev:XXXXX
    CONVEX_URL=https://XXXX.convex.cloud
    CLERK_SIGN_IN_URL=/sign-in
    CLERK_SIGN_UP_URL=/sign-up
    CLERK_SIGN_IN_FALLBACK_URL=/
    CLERK_SIGN_UP_FALLBACK_URL=/
    # follow steps 3, 4, 5 and 7 https://docs.convex.dev/auth/clerk
    CLERK_PUBLISHABLE_KEY=pk_test_XXXXX
    CLERK_SECRET_KEY=sk_test_XXXXX
   ```

## Development

Run the development server:

- `npx convex dev` - to run the Convex development server
- `pnpm dev` - to run the Remix app development server
