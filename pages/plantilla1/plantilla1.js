// Base URL de la API
const API_URL = 'http://api.riverfit.com.mx/api/rutinas';

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
    const contenedor = document.getElementById('rutina-container');

    const pasosHTML = rutina.pasos.map((paso, index) => {
        // Limpia el contenido de la descripción eliminando etiquetas <img> si ya se usa imagen_paso
        const descripcionLimpia = paso.descripcion_paso.replace(/<img[^>]*>/g, '');

        return `
            <div class="exercise-step">
                <div class="step-header">
                    <div class="step-number">${index + 1}</div>
                    <h3>${paso.titulo_paso}</h3>
                </div>
                ${paso.imagen_paso ? `<img src="${paso.imagen_paso}" alt="${paso.titulo_paso}" class="exercise-image">` : ''}
                <p>${descripcionLimpia}</p>
            </div>
        `;
    }).join('');

    const recomendacionesHTML = rutina.recomendaciones.map(rec => `
        <li>${rec}</li>
    `).join('');

    contenedor.innerHTML = `
        <!-- Encabezado -->
        <header>
            <h1>Rutina: ${rutina.titulo}</h1>
            <p>${rutina.subtitulo}</p>
        </header>

        <!-- Contenido Principal -->
        <div class="content">
            <!-- Detalles Generales -->
            <section class="section details">
                <h2>Detalles Generales</h2>
                <ul>
                    <li><strong>Duración:</strong> ${rutina.detalles[0]?.valor || 'N/A'}</li>
                    <li><strong>Nivel:</strong> ${rutina.detalles[1]?.valor || 'N/A'}</li>
                    <li><strong>Objetivo:</strong> ${rutina.detalles[2]?.valor || 'N/A'}</li>
                </ul>
            </section>

            <!-- Ejercicios -->
            <section class="section exercises">
                <h2>Ejercicios</h2>
                ${pasosHTML}
            </section>

            <!-- Recomendaciones -->
            <section class="section recommendations">
                <h2>Recomendaciones</h2>
                <ul>
                    ${recomendacionesHTML}
                </ul>
            </section>
        </div>

        <!-- Pie de página -->
        <footer>
            <p>Recuerda siempre escuchar a tu cuerpo y consultar a un entrenador si tienes dudas.</p>
            <a href="/rutinas" class="btn-back">Volver a la lista</a>
        </footer>
    `;
}



// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);
const rutinaId = params.get('id');
const plantillaId = params.get('plantilla_id') || '1'; // Valor por defecto si no se pasa

// Validar los parámetros y cargar la rutina
if (rutinaId && plantillaId) {
    obtenerRutina(rutinaId, plantillaId);
} else {
    document.body.innerHTML = `<p style="color: red;">No se proporcionó un ID de rutina o plantilla válido.</p>`;
}
