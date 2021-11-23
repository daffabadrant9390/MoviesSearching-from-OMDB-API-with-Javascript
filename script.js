//* A. Syntax to show movies cards on movies-container
const searchBtn = document.querySelector(".search-movies-btn");
searchBtn.addEventListener("click", async function () {
  try {
    const inputMoviesKeyword = document.querySelector(".input-keyword-movies");
    const movies = await getDataMovies(inputMoviesKeyword.value);
    updateUI(movies);
  } catch (err) {
    updateError(err);
  }
});

const getDataMovies = (keywordMovies) => {
  return fetch("http://www.omdbapi.com/?apikey=7c36f70a&s=" + keywordMovies)
    .then((response) => {
      // Here we will set error handling. First we will check if api key or api link is correct or not.
      if (!response.ok) {
        throw response.statusText;
      }
      return response.json();
    })
    .then((response) => {
      // Then, we will check if the input movies keyword is filled and typed correctly
      if (response.Response === "False") {
        throw response.Error;
      }
      return response.Search;
    });
};

const updateUI = (movies) => {
  const moviesHtml = movies.map((movie) => showMovieCard(movie)).join("");
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = moviesHtml;
};

const updateError = (errMsg) => {
  const errorHtml = `
  <div class="row d-flex justify-content-center my-5">
    <div class="col-md-6 bg-danger rounded">
      <p class=" my-5 text-center text-light">${errMsg}</p>
    </div>
  </div>`;
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = errorHtml;
};

//* B. Syntax to show movie Details on modal-body
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modalMoviesBtn")) {
    const imdbid = e.target.dataset.imdbid;
    const detailsMovieData = await getDetailsMovie(imdbid);
    updateDetailMovie(detailsMovieData);
  }
});

const getDetailsMovie = (imdbid) => {
  return fetch("http://www.omdbapi.com/?apikey=7c36f70a&i=" + imdbid)
    .then((response) => {
      if (!response.ok) {
        throw response.statusText;
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw response.Error;
      }
      return response;
    });
};

const updateDetailMovie = (detailsMovieData) => {
  const detailHtml = showMovieDetails(detailsMovieData);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = detailHtml;
};

const showMovieCard = function (movie) {
  return `
    <div class="col-md-4 col-sm-6">
        <div class="card my-3">
            <img src=${movie.Poster} class="card-img-top" />
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                <a href="#" class="btn btn-primary modalMoviesBtn" data-bs-toggle="modal" data-bs-target="#movieModal" data-imdbid=${movie.imdbID}>Get Details</a>
            </div>
        </div>
    </div>`;
};

const showMovieDetails = function (result) {
  return `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                  <img src="${result.Poster}" class="img-fluid" />
                </div>
                <div class="col-md">
                  <ul class="list-group">
                    <li class="list-group-item"><h4>${result.Title} (${result.Year})</h4></li>
                    <li class="list-group-item">
                      <strong>Director : </strong>${result.Director}
                    </li>
                    <li class="list-group-item">
                      <strong>Actor : </strong>${result.Actors}
                    </li>
                    <li class="list-group-item">
                      <strong>Writer : </strong>${result.Writer}
                    </li>
                    <li class="list-group-item">
                      <strong>Plot : </strong><br />${result.Plot}
                    </li>
                  </ul>
                </div>
            </div>
        </div>`;
};
