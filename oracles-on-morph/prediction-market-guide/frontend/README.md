# Frontend for Morph Holesky Starter Kit

This directory contains the frontend application for the Morph Holesky Starter Kit. It's built with Next.js and includes integration with Web3 libraries for interacting with the Morph Holesky network.

## Getting Started

1. Install dependencies:

   ```
   yarn install
   ```

2. Run the development server:

   ```
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `pages/`: Contains the main pages of the application
- `components/`: Reusable React components
- `styles/`: CSS and styling files
- `utils/`: Utility functions and helpers

## Connecting to Morph Holesky

The application is pre-configured to connect to the Morph Holesky network. Ensure you have a Web3-enabled browser or wallet extension installed to interact with the dApp.

## Customizing the Frontend

Feel free to modify the components and pages to suit your specific dApp requirements. The current setup provides a basic structure that you can build upon.

## Building for Production

To create a production build:

```
yarn build
```

Then, to start the production server:

```
yarn start
```

## Learn More

To learn more about the technologies used in this frontend:

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Morph Holesky Documentation](https://docs.morphl2.io/)
