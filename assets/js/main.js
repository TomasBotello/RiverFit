// main.js

// Lógica para el formulario
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector("form"); // Selecciona el formulario de contacto
  
    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío tradicional del formulario
  
        // Captura los datos del formulario
        const formData = {
          nombre: document.getElementById("nombre").value,
          email: document.getElementById("email").value,
          mensaje: document.getElementById("mensaje").value,
        };
  
        console.log("Formulario de contacto enviado:", formData);
  
        // Simulación de envío de datos (puedes ajustar esta parte para tu backend)
        fetch("http://localhost:3000/contact/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert("Mensaje enviado con éxito");
              contactForm.reset(); // Limpia el formulario
            } else {
              alert("Error al enviar el mensaje");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Ocurrió un error al enviar el mensaje");
          });
      });
    } else {
      console.warn("No se encontró el formulario de contacto en el DOM.");
    }
  
    // Configuración del carrusel (usando Owl Carousel)
    $(document).ready(function() {
      $("#owl-demo").owlCarousel({
        items: 3, // Muestra solo 3 elementos
        loop: true, // Bucle infinito
        margin: 10, // Espaciado entre imágenes
        nav: true, // Flechas de navegación
        autoplay: true, // Activar autoplay
        autoplayTimeout: 3000, // Tiempo entre transiciones
        responsive: {
          0: {
            items: 1 // En pantallas pequeñas, muestra 1 imagen
          },
          768: {
            items: 2 // En pantallas medianas, muestra 2 imágenes
          },
          1024: {
            items: 3 // En pantallas grandes, muestra 3 imágenes
          }
        }
      });
    });
    
  });