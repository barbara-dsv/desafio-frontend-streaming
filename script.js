const loadPage = async () => {
    const url = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false'
    try {
        const result = await axios.get(url)
        showMovies(result.data.results)
    } catch (error) {
        console.log(error)
    }
}

document.addEventListener('DOMContentLoaded', loadPage)

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
};



const input = document.querySelector('.input')

input.addEventListener('keyup', async (event) => {
    try {
        if (event.key === 'Enter') {
            const urlSearch = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`
            const result = await axios.get(urlSearch)


            if (result.data.results.length > 0) {
                showMovies(result.data.results);
            } else {
                await loadPage()
            }

            input.value = ''
        }
    } catch (error) {
        console.log(error)
    }

})

