var canvas = document.createElement("canvas");
var sandbox = new GlslCanvas(canvas);
var shaderlist = document.getElementById('shaderlist');

let listValues = new Array();
listValues[0] = new Array("flow fields", "/shader-code/flowy.frag");
listValues[1] = new Array("noise motion", "/shader-code/noise-motion.frag");
listValues[2] = new Array("modulation station", "/shader-code/modulation-station.frag");

function loadShader(){
    for (var i = 0; i<3; i++){
        if (shaderlist.value && shaderlist.value == listValues[i][0]){
            sandbox.load(listValues[i][1]);
        }
    }
}