# Developer README - Nexus NFT Design Studio

This document provides an overview of the project structure and key components for developers working on the Nexus NFT Design Studio application.

## Project Overview

Nexus is a decentralized NFT design studio that allows users to create, customize, and mint unique NFTs on the NEAR blockchain.

## Project Structure

The project is structured as follows:

- `src/`
  - `app/`: Contains the main layout file
  - `components/`: React components
  - `utils/`: Utility functions and classes

## Key Components

### 1. NEAR Wallet Integration (`src/utils/near-wallet.ts`)

This file contains the implementation for interacting with the NEAR blockchain. It handles wallet connection, signing transactions, and other NEAR-related operations, including NFT minting.

### 2. Modal System (`src/components/Modal.tsx`)

The `Modal` component is a reusable modal dialog that can be used throughout the application for various purposes, such as displaying NFT previews or confirmation dialogs.

### 3. Save Modal (`src/components/SaveModal.tsx`)

This component extends the basic Modal functionality to provide a specific interface for saving NFT designs or minting NFTs.

### 4. Main Layout (`src/app/layout.tsx`)

The main layout component that wraps the entire application and provides the overall structure, including SEO metadata.

### 5. Landing Page (`src/components/landing-page.tsx`)

The landing page component, which introduces users to the Nexus NFT Design Studio and its features.

### 6. Top Menu Bar (`src/components/TopMenuBar.tsx`)

This component represents the top navigation or menu bar of the application, providing access to different sections of the NFT design studio.

### 7. Toolbar (`src/components/ToolBar.tsx`)

The Toolbar component provides NFT design tools and quick access to various features within the application.

## Development Guidelines

1. **Component Structure**: Keep components modular and focused on a single responsibility within the NFT design process.
2. **State Management**: Use React hooks for local state and consider a global state management solution for more complex state requirements, such as managing the NFT design state.
3. **NEAR Integration**: All NEAR blockchain interactions, including NFT minting, should go through the `near-wallet.ts` utility to maintain consistency.
4. **Styling**: Uses Tailwind CSS and some shadcn/ui components for a consistent and responsive design.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Run the development server: `npm run dev` or `yarn dev`
4. Open `http://localhost:3000` in your browser

## Additional Resources

- [NEAR Documentation](https://docs.near.org/)
- [NEAR NFT Standards](https://nomicon.io/Standards/NonFungibleToken/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

For any questions or issues, please contact [Zephyr](https://twitter.com/zephyrdev_).
