// Base URL de la API
const API_URL = 'http://api.riverfit.com.mx/api/rutinas';

// Función para limpiar etiquetas HTML y decodificar entidades
function limpiarHTML(texto) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = texto;
    return tempDiv.textContent || tempDiv.innerText || '';
}

// Función para obtener datos de la API
async function obtenerRutina(rutinaId, plantillaId) {
    try {
        const token = localStorage.getItem('token'); // Obtener el token desde el almacenamiento local
        if (!token) {
            throw new Error('Token no encontrado. Por favor, inicia sesión.');
        }

        const respuesta = await fetch(`${API_URL}/${rutinaId}/${plantillaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`Error al obtener la rutina: ${respuesta.statusText}`);
        }

        const datos = await respuesta.json();
        renderizarRutina(datos);
    } catch (error) {
        console.error('Error al cargar la rutina:', error.message);
        document.body.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

// Función para renderizar la rutina en el HTML
function renderizarRutina(rutina) {
    const contenedor = document.querySelector('.main-container');

    // Limpiar contenido previo
    contenedor.innerHTML = '';

    // Crear encabezado
    const encabezadoHTML = `
        <header>
            <h1>${limpiarHTML(rutina.titulo || 'Título no disponible')}</h1>
            <p>${limpiarHTML(rutina.subtitulo || 'Subtítulo no disponible')}</p>
        </header>
    `;

    // Crear detalles
    const detallesHTML = rutina.detalles.map((detalle, index) => `
        <div class="card">
            <h3>${['Duración', 'Nivel', 'Objetivo'][index] || 'Detalle'}</h3>
            <p>${limpiarHTML(detalle.valor || 'N/A')}</p>
        </div>
    `).join('');

    const detallesSectionHTML = `
        <section class="routine-details">
            <h2>Detalles de la Rutina</h2>
            <div class="details-cards">
                ${detallesHTML}
            </div>
        </section>
    `;

    // Crear pasos (manejo de imágenes opcional)
    const pasosHTML = (rutina.pasos || []).map((paso, index) => `
        <div class="step-card">
            ${paso.imagen_paso ? `<img src="${paso.imagen_paso}" alt="Paso ${index + 1}" class="step-image">` : ''}
            <div class="step-info">
                <h3>Paso ${index + 1}: ${limpiarHTML(paso.titulo_paso || 'Título del paso')}</h3>
                <p>${limpiarHTML(paso.descripcion_paso || 'Descripción no disponible')}</p>
            </div>
        </div>
    `).join('');

    const pasosSectionHTML = pasosHTML
        ? `
        <section class="routine-steps">
            <h2>Pasos a Seguir</h2>
            ${pasosHTML}
        </section>
    `
        : '';

    // Crear recomendaciones
    const recomendacionesHTML = rutina.recomendaciones.map(rec => `
        <li>${limpiarHTML(rec)}</li>
    `).join('');

    const recomendacionesSectionHTML = `
        <section class="routine-recommendations">
            <h2>Recomendaciones</h2>
            <ul>
                ${recomendacionesHTML}
            </ul>
        </section>
    `;

    // Crear pie de página
    const pieHTML = `
        <footer>
            <p>Consulta con tu entrenador para personalizar esta rutina según tus necesidades.</p>
            <a href="/rutinas" class="btn">Volver a la Lista</a>
        </footer>
    `;

    // Insertar todas las secciones en el contenedor principal
    contenedor.innerHTML = `
        ${encabezadoHTML}
        ${detallesSectionHTML}
        ${pasosSectionHTML}
        ${recomendacionesSectionHTML}
        ${pieHTML}
    `;
}

// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);
const rutinaId = params.get('id');
const plantillaId = params.get('plantilla_id') || '2'; // Por defecto, plantilla 2

// Validar los parámetros y cargar la rutina
if (rutinaId && plantillaId) {
    obtenerRutina(rutinaId, plantillaId);
} else {
    document.body.innerHTML = `<p style="color: red;">No se proporcionó un ID de rutina o plantilla válido.</p>`;
}
