import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      alert(`Uploading: ${file.name}`);
      // upload the pdf or jpeg file to the flask backend
      const formData = new FormData();
      formData.append('file', file);  

      fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          navigate('/video-preview');
        } else {
          alert('File upload failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('File upload failed');
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dfeadf] via-[#f9f3db] to-[#cce2cb] p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#7a736f] mb-4 text-center">Upload Your File</h1>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.jpeg,.jpg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c4dfdf] file:text-[#4b4b4b] hover:file:bg-[#a1cfcf]"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#a1cfcf] text-white font-semibold rounded-lg hover:bg-[#84bcbc] transition"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
