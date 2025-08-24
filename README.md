# Persona AI – Chat with your AI mentor  
**Live Demo:** [https://persona-ai-adi.vercel.app/](https://persona-ai-adi.vercel.app/)  

---

## 📌 Overview  
**Persona AI** is a Generative AI project that allows users to seamlessly switch between personas and have AI-powered conversations.  
A simple toggle lets you change the persona instantly, and the chat clears to start a fresh conversation with the selected personality.  

This project is built with **Next.js**, **React**, and **Tailwind CSS**, and integrates with a Generative AI API to simulate realistic persona-based interactions.  

---

## ✨ Features  
- **AI Personas:** Chat with either Hitesh Choudhary or Piyush Garg (more coming soon).  
- **Persona Toggle:** Switch instantly between personas with a sleek toggle.  
- **Auto-Clear Chat:** Switching personas automatically resets the conversation.  
- **Real-time AI Responses:** Powered by a Gemini API or any compatible AI API.  
- **Rate-Limiting:** Users are limited to **4 messages per minute** using ArcJet to prevent excessive use of AI tokens.  
- **Responsive UI:** Works seamlessly across devices.  

---

## 🖥️ Tech Stack  
- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Next.js API routes  
- **AI Engine:** Google Gemini API (or any AI API key)  
- **Rate-Limiting:** ArcJet API  
- **Deployment:** Vercel  

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/adityathakur17/persona-ai.git
cd persona-ai
npm install
npm run dev
```
### 2️⃣ set up .env
```bash
GEMINI_API_KEY=your_gemini_api_key_here
ARCJET_KEY=your_arcjet_api_key_here
```
###3️⃣ run the project
```bash
npm run dev
```
