import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const navigateHome = () => {
        navigate('/dashboard');

    } 
    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
            <div className="text-center space-y-6">
            <div className="flex justify-center space-x-2 text-zinc-600 font-mono text-sm">
                <div className="animate-pulse">01</div>
                <div className="animate-pulse delay-100">10</div>
                <div className="animate-pulse delay-200">00</div>
                <div className="animate-pulse delay-300">11</div>
            </div>
            <div>
                <h1 className="text-6xl font-bold text-white mb-2">404</h1>
                <p className="text-xl text-zinc-400">Page not found</p>
            </div>
            
            <p className="text-zinc-500 max-w-md">
                Looks like this beat dropped off the track. 
                The page you're looking for doesn't exist or has been moved.
            </p>
            
            
            <div className="flex justify-center space-x-4">
                <button 
                onClick={navigateHome}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
                >
                <Home className="h-4 w-4" />
                <span>Go Home</span>
                </button>
            </div>
            </div>
        </div>
    );
};

export default NotFound;