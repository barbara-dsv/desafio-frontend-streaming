
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


const openModal = async (idFilm) => {
    const classHidden = document.querySelector('.hidden')
    classHidden.style.display = "flex"
    try {
        const urlModal = `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idFilm}?language=pt-BR`
        const movie = await axios.get(urlModal)

        if (idFilm === movie.data.id) {
            const modalTitle = document.querySelector('.modal__title')
            const modalImg = document.querySelector('.modal__img')
            const modalDescription = document.querySelector('.modal__description')
            const modalAverage = document.querySelector('.modal__average')
            const modalGenres = document.querySelector('.modal__genres')

            modalGenres.innerHTML = ''

            modalTitle.textContent = movie.data.title
            modalImg.src = movie.data.backdrop_path
            modalDescription.textContent = movie.data.overview
            modalAverage.textContent = movie.data.vote_average.toFixed(1)

            movie.data.genres.map(genre => {
                const modalGenre = document.createElement('span')
                modalGenre.classList.add('modal__genre')
                modalGenre.textContent = genre.name
                modalGenres.appendChild(modalGenre)
            })
        }

        const closeModal = () => {
            classHidden.style.display = "none"
        }

        document.querySelector('.modal__close').addEventListener('click', closeModal)
        classHidden.addEventListener('click', closeModal)

    } catch (error) {
        console.log(error)
    }
}



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

            movieDiv.addEventListener('click', () => openModal(movie.id))
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


const changeTheme = () => {
    const btnTheme = document.querySelector('.btn-theme'); 
    const body = document.querySelector('body')
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');
    const highlightInfo = document.querySelector('.highlight__info')
    const highlightDescription = document.querySelector('.highlight__description')
    const highlightGenre = document.querySelector('.highlight__genre-launch')
    const input = document.querySelector('.input')
    const subtitle = document.querySelector('.subtitle')

        btnTheme.addEventListener('click', () => {
            const isDarkMode = body.style.backgroundColor === 'rgb(36, 36, 36)';
            body.style.backgroundColor = isDarkMode ? '#fff' : '#242424';

            prevButton.src = isDarkMode 
            ? './assets/seta-esquerda-preta.svg' 
            : './assets/seta-esquerda-branca.svg';
            nextButton.src = isDarkMode 
            ? './assets/seta-direita-preta.svg' 
            : './assets/seta-direita-branca.svg';
            
            btnTheme.src = isDarkMode 
            ? './assets/light-mode.svg'
            : './assets/dark-mode.svg'

            highlightInfo.style.backgroundColor = isDarkMode
            ? '#fff' 
            : '#454545'
            highlightDescription.style.color = isDarkMode
            ? '#000'
            : '#FFFFFF'

            highlightGenre.style.color = isDarkMode
            ? '#000'
            : '#FFFFFF'
            input.style.backgroundColor = isDarkMode
            ? '#FFFFFF' 
            :'#000' 
            input.style.color = isDarkMode
            ? '#000'
            : '#FFFFFF'
            subtitle.style.color =isDarkMode
             ? '#000'
            : '#FFFFFF'
            console.log('trocou o tema')
        });
   
};

document.addEventListener('DOMContentLoaded', () =>{
    movieOfTheDay()
    changeTheme()
} )


