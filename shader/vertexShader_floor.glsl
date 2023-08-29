#version 300 es

in vec3 aPos;
in vec2 aTexCoords;

//uniform mat4 transform;
uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projMat;

out vec2 TexCoords;

void main()
{
   gl_Position = projMat * viewMat * modelMat * vec4(aPos.x, aPos.y, aPos.z, 1.0);
   TexCoords = aTexCoords;
}