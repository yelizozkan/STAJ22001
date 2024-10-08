document.addEventListener("click", function () {
  if (document.getElementById("movie-search-box").value.length == 0) {
    document.querySelector(".search-c").style.display = "none";
  }
});

document.addEventListener("keyup", function () {
  if (document.getElementById("movie-search-box").value.length == 0) {
    document.querySelector(".search-c").style.display = "none";
  }
});

const apiKeyTMDB = "e261c1ebad4a66d2da6a9166a7d53dbf";

const toggleNav = (open) => {
  document.getElementById("myNav").style.height = open ? "100%" : "0%";
};

const createMovieDetails = (params) => {
  const resultGrid = document.getElementById("result-grid");
  if (resultGrid) {
    const { imgSrc, title, year, ratings, genres } = params;
    const { writers, actors, overview, languages, awards } = params;

    resultGrid.innerHTML = `
     <div class="movie-poster">
         <img src="${imgSrc}" alt="movie poster">
     </div>
     <div class="movie-info">
         <h3 class="movie-title">${title}</h3>
         <ul class="movie-misc-info">
             <li class="year">Year: ${year}</li>
             <li class="rated">Ratings: ${ratings}</li>
             <li class="released">Released: ${year}</li>
         </ul>
         <p class="genre"><b>Genre:</b> ${genres}</p>
         <p class="writer"><b>Writer:</b> ${writers}</p>
         <p class="actors"><b>Actors: </b>${actors}</p>
         <p class="plot"><b>Plot:</b> ${overview}</p>
         <p class="language"><b>Language:</b> ${languages}</p>
         <p class="awards"><b><i class="fas fa-award"></i></b> ${awards}</p>
     </div>
     `;
  }
};

const handleMovieDetails = (details) => {
  const { title, release_date, vote_average, overview } = details;

  const imgSrc = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "image_not_found.png";
  const genres = details.genres.map((genre) => genre.name).join(", ");
  const writers = details.credits.crew
    .filter((crew) => crew.job === "Screenplay" || crew.job === "Writer")
    .map((writer) => writer.name)
    .join(", ");
  const actors = details.credits.cast
    .slice(0, 5)
    .map((actor) => actor.name)
    .join(", ");
  const languages = details.spoken_languages
    .map((lang) => lang.name)
    .join(", ");
  const awards = details.awards || "No awards";
  const params = { imgSrc, title, year: release_date, ratings: vote_average };
  const params2 = { genres, writers, actors, overview, languages, awards };

  createMovieDetails({ ...params, ...params2 });
};

const onMovieClick = async (id) => {
  window.location.href = `movie-details.html?movieId=${id}`;
  const result = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKeyTMDB}&append_to_response=credits`
  );
  const movieDetails = await result.json();
  if (movieDetails) {
    const movieSearchBox = document.getElementById("movie-search-box");
    if (movieSearchBox) movieSearchBox.value = "";
    const searchListNode = document.getElementById("searchList");
    searchListNode.classList.remove("open");
    handleMovieDetails(movieDetails);
  }
};

const createMovieList = (movies) => {
  const searchListNode = document.getElementById("searchList");
  const searchPopup = document.getElementById("searchListPopup");

  if (searchPopup && searchListNode) {
    document.querySelector(".search-c").style.display = "block";
    const fragment = document.createDocumentFragment();
    for (let idx = 0; idx < movies.length; idx++) {
      const movieListItem = document.createElement("div");
      movieListItem.dataset.id = movies[idx].id;
      movieListItem.classList.add("search-list-item");
      const moviePoster = movies[idx].poster_path
        ? `https://image.tmdb.org/t/p/w500${movies[idx].poster_path}`
        : "image_not_found.png";
      movieListItem.innerHTML = `
              <div class="search-item-thumbnail">
                  <img src="${moviePoster}">
              </div>
              <div class="search-item-info">
                  <h3>${movies[idx].title}</h3>
                  <p>${movies[idx].release_date}</p>
              </div>
              `;

      movieListItem.onclick = () => onMovieClick(movieListItem.dataset.id);

      fragment.appendChild(movieListItem);
    }

    searchPopup.innerHTML = "";
    searchPopup.appendChild(fragment);
    searchListNode.classList.add("open");
  }
};

const fetchMovies = async (searchTerm) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}&query=${searchTerm}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results?.length) createMovieList(data.results);
};

let debouncedFetch = null;
let lastSearchVal = "";

