

import React, { useEffect, useState } from 'react';

const VideoPreview = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [extractedText, setExtractedText] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/translate')
      .then((response) => response.json())
      .then((data) => {
        if (data.video_file) {
          setVideoUrl(`http://127.0.0.1:5000/static/outputs/${data.video_file}`);
        }
        if (data.text) {
          setExtractedText(data.text);
        }
      })
      .catch((error) => console.error('Error fetching video:', error));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dfeadf] via-[#f9f3db] to-[#cce2cb] p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-[#4b4b4b] mb-4">🎬 Your Anime Video is Ready!</h1>
        {videoUrl ? (
          <>
            <video controls className="w-full rounded-md shadow-md mb-6">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <a
              href={videoUrl}
              download
              className="inline-block mb-4 bg-[#c4dfdf] px-6 py-2 rounded-lg font-semibold hover:bg-[#a1cfcf] transition"
            >
              ⬇️ Download Video
            </a>
          </>
        ) : (
          <p className="text-[#7a736f]">Loading video...</p>
        )}
        {extractedText && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#4b4b4b] mb-2">Narrated Prompt:</h2>
            <p className="italic text-[#7a736f]">{extractedText}</p>
          </div>
        )}
        <div className="mt-6">
          <a href="/" className="text-sm text-blue-500 underline">← Back to Upload</a>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;