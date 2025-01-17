const API_URL = 'http://api.riverfit.com.mx/api/rutinas/publicadas'; // Cambia esto por la URL real de tu API

// Función para limpiar etiquetas HTML y decodificar caracteres especiales
function limpiarHTML(texto) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = texto;
    return tempDiv.textContent || tempDiv.innerText || '';
}

// Función para cargar rutinas desde el API
async function cargarRutinas() {
    try {
        const token = localStorage.getItem('token'); // Obtener el token almacenado
        if (!token) {
            showNotification('Token no encontrado. Por favor, inicia sesión.', 'error');
            return;
        }

        const respuesta = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Agregar token al encabezado
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            showNotification(`Error ${respuesta.status}: ${errorData.message || 'No autorizado'}`, 'error');
            return;
        }

        const rutinas = await respuesta.json();
        mostrarRutinas(rutinas); // Mostrar rutinas
    } catch (error) {
        console.error('Error al cargar las rutinas:', error.message);
        showNotification(`Error al cargar las rutinas: ${error.message}`, 'error');
    }
}


// Función para generar contenedores dinámicos de rutinas
function mostrarRutinas(rutinas) {
    const contenedor = document.getElementById('rutinas-container');
    contenedor.innerHTML = '';

    rutinas.forEach(rutina => {
        const card = document.createElement('div');
        card.className = 'rutina-card';

        const titulo = limpiarHTML(rutina.titulo);
        const subtitulo = rutina.subtitulo ? `<p class="subtitulo">${limpiarHTML(rutina.subtitulo)}</p>` : '';

        const detalles = rutina.detalles.map(detalle => `<p>${limpiarHTML(detalle.valor)}</p>`).join('');
        const recomendaciones = rutina.recomendaciones.map(rec => `<p>${limpiarHTML(rec)}</p>`).join('');

        // Determina el archivo HTML según el `plantilla_id`
        const plantillaUrl = `/rutinas/plantilla${rutina.plantilla_id}?id=${rutina.id}`;


        card.innerHTML = `
            <h2><a href="${plantillaUrl}" class="titulo-link">${titulo}</a></h2>
            ${subtitulo}
            <div class="detalles">
                <strong>Detalles:</strong>
                ${detalles}
            </div>
            <div class="recomendaciones">
                <strong>Recomendaciones:</strong>
                ${recomendaciones}
            </div>
            <button class="btn-redirigir" onclick="window.location.href='${plantillaUrl}'">Ver más</button>
        `;

        contenedor.appendChild(card);
    });
}

function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
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


// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarRutinas);
