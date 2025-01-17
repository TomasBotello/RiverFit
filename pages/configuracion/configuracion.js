const API_URL = 'http://localhost:4000/api/';

    // Verifica si el usuario tiene un token válido en localStorage
    const token = localStorage.getItem("token");

    // Si no hay token, redirige al inicio de sesión o página pública
    if (!token) {
        alert("Acceso denegado. Por favor, inicia sesión.");
        window.location.href = "../index.html"; // Redirige al inicio
    }

document.addEventListener('DOMContentLoaded', () => {
    const btnSolicitarCodigo = document.getElementById('btn-solicitar-codigo');
    const solicitarCodigoSection = document.getElementById('solicitar-codigo-section');
    const ingresarCodigoSection = document.getElementById('ingresar-codigo-section');
    const formCambiarContrasena = document.getElementById('form-cambiar-contrasena');
    const notificationContainer = document.getElementById('notification-container');

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;

        notification.querySelector('.close-btn').addEventListener('click', () => {
            notificationContainer.removeChild(notification);
        });

        notificationContainer.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notificationContainer.removeChild(notification);
            }
        }, 5000);
    }

    async function obtenerToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró el token. Por favor, inicia sesión.');
        }
        return token;
    }

    async function cargarInfoMiembro() {
        try {
            const token = await obtenerToken();
            const response = await fetch(`${API_URL}miembros/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const miembro = await response.json();
            document.getElementById('miembro-nombre').textContent = `${miembro.nombre} ${miembro.apellido_pat} ${miembro.apellido_mat}`;
            document.getElementById('miembro-correo').textContent = miembro.correo;
            document.getElementById('miembro-telefono').textContent = miembro.telefono_personal;
            document.getElementById('miembro-fecha-registro').textContent = new Date(miembro.fecha_registro).toLocaleDateString();

            showNotification('Información personal cargada correctamente.', 'success');
        } catch (error) {
            console.error('Error al cargar la información del miembro:', error.message);
            showNotification('Error al cargar la información del miembro.', 'error');
        }
    }

    async function cargarEstadoMembresia() {
        try {
            const token = await obtenerToken();
            const response = await fetch(`${API_URL}estado-membresia`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            const membresia = data.status[0];
            document.getElementById('membresia-nombre').textContent = membresia.nombre_membresia;
            document.getElementById('membresia-descripcion').textContent = membresia.descripcion_membresia;
            document.getElementById('membresia-fecha-inicio').textContent = new Date(membresia.fecha_inicio).toLocaleDateString();
            document.getElementById('membresia-fecha-fin').textContent = new Date(membresia.fecha_fin).toLocaleDateString();
            document.getElementById('membresia-estado').textContent = membresia.estado;

            showNotification('Estado de la membresía cargado correctamente.', 'success');
        } catch (error) {
            console.error('Error al cargar el estado de la membresía:', error.message);
            showNotification('Error al cargar el estado de la membresía.', 'error');
        }
    }

    async function solicitarCodigoTemporal() {
        try {
            const token = await obtenerToken();
            const response = await fetch(`${API_URL}miembros/solicitar-cambio-contrasena`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            showNotification('Código enviado a tu correo electrónico.', 'success');
            solicitarCodigoSection.style.display = 'block';
            ingresarCodigoSection.style.display = 'block';
        } catch (error) {
            console.error('Error al solicitar el código:', error.message);
            showNotification('No se pudo enviar el código. Inténtalo de nuevo.', 'error');
        }
    }

    async function cambiarContrasena(event) {
        event.preventDefault();

        try {
            const token = await obtenerToken();
            const codigo = document.getElementById('codigo').value;
            const nuevaContrasena = document.getElementById('nueva-contrasena').value;

            const response = await fetch(`${API_URL}miembros/cambiar-contrasena`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ codigo, nuevaContrasena })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            showNotification('Contraseña cambiada exitosamente.', 'success');
            solicitarCodigoSection.style.display = 'block';
            ingresarCodigoSection.style.display = 'none';
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error.message);
            showNotification('No se pudo cambiar la contraseña. Verifica el código e inténtalo nuevamente.', 'error');
        }
    }

    cargarInfoMiembro();
    cargarEstadoMembresia();
    btnSolicitarCodigo.addEventListener('click', solicitarCodigoTemporal);
    formCambiarContrasena.addEventListener('submit', cambiarContrasena);
});
