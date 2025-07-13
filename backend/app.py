from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os 
import requests

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
        file.save(os.path.join(UPLOAD_FOLDER, file.filename))
        res = ping_colab_api_get_text()
        print(res  )  # Debugging line to check the response from the APIs
        return "File uploaded successfully", 200
    else:
        return "Invalid file type", 400


#A function that will send the uploaded file to the colab api, that will be a post request and send out png or jpeg image and return the text for image-text translation
def ping_colab_api_get_text():
    file_path = os.path.join(UPLOAD_FOLDER, 'img_test.jpg')
    files = {'file': open(file_path, 'rb')}
    response = requests.post('https://f519ba480e49.ngrok-free.app/extract-text', files=files)  # Replace with your actual Colab API URL
    if response.status_code == 200:
        data = response.json()  # Assuming the API returns JSON data
        return {'text': data.get('text'), 'file_name': 'img_test.jpg'}
    else:
        return "Error in API call", response.status_code
    

def get_first_video_file():
    outputs_dir = 'static/outputs'
    if not os.path.exists(outputs_dir):
        return None
    video_files = [f for f in os.listdir(outputs_dir) if f.endswith(('.mp4', '.avi', '.mov'))]
    return video_files[0] if video_files else None

#a get request to return a text from colab api 
@app.route('/translate', methods=['GET'])
def translate_text():
    response = ping_colab_api_get_text()
    if response and 'text' in response:
        text = response['text']
        video_response = ping_colab_api(text)  # Assuming this triggers video generation
        if video_response:
            video_file = get_first_video_file()
            return jsonify({'text': text, 'video_file': video_file})
        else:
            return "Error in video generation", 500
    else:
        return "Error in translation", 500  


#ping another colab api to get the perform text-to-video translation
def ping_colab_api(text):
    url = 'https://colab-api-url.com/generate-video'  # Replace with your actual Colab API URL
    response = requests.post(url)
    if response.status_code == 200:
        return response.json()  # Assuming the API returns JSON data
    else:
        return None  # Handle error appropriately


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