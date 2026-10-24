# 🏆 ViewPilot — AI-Powered Adaptive Interview Platform

> **Team MoonCraft | CodeFest 2026**  
> *Problem Statement #2: AI-Powered Web Applications × Job Readiness*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20%2F%202.5-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Material 3 Expressive](https://img.shields.io/badge/Design-Material%203%20Expressive-B9573D?style=flat)](https://m3.material.io/)

---

## 📖 Overview

**ViewPilot** is an intelligent, real-time mock interview and job readiness coach designed to bridge the gap between academic preparation and competitive hiring standards. Powered by **Google Gemini** and modern web-native telemetry, ViewPilot delivers adaptive, conversational interviews tailored to the candidate's target role, experience level, and uploaded resume.

Beyond basic text Q&A, ViewPilot provides:
- **Adaptive Multi-Turn Questioning**: Dynamic follow-up probes based on candidates' responses and STAR method completeness.
- **Client-Side Real-Time Telemetry**: Real-time speech rate (WPM) tracking, filler word detection, and candidate video presence/gaze indicators.
- **Evidence-Backed Scorecards**: Multi-dimensional rubrics (Technical, Communication, Problem Solving, Answer Quality) citing direct transcript quotes.
- **Physical Robot Avatar Synchronization**: Hardware-ready webhook bridge for physical robotic interview companions (`/api/robot`).
- **Zero API Key Leakage**: All generative models and external services are strictly routed through isolated server-side handlers.

---

## 🏗️ System Architecture

ViewPilot is architected with clear boundaries between the **Client Presentation & Telemetry Layer**, the **Secure Next.js Server Layer**, the **AI & Evaluation Engines**, and **External Hardware/Speech Bridges**.

```mermaid
flowchart TD
    %% ==========================================
    %% Subgraphs for layered architecture
    %% ==========================================
    subgraph ClientLayer["🖥️ Presentation & Client Layer (Next.js 15 App Router)"]
        direction TB
        UI_Home["Landing Page\n(Brand & Overview)"]
        UI_Wizard["Onboarding Wizard\n(Role, Exp, Domain, Resume)"]
        UI_Chat["Interview Interface\n(Dynamic Q&A Loop)"]
        UI_Report["Evaluation Dashboard\n(Rubrics, Evidence & Action Plan)"]
        
        subgraph ClientTelemetry["Client-Side Real-Time Telemetry"]
            CamTelemetry["Candidate Camera & Vision\n(Gaze, Head Pose, Presence)"]
            VoiceCoach["Web Speech & Pace Coach\n(WPM, Filler Words, Pauses)"]
            AudioTTS["Audio & TTS Player\n(ElevenLabs / Web Audio)"]
        end
    end

    subgraph ServerLayer["🛡️ Next.js Secure Server / API Handlers"]
        direction TB
        API_Interview["/api/interview\n(Context & Question Generation)"]
        API_Evaluate["/api/evaluate\n(Rubric Scoring & Evidence Extraction)"]
        API_Resume["/api/parse-resume\n(PDF Ingestion & Text Parsing)"]
        API_Voice["/api/voice/tts\n(Text-to-Speech Streaming)"]
        API_Robot["/api/robot\n(Physical Robot Synchronization)"]
    end

    subgraph IntelligenceLayer["🧠 AI & Engine Core"]
        direction TB
        GeminiCore["Google Gemini API\n(Structured Schemas & Adaptive Prompts)"]
        RubricEngine["4-Dimension Evaluation Engine\n(Tech, Communication, Problem Solving, Quality)"]
        FallbackEngine["Robust Offline Fallback Engine\n(High Resilience Guarantee)"]
    end

    subgraph ExternalDevices["🤖 Hardware & Audio Integration"]
        RobotDevice["Physical Robot Avatar\n(Nodding, Expressive Eyes, Turn State)"]
        ElevenLabsAPI["ElevenLabs TTS Service\n(Realistic Interrogator Voice)"]
    end

    %% ==========================================
    %% Data & Control Flows
    %% ==========================================
    UI_Wizard -->|"1. Parse Resume"| API_Resume
    UI_Wizard -->|"2. Initialize Session"| API_Interview
    UI_Chat -->|"3. Stream Turn & Answers"| API_Interview
    CamTelemetry -->|"Live Visual Metrics"| UI_Chat
    VoiceCoach -->|"Pace & Speech Events"| UI_Chat
    UI_Chat -->|"4. Complete & Evaluate"| API_Evaluate
    API_Evaluate -->|"5. Return Structured JSON"| UI_Report

    API_Interview --> GeminiCore
    API_Evaluate --> GeminiCore
    GeminiCore -.->|"On Failure / Timeout"| FallbackEngine
    API_Evaluate --> RubricEngine

    UI_Chat -->|"Stream Audio Response"| API_Voice
    API_Voice --> ElevenLabsAPI

    API_Interview -->|"Sync Turn & Stage"| API_Robot
    API_Robot --> RobotDevice

    %% ==========================================
    %% Styling Classes
    %% ==========================================
    classDef client fill:#F4D8CC,stroke:#B9573D,stroke-width:2px,color:#292824;
    classDef telemetry fill:#FFF7F2,stroke:#B9573D,stroke-width:1.5px,color:#292824;
    classDef server fill:#E5E5CD,stroke:#686B4E,stroke-width:2px,color:#292824;
    classDef ai fill:#E8DFFF,stroke:#625B8A,stroke-width:2px,color:#292824;
    classDef hardware fill:#DCE7FF,stroke:#3B5998,stroke-width:2px,color:#292824;

    class UI_Home,UI_Wizard,UI_Chat,UI_Report client;
    class CamTelemetry,VoiceCoach,AudioTTS telemetry;
    class API_Interview,API_Evaluate,API_Resume,API_Voice,API_Robot server;
    class GeminiCore,RubricEngine,FallbackEngine ai;
    class RobotDevice,ElevenLabsAPI hardware;
```

