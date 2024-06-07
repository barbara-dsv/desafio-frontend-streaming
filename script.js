
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





//
const movieOfTheDay = async () => {
    const urlGeneral = 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR'

    const urlVideo = 'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR'
    try {
        const result = await axios.get(urlGeneral)
        const resultado = await axios.get(urlVideo)

        highlight(result.data)
        hrefVideo(resultado)
    } catch (error) {
        console.log(error)
    }
}

const highlight = (videoData) => {
    const highlightVideo = document.querySelector('.highlight__video')
    const highlightTitle = document.querySelector('.highlight__title')
    const highlightRating = document.querySelector('.highlight__rating')
    const highlightGenres = document.querySelector('.highlight__genres')
    const highlightLaunch = document.querySelector('.highlight__launch')
    const highlightDescription = document.querySelector('.highlight__description')


    highlightVideo.style.backgroundImage = `url(${videoData.backdrop_path})`
    highlightTitle.textContent = videoData.title
    highlightRating.textContent = videoData.vote_average.toFixed(1)

    const genreName = videoData.genres.map(genre => genre.name).join(', ')
    highlightGenres.textContent = genreName

    highlightLaunch.textContent = videoData.release_date
    highlightDescription.textContent = videoData.overview
}

const hrefVideo = (link) => {
    const highlightVideoLink = document.querySelector('.highlight__video-link')

    highlightVideoLink.href = `https://www.youtube.com/watch?v=${link.data.results[0].key}`
}
document.addEventListener('DOMContentLoaded', movieOfTheDay)