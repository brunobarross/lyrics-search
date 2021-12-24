const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

// const apiURL = `https://api.vagalume.com.br/search.artmus?q=Skank%20Vamos%20Fugir&apikey=apikey=67eea032b5a9043602dc59a1b4ce3d9d`
// ;

const apiURL = `https://api.lyrics.ovh`


const getMoreSongs = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/corsdemo/${url}`);
    const data = await response.json();
    insertSongsIntoPage(data)
}

const insertSongsIntoPage = songsInfo => {
    console.log(songsInfo)
    songsContainer.innerHTML = songsInfo.data.map(song =>
        `<li class="song">
            <span class="song-artist">${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
        </li>`).join('');

    if (songsInfo.prev || songsInfo.next) {
        prevAndNextContainer.innerHTML = `
                ${songsInfo.next ? `<button class="btn" onclick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : ""}
                ${songsInfo.prev ? `<button class="btn" onclick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : ""}`
        return
    }
    prevAndNextContainer.innerHTML = '';
}




const fetchSongs = async term => {
    const response = await fetch(`${apiURL}/suggest/${term}`);
    const data = await response.json();

    insertSongsIntoPage(data)
    
}



form.addEventListener('submit', event => {
    event.preventDefault()

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        songsContainer.innerHTML = `<li class="warning-message"> Por favor, digite um termo válido</li>`
        return
    }

    fetchSongs(searchTerm);

})

const fetchLyrics = async (artist, songTitle) =>{
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await response.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    songsContainer.innerHTML = `
        <li class="lyrics-container">
        <h2><strong>${songTitle}</strong></h2>
        <p class="lyrics">${lyrics}</p>
        </li>
    `
}

songsContainer.addEventListener('click', event =>{
    const clickedElement = event.target;
    if(clickedElement.tagName === 'BUTTON'){
       const artist = clickedElement.getAttribute('data-artist');
       const songTitle = clickedElement.getAttribute('data-song-title');
    
       prevAndNextContainer.innerHTML = '';
       fetchLyrics(artist, songTitle);
    }
})