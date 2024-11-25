
async function createUserTask(taskData: { title: string }): Promise<any> {
    try {

        console.log('Creating task:', taskData);
        const token = sessionStorage.getItem('authToken'); 
        if (!token) {
            throw new Error('No auth token found. Please log in.');
        }

        const response = await fetch(`/api/task/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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


async function getTasks(): Promise<any[]> {
    try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found. Please log in.');
        }

        const response = await fetch(`/api/task/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch tasks');
        }

        const data = await response.json();
        console.log('data', data);
        const tasks = data || [];
        console.log('Fetched tasks:', tasks);
        if (tasks.length === 0) {
            return [];
        } else {

            return tasks.sort(
                (a: { created_at: string }, b: { created_at: string }) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        }

    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}


async function updateTask(id: number, newStatus: string, description: string): Promise<any> {
    try {
        const token = sessionStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found. Please log in.');

        const response = await fetch(`/api/task/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token in the request
            },
            body: JSON.stringify({
                title: description,
                description,
                status: newStatus,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update task');
        }

        console.log('Task updated successfully');

        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

async function deleteTask(taskId: number): Promise<any> {
    try {
        const token = sessionStorage.getItem('authToken'); // Or localStorage
        if (!token) throw new Error('No auth token found. Please log in.');

        const response = await fetch(`/api/task/delete/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        // Explicitly check response status if needed
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error(errorData.message || 'Failed to delete task');
        }

        // If the server returns no body, return a custom success message or similar 200
        return response.status
   
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}



export { createUserTask, getTasks, updateTask, deleteTask };