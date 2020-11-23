#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

//mat2 rotate2d(float angle){
//    return mat2(cos(angle),-sin(angle),
//                sin(angle),cos(angle));
//}

float lines(in vec2 pos, float b){
    float scale = 50.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*4.189)+b*2.0))*.5);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.y *= u_resolution.y/u_resolution.x;
    //st=st*2.-5.;
    vec2 pos = st.yx*vec2(noise(st*cos(u_time/30.)/2.)*2., noise(st*sin(u_time/100.)));

    float pattern = pos.x;

    // Add noise
   // pos = rotate2d( noise(pos) ) * pos;

    // Draw lines
    pattern = lines(pos,.5);

    vec3 color = vec3(lines(pos,.5));

    gl_FragColor = vec4(color,1.0);
}

