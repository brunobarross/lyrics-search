const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container');

const apiURL = `https://api.vagalume.com.br/search.php?art=MichaelJackson&mus=billiejean&apikey=apikey=67eea032b5a9043602dc59a1b4ce3d9d`
;


const fetchSongs = term =>{
    fetch(apiURL).then((response)=>{
        return response.json()
        
    }).then((body)=>{
        console.log(body)
    })
}



form.addEventListener('submit', event =>{
    event.preventDefault()

    const searchTerm = searchInput.value.trim();

    if(!searchTerm){
        songsContainer.innerHTML = `<li class="warning-message"> Por favor, digite um termo válido</li>`
        return
    }

    fetchSongs(searchTerm);

})