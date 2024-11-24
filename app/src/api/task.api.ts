


async function createUserTask(taskData: { title: string, user_id: string }): Promise<any> {
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
}

async function getTasks(userId: string): Promise<any> {
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
}


// async function updateTask(task: Task): Promise<Task> {
//   const response = await axios.put<Task>(`${baseUrl}/tasks/${task.id}`, task);
//   return response.data;
// }

// async function deleteTask(id: number): Promise<void> {
//   await axios.delete(`${baseUrl}/tasks/${id}`);
// }

export { createUserTask, getTasks };