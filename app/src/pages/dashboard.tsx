import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

interface TodoItem {
    id: number;
    uuid: string;
    title: string;
    description: string;
    status: string;
    user_id: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

const fetchToDos = async (userId: string) => {    
    try {
        const response = await fetch(`/api/task/get/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        console.log('data:', data);
        
        // sort by created date 
        //data.sort((a: TodoItem, b: TodoItem) => {
       //     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
       //  }); // Add sorting logic here

        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
};

const createTask = async (taskData: { title: string, user_id: string }) => {

    console.log("taskData:", taskData);

    try {
        // http://localhost:3000/api/task/create/1
        const response = await fetch(`/api/task/create/1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: taskData.title,
                description: taskData.title,
                status: 'pending',
                user_id: taskData.user_id,
            })
        });
        if (!response.ok) throw new Error('Failed to create task');
        return await response.json();
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export default function Dashboard() {
    const [newTask, setNewTask] = useState<string>('');
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [error, setError] = useState<string>('');

    // Get user_id from localStorage or context
    // const user_id = localStorage.getItem('user_id') || '1'; // Replace with actual user ID
    const user_id = '1';

    useEffect(() => {
        // Fetch tasks when component mounts
        fetchToDos(user_id)
            .then(data => setTodos(data))
            .catch(err => setError('Failed to load tasks'));
    }, [user_id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newTask.trim()) {
            try {
                const createdTask = await createTask({
                    title: newTask.trim(),
                    user_id: user_id
                });

                setTodos(prevTodos => [...prevTodos, {
                    ...createdTask,
                    completed: createdTask.status === 'completed'
                }]);
                setNewTask('');
            } catch (err) {
                setError('Failed to create task');
            }
        }
    };

    const toggleTodo = async (id: number) => {
        try {
            // Add API call to update task status
            const response = await fetch(`/api/task/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'completed'
                })
            });

            if (!response.ok) throw new Error('Failed to update task');

            setTodos(todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ));
        } catch (error) {
            setError('Failed to update task');
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            // Add API call to delete task
            const response = await fetch(`/api/task/delete/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete task');

            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            setError('Failed to delete task');
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-800">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
                    
                    <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 p-6 mb-8">
                        <form onSubmit={handleSubmit} className="flex gap-4">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md 
                                         text-white placeholder-zinc-400 
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         transition duration-200"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 
                                         text-white font-medium rounded-md
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                         focus:ring-offset-zinc-900
                                         transition duration-200"
                            >
                                Add
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        {todos.map(todo => (
                            <div 
                                key={todo.id}
                                className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 flex items-center justify-between
                                         hover:border-zinc-600 transition duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={todo.status === 'completed'}
                                        onChange={() => toggleTodo(todo.id)}
                                        className="w-5 h-5 rounded border-zinc-600 
                                                 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900
                                                 bg-zinc-800"
                                    />
                                    <span className={`text-white ${todo.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
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
                        
                        {todos.length === 0 && (
                            <div className="text-center text-zinc-500 py-8">
                                No tasks yet. Add one above!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}