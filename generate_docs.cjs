const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const outputFile = path.join(projectRoot, 'Manual_And_SourceCode.md');

const header = `
# Trade Manager Guard Pro V1.1 - Comprehensive Technical Documentation
**Date:** ${new Date().toISOString().split('T')[0]}
**Author:** Antigravity (Assistant)

---

## 📘 1. Introduction & Overview
**Trade Manager Guard Pro** is not just a trading journal; it is a sophisticated **Money Management System** designed to protect capital and optimize profits using mathematical probability models.

### Core Philosophy
1.  **Capital Protection**: The system enforces a strict **2% Initial Stake** rule.
2.  **Profit Maximization**: Uses a **Compound Interest** model on wins (increasing stake by a set %).
3.  **Loss Recovery**: Implements a calculated **Martingale-like Multiplier (2.84x)** to recover losses + profit in a single win.
4.  **Anti-Blowout**: Hard limit on consecutive losses (Max 3-5) to prevent emotional trading (Revenge Trading).

---

## 🛠 2. Technical Architecture

### Tech Stack
-   **Frontend Framework**: React 18 (Functional Components + Hooks)
-   **Language**: TypeScript (Strict Typing)
-   **Build Tool**: Vite (Fast HMR & Bundling)
-   **Styling**: TailwindCSS (Utility-first CSS)
-   **Icons**: Lucide-React
-   **Charts**: Recharts (for Performance Graph)
-   **State Persistence**: LocalStorage (Data survives refresh)

### Key Components Structure
*   **App.tsx**: The "Brain" of the application. Handles the main state machine (Idle -> Trade -> Win/Loss -> Calculation).
*   **SessionManager**: Manages the lifecycle of a trading session (Start -> Trade Loop -> Reset/Archive).
*   **SettingsPanel**: Controls the mathematical variables (Risk %, Multipliers, Assets).
*   **StrategyModal**: A decision-support tool that provides checklists for common strategies (Ronald PRO, EMA+SAR).
*   **SessionReportModal**: Generates PDF reports and visualizes session performance.

---

## 💻 3. Source Code
The following is the complete source code for the project.
`;

fs.writeFileSync(outputFile, header, 'utf8');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (f !== 'node_modules' && f !== 'dist' && f !== '.git') {
                walkDir(dirPath, callback);
            }
        } else {
            callback(path.join(dir, f));
        }
    });
}

const allowedExts = ['.ts', '.tsx', '.css', '.html', '.json', '.js', '.bat'];

walkDir(projectRoot, (filePath) => {
    const ext = path.extname(filePath);
    const name = path.basename(filePath);

    if (filePath === outputFile) return;
    if (name === 'package-lock.json') return;
    if (!allowedExts.includes(ext)) return;

    const relativePath = path.relative(projectRoot, filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    const lang = ext.replace('.', '').replace('tsx', 'typescript').replace('ts', 'typescript').replace('js', 'javascript');

    const fileBlock = `
---
### 📄 File: ${relativePath}
\`\`\`${lang}
${content}
\`\`\`
`;
    fs.appendFileSync(outputFile, fileBlock, 'utf8');
    console.log(`Processed: ${relativePath}`);
});

console.log(`\n✅ Documentation Generated: ${outputFile}`);
