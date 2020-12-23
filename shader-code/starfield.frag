
precision highp float; 
uniform vec2 u_resolution;  // Width and height of the shader
uniform float u_time;  // Time elapsed
 
// Constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURFACE_DIST .001

precision highp float;

float scale = 1.;

mat2 rotate2D(float a) {
  float c = abs(cos(a));
  float s = abs(sin(a));
  return mat2(-c,s,-s,-c);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .001;
    }
    return value;
}
 
float GetDist(vec3 p, float sc, vec2 uv)
{
    vec4 s = vec4(0, 1, 6, 1);
    
    float sphereDist =  length(p-s.xyz)-s.w;
    float planeDist = p.y;
    float d = sphereDist * fbm(uv);
    //d = cylinder3;
 
    return d;
}
 
float RayMarch(vec3 ro, vec3 rd, vec2 uv) 
{
    float dO = 0.; //Distane Origin
    for(int i=0;i<MAX_STEPS;i++)
    {
        vec3 p = ro + rd * dO;
        float ds = GetDist(p, scale, uv); // ds is Distance Scene
        dO += ds;
        if(dO > MAX_DIST || ds < SURFACE_DIST) break;
    }
    return dO;
}

vec3 GetNormal(vec3 p, vec2 uv)
{
    float d = GetDist(p, scale, uv);
    vec2 e = vec2(.01,0);
    vec3 n = d - vec3(
    GetDist(p-e.xyy, scale, uv),
    GetDist(p-e.yxy, scale, uv),
    GetDist(p-e.yyx, scale, uv));
 
    return normalize(n);
}
 
float GetLight(vec3 p, vec2 uv)
{ 
    // Light (directional diffuse)
    vec3 lightPos = vec3(5.,5.,2.0);
    lightPos.xz *= rotate2D(u_time/2.);// Light Position
    vec3 l = normalize(lightPos-p); // Light Vector
    vec3 n = GetNormal(p, uv); // Normal Vector
   
    float dif = dot(n,l); // Diffuse light
    dif = clamp(dif,0.,1.); // Clamp so it doesnt go below 0
 
    return dif;
}

vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}
 
void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    uv *= 800.;
    uv.x -= (u_time/100.);
    uv.y += .5;

    vec3 col = vec3(0);
    
    vec3 ro = vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    float d = RayMarch(ro, rd, uv);
    
    vec3 p = ro + rd * d;
    
    float dif = GetLight(p, uv);
    col = vec3(dif);
    
    col = pow(col, vec3(.4545));
 
    // Set the output color
    gl_FragColor = vec4(col,1.0);
}