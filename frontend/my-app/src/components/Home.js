import logo from '../static/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      const renamedFile = new File([file], 'img_test.jpg', { type: file.type });
      formData.append('file', renamedFile);

      fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          setIsUploading(false);
          if (response.ok) {
            navigate('/video-preview');
          } else {
            alert('File upload failed');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsUploading(false);
          alert('File upload failed');
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dfeadf] via-[#f9f3db] to-[#cce2cb] p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-xl transition-all duration-300">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-48 drop-shadow-lg" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#4b4b4b] mb-2 text-center">
          Upload Your File
        </h1>
        <p className="text-center text-gray-500 text-lg mb-6">
          Turn your manga idea into video magic ✨
        </p>
        <form onSubmit={handleUpload} className="space-y-6">
          <label
            htmlFor="fileInput"
            className="block w-full text-base text-gray-700 text-center file:mr-4 file:py-4 file:px-8 file:rounded-xl file:border border-gray-200 file:font-semibold file:bg-[#c4dfdf] file:text-[#4b4b4b] hover:file:bg-[#a1cfcf] transition-all shadow-md cursor-pointer py-6 border-2 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100"
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.jpeg,.jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            Click or drag file here to upload
          </label>
          {file && (
            <p className="text-center text-sm text-gray-600">Selected: {file.name}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#a1cfcf] text-white text-lg font-bold rounded-full hover:bg-[#84bcbc] transition flex justify-center items-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              'Upload'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
