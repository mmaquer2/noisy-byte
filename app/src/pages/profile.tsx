import { Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function Profile () {
    const navigate = useNavigate();
    const navigateHome = () => {
        navigate('/dashboard');
    } 
    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
          <div className="text-center space-y-6">
            <div className="flex justify-center space-x-2 text-zinc-600 font-mono text-sm">
              <div className="animate-pulse">♪</div>
              <div className="animate-pulse delay-100">♫</div>
              <div className="animate-pulse delay-200">♪</div>
              <div className="animate-pulse delay-300">♫</div>
            </div>     
            <div>
              <h1 className="text-6xl font-bold text-white mb-2">Settings Page Coming Soon</h1>
              <p className="text-xl text-zinc-400">This beat is still in production. Check Later Later!</p>
            </div>         
            <div className="flex justify-center space-x-4">
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-white text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
                onClick={navigateHome}
              >
                <Music className="h-4 w-4" />
                <span>Back to Studio</span>
              </button>
            </div>
          </div>
        </div>
      );
}


