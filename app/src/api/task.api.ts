
async function createUserTask(taskData: { title: string }): Promise<any> {
    try {

        console.log('Creating task:', taskData);

        // Retrieve the token from storage
        const token = sessionStorage.getItem('authToken'); // Or localStorage if appropriate
        if (!token) {
            throw new Error('No auth token found. Please log in.');
        }

        // Make the API request
        const response = await fetch(`/api/task/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Pass the token in the header
            },
            body: JSON.stringify({
                title: taskData.title,
                description: taskData.title,
                status: 'pending',
            }),
        });

        if (!response.ok) throw new Error('Failed to create task');
        return await response.json();
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}


async function getTasks(): Promise<any> {

    console.log('Fetching tasks...');
    try {
        // Retrieve token from session storage (or localStorage if used)
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found. Please log in.');
        }

        // Make the request with the token in the Authorization header
        const response = await fetch(`/api/task/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include token in the header
            },
        });

        // Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch tasks');
        }

        // Parse and return the response data
        const data = await response.json();

        console.log('Fetched tasks:', data);

        // Optional: Sort tasks by created date (if applicable)
        data.sort((a: { created_at: string }, b: { created_at: string }) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}



async function updateTask(id: number, status:string, description: string): Promise<any> {
    try {
        const response = await fetch(`/api/task/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: description,
                description: description,
                uuid: id,
                status: status === 'completed' ? 'pending' : 'completed',
            })
        });

        if (!response.ok) throw new Error('Failed to update task');
        return await response.json();

    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
 }

async function deleteTask(taskId: number): Promise<any> {
    try {
        const response = await fetch(`/api/task/delete/${taskId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return response;
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

export { createUserTask, getTasks, updateTask, deleteTask };