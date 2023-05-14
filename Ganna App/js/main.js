const musicLibsContainer=document.getElementById('music-libs');
const audioPlayer=document.getElementById("audio-player");
const pausedBtn=document.getElementById("paused");
const playingBtn=document.getElementById("playing");
const songCurrentTime=document.getElementById("songTimeStart");
const songToTotalTime=document.getElementById("songToTotalTime");
console.log(songCurrentTime.innerText);
console.log(songToTotalTime);
var currantSongObj={};
var defaultImage="assests/images/defaultImage.gif"
console.log(musicLibsContainer);
window.addEventListener('load',bootUpApp)
function bootUpApp(){
    fetchandRenderAllSection();
}
function fetchandRenderAllSection(){
    fetch('js/gaana.json')
    .then(res=>res.json())
    .then(res=>{
        const {cardbox}=res;
        console.log(cardbox);
        if(Array.isArray(cardbox) && cardbox.length){
            cardbox.forEach(section =>{
                const {songsbox,songscards}=section;
                renderSection(songsbox,songscards);
            })
            
        }
        
    })
    .catch((err)=>{
        console.error(err);
        alert('error failing data');
    })

}
function renderSection(title,songsList){
    const songsSection=makeSectionDom(title,songsList);
    musicLibsContainer.appendChild(songsSection);
    console.log(songsSection);

}
function makeSectionDom(title,songsList){
    const sectionDiv=document.createElement('div');
    sectionDiv.className='song-section';
    sectionDiv.innerHTML=`<h2 class="section-heading"> ${title}</h2>
    <div class="songs-cont">
        ${songsList.map(songObj=> buildSongCardDom(songObj)).join('')}
    </div>`
    // console.log(sectionDiv.innerHTML);
    return sectionDiv;

}
function buildSongCardDom(songObj){
    return `<div class="song-card" onclick="palySong(this)" data-songobj='${JSON.stringify(songObj)}'>
        <div class="img-cart">
            <img src="${songObj.image_source}" alt="${songObj.song_name}">
            <div class="overlay"></div>
        </div>
        <p class="song-name">${songObj.song_name}</p>
    </div>`;
}
function palySong (SongCardEl){
    const songObj=JSON.parse(SongCardEl.dataset.songobj)
    setCurrentSong(songObj);
    document.getElementById("music-player").classList.remove("hidden");
}
function setCurrentSong(songObj){
    currentSongObj=songObj;
    audioPlayer.pause();
    audioPlayer.src=songObj.quality.low;
    audioPlayer.currentTime=0;
    audioPlayer.play();
    updatePlayerUi(songObj)

}
function updatePlayerUi(songObj){
    const songimg=document.getElementById("song-img");
    const songName=document.getElementById("song-name");
    songimg.src=songObj.image_source;
    songName.innerHTML=songObj.song_name;

    songCurrentTime.innerHTML=audioPlayer.currentTime;
    
}
function togglePlayer(){
    if(audioPlayer.paused){
        audioPlayer.play();
        
    }  
    else{
        audioPlayer.pause();
    }
    pausedBtn.style.display=audioPlayer.paused ? 'block' : 'none';
    playingBtn.style.display=audioPlayer.paused ? 'none' : 'block';
}
function updatePlayerTime(){
    if(!audioPlayer || audioPlayer.paused)  return;
    const songCurrentTime=document.getElementById('songTimeStart');
    songCurrentTime.innerHTML=getTimeString(audioPlayer.currentTime);
    songToTotalTime.innerHTML=getTimeString(audioPlayer.duration);
}
function getTimeString(time){
    return isNaN(audioPlayer.duration)?"0:00":Math.floor(time/60)+":"+parseInt((((time/60)%1)*100).toPrecision(2));
}
