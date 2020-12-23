var canvas = new Array(document.getElementById('rays'), document.getElementById('flowy'), document.getElementById('motion'), document.getElementById('modulate'), document.getElementById('starfield'));
var shaderlist = document.getElementById('shaderlist');

var listValues = new Array("raymarching", "flow fields", "noise motion", "modulation station", "starfield");

setInterval(() => {
    for (var i = 0; i<canvas.length; i++){
        if (shaderlist.value != listValues[i]){
            canvas[i].classList.remove("visible");
            canvas[i].classList.add("invisible");
            
        } else {
            canvas[i].classList.remove("invisible");
            canvas[i].classList.add("visible");
        }
    }
}, 1);