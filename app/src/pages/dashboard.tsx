import { useState, useEffect, useCallback } from 'react';
import { createUserTask, getTasks, deleteTask, updateTask } from '../api/task.api';
import NavHeader from '../components/NavHeader';
import "../App.css";

const fetchToDos = async () => {
    try {
        const data = await getTasks(); 
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
};

const createTask = async (taskData: { title: string }) => {
    try {
        const data = await createUserTask(taskData); 
        return data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export default function Dashboard() {
    const [newTask, setNewTask] = useState<string>('');
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchToDos()
            .then(data => setTodos(data))
            .catch(() => setError('Failed to load tasks'));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!newTask.trim()) return;

            try {
                const createdTask = await createTask({ title: newTask.trim() });
                setTodos(prev => [...prev, { ...createdTask, completed: createdTask.status === 'completed' }]);
                setNewTask('');
            } catch {
                setError('Failed to create task');
            }
        },
        [newTask]
    );

    const toggleTodo = useCallback(
        async (id: number, status: string, description: string) => {
            try {
                
                const newStatus = status === 'completed' ? 'pending' : 'completed';
                console.log(`Toggling task ${id} ${description} to ${newStatus}`);

                const result = await updateTask(id, newStatus, description);
                
                console.log('result', result);
                
                // update the UI by toggling the status of the task
                setTodos(prev =>
                    prev.map(todo => (todo.id === id ? { ...todo, status: newStatus, completed: newStatus === 'completed' } : todo))
                );
            
            } catch(error) {
                console.error('Failed to update task:', error);
                setError('Failed to update task');
            }
        },
        []
    );

    const deleteTodo = useCallback(
        async (id: number) => {
            try {
                await deleteTask(id); // Call the API function to delete the task
            
                // Update the UI by filtering out the deleted task
                setTodos(prev => prev.filter(todo => todo.id !== id));
            } catch (error) {
                console.error('Failed to delete task:', error);
                setError('Failed to delete task');
            }
        },
        []
    );
    
    return (
        <>
            <NavHeader />
            <div className="min-h-screen bg-zinc-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-8">To Do List</h1>

                        {error && (
                            <div className="bg-red-500 text-white rounded-md p-4 mb-4">
                                {error}
                            </div>
                        )}

                        <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 p-6 mb-8">
                            <form onSubmit={handleSubmit} className="flex gap-4">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={e => setNewTask(e.target.value)}
                                    placeholder="Add a new task..."
                                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition duration-200"
                                >
                                    Add
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {todos.map(todo => (
                                <div
                                    key={todo.id}
                                    className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 flex items-center justify-between hover:border-zinc-600 transition duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={todo.status === 'completed'}
                                            onChange={() => toggleTodo(todo.id, todo.status, todo.description)}
                                            className="w-5 h-5 rounded border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900 bg-zinc-800"
                                        />
                                        <span
                                            className={`text-white ${todo.status === 'completed' ? 'line-through text-zinc-500' : ''}`}
                                        >
                                            {todo.description}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="text-zinc-400 hover:text-red-400 transition duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {todos.length === 0 && !error && (
                                <div className="text-center text-zinc-500 py-8">
                                    No tasks yet. Add one above!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
