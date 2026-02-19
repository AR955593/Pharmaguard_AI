# PharmaGuard AI: Pharmacogenomic Risk Prediction System
**RIFT 2026 Hackathon Submission - HealthTech Track**

Adverse drug reactions cause over 100,000 preventable deaths annually in the USA. PharmaGuard AI is an AI-powered clinical decision support web application that analyzes patient genomic data (VCF files) to predict personalized drug response risks and generate clinically actionable recommendations aligned with established pharmacogenomic guidelines.

## 🚀 Deployment Instructions (Vercel)
1. Push this repository to GitHub.
2. Login to [Vercel](https://vercel.com).
3. Click "Add New..." -> "Project".
4. Import your GitHub repository.
5. Framework Preset should automatically detect "Next.js".
6. Click "Deploy".
7. Your application will be live in ~1 minute.

## ✨ Features
- **VCF File Parsing**: Supports standard VCF v4.2 uploads (drag & drop).
- **Genetic Variant Analysis**: Identifies variants in critical pharmacogenes (CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD).
- **Risk Prediction**: Classifies drug risks as Safe, Adjust Dosage, Toxic, or Ineffective.
- **AI Explanations**: Generates human-readable explanations for complex genetic interactions.
- **Clinical Recommendations**: Provides dosing guidelines based on phenotype.
- **Premium UI**: Modern, responsive interface with real-time analysis.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Lucide React
- **Logic**: Custom VCF Parser & Risk Engine

## 📦 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AR955593/Pharmaguard_AI.git
   cd Pharmaguard_AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧬 Usage
1. Upload a VCF file (Sample provided in `public/sample.vcf`).
2. Enter a drug name (e.g., Codeine, Warfarin).
3. Click "Analyze" triggers the risk assessment.
4. View the detailed report and download JSON.

## 📂 Project Structure
- `src/app`: Next.js pages and layout
- `src/components`: React UI components (FileUpload, ResultsDisplay)
- `src/lib`: Core logic (vcfParser, riskEngine, llmService)
- `src/types`: TypeScript definitions


---
*Disclaimer: For demonstration purposes only. Not a medical device.*
