// === Slideshow Logic ===

// Slideshow image array
const images = [];
for (let i = 1; i <= 102; i++) {
  const filename = `img${String(i).padStart(3, '0')}.jpg`;
  images.push(`assets/slideshow/${filename}`);
}

// Preload images (optional)
images.forEach((src) => {
  const img = new Image();
  img.src = src;
});


let currentIndex = 0;
let isPlaying = true;
let intervalId = null;

const imgElement = document.getElementById('slideshow-img');
const fullscreenModal = document.getElementById('fullscreen-modal');
const fullscreenImg = document.getElementById('fullscreen-img');

function showSlide(index) {
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;
  currentIndex = index;

  imgElement.classList.remove('opacity-100');
  imgElement.classList.add('opacity-0');

  if (!fullscreenModal.classList.contains('hidden')) {
    fullscreenImg.classList.remove('opacity-100');
    fullscreenImg.classList.add('opacity-0');
  }

  setTimeout(() => {
    imgElement.src = images[currentIndex];
    imgElement.classList.remove('opacity-0');
    imgElement.classList.add('opacity-100');

    if (!fullscreenModal.classList.contains('hidden')) {
      fullscreenImg.src = images[currentIndex];
      fullscreenImg.classList.remove('opacity-0');
      fullscreenImg.classList.add('opacity-100');
    }
  }, 300);
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function togglePlay() {
  isPlaying = !isPlaying;
  const button = event.target;
  button.textContent = isPlaying ? '⏸ Pause' : '▶️ Play';
  if (isPlaying) startAutoSlide();
  else clearInterval(intervalId);
}

function shuffleSlides() {
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  currentIndex = 0;
  showSlide(currentIndex);
}

function startAutoSlide() {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (isPlaying) nextSlide();
  }, 4000);
}

function openFullscreen() {
  fullscreenImg.src = images[currentIndex];
  fullscreenModal.classList.remove('hidden');

  // Enter native fullscreen (browser fullscreen)
  if (document.fullscreenEnabled && !document.fullscreenElement) {
    fullscreenModal.requestFullscreen().catch(err => console.error(err));
  }

  // DO NOT stop auto-play — let slideshow continue
}

function closeFullscreen() {
  fullscreenModal.classList.add('hidden');

  // Exit browser fullscreen if active
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(err => console.error(err));
  }
}

function toggleFullscreen() {
  if (fullscreenModal.classList.contains('hidden')) {
    openFullscreen();
  } else {
    closeFullscreen();
  }
}

imgElement.addEventListener('click', openFullscreen);

fullscreenModal.addEventListener('click', closeFullscreen);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !fullscreenModal.classList.contains('hidden')) {
    closeFullscreen();
  }
});

startAutoSlide();
showSlide(currentIndex);


// === Music Player with Playlist, Shuffle, Repeat ===

const audio = document.getElementById('wedding-audio');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const trackTitle = document.getElementById('track-title');

const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeRange = document.getElementById('volume-range');

const playlist = [
  { title: "Our Special Song", src: "assets/audio/song1.mp3" },
];

let currentTrackIndex = 0;
let isAudioPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 = No repeat, 1 = Repeat all, 2 = Repeat one

function loadTrack(index) {
  if (index < 0) index = playlist.length - 1;
  if (index >= playlist.length) index = 0;
  currentTrackIndex = index;

  audio.src = playlist[currentTrackIndex].src;
  trackTitle.textContent = playlist[currentTrackIndex].title;
  resetProgressBar();

  if (isAudioPlaying) {
    audio.play().catch(console.error);
  }
}

function playAudio() {
  audio.play();
  isAudioPlaying = true;
  playBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
}

function pauseAudio() {
  audio.pause();
  isAudioPlaying = false;
  pauseBtn.classList.add('hidden');
  playBtn.classList.remove('hidden');
}

function nextTrack() {
  if (isShuffle) {
    shufflePlay();
  } else {
    loadTrack(currentTrackIndex + 1);
  }
}

function prevTrack() {
  loadTrack(currentTrackIndex - 1);
}

function shufflePlay() {
  let nextIndex = Math.floor(Math.random() * playlist.length);
  while (nextIndex === currentTrackIndex && playlist.length > 1) {
    nextIndex = Math.floor(Math.random() * playlist.length);
  }
  loadTrack(nextIndex);
}

function resetProgressBar() {
  progressBar.style.width = '0%';
}

volumeRange.addEventListener('input', () => {
  audio.volume = volumeRange.value;
});

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.textContent = isShuffle ? '🔀 On' : '🔀 Off';
});

repeatBtn.addEventListener('click', () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.textContent = ['🔁 Off', '🔁 All', '🔂 One'][repeatMode];
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
  }
});

audio.addEventListener('ended', () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatMode === 1 || currentTrackIndex < playlist.length - 1) {
    nextTrack();
  } else {
    pauseAudio();
    audio.currentTime = 0;
    resetProgressBar();
  }
});

playBtn.addEventListener('click', playAudio);
pauseBtn.addEventListener('click', pauseAudio);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

window.addEventListener('DOMContentLoaded', () => {
  loadTrack(currentTrackIndex);
  audio.volume = volumeRange.value;
});

function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');

  // Random starting position
  petal.style.left = Math.random() * 100 + 'vw';

  // Random animation duration & delay
  const duration = 10 + Math.random() * 10; // 10–20s
  petal.style.animationDuration = `${duration}s`;

  // Random horizontal drift via rotate
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;

  document.getElementById('petal-container').appendChild(petal);

  // Remove petal after animation
  setTimeout(() => petal.remove(), duration * 1000);
}

// Create petals at intervals
setInterval(() => {
  if (document.hasFocus()) {
    createPetal();
  }
}, 500); // One petal every 0.5s

// === Anniversary Countdown Logic ===

function updateAnniversaryCountdown() {
  const anniversaryDate = new Date('2025-05-25T00:00:00');
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;

  // Days married
  const marriageDays = Math.floor((now - anniversaryDate) / msPerDay);
  document.getElementById('marriage-days').textContent = `${marriageDays} day${marriageDays !== 1 ? 's' : ''}`;

  // Next anniversary (next May 25)
  let nextAnniversary = new Date(now.getFullYear(), 4, 25); // May is month 4
  if (now > nextAnniversary) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
  }

  const totalSeconds = Math.floor((nextAnniversary - now) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const countdownText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  document.getElementById('anniversary-countdown').textContent = countdownText;
}

// Update every second
setInterval(updateAnniversaryCountdown, 1000);
updateAnniversaryCountdown();
