# Lab 02 - AI Web3 Project

This project is a full-stack Web3 application developed for the HK IIT Web3 Lab 02. It includes a Next.js frontend, a Node.js/TypeScript backend, and an Ethereum smart contract managed with Hardhat.

## Project Structure

The project is organized into three main directories:

-   `frontend/`: Contains the Next.js user interface.
-   `backend/`: Contains the Node.js/TypeScript API server.
-   `smartcontract/`: Contains the Solidity smart contract and Hardhat development environment.

## Getting Started

Below are the instructions to set up and run each part of the project.

### 1. Frontend (Next.js)

The frontend is built with Next.js.

**Setup:**

Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
# or
# yarn install
# or
# pnpm install
```

**Running the Development Server:**

```bash
npm run dev
# or
# yarn dev
# or
# pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 2. Backend (Node.js/TypeScript)

The backend is a Node.js server written in TypeScript.

**Setup:**

Navigate to the `backend` directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

**Running the Development Server:**

(Assuming your `package.json` has a `dev` or `start` script for the backend, e.g., using `ts-node-dev` or `nodemon`)
```bash
npm run dev # or npm start, adjust based on your backend's package.json
```
The backend server will typically start on a port like `8000` or `3001`. Check your backend server configuration for the exact port.

### 3. Smart Contract (Hardhat/Solidity)

The smart contract is developed using Solidity and Hardhat.

**Setup:**

Navigate to the `smartcontract` directory:
```bash
cd smartcontract
```

Install dependencies:
```bash
npm install
```

**Compile the Smart Contract:**

```bash
npx hardhat compile
```

**Run Tests (Optional but Recommended):**

```bash
npx hardhat test
```

**Deploy the Smart Contract:**

(This usually requires a script in your `scripts/` directory, e.g., `deploy.ts`)
```bash
npx hardhat run scripts/deploy.ts --network <your_network_name>
```
Replace `<your_network_name>` with the target network (e.g., `localhost`, `sepolia`). Ensure your `hardhat.config.ts` is configured for the desired network.

## Technologies Used

-   **Frontend:** Next.js, React, TypeScript
-   **Backend:** Node.js, Express.js (or similar), TypeScript
-   **Smart Contract:** Solidity, Hardhat, Ethers.js
-   **Version Control:** Git, GitHub

---

Feel free to customize this README further with more specific details about your project's functionality, API endpoints, contract interactions, or deployment instructions.
