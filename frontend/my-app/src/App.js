import { Routes, Route } from 'react-router-dom';
import UploadPage from './components/Home';
import VideoPreview from './components/VideoPreview';

function App() {
  return (
    <Routes>
      <Route path="/home" element={<UploadPage />} />
      <Route path="/video-preview" element={<VideoPreview />} />
    </Routes>
  );
}

export default App;