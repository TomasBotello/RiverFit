const API_URL = 'http://localhost:4000/api/auth/login/miembro';

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, contrasena: password }),
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const data = await response.json();

        // Guarda el token en localStorage y cookies
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; SameSite=Strict;`;

        // Redirige a /inicio
        window.location.href = '/inicio';
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
});
