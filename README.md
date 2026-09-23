<div align="center">
  <img src="https://img.shields.io/badge/MediSphere-00C49F?style=for-the-badge&logo=health&logoColor=white" alt="MediSphere Banner" />
  <h1>⚕️ MediSphere</h1>
  <p><b>Your AI-Powered Next-Gen Health & Hospital Navigator</b></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#)
  [![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
</div>

<br />

## 🌟 The Problem
Navigating the healthcare system is often overwhelming. Patients struggle to understand complex medical reports, don't know what their prescribed medicines actually do, and find it incredibly difficult to compare hospitals to find the *right* specialized care based on real-time facilities, distance, and cost.

## 💡 Our Solution
**MediSphere** bridges the gap between complex healthcare data and patient understanding. It's a comprehensive, AI-driven healthcare ecosystem that empowers users to analyze their health records, understand their medications, and dynamically match with the best nearby hospitals. 

---

## 🚀 Key Features (Hackathon Highlights)

### 🏥 1. Intelligent Hospital Matching & Comparison
- **Smart Discovery**: Uses geolocation and Overpass API (OpenStreetMap) to instantly find nearby hospitals.
- **Disease-based Filtering**: Search for a specific condition (e.g., "Cardiology") and instantly filter hospitals equipped to handle it.
- **Side-by-Side Comparison**: Select up to 3 hospitals to dynamically compare their *Ratings, Distance, Cost Estimates, and Live Facilities (ICU, 24/7 ER, etc.)* in a beautiful side-panel view.

### 📄 2. AI Medical Report Analysis
- **Vision & Text Analysis**: Upload any medical report (PDF or Image). 
- **GPT-4o Vision Integration**: The backend automatically extracts, structures, and simplifies complex medical jargon into readable metrics (glucose, cholesterol, etc.).
- **Health Score**: Aggregates your report data into a dynamic "Health Score" dashboard tracking your wellness over time.

### 💊 3. AI Medicine Analyzer
- **Snap & Learn**: Don't know what a pill is for? Upload a photo of the medicine strip or bottle.
- **Instant Insights**: The AI identifies the medicine, its primary use case, dosage guidelines, and potential side effects—perfect for elderly care and general safety.

### 🤖 4. Real-time AI Health Assistant
- **Context-Aware Chat**: A built-in AI assistant trained on medical contexts to answer health queries, interpret symptoms, and guide you on when to visit a hospital.

---

## 🛠️ Tech Stack

**Frontend (Sleek, Responsive, Glassmorphic UI):**
- React 18 (TypeScript)
- Vite (Fast bundling)
- TailwindCSS (Premium dark-mode medical aesthetics)
- Lucide React (Icons) & Recharts (Data Visualization)
- Context API (State Management)

**Backend (High-Performance & Scalable):**
- Python 3 + FastAPI 
- OpenAI GPT-4o-mini API (For Vision, Report Extraction, and Chat)
- Cloudinary (For secure medical image/PDF hosting)
- Overpass API (For live mapping and hospital facility geodata)
- SQLAlchemy (ORM)

---

## 🏗️ Architecture & How It Works
1. **The NLP Engine:** User uploads a report/medicine -> Sent to FastAPI backend -> Uploaded to Cloudinary -> URL fed into GPT-4o Vision -> Structured JSON returned to frontend.
2. **The Geospatial Engine:** User requests hospitals -> Frontend gets Lat/Long -> FastAPI queries Overpass API for `amenity=hospital` within a bounding box -> Data is cleaned, mocked with simulated capacities for the demo -> Displayed on an interactive Map.

---

## 🏁 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- Python 3.10+
- OpenAI API Key
- Cloudinary Credentials

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Edit .env with your OpenAI and Cloudinary keys

# Run the backend
uvicorn app.main:app --reload
```
*Backend runs on `http://localhost:8000`. Swagger API docs available at `http://localhost:8000/docs`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔮 What's Next?
- **Blockchain EHR Integration**: Securing medical reports via smart contracts.
- **Live Hospital Bed APIs**: Connecting to real-time hospital bed availability APIs.
- **Wearable Integration**: Syncing Apple Watch/Fitbit data to the health dashboard.

<br />

<div align="center">
  <b>Built with ❤️ for the Hackathon</b>
</div>
