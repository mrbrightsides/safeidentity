# SafeIdentity 🛡️

**SafeIdentity** is an AI-powered decentralized identity validation platform built for the **GenLayer Bradbury Testnet**. It leverages Large Language Models (LLMs) as validator nodes to perform intelligent, multi-factor identity verification without relying on a central authority.

---

## 🌟 Overview

In the current digital landscape, identity verification is often centralized, siloed, and prone to single points of failure. SafeIdentity reimagines this process by using **Intelligent Contracts**—smart contracts capable of executing AI logic—to evaluate identity claims.

By combining **AI-driven analysis** with **Decentralized Consensus**, SafeIdentity provides a smarter, more resilient way to establish trust in Web3. SafeIdentity introduces a hybrid trust model where AI provides probabilistic judgment and consensus ensures deterministic finality.

---

## 🌍 Why This Matters

SafeIdentity addresses a fundamental challenge in Web3: establishing trust without centralized authorities.

By combining AI-driven probabilistic reasoning with deterministic consensus, SafeIdentity enables scalable, transparent, and trustless identity validation for decentralized applications.

---

## 🚀 Key Features

- **🤖 AI Validator Nodes**: Each validator node runs an LLM to analyze data consistency, detect fraud patterns, and assess risk levels.
- **🧑‍🤝‍🧑 Optimistic Democracy**: A majority-based consensus mechanism where nodes must agree on the validity of an identity claim.
- **⚖️ Equivalence Principle**: All AI outputs are structured and deterministic, ensuring that different nodes can reach a consistent consensus.
- **🔍 Detailed Risk Assessment**: Provides granular "Low", "Medium", and "High" risk levels with detailed AI-generated reasoning.
- **⚠️ Conflict Detection**: Visually highlights validator disagreements, demonstrating the system's ability to handle edge cases and suspicious data.
- **📊 Real-time Metrics**: Live confidence scoring and network status monitoring.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Engine**: Google Gemini API (via `@google/genai`)
- **Blockchain Simulation**: GenLayer Bradbury Testnet Simulator

---

## ⚙️ How It Works

1. **Identity Claim**: A user submits an identity claim containing metadata (issuer, reputation) and evidence (biometric hashes, social proof).
2. **AI Evaluation**: Multiple validator nodes independently evaluate the claim using an LLM. They generate a `validity_score`, `confidence`, and `risk_level`.
3. **Consensus**: The system aggregates the outputs. If a majority of nodes agree (e.g., "APPROVE"), the identity is verified.
4. **Final Decision**: The Intelligent Contract finalizes the state as **Approved**, **Rejected**, or **Flagged for Dispute**.

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or Yarn
- A Google Gemini API Key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in a `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📜 License

This project is licensed under the Apache-2.0 License.
