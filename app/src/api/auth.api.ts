
async function loginUser(username: string, password: string): Promise<any> {
   
  try {
    // TODO: Test this code with a real hashed password
        const response = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        if (!response.ok) throw new Error('Failed to login');

        // create new stored user local

        console.log('response from login', response);

        // save token in session storage
       // const data = await response.json();
        //console.log('data from login', data);
        //localStorage.setItem('user', JSON.stringify(data));
        
        const user = await response.json();
        console.log('user from login', user);
        localStorage.setItem('user', JSON.stringify(user));

        return user;

    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}


async function registerUser(username: string, password: string): Promise<any> {
    try {
        const response = await fetch(`/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: '',
                avatar: '',
            })
        });

        if (!response.ok) throw new Error('Failed to register');
        return await response.json();

    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
}


async function logout() {

}

export { loginUser, registerUser, logout };