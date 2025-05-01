# Swap POC Frontend

## Overview

A proof-of-concept frontend application demonstrating the Mach SDK swap functionality.

It uses the Mach SDK to connect to the Mach network and the Mach API to get the swap data.

There are two simpe API routes -

- /api/assets - get the list of assets supported by the Mach API
- /api/order - create an order to swap the tokens

This is a highly simplified Mach client. It is not production ready and is only meant to be used to demonstrate the simplicity of the Mach SDK.

It uses a private key configured on the NextJS backend to fill the swap. As such, it does not support connecting wallets in the browser and only supports a single user (the owner of the private key configured in the backend's environment).

## Prerequisites

- Node.js 18+
- npm or yarn

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fggarza5%2Fmach-next-first&env=PRIVATE_KEY&envDescription=Private%20key%20for%20swap%20wallet&project-name=mach-swapper&repository-name=my-mach-swapper&demo-title=Mach%20SDK%20Swap%20Widget)

## Getting Started

# Install dependencies

npm install

````

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
````

## Project Structure

```
src/
├── app/           # Route components
    ├── api/       # API Routes
├── components/    # Reusable UI components
├── config/        # Handles grabbing the private key from the environment to fill swaps on the backend
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── types/         # Types defined
└── utils/         # Helper functions
```
