document.addEventListener("DOMContentLoaded", function () {
    const today = new Date(); // Obtiene la fecha y hora actual
    const currentDay = today.getDay(); // Día de la semana (0: Domingo, 1: Lunes, ..., 6: Sábado)
    const currentHour = today.getHours(); // Hora actual (0-23)

    const openingHour = 6; // Hora de apertura
    const closingHour = 21; // Hora de cierre

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const day = parseInt(card.getAttribute("data-day"), 10);
        const isToday = day === currentDay;

        if (isToday) {
            // Resalta la tarjeta del día actual
            card.classList.add("current-day");

            // Determina el estado del gimnasio
            const statusText = (currentHour >= openingHour && currentHour < closingHour) 
                ? "Abierto ahora" 
                : "Cerrado ahora";

            // Inserta el estado en la tarjeta
            const statusElement = document.createElement("p");
            statusElement.textContent = statusText;
            statusElement.classList.add(statusText === "Abierto ahora" ? "text-success" : "text-danger");
            card.querySelector(".card-body").appendChild(statusElement);
        }
    });
});