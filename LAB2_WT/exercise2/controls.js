const audioPlayer = document.getElementById('myAudio');
const videoPlayer = document.getElementById('myVideo');
const audioTimeDisplay = document.getElementById('audioTime');
const videoTimeDisplay = document.getElementById('videoTime');


function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

audioPlayer.addEventListener('timeupdate', () => {
    audioTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});

videoPlayer.addEventListener('timeupdate', () => {
    videoTimeDisplay.textContent = formatTime(videoPlayer.currentTime);
});