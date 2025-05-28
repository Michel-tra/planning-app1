export const logout = (navigate) => {
    localStorage.removeItem('user');
    navigate('/'); // Redirection vers la page de login
};