---

## 🔄 End-to-End Interview & Evaluation Flow

The following sequence illustrates how a candidate session progresses from onboarding to final rubric scoring:

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as 👤 Candidate
    participant UI as 🖥️ ViewPilot UI
    participant Server as 🛡️ Next.js API Routes
    participant Gemini as 🧠 Google Gemini AI
    participant Robot as 🤖 Physical Robot Avatar

    Candidate->>UI: Select Role, Difficulty, & Upload Resume
    UI->>Server: POST /api/parse-resume (Multipart/PDF)
    Server-->>UI: Extracted Text & Candidate Profile
    
    UI->>Server: POST /api/interview (action: "start", config)
    Server->>Gemini: Prompt with Role, Resume Context, & Rubric
    Gemini-->>Server: First Behavioral / Technical Question
    Server->>Robot: Sync "interviewer_asking" Expression
    Server-->>UI: Initial Question + Session Metadata
    
    loop Interview Turn (1 to N Questions)
        Candidate->>UI: Answer via Voice (STT) or Text
        Note over UI: PaceCoach analyzes WPM & fillers<br/>Camera tracks presence & gaze
        UI->>Server: POST /api/interview (history, latestAnswer)
        Server->>Robot: Sync "listening_evaluating" (nod)
        Server->>Gemini: Adaptive follow-up or next dimension prompt
        Gemini-->>Server: Follow-up Probe / New Question
        Server-->>UI: Next Question Payload + Audio (TTS)
    end

    Candidate->>UI: Conclude Interview Session
    UI->>Server: POST /api/evaluate (full transcript + telemetry)
    Server->>Gemini: Structured Evaluation Prompt (JSON Schema)
    Gemini-->>Server: Validated Evaluation JSON (4 Dimensions + Evidence)
    Server-->>UI: Comprehensive Coaching Report
    UI->>Candidate: Render Scorecard, Video Telemetry, & Action Plan
