document.getElementById('logout-button').addEventListener('click', async (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del enlace

    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            alert('No hay sesión activa.');
            window.location.href = '/login';
            return;
        }

        // Realizar la solicitud a la API para cerrar sesión
        const response = await fetch('http://localhost:4000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al cerrar sesión:', errorData);
            throw new Error(errorData.message || 'Error al cerrar sesión');
        }

        // Borrar las cookies (frontend)
        document.cookie = 'token=; Max-Age=0; path=/;';

        // Redirigir al usuario al inicio de sesión
        alert('Sesión cerrada correctamente.');
        window.location.href = '/login';
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
        alert('Ocurrió un error al cerrar sesión.');
    }
});
