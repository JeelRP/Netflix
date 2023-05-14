const button = document.querySelector("button");
const close = document.querySelector(".close");
const trailer = document.querySelector(".trailer");
const video = document.querySelector("iframe");

button.addEventListener('click', () => {
    trailer.style.visibility = "visible";
    trailer.style.opacity = 1;
});

close.addEventListener('click', () => {
    trailer.style.visibility = "hidden";
    trailer.style.opacity = 0;

    video.pause();
    video.currentTime = 0;
});