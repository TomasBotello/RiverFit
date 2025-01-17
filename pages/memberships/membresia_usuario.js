// Asumiendo que tienes un token JWT almacenado en localStorage
const token = localStorage.getItem("token");
console.log("Token JWT:", token);  // Verifica si el token se obtiene correctamente

// URL del endpoint de suscripciones y estado de membresía
const apiSuscripcionesUrl = 'http://api.riverfit.com.mx/api/suscripciones';
const apiEstadoMembresiaUrl = 'http://api.riverfit.com.mx/api/estado-membresia';
const apiMembresiasUrl = 'http://api.riverfit.com.mx/api/membresias';  // Endpoint de membresías

// Función para obtener las suscripciones
const obtenerSuscripciones = async () => {
    try {
        const response = await fetch(apiSuscripcionesUrl, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Response status:", response.status);  // Verifica el código de estado

        if (!response.ok) {
            throw new Error('Error al obtener suscripciones');
        }

        const data = await response.json();
        console.log("Datos de suscripciones:", data);  // Muestra los datos devueltos por el servidor

        if (data.subscriptions && data.subscriptions.length > 0) {
            // Mostrar las suscripciones en la tabla
            const tableBody = document.querySelector('#subscriptions-table tbody');
            tableBody.innerHTML = '';  // Limpiar la tabla antes de agregar nuevas filas
            data.subscriptions.forEach(subscription => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${subscription.nombre_membresia}</td>
                    <td>${subscription.descripcion_membresia}</td>
                    <td>${subscription.duracion} ${subscription.unidad_duracion}</td>
                    <td>${subscription.precio}</td>
                    <td>${new Date(subscription.fecha_inicio).toLocaleDateString()}</td>
                    <td>${new Date(subscription.fecha_fin).toLocaleDateString()}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            showNotification('No tienes suscripciones activas.', 'error');
        }
    } catch (error) {
        console.error('Error al cargar las suscripciones:', error);
        showNotification('Hubo un problema al cargar las suscripciones.', 'error');
    }
};

// Función para obtener el estado de la membresía
const obtenerEstadoMembresia = async () => {
    try {
        const response = await fetch(apiEstadoMembresiaUrl, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el estado de la membresía');
        }

        const data = await response.json();
        console.log("Estado de la membresía:", data);  // Muestra los datos del estado de membresía

        // Mostrar el estado de la membresía
        const membresia = data.status[0];
        document.getElementById('membresia-nombre').textContent = membresia.nombre_membresia;
        document.getElementById('membresia-descripcion').textContent = membresia.descripcion_membresia;
        document.getElementById('membresia-fecha-inicio').textContent = new Date(membresia.fecha_inicio).toLocaleDateString();
        document.getElementById('membresia-fecha-fin').textContent = new Date(membresia.fecha_fin).toLocaleDateString();
        document.getElementById('membresia-estado').textContent = membresia.estado;

    } catch (error) {
        console.error('Error al cargar el estado de la membresía:', error);
        showNotification('Hubo un problema al cargar el estado de la membresía.', 'error');
    }
};

// Función para abrir el modal
function openModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    cargarMembresias();  // Llamar a la API para obtener las membresías
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Función para cargar las membresías desde la API
async function cargarMembresias() {
    try {
        console.log("Cargando las membresías...");
        const response = await fetch(apiMembresiasUrl, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las membresías');
        }

        const data = await response.json();
        console.log("Membresías:", data);  // Verifica la respuesta de la API

        // Verifica si 'data' es un array o si los datos están dentro de una propiedad
        const memberships = Array.isArray(data) ? data : data.memberships || []; // Ajustar según la estructura de la API

        const tableBody = document.querySelector('#membresia-table tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas
        memberships.forEach(membresia => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${membresia.nombre}</td>
                <td>${membresia.descripcion}</td>
                <td>${membresia.duracion} ${membresia.unidad_duracion}</td>
                <td>${membresia.precio}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar las membresías:", error);
    }
}

// Llamamos a las funciones para cargar las suscripciones y el estado de la membresía cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerSuscripciones();
    obtenerEstadoMembresia();
});




const apiListarArchivosUrl = 'http://api.riverfit.com.mx/api/listar-archivos';

// Función para cargar las suscripciones compradas
const obtenerSuscripcionesCompradas = async () => {
    try {
        const response = await fetch(apiListarArchivosUrl, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las suscripciones compradas');
        }

        const data = await response.json();
        console.log("Suscripciones compradas:", data);

        const tableBody = document.querySelector('#compras-table tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

        if (data.length > 0) {
            data.forEach(compra => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${compra.fechaCreacion ? new Date(compra.fechaCreacion).toLocaleDateString() : "N/A"}</td>
                    <td>
                        <button class="table-btn" onclick="descargarPdf('${compra.rutaPdf}')">Descargar PDF</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="2" style="text-align:center;">No tienes suscripciones compradas.</td>`;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error al cargar las suscripciones compradas:', error);
        showNotification('Hubo un problema al cargar las suscripciones compradas.', 'error');
    }
};

function descargarPdf(rutaPdf) {
    if (rutaPdf) {
        // Crear un iframe para simular la descarga
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = rutaPdf; // Establecer la URL del archivo
        document.body.appendChild(iframe);

        // Opcional: remover el iframe después de un tiempo
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000); // 1 segundo después de iniciar la descarga
    } else {
        showNotification('No se encontró la ruta del PDF.', 'error');
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


// Llamamos a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerSuscripcionesCompradas();
});
