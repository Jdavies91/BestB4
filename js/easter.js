function jonS() {
    "use strict";
    var jonS = document.getElementById("jons");

    if(jonS.alt === "Placeholder"){
        jonS.alt = "PlaceholderS";
        jonS.src = "images/PlaceholderS.png";
    }
    else {
        jonS.alt = "Placeholder";
        jonS.src = "images/Placeholder.png";
    }
}
function erwinS() {
    "use strict";
    var erwinS = document.getElementById("erwins");
    var jonS = document.getElementById("jons");

    if(erwinS.alt === "Erwin" && jonS.alt === "PlaceholderS"){
        erwinS.alt = "ErwinS";
        erwinS.src = "images/ErwinS.png";
    }
    else {
        erwinS.alt = "Erwin";
        erwinS.src = "images/Erwin.png";
    }

}

function sonicS() {
    "use strict";
    var sonicS = document.getElementById("sonics");
    var erwinS = document.getElementById("erwins");
    if(sonicS.alt === "sonic" && erwinS.alt === "ErwinS"){
        sonicS.alt = "sonicS";
        sonicS.src = "images/sonicS.png";
    }
    else {
        sonicS.alt = "sonic";
        sonicS.src = "images/sonic.png";
    }
}

function hankS() {
    "use strict";
    var hankS = document.getElementById("hanks");
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];
    var sonicS = document.getElementById("sonics");
    if(hankS.alt === "Hank" && sonicS.alt === "sonicS"){
        hankS.alt = "HankS";
        hankS.src = "images/HankS.png";
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
        }
    }
    else {
        hankS.alt = "Hank";
        hankS.src = "images/Hank.png";
    }
}
