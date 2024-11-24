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

interface StoredUserLocal {
    username: string;
    email: string;
    avatar: string;
    user_id: string;
    token: string;
}

interface User {
    id: number;
    uuid: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
}