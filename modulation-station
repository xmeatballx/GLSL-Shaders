#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rotate2D(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    st*=sin(u_time)+10.;
    st.x = sin(st.x+(st.y*sin(u_time/5)));
    st.y = cos(st.y+(st.x*cos(u_time/5)));
    st=rotate2D(sin(u_time))*st;
    gl_FragColor = vec4(vec3(smoothstep(st.x,st.y,sin(u_time/5.))),1.0);
}
