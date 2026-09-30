import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from gemini_service import GeminiFinanceService

load_dotenv()

app = Flask(__name__)
CORS(app)

gemini_service = GeminiFinanceService()

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "FinWise AI Python Flask Backend",
        "has_gemini_key": bool(os.getenv("GEMINI_API_KEY"))
    })

@app.route("/api/financial-advice", methods=["POST"])
def financial_advice():
    data = request.get_json() or {}
    result = gemini_service.generate_financial_advice(data)
    return jsonify(result)

@app.route("/api/chat", methods=["POST"])
def chat():
    body = request.get_json() or {}
    message = body.get("message", "")
    data = body.get("financialData", {})
    history = body.get("history", [])
    reply = gemini_service.generate_chat_reply(message, data, history)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
