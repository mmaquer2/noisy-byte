
async function createUserTask(taskData: { title: string, user_id: string }): Promise<any> {
    try {
    
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
    
        //TODO: sort by created date 
        //data.sort((a: TodoItem, b: TodoItem) => {
       //     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
       //  }); 

        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
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

async function deleteTask(taskId: number, userId: number): Promise<any> {
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