
//Script para mostrar los detalles de un evento
import { fetchData, displayEventDetails, displayErrorMessage } from '../modules/functions.js';

// Función para obtener el ID del evento de la URL
function getEventIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Función para encontrar el evento por ID
function findEventById(events, eventId) {
  return events.find(event => event._id.toString() === eventId);
}

// Función principal de inicialización
function init() {
  const eventId = getEventIdFromUrl();

  if (!eventId) {
    displayErrorMessage("No event ID provided");
    return;
  }

  fetchData()
    .then(data => {
      if (!data || !Array.isArray(data.events)) {
        throw new Error("Invalid data structure");
      }

      const event = findEventById(data.events, eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      displayEventDetails(event);
    })
    .catch(error => {
      displayErrorMessage(error.message || "Error loading event details. Please try again later.");
    });
}

// Inicializar la página cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);