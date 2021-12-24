const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

// const apiURL = `https://api.vagalume.com.br/search.artmus?q=Skank%20Vamos%20Fugir&apikey=apikey=67eea032b5a9043602dc59a1b4ce3d9d`
// ;

const apiURL = `https://api.lyrics.ovh`


const fetchData = async url => {
    const response = await fetch(url);
    return await response.json();
}



const getMoreSongs = async url => {
    const data = await fetchData(`https://cors.bridged.cc/${url}`);
}


insertNextAndPrevButtons = ({ data, next, prev }) => {
    prevAndNextContainer.innerHTML = `
    ${next ? `<button class="btn" onclick="getMoreSongs('${next}')">Próximas</button>` : ""}
    ${prev ? `<button class="btn" onclick="getMoreSongs('${prev}')">Anteriores</button>` : ""}`
}



const insertSongsIntoPage = ({ data, prev, next }) => {
    songsContainer.innerHTML = data.map(({ artist: { name }, title }) =>
        `<li class="song">
            <span class="song-artist">${name}</strong> - ${title}</span>
            <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>
        </li>`).join('');
    if (prev || next) {
        insertNextAndPrevButtons({ prev, next });
        return //usei return para não precisar usar um else
    }
    prevAndNextContainer.innerHTML = '';
}




const fetchSongs = async term => {
    const data = await fetchData(`${apiURL}/suggest/${term}`);
    console.log(data)
    insertSongsIntoPage(data)
}

const handleFormSubmit = event => {
    event.preventDefault()
    const searchTerm = searchInput.value.trim();
    searchInput.value = '';
    searchInput.focus();

    if (!searchTerm) {
        songsContainer.innerHTML = `<li class="warning-message"> Por favor, digite um termo válido</li>`
        return
    }
    fetchSongs(searchTerm);
}


form.addEventListener('submit', handleFormSubmit)


const insertLyricsIntoPage = ({ lyrics, artist, songTitle}) => {
    songsContainer.innerHTML = `
    <li class="lyrics-container">
    <h2><strong>${songTitle}</strong> - ${artist}</h2>
    <p class="lyrics">${lyrics}</p>
    </li>
`

}

const fetchLyrics = async (artist, songTitle) => {
    const data = await fetchData((`${apiURL}/v1/${artist}/${songTitle}`));
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    insertLyricsIntoPage({ lyrics, artist, songTitle });
   

}

const handleSongsContainerClick = event => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-song-title');

        prevAndNextContainer.innerHTML = '';
        fetchLyrics(artist, songTitle);
    }
}

songsContainer.addEventListener('click', handleSongsContainerClick)