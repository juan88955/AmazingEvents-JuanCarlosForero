// Función para obtener datos de la API usando fetch puro
export function fetchData() {
  // Hacemos una petición a la API
  return fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => {
      // Verificamos si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Convertimos la respuesta a JSON
      return response.json();
    })
    .catch(error => {
      // Si hay un error, lo mostramos en la consola y lo lanzamos
      console.error('Error fetching data:', error);
      throw error;
    });
}

// Función para crear checkboxes de categorías
export function createCategoryCheckboxes(events, checkboxContainer) {
  // Obtenemos categorías únicas de los eventos
  const categories = [...new Set(events.map(event => event.category))];
  // Creamos un fragmento para mejorar el rendimiento
  const fragment = document.createDocumentFragment();

  // Por cada categoría, creamos un checkbox
  categories.forEach(category => {
    const checkbox = document.createElement('div');
    checkbox.className = 'form-check';
    checkbox.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${category}" id="${category}">
      <label class="form-check-label" for="${category}">${category}</label>
    `;
    fragment.appendChild(checkbox);
  });

  // Limpiamos el contenedor y añadimos los nuevos checkboxes
  checkboxContainer.innerHTML = '';
  checkboxContainer.appendChild(fragment);
}

// Función para mostrar eventos en la página
export function displayEvents(events, container) {
  // Si no hay eventos, mostramos un mensaje
  if (events.length === 0) {
    container.innerHTML = '<p class="text-center">No events found matching your search.</p>';
    return;
  }

  // Creamos una fila para los eventos
  const row = document.createElement('div');
  row.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center';

  // Creamos una tarjeta para cada evento
  row.innerHTML = events.map(event => `
    <div class="col">
      <div class="card h-100">
        <img src="${event.image}" class="card-img-top" alt="${event.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${event.name}</h5>
          <p class="card-text">${event.description}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <p class="mb-0"><span class="fw-bold">Price:</span> $${event.price}</p>
            <a href="../pages/details.html?id=${event._id}" class="btn btn-primary">Details</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Limpiamos el contenedor y añadimos las nuevas tarjetas
  container.innerHTML = '';
  container.appendChild(row);
}

// Función para filtrar eventos según término de búsqueda y categorías seleccionadas
export function filterEvents(events, searchTerm, selectedCategories) {
  return events.filter(event => {
    // Verificamos si el evento coincide con el término de búsqueda
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Verificamos si el evento pertenece a las categorías seleccionadas
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
    return matchesSearch && matchesCategory;
  });
}

// Función para mostrar detalles de un evento específico
export function displayEventDetails(event) {
  const detailsContainer = document.getElementById('eventDetails');
  // Creamos el HTML para mostrar los detalles del evento
  detailsContainer.innerHTML = `
    <div class="ContainerDetails">
      <div class="row">
        <div class="col-12">
          <div class="card shadow" style="max-width: 1000px; margin: auto;">
            <div class="row g-0">
              <div class="col-md-6 p-0">
                <img src="${event.image}" class="img-fluid w-100 h-100" style="object-fit: cover; max-height: 404px;" alt="${event.name}">
              </div>
              <div class="col-md-6">
                <div class="card-body h-100 d-flex flex-column">
                  <h2 class="card-title mb-4">${event.name}</h2>
                  <ul class="list-group list-group-flush flex-grow-1">
                    <li class="list-group-item"><strong>Date:</strong> ${event.date}</li>
                    <li class="list-group-item"><strong>Description:</strong> ${event.description}</li>
                    <li class="list-group-item"><strong>Category:</strong> ${event.category}</li>
                    <li class="list-group-item"><strong>Place:</strong> ${event.place}</li>
                    <li class="list-group-item"><strong>Capacity:</strong> ${event.capacity}</li>
                    ${event.assistance ? `<li class="list-group-item"><strong>Assistance:</strong> ${event.assistance}</li>` : ''}
                    ${event.estimate ? `<li class="list-group-item"><strong>Estimate:</strong> ${event.estimate}</li>` : ''}
                    <li class="list-group-item"><strong>Price:</strong> $${event.price}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Función para mostrar un mensaje de error
export function displayErrorMessage(message) {
  const detailsContainer = document.getElementById('eventDetails');
  detailsContainer.innerHTML = `<p class="text-center text-danger">${message}</p>`;
}

// Función para generar la tabla de eventos destacados
export function generateFeaturedEventsTable(events, currentDate) {
  // Calculamos los eventos con mayor y menor asistencia, y mayor capacidad
  const { highestAttendance, lowestAttendance, largestCapacity } = events.reduce((acc, event) => {
    const attendancePercentage = calculateAttendancePercentage(event.assistance, event.capacity);
    if (attendancePercentage > acc.highestAttendancePercentage || attendancePercentage === acc.highestAttendancePercentage && event.capacity > acc.highestAttendance.capacity) {
      acc.highestAttendance = event;
      acc.highestAttendancePercentage = attendancePercentage;
    }
    if (attendancePercentage < acc.lowestAttendancePercentage) {
      acc.lowestAttendance = event;
      acc.lowestAttendancePercentage = attendancePercentage;
    }
    if (event.capacity > acc.largestCapacity.capacity) {
      acc.largestCapacity = event;
    }
    return acc;
  }, { highestAttendance: null, lowestAttendance: null, largestCapacity: { capacity: 0 }, highestAttendancePercentage: 0, lowestAttendancePercentage: 100 });

  // Actualizamos la tabla con los resultados
  document.getElementById('highest-attendance').textContent =
    `${highestAttendance.name} with ${calculateAttendancePercentage(highestAttendance.assistance || highestAttendance.estimate, highestAttendance.capacity).toFixed(2)}%`;

  document.getElementById('lowest-attendance').textContent =
    `${lowestAttendance.name} with ${calculateAttendancePercentage(lowestAttendance.assistance || lowestAttendance.estimate, lowestAttendance.capacity).toFixed(2)}%`;

  document.getElementById('largest-capacity').textContent =
    `${largestCapacity.name} with capacity of ${largestCapacity.capacity}`;
}

// Función auxiliar para generar tablas de eventos (pasados o futuros)
function generateEventsTable(events, currentDate, tableBodyId, isPast) {
  const tableBody = document.getElementById(tableBodyId);
  tableBody.innerHTML = ''; // Limpiamos las filas existentes

  // Filtramos los eventos según si son pasados o futuros
  const filteredEvents = events.filter(event =>
    isPast ? new Date(event.date) < new Date(currentDate) : new Date(event.date) >= new Date(currentDate)
  );

  // Calculamos los datos para cada categoría
  const categoryData = filteredEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = { revenue: 0, attendance: 0, count: 0 };
    }
    const attendance = isPast ? event.assistance : event.estimate;
    acc[event.category].revenue += attendance * event.price;
    acc[event.category].attendance += calculateAttendancePercentage(attendance, event.capacity);
    acc[event.category].count++;
    return acc;
  }, {});

  // Creamos una fila en la tabla para cada categoría
  Object.entries(categoryData).forEach(([category, data]) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = category;
    row.insertCell().textContent = `$${data.revenue.toFixed(2)}`;
    row.insertCell().textContent = `${(data.attendance / data.count).toFixed(2)}%`;
  });
}

// Función para generar la tabla de eventos futuros
export function generateUpcomingEventsTable(events, currentDate) {
  generateEventsTable(events, currentDate, 'upcoming-events-body', false);
}

// Función para generar la tabla de eventos pasados
export function generatePastEventsTable(events, currentDate) {
  generateEventsTable(events, currentDate, 'past-events-body', true);
}

// Función auxiliar para calcular el porcentaje de asistencia
function calculateAttendancePercentage(attendance, capacity) {
  return (Number(attendance) / Number(capacity)) * 100;
}