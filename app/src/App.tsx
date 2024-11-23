import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/dashboard';  
import SoundBoard from './pages/soundboard';
import Profile from './pages/profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/soundboard" element={<SoundBoard />} /> 
       <Route path="/profile" element={<Profile />} /> 
       <Route path="*" element={<NotFound />} /> 
    </Routes>
  );
}

export default App;