const findMovies = (e) => {
  const value = e.target.value.trim();
  const searchListNode = document.getElementById("searchList");

  if (searchListNode) {
    if (value.length) {
      if (debouncedFetch) clearTimeout(debouncedFetch);
      debouncedFetch = setTimeout(() => {
        if (lastSearchVal !== value) {
          lastSearchVal = value;
          fetchMovies(value);
        }
      }, 500);
    } else if (searchListNode.classList.contains("open")) {
      searchListNode.classList.remove("open");
    }
  }
};

const onOutOfListClick = (e) => {
  if (e.target.id === e.currentTarget.id) e.target.classList.remove("open");
};

// document.addEventListener("DOMContentLoaded", () => {
//   createOverlayMenu();
// });

// var carouselWidth1 = $("carousel-inner-cards-1")[0].scrollWidth;
// var cardWidth = $("carousel-item-cards-1").width();

// var scrollPosition1 = 0;

$("carousel-control-next-1").on("click", function () {
  console.log("next");
  scrollPosition1 += cardWidth1;

  $("carousel-inner-cards-1").animate({ scrollLeft: scrollPosition1 }, 600);
});

const movieId = "MOVIE_ID"; // İlgili filmin ID'si

const getMovieVideos = async (movieId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
  );
  const data = await response.json();
  return data.results;
};

const getTrailerUrl = (videos) => {
  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

// Carousel kısmı
const createMovieCard = (movie, trailerUrl) => {
  const { title, release_date, vote_count, poster_path, vote_average } = movie;
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "image_not_found.png";

  return `
    <div class="carousel-item">
      <a href="#">
        ${
          trailerUrl
            ? `<iframe src="${trailerUrl}" style="width: 100%; height: 500px;" frameborder="0" allowfullscreen></iframe>`
            : `<img src="${imgSrc}" class="d-block w-100" alt="${title}">`
        }
      </a>
      <div class="slider-bottom">
        <img src="${imgSrc}" alt="${title}">
        <div class="slider-bottom-play-icon-section">
          <i class="fa-regular fa-circle-play" id="slider-bottom-play-icon"></i>
        </div>
        <div class="slider-bottom-text-section">
          <div>
            <h1>${title}</h1>
          </div>
          <div>
            <p>Watch the trailer</p>
          </div>
          <div>
            <i class="fa-regular fa-thumbs-up"></i>
            <span>${vote_count}</span>
            <span>❤️</span>
            <span id="slider-bottom-smile-emote">😃</span>
            <span id="slider-bottom-smile-emote-value">${(
              vote_average * 10
            ).toFixed(0)}%</span>
          </div>
        </div>
        <div class="slider-bottom-time-section">
          <span>${release_date}</span>
        </div>
      </div>
    </div>
  `;
};


// "Up next" bölümü için kart oluşturma fonksiyonu
const createMenuSliderItem = (movie) => {
  const { id, title, vote_count, poster_path, vote_average } = movie;
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "image_not_found.png";
  return `
    <div class="menu-slider-items">
      <img src="${imgSrc}" alt="${title}">
      <a href="#">
        <div class="menu-slider-info">
          <div>
            <i class="fa-regular fa-circle-play"></i>
            <span>${(vote_average * 10).toFixed(0)}%</span>
          </div>
          <h5>${title}</h5>
          <span>Watch the trailer</span>
          <div>
            <i class="fa-regular fa-thumbs-up"></i>
            <span>${vote_count}</span>
            <span>❤️</span>
            <span>😃</span>
            <span>${(vote_average * 10).toFixed(0)}</span>
          </div>
        </div>
      </a>
    </div>
  `;
};

// Belirli bir film için fragman URL'sini çeken fonksiyon
const fetchTrailerUrl = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKeyTMDB}&language=en-US`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results?.length) {
    const trailer = data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    if (trailer) {
      return `https://www.youtube.com/embed/${trailer.key}`;
    }
  }
  return null;
};

// Popüler filmleri çeken ve hem carousel hem de "Up next" bölümlerine içerik ekleyen fonksiyon
const fetchPopularMovies = async () => {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKeyTMDB}&language=en-US&page=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results?.length) {
    const popularMoviesContainer = document.querySelector("#carousel-inner-1");
    const movieCards = await Promise.all(
      data.results.slice(0, 3).map(async (movie) => {
        const trailerUrl = await fetchTrailerUrl(movie.id);
        return createMovieCard(movie, trailerUrl);
      })
    );
    popularMoviesContainer.innerHTML = movieCards.join("");
    popularMoviesContainer.firstElementChild.classList.add("active");

    const menuSliderContainer = document.querySelector(".menu-slider");
    menuSliderContainer.innerHTML = data.results
      .slice(3, 6)
      .map(createMenuSliderItem)
      .join("");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies();
});

