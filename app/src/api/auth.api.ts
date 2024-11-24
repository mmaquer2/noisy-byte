
async function loginUser(username: string, password: string): Promise<any> {
   
  // testing login only to mock the login process
   if (username === 'admin' && password === 'admin') {
    console.log('Logged in successfully');
    localStorage.setItem('user', 
      JSON.stringify({
          username: 'admin',
          email: 'admin',
          avatar: '',
          user_id : 1,
          token: '1234'
  }));
  
  return {
        username: 'admin',
        email: 'admin',
        avatar: '',
        user_id : 1,
        token: '1234'
    };

    
  }

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


        return await response.json();

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