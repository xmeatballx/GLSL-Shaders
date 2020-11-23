#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 spectrum1;

float noise(in vec2 st, in vec2 seed){
    return fract(sin(dot(vec2(floor(st.x), st.y),
                         seed))*
        43758.5453123);
}

float random(in vec2 st){
    return fract(sin(dot(st,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(1.0);
    float inc;
    inc++;
    float rs = noise(st+(random(vec2(st))), (st*(u_time/100000.)));
    float d = distance((st+abs(sin(u_time/10.))+1.0)/2.5, vec2(noise(vec2(st.x), vec2(random(st*1000000000.)))));
    color = min(vec3(rs),vec3(fract(d)));
    gl_FragColor = vec4(color,1.0);
}
