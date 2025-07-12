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
        #ping_colab_api()
        return "File uploaded successfully", 200
    else:
        return "Invalid file type", 400


#A function that will send the uploaded file to the colab api
def ping_colab_api():
    url = 'https://colab-api.example.com/process'  # Replace with your Colab API URL
    files = {'file': open(os.path.join(UPLOAD_FOLDER, os.listdir(UPLOAD_FOLDER)[0]), 'rb')}
    try:
        response = requests.post(url, files=files)
        if response.status_code == 200:
            print("Colab API pinged successfully")
        else:
            print(f"Failed to ping Colab API: {response.status_code}")
    except Exception as e:
        print(f"Error pinging Colab API: {e}")


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