// Haftalık popüler filmleri çeken fonksiyon
const fetchWeeklyTopMovies = async () => {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKeyTMDB}&language=en-US&page=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results?.length) {
    const movies = data.results.slice(0, 10); // İlk 10 filmi al
    displayTopMovies(movies);
  }
};

// Filmleri ekrana yerleştiren fonksiyon
const displayTopMovies = (movies) => {
  const container = document.querySelector("#top-movies-slider");
  if (container) {
    container.innerHTML = movies
      .map((movie) => {
        const imgSrc = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "image_not_found.png";
        return `
        <div class="swiper-slide">
        <div class="card-items-1">
          <img src="${imgSrc}" alt="${movie.title}">
          <div class="card-slider-info">
            <div class="puan-container">
              <span class="rating">⭐ ${movie.vote_average.toFixed(1)} <button> ☆</button></span>
            </div>
            <h4>${movie.title}</h4>
            <div class="button-container">
              <button class="card-slider-button-watchlist"><i class="fa-solid fa-plus"></i> Watchlist</button>
              <button class="card-slider-button-trailer"><i class="fa-solid fa-play"></i> Trailer</button>
            </div>
          </div>
        </div>
      </div>
      `;
      })
      .join("");
  }
};

// Apply styles for Top Movies
const applyTopMoviesStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .card-items-1 {
      /* Your existing styles for card-items-1 */
    }

    .button-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-slider-button-watchlist {
      background-color: #444;
      border: none;
      border-radius: 20px;
      padding: 5px 2px;
      font-weight: 600;
      color: #3FA2F6;
      margin-top: 10px
    }

    .card-slider-button-watchlist > i {
      color: #3FA2F6;
    }

    .card-slider-button-watchlist:hover {
      background-color: #3fa1f634;
    }

    .card-slider-button-trailer {
      background-color: transparent;
      border: none;
      border-radius: 20px;
      padding: 5px 2px;
      font-weight: 600;
    }

    .card-slider-button-trailer:hover {
      background-color: #444;
    }
  `;
  document.head.appendChild(style);
};

// Call the function to apply styles
applyTopMoviesStyles();

// Fan Favorites Card
const createFanFavoritesCard = (show) => {
  const { name, poster_path, vote_average } = show;
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "image_not_found.png";
  return `
  <div class=" swiper-slide">
    <div class="card-items-2">
      <img src="${imgSrc}" alt="${name}">
      <div class="card-slider-info">
        <div class="puan-container">
          <span class="rating">⭐ ${vote_average.toFixed(1)} <button> ☆</button></span>
        </div>
        <h4>${name}</h4>
        <div class="button-container">
          <button class="card-slider-button-watchlist"><i class="fa-solid fa-plus"></i> Watchlist</button>
          <button class="card-slider-button-trailer"><i class="fa-solid fa-play"></i> Trailer</button>
        </div>
      </div>
    </div>
  </div>
  `;
};

// Apply styles for Fan Favorites
const applyFanFavoritesStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .card-items-2 {
      /* Your existing styles for card-items-2 */
    }

    .button-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-slider-button-watchlist {
      background-color: #444;
      border: none;
      border-radius: 20px;
      padding: 5px 2px;
      font-weight: 600;
      color: #3FA2F6;
      margin-top: 10px
    }

    .card-slider-button-watchlist > i {
      color: #3FA2F6;
    }

    .card-slider-button-watchlist:hover {
      background-color: #3fa1f634;
    }

    .card-slider-button-trailer {
      background-color: transparent;
      border: none;
      border-radius: 20px;
      padding: 5px 2px;
      font-weight: 600;
    }

    .card-slider-button-trailer:hover {
      background-color: #444;
    }
  `;
  document.head.appendChild(style);
};

// Call the function to apply styles
applyFanFavoritesStyles();


