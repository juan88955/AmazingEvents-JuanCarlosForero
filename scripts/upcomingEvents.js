// Script para eventos futuros
import { fetchData, createCategoryCheckboxes, displayEvents, filterEvents } from '../modules/functions.js';

// Selección de elementos del DOM
const contenedor = document.getElementById("contenedor");
const checkboxContainer = document.getElementById("checkboxContainer");
const searchInput = document.querySelector('input[type="search"]');
const searchButton = document.querySelector('#searchButton');

// Variable para almacenar eventos futuros
let upcomingEvents = [];

// Función de inicialización
function init() {
  fetchData()
    .then(data => {
      const currentDate = new Date(data.currentDate);

      // Filtrar eventos futuros
      upcomingEvents = data.events.filter(event => new Date(event.date) >= currentDate);

      // Crear checkboxes y mostrar eventos
      createCategoryCheckboxes(upcomingEvents, checkboxContainer);
      displayEvents(upcomingEvents, contenedor);

      // Agregar event listeners
      searchInput.addEventListener('input', handleSearch);
      searchInput.addEventListener('keypress', handleEnterKey);
      checkboxContainer.addEventListener('change', handleSearch);
    })
    .catch(error => {
      contenedor.innerHTML = '<p class="text-center text-danger">Error al cargar los eventos. Por favor, intente más tarde.</p>';
      console.error('Error initializing app:', error);
    });
}

// Función para manejar la tecla Enter en el campo de búsqueda
function handleEnterKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  }
}

// Función para manejar la búsqueda y filtrado
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategories = Array.from(document.querySelectorAll('.form-check-input:checked'))
    .map(checkbox => checkbox.value);

  const filteredEvents = filterEvents(upcomingEvents, searchTerm, selectedCategories);
  displayEvents(filteredEvents, contenedor);
}

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);