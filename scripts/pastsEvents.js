// Script para eventos pasados
import { fetchData, createCategoryCheckboxes, displayEvents, filterEvents } from '../modules/functions.js';

// Selección de elementos del DOM
const contenedor = document.getElementById("contenedor");
const checkboxContainer = document.getElementById("checkboxContainer");
const searchInput = document.querySelector('input[type="search"]');
const searchButton = document.getElementById('searchButton');

// Variables para almacenar eventos y fecha actual
let allEvents = [];
let currentDate;

// Función de inicialización
function init() {
  fetchData()
    .then(data => {
      allEvents = data.events;
      currentDate = data.currentDate;

      const pastEvents = getPastEvents();

      createCategoryCheckboxes(pastEvents, checkboxContainer);
      displayEvents(pastEvents, contenedor);

      // Agregar event listeners
      searchButton.addEventListener('click', handleSearch);
      searchInput.addEventListener('input', handleSearch);
      checkboxContainer.addEventListener('change', handleSearch);
    })
    .catch(error => {
      console.error('Error initializing page:', error);
      contenedor.innerHTML = '<p class="text-center text-danger">Error loading events. Please try again later.</p>';
    });
}

// Función para obtener eventos pasados
function getPastEvents() {
  return allEvents.filter(event => new Date(event.date) < new Date(currentDate));
}

// Función para manejar la búsqueda y filtrado
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategories = Array.from(document.querySelectorAll('.form-check-input:checked'))
    .map(checkbox => checkbox.value);
  const pastEvents = getPastEvents();
  const filteredEvents = filterEvents(pastEvents, searchTerm, selectedCategories);
  displayEvents(filteredEvents, contenedor);
}

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);