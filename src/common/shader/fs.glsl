uniform float angle;
uniform float time;
uniform sampler2D texture;
varying vec2 vUv;

void main( void ) {
    //vec2 position = -1.0 + 2.0 * vUv;
    vec2 uv = vUv;
    //uv.x = uv.x + 0.03*sin(time+uv.x*angle);
    //uv.y = uv.y + 0.03*sin(time+uv.y*angle);
    //
    //uv.x = uv.x + 0.03*sin(time+uv.x*angle);
    //uv.y = uv.y + 0.03*sin(time+uv.y*angle);
    uv.xy = uv.xy+0.02*sin(time+uv.xy*angle);
    //
    vec3 color = texture2D( texture, uv ).rgb;
    gl_FragColor = vec4( color, .98 );
}