```

---

## 🔑 Key Architectural Highlights

### 1. Zero-Browser Secret Exposure
Client browsers never interact directly with LLM or TTS providers. All communications flow through Next.js App Router API handlers (`/api/*`), shielding private credentials, API keys, and internal prompt templates.

### 2. Multi-Modal Client-Side Telemetry
- **Video Presence & Gaze Estimation**: Non-invasive computer-vision heuristics measure candidate face centering, posture stability, and gaze engagement.
- **Pace Coach**: Real-time calculation of words-per-minute (WPM), filler word frequency (`"um"`, `"uh"`, `"like"`), and pause duration via browser Web Speech API.

### 3. Structured 4-Dimensional Scoring Rubric
Evaluations are strictly enforced through Zod schemas matching our 4 primary axes:
- **Technical Acumen**: Domain precision, accuracy, and depth of technical answers.
- **Communication & Delivery**: Clarity, concise phrasing, structured answers (STAR method), and pace.
- **Problem Solving & Critical Thinking**: Handling edge cases, assumptions, and methodical breakdown.
- **Answer Quality & Completeness**: Relevance, evidence, depth, and actionable takeaways.

### 4. Hardware Avatar Bridge (`/api/robot`)
Allows ViewPilot to drive physical desktop robotic companions or local animatronics via HTTP/LAN endpoints, syncing physical head movements, nodding, and eye expressions to active interview phases.

---

## 📂 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── evaluate/          # Final rubric generation & evidence extraction
│   │   ├── interview/         # Adaptive question and follow-up engine
│   │   ├── parse-resume/      # Local PDF parser & resume extraction
│   │   ├── robot/             # Physical robot companion sync endpoint
│   │   └── voice/tts/         # Audio generation & streaming endpoint
│   ├── interview/             # Real-time interview chat interface
│   ├── report/                # Rich evaluation report & coaching dashboard
│   ├── setup/                 # Multi-step onboarding wizard
│   ├── globals.css            # Material 3 Expressive theme tokens
│   └── page.tsx               # Product landing page & entry
├── components/
│   ├── CandidateCamera.tsx    # Live camera view & gaze estimation
│   ├── ChatMessage.tsx        # Structured message bubbles with status
│   ├── CoachingTips.tsx       # Live inline suggestions
│   ├── CommunicationTelemetry.tsx # WPM & speech metrics visualizer
│   ├── EvidencePanel.tsx      # Quoted transcript evidence breakdown
│   ├── OnboardingWizard.tsx   # Step-by-step role configuration
│   ├── PaceCoach.tsx          # Real-time cadence coach
│   ├── ScoreCard.tsx          # Dimensional grading breakdown
│   └── ui/                    # Reusable pill buttons, cards, and chips
├── lib/
│   ├── gemini.ts              # Gemini SDK client & prompt orchestrator
│   ├── prompts.ts             # System prompts with structured instructions
│   ├── robot/                 # Hardware client & protocol bridges
│   ├── schemas.ts             # Zod validation schemas
│   └── fallback-data.ts       # Deterministic fallback responses
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer
- **npm** / **pnpm** / **yarn**
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install
```bash
git clone https://github.com/Itsmeakash248/CodeFest-FINAL.git
cd CodeFest-FINAL
npm install
```

### 2. Configure Environment Variables
Create or verify `.env.local`:
```bash
# Server-Side Only Credentials
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: ElevenLabs for Ultra-Realistic Voice
ELEVENLABS_API_KEY=your_elevenlabs_key_here
ELEVENLABS_VOICE_ID=XrExE9yKIg1WjnnlVkGX

# Optional: LAN Robot Bridge
# ROBOT_BASE_URL=http://192.168.1.42
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Built with ❤️ by Team MoonCraft
CodeFest 2026 — AI-Powered Web Applications × Job Readiness
