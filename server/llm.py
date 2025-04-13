import os
from groq import Groq
from dotenv import load_dotenv
from time import sleep

# Load environment variables
load_dotenv()

# Validate API key
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env file")

# Initialize Groq client
client = Groq(api_key=api_key)

def get_chatbot_response(user_message):
    """
    Fetch a response from the Groq API for the given user message.
    Returns a string response or an error message if the call fails.
    """
    for attempt in range(3):
        try:
            completion = client.chat.completions.create(
                model="llama3-8b-8192",  # Using LLaMA 3 8B model
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a compassionate mental health chatbot. Provide empathetic, supportive, "
                            "and non-judgmental responses. Offer encouragement, suggest coping strategies, "
                            "and avoid giving medical diagnoses. If the user seems distressed, gently suggest "
                            "seeking professional help."
                        ),
                    },
                    {"role": "user", "content": user_message},
                ],
                max_tokens=200,
                temperature=0.7,
            )
            print(f"Groq API response: {completion.choices[0].message.content[:50]}...")  # Debug
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API error (attempt {attempt + 1}): {e}")
            if "429" in str(e):  # Rate limit
                sleep(2 ** attempt)  # Exponential backoff
                continue
            return "I'm sorry, I'm having trouble responding right now. Please try again later."
    return "I'm sorry, I'm having trouble responding right now. Please try again later."