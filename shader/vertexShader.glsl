#version 300 es

in vec3 aPos;
//layout (location = 1) in vec3 aColor;
//layout (location = 8) in vec2 aTexCoord;
in vec3 aNormal;
in vec2 aTexCoord;

//uniform mat4 transform;
uniform mat4 modelMat;
uniform mat4 viewMat;
uniform mat4 projMat;

//out vec4 vertexColor;
//out vec2 TexCoord;
out vec3 FragPos;
out vec3 Normal;
out vec2 TexCoord;


void main() {
   gl_Position = projMat * viewMat * modelMat * vec4(aPos.x, aPos.y, aPos.z, 1.0);
   //vertexColor = vec4(aColor.x, aColor.y, aColor.z, 1.0);
   //TexCoord = aTexCoord;
   FragPos = (modelMat * vec4(aPos.x, aPos.y, aPos.z, 1.0)).xyz;
   Normal = mat3(modelMat) * aNormal;
	TexCoord = vec2(aTexCoord.x, aTexCoord.y);
}