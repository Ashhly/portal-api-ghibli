// URL de la API pública de Studio Ghibli
const API_URL = 'https://ghibliapi.vercel.app/films';

const moviesGrid = document.getElementById('moviesGrid');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let allMovies = [];

// Función para obtener datos desde el servicio web
async function fetchMovies() {
    try {
        loader.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        allMovies = data;
        displayMovies(allMovies);
    } catch (error) {
        console.error('Error al consumir la API:', error);
        errorMessage.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
    }
}

// Función para renderizar las tarjetas en el DOM
function displayMovies(movies) {
    moviesGrid.innerHTML = '';

    if (movies.length === 0) {
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');

    movies.forEach(movie => {
        const card = document.createElement('article');
        card.className = 'movie-card';

        // Imagen o poster de la película proveniente de la API
        const bannerImg = movie.movie_banner || movie.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500';

        card.innerHTML = `
            <img src="${bannerImg}" alt="${movie.title}" class="movie-banner" loading="lazy">
            <div class="movie-body">
                <h3 class="movie-title">${movie.title}</h3>
                <span class="movie-original-title">${movie.original_title} (${movie.original_title_romanised})</span>
                
                <div class="movie-info">
                    <span class="badge-pill">📅 ${movie.release_date}</span>
                    <span class="badge-score">⭐ ${movie.rt_score}%</span>
                </div>

                <p class="movie-desc">${movie.description}</p>
                
                <div class="movie-footer">
                    <span>🎬 Director: <strong>${movie.director}</strong></span>
                </div>
            </div>
        `;

        moviesGrid.appendChild(card);
    });
}

// Función para filtrar películas por texto
function filterMovies() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.director.toLowerCase().includes(query)
    );
    displayMovies(filtered);
}

// Event Listeners
searchBtn.addEventListener('click', filterMovies);
searchInput.addEventListener('input', filterMovies);

// Cargar películas al iniciar la página
document.addEventListener('DOMContentLoaded', fetchMovies);