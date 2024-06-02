

document.addEventListener('DOMContentLoaded', async () => {
    const url = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'
    try {
        const result = await axios.get(url)
        showMovies(result.data.results)
        console.log(result.data.results[17].title)
    } catch (error) {
        console.log(error)
    }
})

const showMovies = (movieData) => {
    const movies = document.querySelector('.movies')
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');

    let currentPage = 0
    const page = 5


    const pagination = (indexCurrent) => {
        movies.innerHTML = ''

        let endIndex = indexCurrent + page;

        for (const movie of movieData.slice(indexCurrent, endIndex)) {

            const movieDiv = document.createElement('div')
            movieDiv.classList.add('movie')
            movieDiv.style.backgroundImage = `url(${movie.poster_path})`
            movieDiv.innerHTML = `
            <div class="movie__info">
            <span class="movie__title">${movie.title}</span>
            <span class="movie__rating">
            ${movie.vote_average.toFixed(1)}
            <img src="./assets/estrela.svg" alt="Estrela">
            </span>
            </div>`
            movies.appendChild(movieDiv)
        }
    }
    prevButton.addEventListener('click', () => {
        currentPage = (currentPage - 1 + (movieData.length / page)) % (movieData.length / page)
        pagination(currentPage * page)
    })

    nextButton.addEventListener('click', () => {
        currentPage = (currentPage + 1) % (movieData.length / page);
        pagination(currentPage * page);
    })

    pagination(currentPage * page);
}