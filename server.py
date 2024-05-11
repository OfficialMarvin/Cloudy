from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)

# Load the tokenizer and model from the pretrained Hugging Face model
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    text = data['text']
    chat_history_ids = data.get('chat_history_ids', None)
    
    # Tokenize the input text
    inputs = tokenizer(text, return_tensors='pt')
    
    # Generate a response from the model
    response = model.generate(**inputs, max_length=128)
    
    # Decode the generated ids to text
    reply_text = tokenizer.decode(response[0], skip_special_tokens=True)
    
    return jsonify({'message': reply_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
