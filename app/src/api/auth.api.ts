
function loginUser(formData:object) {
    // This is a fake login function that will return a user object if the username and password are correct.
    // In a real application, you would make a request to the server to authenticate the user.
    if (formData.username === 'admin' && formData.password === 'admin') {
        return {
        id: 1,
        username: 'admin',
        email: '',
        firstName: 'Admin',


        lastName: 'User',
        role: 'admin',
        };
    }

}


//**


function logout() {
  // This is a fake logout function that will remove the user from the local storage.
  // In a real application, you would make a request to the server to remove the user's session.
  localStorage.removeItem('user');
  window.location.href = '/login';
}
