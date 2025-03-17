# ⚽ UCL Quiz App 🏆  

### Test Your Champions League Knowledge!  

The **UCL Quiz App** is an interactive football trivia game designed for UEFA Champions League fans. Challenge yourself with exciting questions on legendary players, iconic matches, and unforgettable moments in UCL history! Whether you're a casual fan or a hardcore football enthusiast, this app is perfect for testing your football knowledge.  

---

## 🚀 Features  

- 🏆 **Multiple Quiz Categories** – Questions about teams, players, finals, records, and more.  
- ⏳ **Timed Challenges** – Answer quickly before the timer runs out.  
- 🎯 **Score Tracking** – Keep track of your progress and high scores.  
- 📱 **Responsive UI** – Optimized for desktop, tablet, and mobile devices.   
- 🔄 **Dynamic Questions** – Fresh quizzes added regularly.  
- 🌍 **Leaderboard (Optional work in Progress)** – Compete with other football fans worldwide.  

---

## 🛠️ Tech Stack  

| **Technology**  | **Usage** |
|---------------|------------|
| **React.js** | Frontend (client) |
| **Node.js & Express.js** | Backend (server) |
| **TypeScript** | Strongly-typed JavaScript |
| **Tailwind CSS** | UI Styling |
| **Drizzle ORM** | Database Management |
| **PostgreSQL** | Data Storage (optional) |
| **Vite** | Fast development build |
| **Deployment** | Vercel / Netlify (Frontend), Fly.io / Render (Backend) |

---
---

## 📂 Project Structure  

ucl-quiz-app/ │── client/ # Frontend (React.js with Vite & Tailwind CSS) │ ├── src/ │ │ ├── components/ # Reusable UI components │ │ ├── data/ # Mock data for quizzes │ │ ├── hooks/ # Custom React hooks │ │ ├── lib/ # Utility functions │ │ ├── pages/ # Page components (Home, Quiz, Results, etc.) │ │ ├── App.tsx # Main app component │ │ ├── main.tsx # Entry point │ ├── public/ # Static assets (icons, images, etc.) │ ├── index.html # Main HTML file │── server/ # Backend (Node.js with Express.js) │ ├── routes/ # API endpoints (quiz, users, scores, etc.) │ ├── controllers/ # Business logic for each route │ ├── models/ # Database models/schema │ ├── middleware/ # Auth, validation, etc. │ ├── db/ # Database connection & config │ ├── server.ts # Main server entry point │── shared/ # Shared utilities & constants │── dist/ # Production build output │── node_modules/ # Project dependencies │── .gitignore # Files to exclude from Git │── package.json # Project metadata & scripts │── package-lock.json # Dependency lock file │── drizzle.config.ts # Database ORM configuration │── tailwind.config.ts # Tailwind CSS setup │── vite.config.ts # Vite project configuration │── tsconfig.json # TypeScript configuration │── theme.json # Theme settings


---

## 🏗️ Installation & Setup  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/SakshamChouhan/ucl-football-quiz.git
cd ucl-football-quiz

2️⃣ Install Dependencies
sh
npm install  # Install both frontend & backend dependencies

3️⃣ Run the Development Server
sh
npm run dev

📬 Contact
For any questions or feedback, feel free to reach out:
📧 Email: raisaksham426@gmail.com
