# Aura: AI Copilot for Emotional Wellbeing

Aura is a web-based AI-powered emotional wellness tool that detects real-time emotions using facial expressions or voice and suggests personalized interventions like calming music, guided breathing, journaling, and a GPT-powered chatbot.

---

## 🧠 Features

- Real-time emotion detection via webcam and audio
- AI-powered chatbot for emotional support
- Personalized journaling suggestions
- Mood trend visualizations
- Calming interventions (music, breathing exercises)
- Session summary with emotional reports

---

## 🛠 Tech Stack

- *Frontend:* React.js, Tailwind CSS, face-api.js, React Webcam
- *Backend:* Node.js (Express), FastAPI (Python)
- *AI Services:* OpenAI GPT, TensorFlow/face-api.js, pyAudioAnalysis (optional)
- *Others:* MongoDB/Firebase, Python (for emotion detection & chatbot)

---

## ⚙ How to Run the Project

### Step 1: Setup Frontend (Client)
```bash
cd client
npm install
npm run dev

> Starts the React frontend on http://localhost:5173/




---

Step 2: Start the Node Server (API + Static)

nodemon server.js

> Runs the backend server for API endpoints.




---

Step 3: Start the Chatbot Server

python app.py

> Starts the flask server for GROQ-based chatbot.




---

Step 4: Run Emotion Detection & Yoga Integration (Optional)

python yoga.py

> Starts the OpenCV webcam-based emotion and posture detection.

```




---

✅ Final Notes

Ensure you have Python 3.8+ and Node.js installed

Add your API keys (OpenAI, etc.) to .env files

For webcam/audio to work, allow browser permissions

Tested on Chrome and Firefox



---

📄 License

MIT License. Free to use and modify with credits.

