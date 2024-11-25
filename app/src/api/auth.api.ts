
async function loginUser(username: string, password: string): Promise<any> {
  try {
      const response = await fetch(`/api/auth/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to login');
      }

      // Parse the response
      const { token, ...user } = await response.json();

      // Validate token before storing
      if (!token) {
          throw new Error('Token not provided in the response');
      }

      // Save token in sessionStorage
      sessionStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Login successful:', user);
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
    try {
        // Clear the token from sessionStorage
        sessionStorage.removeItem('authToken');

        // Clear user info from localStorage
        localStorage.removeItem('user');

        console.log('Logged out');
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }

}

export { loginUser, registerUser, logout };