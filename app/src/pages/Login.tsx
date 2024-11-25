import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import Logo from '../components/Logo';
import '../App.css'


interface FormData {
  username: string;
  password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Logging in with:', formData);
            const user = await loginUser(formData.username, formData.password);
            if(user){
                navigate('/dashboard');
            }
            

        } catch (err) {
            setError('Invalid username or password');
            console.log('error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-800">
            <div className="max-w-md w-full p-6">
            <div className="flex flex-col items-center mb-6">
                    <Logo className="h-16 w-20 mb-2" />
                </div>
                <div className="bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-700">
                    <h2 className="text-center text-3xl font-bold text-white mb-8">
                            welcome to noisy byte
                        </h2>
                 
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md 
                                             text-white placeholder-zinc-400 
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             transition duration-200"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md 
                                             text-white placeholder-zinc-400 
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             transition duration-200"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
                                     text-white font-medium rounded-md
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition duration-200"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}