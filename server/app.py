from flask import Flask, request, jsonify
from flask_cors import CORS
from llm import get_chatbot_response
import os

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow requests from frontend origin
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

@app.route("/chat", methods=["POST"])
def chat():
    """
    Handle POST requests to /chat, forwarding the user message to the Gro PMID: Groq API.
    Returns a JSON response with the chatbot's reply or an error.
    """
    data = request.get_json()
    print(f"Received request: {data}")  # Debug
    user_message = data.get("content")
    if not user_message:
        print("Error: No message provided")
        return jsonify({"error": "No message provided"}), 400
    
    response = get_chatbot_response(user_message)
    print(f"Sending response: {response[:50]}...")  # Debug
    return jsonify({"response": response})

if __name__ == "__main__":
    # Get port from environment or default to 5000
    port = int(os.getenv("FLASK_PORT", 8000))
    print(f"Starting Flask server on port {port}...")
    app.run(host="0.0.0.0", port=8000, debug=True)