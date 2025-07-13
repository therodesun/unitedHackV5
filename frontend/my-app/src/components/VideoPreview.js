

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dfeadf] via-[#f9f3db] to-[#cce2cb] p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#7a736f] mb-4">Video Preview</h1>
        {videoUrl ? (
          <video controls className="w-full rounded-md shadow-md mb-4">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-[#7a736f]">Loading video...</p>
        )}
        {extractedText && (
          <p className="text-[#7a736f] mt-2 italic">{extractedText}</p>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;