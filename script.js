// ===== NAVIGATION =====
document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const page = link.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');
    });
});

// ===== SONGS =====
const songs = [
    { name: "A-RANDOM SONG", path: "songs/1.mp3", cover: "covers/1.jpg", duration: "3:40" },
    { name: "B-RANDOM SONG", path: "songs/2.mp3", cover: "covers/2.jpg", duration: "0:35" },
    { name: "C-RANDOM SONG", path: "songs/3.mp3", cover: "covers/3.jpg", duration: "0:59" },
    { name: "D-RANDOM SONG", path: "songs/4.mp3", cover: "covers/4.jpg", duration: "5:04" },
    { name: "E-RANDOM SONG", path: "songs/5.mp3", cover: "covers/5.jpg", duration: "3:18" },
    { name: "F-RANDOM SONG", path: "songs/6.mp3", cover: "covers/6.jpg", duration: "4:11" },
    { name: "G-RANDOM SONG", path: "songs/7.mp3", cover: "covers/7.jpg", duration: "5:33" },
    { name: "H-RANDOM SONG", path: "songs/8.mp3", cover: "covers/8.jpg", duration: "4:48" },
    { name: "I-RANDOM SONG", path: "songs/9.mp3", cover: "covers/9.jpg", duration: "6:30" },
    { name: "J-RANDOM SONG", path: "songs/10.mp3", cover: "covers/10.jpg", duration: "2:21" },
    { name: "K-RANDOM SONG", path: "songs/11.mp3", cover: "covers/11.jpeg", duration: "7:24" },
    {name: "l-RANDOM SONG", path: "songs/12.mp3", cover: "covers/12.jpeg", duration: "0:43"}
];

// ===== PLAYER =====
let currentIndex = 0;
let isShuffled = false;
const audio = new Audio(songs[0].path);
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const songNameEl = document.getElementById('songName');
const gifEl = document.getElementById('gif');
const songList = document.getElementById('songList');

// Load songs
songs.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'song-item';
    div.innerHTML = `
        <img src="${s.cover}" alt="${s.name}">
        <span class="name">${s.name}</span>
        <span class="duration">${s.duration}</span>
        <i class="fas fa-play play-icon" data-index="${i}"></i>
    `;
    songList.appendChild(div);
});

// Toggle play/pause
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
        gifEl.classList.add('active');
    } else {
        audio.pause();
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
        gifEl.classList.remove('active');
    }
}

playBtn.addEventListener('click', togglePlay);

// Load song
function loadSong(index) {
    currentIndex = index;
    audio.src = songs[index].path;
    songNameEl.textContent = songs[index].name;
    totalTimeEl.textContent = songs[index].duration;
    audio.currentTime = 0;
    progressBar.value = 0;
    currentTimeEl.textContent = '0:00';
    
    document.querySelectorAll('.song-item .play-icon').forEach((el, i) => {
        el.className = `fas fa-${i === index ? 'pause' : 'play'} play-icon`;
    });
    
    if (!audio.paused) gifEl.classList.add('active');
}

// Click song
document.querySelectorAll('.song-item .play-icon').forEach(el => {
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(el.dataset.index);
        if (idx === currentIndex && !audio.paused) {
            audio.pause();
            playBtn.classList.remove('fa-pause');
            playBtn.classList.add('fa-play');
            gifEl.classList.remove('active');
            el.className = 'fas fa-play play-icon';
            return;
        }
        loadSong(idx);
        audio.play();
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
        gifEl.classList.add('active');
        el.className = 'fas fa-pause play-icon';
    });
});

// Next / Prev
document.getElementById('nextBtn').addEventListener('click', () => {
    let next = (currentIndex + 1) % songs.length;
    if (isShuffled) {
        let rand;
        do { rand = Math.floor(Math.random() * songs.length); }
        while (rand === currentIndex && songs.length > 1);
        next = rand;
    }
    loadSong(next);
    audio.play();
    playBtn.classList.remove('fa-play');
    playBtn.classList.add('fa-pause');
    gifEl.classList.add('active');
});

document.getElementById('prevBtn').addEventListener('click', () => {
    const prev = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(prev);
    audio.play();
    playBtn.classList.remove('fa-play');
    playBtn.classList.add('fa-pause');
    gifEl.classList.add('active');
});

// Shuffle
document.getElementById('shuffleBtn').addEventListener('click', () => {
    isShuffled = !isShuffled;
    document.getElementById('shuffleBtn').style.color = isShuffled ? '#b177fc' : 'rgba(232,224,240,0.2)';
});

// Progress
audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.value = pct;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
});

progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Volume
document.getElementById('volumeBtn').addEventListener('click', () => {
    audio.muted = !audio.muted;
    document.getElementById('volumeBtn').classList.toggle('fa-volume-mute');
});

// Auto next
audio.addEventListener('ended', () => {
    document.getElementById('nextBtn').click();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight') { e.preventDefault(); document.getElementById('nextBtn').click(); }
    if (e.code === 'ArrowLeft') { e.preventDefault(); document.getElementById('prevBtn').click(); }
});

console.log('🎵 mahiTUNES loaded');