#version 300 es
precision highp float;
out vec4 FragColor;

void main()
{             

    gl_FragDepth = gl_FragCoord.z;
    //FragColor = vec4(vec3(gl_FragDepth), 1.0); // orthographic

}