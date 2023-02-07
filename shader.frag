precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_offset;
uniform float u_zoom;
uniform float u_rotation;

mat2 r(float r)
{
    return mat2(cos(r), -sin(r), sin(r), cos(r)); 
}

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv = uv * r(u_rotation);
    uv = fract(max(u_zoom, 1.) * uv);
    uv += u_offset;
    gl_FragColor = vec4(abs(sin(uv.x + u_time)), abs(sin(uv.y - u_time)), (uv.x + uv.y) * .5, 1.);
}