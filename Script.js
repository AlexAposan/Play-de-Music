const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentprogress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');


const deusDaminhavida = {
    songName: 'Deus da minha Vida',
    artist: 'Thalles Roberto',
    file: 'Deus-da-Minha-Vida',
    liked: false,
};
const eliSoares = {
    songName: 'Tudo oque eu sou',
    artist: 'Eli Soares',
    file: 'Eli-Soares-Tudo-Que-Eu-Sou',
    liked: false,
};
const oficinaG3 = {
    songName: 'Lagrimas',
    artist: 'Oficina G3',
    file: 'Oficina-G3-Lagrimas',
    liked: false,
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [deusDaminhavida, eliSoares, oficinaG3];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

function pauseySong() {
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseySong();
    }
    else {
        playSong();
    }
}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
    else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
}

function initializeSong() {
    cover.src = `imagens/${sortedPlaylist[index].file}.jpg`;
    song.src = `music/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();

}

function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1;
    }
    initializeSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0;
    }
    else {
        index += 1;
    }
    initializeSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentprogress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpto(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumptoTime = (clickPosition / width) * song.duration;
    song.currentTime = jumptoTime;
}

function shuffleArrey(preShuffleArrey) {
    const size = preShuffleArrey.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArrey[currentIndex];
        preShuffleArrey[currentIndex] = preShuffleArrey[randomIndex];
        preShuffleArrey[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleButtonclick() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArrey(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }
    else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClick() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    }
    else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    }
    else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}


initializeSong()
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpto);
shuffleButton.addEventListener('click', shuffleButtonclick);
repeatButton.addEventListener('click', repeatButtonClick);
likeButton.addEventListener('click', likeButtonClicked);