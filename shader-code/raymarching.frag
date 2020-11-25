#version 410

layout(location = 0) out vec4 out_color;
precision highp float; 
uniform vec2 v2Resolution;  // Width and height of the shader
uniform float fGlobalTime;  // Time elapsed
 
// Constants
#define PI 3.1415925359
#define TWO_PI 6.2831852
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURFACE_DIST .001

precision highp float;

float scale = 1.5;

mat2 rotate2D(float a) {
  return mat2(cos(a),-sin(a),sin(a),cos(a));
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdCylinder(vec3 p, vec3 a, vec3 b, float r) {
	vec3 ab = b-a;
    vec3 ap = p-a;
    
    float t = dot(ab, ap) / dot(ab, ab);
    t = clamp(t, 0., 1.);
    
    vec3 c = a + t*ab;
    
    float x = length(p-c)-r;
    float y = (abs(t-.5)-.5)*length(ab);
    float e = length(max(vec2(x, y), 0.));
    float i = min(max(x, y), 0.);
    
    return e+i;
}
 
float GetDist(vec3 p, float sc)
{
    vec3 pr = p - vec3(0,1,0);
    pr.xz *= rotate2D(fGlobalTime/4.);
    pr.yz *= rotate2D(1.6);
    pr.zx *= rotate2D(fGlobalTime/2.);
    vec4 s = vec4(0.,-.4,0,sc+.3); //Sphere. xyz is position w is radius
    float box = sdBox(pr-vec3(0,-.4,0), vec3(sc));
    float sphereDist = length(pr-s.xyz) - s.w;
    float planeDist = (p.y)+.5;
    float cylinder = sdCylinder(pr, vec3(0, -3, 0.), vec3(0, 8., 0), sc*.6);
    pr.yx *= rotate2D(1.8);
    float cylinder3 = sdCylinder(vec3(pr.x-sin(.5), pr.y, pr.z-.5), vec3(-1.5, -6, -.8), vec3(0, 8., 0), sc*.6);
    pr.zy *= rotate2D(1.8);
    float cylinder2 = sdCylinder(vec3(pr.x-sin(.5), pr.y, pr.z-.5), vec3(-1.5, -6, -.8), vec3(0, 8., 0), sc*.6);
    float opShape = max(max(sphereDist,-min(min(cylinder, cylinder2), cylinder3)),box);
    float d = max(opShape*2, opShape*4.)/2.;
    d = min(d,planeDist);
    //d = cylinder3;
 
    return d;
}
 
float RayMarch(vec3 ro, vec3 rd) 
{
    float dO = 0.; //Distane Origin
    for(int i=0;i<MAX_STEPS;i++)
    {
        vec3 p = ro + rd * dO;
        float ds = GetDist(p, scale); // ds is Distance Scene
        dO += ds;
        if(dO > MAX_DIST || ds < SURFACE_DIST) break;
    }
    return dO;
}

vec3 GetNormal(vec3 p)
{
    float d = GetDist(p, scale);
    vec2 e = vec2(.01,0);
    vec3 n = d - vec3(
    GetDist(p-e.xyy, scale),
    GetDist(p-e.yxy, scale),
    GetDist(p-e.yyx, scale));
 
    return normalize(n);
}
 
float GetLight(vec3 p)
{ 
    // Light (directional diffuse)
    vec3 lightPos = vec3(5.,5.,2.0);
    lightPos.xz *= rotate2D(fGlobalTime);// Light Position
    vec3 l = normalize(lightPos-p); // Light Vector
    vec3 n = GetNormal(p); // Normal Vector
   
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
    vec2 uv = (gl_FragCoord.xy-.5*v2Resolution.xy)/v2Resolution.y;
    vec3 ro = vec3(.5,5,-4.); // Ray Origin/Camera
    //ro.xz *= rotate2D(fGlobalTime);
    vec3 rd = R(uv, ro, vec3(0), .7);
 
    float d = RayMarch(ro,rd); // Distance
   
    vec3 p = ro + rd * d;
    float dif = GetLight(p); // Diffuse lighting
    d*= .2;
    vec3 color = vec3(dif);
    //color += GetNormal(p);
    //float color = GetLight(p);
 
    // Set the output color
    out_color = vec4(color,1.0);
}