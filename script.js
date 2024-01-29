// const res = require("express/lib/response");
let ourSongs, songUL, songCard, songCard2, currSongIndex =0 ;
let currSong = new Audio();
let imgSrc = ["As It Was.png", "Believer.png", "Blinded By Lights.png", "Demon in me.png", "Dil Se Dil.png", "Lover.png", "Nee Singam Dhan.png", "Starboy.png", "Until I Found You.png", "Vikram.png"],
singer = ["Harry Styles", "Imagine Dragons", "The Weekend", "Midhun Mukundan", "Vishal Chandrashekhar", "Taylor Swift", "Sid Sriram", "The Weekend", "Stephen Sanchez", "Anirudh Ravichander"];

// Responsive Navbar
document.querySelector(".humburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = 0 + "%";
});

document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = -120 + "%";
});


async function getSongs(){
    let a = await fetch("/songs/");
    let response = await a.text();
    // console.log(response);
    let myDiv = document.createElement("div");
    myDiv.innerHTML = response;
    // console.log(myDiv);
    let hyperlinks = myDiv.getElementsByTagName("a");
    // console.log(hyperlinks);
    let songs = [];

    for(let i=0; i< hyperlinks.length; i++){
        const element = hyperlinks[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href);
        }
    }
    // console.log(songs);
    return songs;
}
// getSongs();

async function main(){
    ourSongs = await getSongs();

    songUL = document.querySelector(".list").getElementsByTagName("ul")[0];
    songCard = document.querySelector(".content").getElementsByTagName("div")[0];  
    console.log(songCard);

    for(let song of ourSongs){
        songUL.innerHTML = songUL.innerHTML + `<li class="icon-li-gap lis white">
        <img src="./imgs/music.svg" alt="" class="invert">
        <div class="info">
            <p>${song.split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0]}</p>
        </div>    
    </li>`
    }

    for(let index=0; index<ourSongs.length; index++){
        let mySong = ourSongs[index];
        songCard.innerHTML = songCard.innerHTML + 
        `<div class="card white">
        <img src="./imgs/${imgSrc[index]}" alt="">
        <div class="songName">
            <h4>${mySong.split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0]}</h4>
            <p>${singer[index]}</p>
        </div>
        </div>`
    }

    songCard2 = document.getElementsByClassName("playlist2")[0];
    
    for(let index= (ourSongs.length - 1); index>=0; index--){
        let mySong2 = ourSongs[index];
        songCard2.innerHTML = songCard2.innerHTML + 
        `<div class="card white">
        <img src="./imgs/${imgSrc[index]}" alt="">
        <div class="songName">
            <h4>${mySong2.split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0]}</h4>
            <p>${singer[index]}</p>
        </div>
        </div>`
    }

    // var audio = new Audio(ourSongs[0]);
    // audio.play();

    let playArr = [[".content", "card", ".songName"], [".list", "lis", ".info"]];

    for(index = 0;index<2; index++){
        let querySel = playArr[index][0], classE = playArr[index][1], querySelect = playArr[index][2];

        Array.from(document.querySelector(querySel).getElementsByClassName(classE)).forEach(e=>{
            e.addEventListener("click", element=>{
            playSong(e.querySelector(querySelect).firstElementChild.innerHTML);
            });
        });
    }

}

function playSong(track){
    currSong.src = "/songs/" + track + ".mp3";
    currSong.play();
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    play.classList.replace("fa-circle-play", "fa-circle-pause");

    setInterval(()=>{
        if(secondsToMinutes(currSong.currentTime) == secondsToMinutes(currSong.duration)){
            play.classList.replace("fa-circle-pause", "fa-circle-play");
        }
    }, 1000);

}

play.addEventListener("click", ()=>{
    if(currSong.paused){
        currSong.play();
        play.classList.replace("fa-circle-play", "fa-circle-pause");
    }else{
        currSong.pause();
        play.classList.replace("fa-circle-pause", "fa-circle-play");
    }
});

document.querySelector("#previous").addEventListener("click", playPreviousSong);
document.querySelector("#next").addEventListener("click", playNextSong);

function playPreviousSong(){
    currSongIndex = (currSongIndex - 1 + ourSongs.length) % ourSongs.length;
    playSong((ourSongs[currSongIndex]).split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0]);
}

function playNextSong(){
    currSongIndex = (currSongIndex + 1)% ourSongs.length;
    playSong((ourSongs[currSongIndex]).split("/songs/")[1].replaceAll("%20", " ").split(".mp3")[0]);
}

function secondsToMinutes(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Now update the time
currSong.addEventListener("timeupdate", ()=>{
    document.querySelector(".songTime").innerHTML = `${secondsToMinutes(currSong.currentTime)} / ${secondsToMinutes(currSong.duration)}`;
    document.querySelector(".circle").style.left = (currSong.currentTime/currSong.duration)*100 + "%";
});

// Seekbar 
document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = ((e.offsetX/e.target.getBoundingClientRect().width)*100);
    document.querySelector(".circle").style.left = percent + "%";
    currSong.currentTime = ((currSong.duration)*percent)/100;
});

// Volume Range
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e=>{
    currSong.volume = (e.target.value)/100;
});

// Mute Volume
document.querySelector(".volume > i").addEventListener("click", e=>{
    if(currSong.volume>0){
        e.target.classList.replace("fa-volume-high", "fa-volume-xmark");
        currSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }else{
        e.target.classList.replace("fa-volume-xmark", "fa-volume-high");
        currSong.volume = 0.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
});

// Reversing the List Li for Top Picks and Superhit Songs
document.querySelector(".playlist2").addEventListener("click", ()=>{
    document.querySelector(".list ul").style.flexDirection = "Column-reverse";
    document.querySelector(".list li").innerHTML= document.querySelector(".list li").innerHTML.replace("Top Picks", "Superhit Songs")
});

document.querySelector(".playlist1").addEventListener("click", ()=>{
    document.querySelector(".list ul").style.flexDirection = "Column";
    document.querySelector(".list li").innerHTML= document.querySelector(".list li").innerHTML.replace("Superhit Songs", "Top Picks")
});

// console.log(document.querySelector(".list li").innerHTML.replace("Top Picks", "Superhit Songs"));
main();