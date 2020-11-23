var canvas = document.querySelector('.glslCanvas')
var shaderlist = document.getElementById('shaderlist');

let listValues = new Array();
listValues[0] = new Array("flow fields", "/shader-code/flowy.frag");
listValues[1] = new Array("noise motion", "/shader-code/noise-motion.frag");
listValues[2] = new Array("modulation station", "/shader-code/modulation-station.frag");

function loadShader(){
    for (var i = 0; i<3; i++){
        if (shaderlist.value && shaderlist.value == listValues[i][0]){
            canvas.width+=10;
            canvas.setAttribute("data-fragment-url", listValues[i][1]);
        }
    }
}