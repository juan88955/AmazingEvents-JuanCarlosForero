//Script para la página de estadísticas
import { fetchData, generateFeaturedEventsTable, generateUpcomingEventsTable, generatePastEventsTable } from '../modules/functions.js';

// Función principal para inicializar la página de estadísticas
function initStats() {
  fetchData()
    .then(data => {
      const { events, currentDate } = data;

      generateFeaturedEventsTable(events, currentDate);
      generateUpcomingEventsTable(events, currentDate);
      generatePastEventsTable(events, currentDate);
    })
    .catch(error => {
      console.error('Error loading stats:', error);
      displayErrorMessage('An error occurred while loading the statistics. Please try again later.');
    });
}

// Función para mostrar mensajes de error
function displayErrorMessage(message) {
  const containerIds = ['featured-events-table', 'upcoming-events-table', 'past-events-table'];

  containerIds.forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = `<p class="text-center text-danger">${message}</p>`;
    }
  });
}

// Inicializar la página cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initStats);