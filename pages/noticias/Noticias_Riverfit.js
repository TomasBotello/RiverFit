// Base URL de la API
const API_URL = 'https://api.riverfit.com.mx/api/publicaciones';

// Función para obtener publicaciones
async function obtenerPublicaciones() {
    try {
        console.log('[obtenerPublicaciones] Iniciando solicitud a la API:', API_URL);

        const token = localStorage.getItem('token'); // Recuperar el token almacenado
        if (!token) {
            throw new Error('No se encontró el token. Por favor, inicia sesión.');
        }

        // Realizar la solicitud con el token en el encabezado
        const respuesta = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Agregar el token al encabezado
                'Content-Type': 'application/json',
            },
        });

        console.log('[obtenerPublicaciones] Respuesta del servidor:', respuesta.status);

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            console.error('[obtenerPublicaciones] Error en la respuesta:', errorData);
            showNotification(errorData.message || 'Error al cargar las publicaciones.', 'error');
            return;            
        }

        const publicaciones = await respuesta.json();
        console.log('[obtenerPublicaciones] Publicaciones recibidas:', publicaciones);

        renderizarPublicaciones(publicaciones);
    } catch (error) {
        console.error('[obtenerPublicaciones] Error al obtener publicaciones:', error.message);
    }
}

// Función para renderizar publicaciones
function renderizarPublicaciones(publicaciones) {
    const container = document.querySelector('#news-feed-container');
    container.innerHTML = '';

    publicaciones.forEach(pub => {
        console.log('[renderizarPublicaciones] Procesando publicación:', pub);

        const descripcionId = `descripcion-${pub.id}`;
        const imagenAutor = pub.imagen_autor || pub.imagen || '';
        const imagenHTML = pub.imagen
            ? `<div class="news-image">
                   <img src="${pub.imagen}" alt="${pub.titulo}" class="main-image">
               </div>`
            : '<div class="news-image-placeholder">Sin imagen</div>';

        const publicacionHTML = `
            <div class="news-item">
                <div class="news-header">
                    <img src="${imagenAutor}" alt="${pub.nombre_autor}" class="news-author-img">
                    <div class="news-author-info">
                        <p class="name">${pub.nombre_autor}</p>
                        <p class="date">${new Date(pub.fecha_hora).toLocaleString()}</p>
                    </div>
                </div>
                ${imagenHTML}
                <div class="news-content">
                    <h2>${pub.titulo}</h2>
                    <p id="${descripcionId}" class="news-description">${getTruncatedText(pub.descripcion, descripcionId)}</p>
                </div>
                <div class="news-footer">
                    <button class="btn btn-like ${pub.haReaccionado ? 'liked' : ''}" 
                            data-publicacion-id="${pub.id}">
                        Me gusta (${pub.reacciones})
                    </button>
                </div>
            </div>
        `;

        container.innerHTML += publicacionHTML;
    });

    console.log('[renderizarPublicaciones] Publicaciones renderizadas correctamente.');

    // Asociar eventos a los botones "Me gusta"
    document.querySelectorAll('.btn-like').forEach(boton => {
        boton.addEventListener('click', () => {
            const publicacionId = boton.getAttribute('data-publicacion-id');
            manejarReaccion(publicacionId, boton);
        });
    });
}

// Función para truncar texto y manejar "Ver más"
function getTruncatedText(text, descripcionId) {
    const maxLength = 150;
    if (text.length <= maxLength) return text;

    return `
        ${text.substring(0, maxLength)}...
        <span class="show-more-inline" data-target="${descripcionId}" data-full-text="${text}">Ver más</span>
    `;
}

// Evento "Ver más/Ver menos"
document.querySelector('#news-feed-container').addEventListener('click', event => {
    if (event.target.classList.contains('show-more-inline')) {
        const descripcionId = event.target.getAttribute('data-target');
        const descripcionElement = document.getElementById(descripcionId);
        const fullText = event.target.getAttribute('data-full-text');

        if (descripcionElement.classList.contains('expanded')) {
            descripcionElement.classList.remove('expanded');
            descripcionElement.innerHTML = getTruncatedText(fullText, descripcionId);
        } else {
            descripcionElement.classList.add('expanded');
            descripcionElement.innerHTML = `
                ${fullText}
                <span class="show-more-inline" data-target="${descripcionId}" data-full-text="${fullText}">Ver menos</span>
            `;
        }
    }
});

async function manejarReaccion(publicacionId, boton) {
    try {
        console.log(`[manejarReaccion] Procesando like para la publicación ID: ${publicacionId}`);

        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('No se encontró el token. Por favor, inicia sesión.', 'error');
            return;                        
        }

        const respuesta = await fetch(`${API_URL}/${publicacionId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log(`[manejarReaccion] Respuesta del servidor: ${respuesta.status}`);

        if (!respuesta.ok) {
            showNotification('Error al actualizar la reacción.', 'error');
            return;            
        }

        const data = await respuesta.json();
        console.log(`[manejarReaccion] Respuesta procesada:`, data);

        // Actualizar el estado visual del botón y contador
        boton.textContent = `Me gusta (${data.totalLikes})`;
        boton.classList.toggle('liked', data.message === 'Like agregado');
    } catch (error) {
        console.error('[manejarReaccion] Error:', error.message);
    }
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

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerPublicaciones);
