from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os 
import requests
import uuid

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
CORS(app)
# A post request handler to accept a jpeg or png image file and save to uploads directory
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    if file and file.filename.lower().endswith(('.jpg', '.jpeg', '.pdf')):
        file.save(os.path.join(UPLOAD_FOLDER, 'img_test.jpg'))
        return "File uploaded successfully", 200
    else:
        return "Invalid file type", 400


#A function that will send the uploaded file to the colab api, that will be a post request and send out png or jpeg image and return the text for image-text translation
def ping_colab_api_get_text():
    file_path = os.path.join(UPLOAD_FOLDER, 'img_test.jpg')
    files = {'file': open(file_path, 'rb')}
    response = requests.post('https://997d3c37a645.ngrok-free.app/extract-text', files=files)  # Replace with your actual Colab API URL
    if response.status_code == 200:
        data = response.json()  # Assuming the API returns JSON data
        return {'text': data.get('text'), 'file_name': 'img_test.jpg'}
    else:
        return "Error in API call", response.status_code
    

#a get request to return a text from colab api 
@app.route('/translate', methods=['GET'])
def translate_text():
    response = ping_colab_api_get_text()
    if response and 'text' in response:
        text = response['text']
        video_response = ping_colab_api(text)  # Assuming this triggers video generation
        if video_response:
            return jsonify({'text': text, 'video_file': video_response})
    else:
        return "Error in translation", 500  


#ping another colab api to get the perform text-to-video translation
def ping_colab_api(text):
    url = 'https://f552d119e74e.ngrok-free.app/generate-video'  # Replace with your actual Colab API URL
    payload = {'prompt': text}
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        outputs_dir = 'static/outputs'
        os.makedirs(outputs_dir, exist_ok=True)
        video_filename = f'{str(uuid.uuid4())}.mp4'
        video_path = os.path.join(outputs_dir, video_filename)
        with open(video_path, 'wb') as f:
            f.write(response.content)
        return video_filename
    else:
        return None

@app.route('/video', methods=['GET'])
def get_video():
    outputs_dir = 'static/outputs'
    if not os.path.exists(outputs_dir):
        return "Outputs directory not found", 404
    video_files = [f for f in os.listdir(outputs_dir) if f.endswith(('.mp4', '.avi', '.mov'))]
    if video_files:
        return jsonify({'video_file': video_files[0]})
    else:
        return "No video files found", 404



if __name__ == '__main__':
    app.run(debug=True)