// Fetch Fan Favorites
const fetchFanFavorites = async () => {
  try {
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKeyTMDB}&language=en-US&page=1`;
    const response = await fetch(url);
    console.log("1", response);
    const data = await response.json();
    console.log("2", data);

    if (data.results?.length) {
      const fanFavoritesContainer = document.getElementById(
        "fan-favorites-slider"
      );
      console.log("3", fanFavoritesContainer);
      fanFavoritesContainer.innerHTML = data.results
        .map(createFanFavoritesCard)
        .join("");
    }
  } catch (error) {
    console.error("Error fetching fan favorites:", error);
  }
};

// In Theaters Card
const createInTheatersCard = (movie) => {
  const { title, poster_path, vote_average } = movie;
  const imgSrc = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "image_not_found.png";

  return `
  <div class=" swiper-slide">
    <div class="card-items-3">
      <img src="${imgSrc}" alt="${title}">
      <div class="card-slider-info">
        <div class="puan-container">
          <span class="rating">⭐ ${vote_average.toFixed(1)} <button class="puani-ekle-button"> ☆</button></span>
        </div>
        <h4>${title}</h4>
        <div class="button-container">
          <button class="card-slider-button-watchlist"><i class="fa-solid fa-plus"></i> Watchlist</button>
          <button class="card-slider-button-trailer"><i class="fa-solid fa-play"></i> Trailer</button>
        </div>
      </div>
    </div>
  </div>
  `;
};
const applyButtonStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .button-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-slider-button-watchlist {
      background-color: #444;
      border: none;
      border-radius: 20px;
      padding: 5px 2px;
      font-weight: 600;
      color: #3FA2F6;
      margin-top: 10px;
    }

    .card-slider-button-watchlist > i {
      color: #3FA2F6;
    }

    .card-slider-button-watchlist:hover {
      background-color: #3fa1f634;
    }

    .card-slider-button-trailer {
      background-color: transparent;
      border: none;
      border-radius: 20px;
      padding: 5px 2px;
      font-weight: 600;
    }

    .card-slider-button-trailer:hover {
      background-color: #444;
    }
  `;
  document.head.appendChild(style);
};

// Fonksiyonları çağırma
applyButtonStyles();

// Fetch In Theaters Movies
const fetchInTheatersMovies = async () => {
  try {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKeyTMDB}&language=en-US&page=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results?.length) {
      const inTheatersContainer = document.getElementById("in-theaters-slider");
      inTheatersContainer.innerHTML = data.results
        .map(createInTheatersCard)
        .join("");
    }
  } catch (error) {
    console.error("Error fetching in theaters movies:", error);
  }
};

const calculateAge = (birthdate) => {
  if (!birthdate) return "Unknown";
  const birthDate = new Date(birthdate);
  const difference = Date.now() - birthDate.getTime();
  const age = new Date(difference).getUTCFullYear() - 1970;
  return age;
};

const createPopularPersonCard = (person, age) => {
  const { name, profile_path } = person;
  const imgSrc = profile_path
    ? `https://image.tmdb.org/t/p/w500${profile_path}`
    : "image_not_found.png";
  return `
    <div class=" swiper-slide">
    <div class="card-items-4">
      <img src="${imgSrc}" alt="${name}">
      <div class="card-slider-info"> 
        <h4>${name} (${age})</h4>
      </div>
      </div>
    </div>
  `;
};

const fetchPersonDetails = async (personId) => {
  try {
    const url = `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKeyTMDB}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for person ID ${personId}:`, error);
    return null;
  }
};

const fetchPopularPeople = async () => {
  try {
    const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKeyTMDB}&language=en-US&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Fetched popular people:", data.results);

    const popularPeopleContainer =
      document.getElementById("celebrities-slider");
    console.log("Popular People Container:", popularPeopleContainer); // Hata ayıklama

    if (data.results?.length && popularPeopleContainer) {
      const cards = await Promise.all(
        data.results.map(async (person) => {
          const details = await fetchPersonDetails(person.id);
          console.log(`Fetched details for ${person.name}:`, details);

          const age =
            details && details.birthday
              ? calculateAge(details.birthday)
              : null; // "Unknown" yerine null kullanıyoruz

          // Eğer yaş bilgisi mevcutsa kart oluştur
          if (age) {
            return createPopularPersonCard(person, age);
          }
          return ''; // Yaş bilgisi yoksa boş string döndür
        })
      );

      // Boş stringler filtrelendi ve kartlar birleştirildi
      popularPeopleContainer.innerHTML = cards.filter(card => card).join("");
    }
  } catch (error) {
    console.error("Error fetching popular people:", error);
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  fetchPopularPeople();
});

document.addEventListener("DOMContentLoaded", () => {
  fetchWeeklyTopMovies();
  fetchFanFavorites();
  fetchInTheatersMovies();
});

let currentIndex = 0;

