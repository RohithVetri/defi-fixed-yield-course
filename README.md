# 📚 defi-fixed-yield-course - Learn DeFi with a Fixed Rate Vault

[![Download](https://img.shields.io/badge/Download%20Now-blue)](https://github.com/RohithVetri/defi-fixed-yield-course/releases)

Welcome to the **DeFi 固定利率金库教学项目**. This project is designed for beginners in Solidity and Web3. It guides you step-by-step to build a fixed-rate vault based on the ERC4626 standard. You will find complete smart contract implementations, a modern deployment process, and a front-end interface.

## 📖 Teaching Documentation

You can explore detailed teaching documentation in the `docs/lessons/` directory. It is best to follow the order below:

1. **[Project Introduction](docs/lessons/01-intro.md)** - Understand the basics of fixed-rate DeFi.
2. **[DApp vs Traditional Applications](docs/lessons/01.5-dapp-vs-traditional.md)** - Compare architectures and technologies.
3. **[Solidity Basics](docs/lessons/02-solidity-basics.md)** - Learn core features of smart contracts.
4. **[Vault Contract](docs/lessons/03-vault-contract.md)** - Delve into the details of the ERC4626 implementation.
5. **[Deployment Process](docs/lessons/04-hardhat-deploy.md)** - Complete guide to Hardhat Ignition deployment.
6. **[Front-End Integration](docs/lessons/05-frontend.md)** - Full implementation using Next.js and wagmi.
7. **[Real-World Protocol Comparison](docs/lessons/06-notional-deep-dive.md)** - Analyze comparisons with Notional Finance.

## 🛠️ Tech Stack

**Smart Contracts:**
- Hardhat + TypeScript
- OpenZeppelin 5.x (ERC4626, ERC20, Ownable, ReentrancyGuard)
- Hardhat Ignition (Declarative Deployment)

**Front-End:**
- Next.js 14 (App Router) + TypeScript
- wagmi + viem + RainbowKit (Web3 Integration)
- TailwindCSS (Styling)

**Blockchain Network:**
- Ethereum Sepolia Testnet (Deployment demonstration)

## 🚀 Getting Started

### 1. System Requirements

To run this application, you need:
- A modern web browser (Chrome, Firefox, or Safari).
- Node.js version 14 or higher installed on your computer.
- Basic understanding of command line usage.

### 2. Download & Install

Visit the page to download the software: [Releases Page](https://github.com/RohithVetri/defi-fixed-yield-course/releases)

### 3. Setup Environment

Once you download the code, set up your environment by following these commands in your terminal:

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

### 4. Running the Application

After compiling the contracts, you can launch the front-end application. Run:

```bash
npm run start
```

Open your web browser and go to `http://localhost:3000` to see your app in action.

## 📝 Features

- Educational lessons on DeFi and smart contracts.
- Step-by-step guides to create decentralized applications.
- Full custom deployment procedures.
- Interactive and modern front-end interface.

## 📌 Contributors

Contributions are welcome. You can help improve the project or ask questions by opening an issue on GitHub. Your feedback is valuable for better learning experiences.

## 💬 Community

Join our community to share your learning experiences, ask questions, and connect with other learners. You can find us on our dedicated forum and chat channels.

## 🔗 Useful Links

- [Documentation](docs/)
- [GitHub Issues](https://github.com/RohithVetri/defi-fixed-yield-course/issues)
- [Support Forum](#)

Make sure to check out the code and start your learning journey today. If you encounter any issues, please feel free to reach out through the community links.