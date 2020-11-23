var canvas = new Array(document.getElementById('flowy'), document.getElementById('motion'), document.getElementById('mod'));
var shaderlist = document.getElementById('shaderlist');

var listValues = new Array("flow fields", "noise motion", "modulation station")

setInterval(() => {
    for (var i = 0; i<3; i++){
        if (shaderlist.value != listValues[i]){
            canvas[i].classList.remove("visible");
            canvas[i].classList.add("invisible");
        } else {
            canvas[i].classList.remove("invisible");
            canvas[i].classList.add("visible");
        }
    }
}, 1);