// Script para la página de inicio
import { fetchData, createCategoryCheckboxes, displayEvents, filterEvents } from '../modules/functions.js';

// Selección de elementos del DOM
const contenedor = document.getElementById("contenedor");
const checkboxContainer = document.getElementById("checkboxContainer");
const searchInput = document.querySelector('input[type="search"]');
const searchButton = document.getElementById('searchButton');

// Variable para almacenar todos los eventos
let allEvents = [];

// Función de inicialización
function init() {
  fetchData()
    .then(data => {
      allEvents = data.events;

      // Crear checkboxes y mostrar eventos
      createCategoryCheckboxes(allEvents, checkboxContainer);
      displayEvents(allEvents, contenedor);

      // Agregar event listeners
      searchButton.addEventListener('click', handleSearch);
      searchInput.addEventListener('input', handleSearch);
      checkboxContainer.addEventListener('change', handleSearch);
    })
    .catch(error => {
      contenedor.innerHTML = '<p class="text-center text-danger">Error loading events. Please try again later.</p>';
      console.error('Error initializing app:', error);
    });
}

// Función para manejar la búsqueda y filtrado
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategories = Array.from(document.querySelectorAll('.form-check-input:checked'))
    .map(checkbox => checkbox.value);

  const filteredEvents = filterEvents(allEvents, searchTerm, selectedCategories);
  displayEvents(filteredEvents, contenedor);
}

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);