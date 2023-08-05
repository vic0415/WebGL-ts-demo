#version 300 es
precision highp float;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoord;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 

uniform Material material;
//uniform sampler2D ourTexture;
//uniform sampler2D ourFace;
uniform vec3 objColor;
uniform vec3 ambientColor;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 CameraPos;
uniform sampler2D texture1;

out vec4 FragColor;


// texture samplers

void main() {
    //FragColor = vertexColor;
    //FragColor = texture(ourTexture, TexCoord) * texture(ourFace, TexCoord);

    vec3 lightDir = normalize(lightPos - FragPos);
    vec3 reflectVec = reflect(-lightDir, Normal);
    vec3 CameraVec = normalize(CameraPos - FragPos);


    float reflectDot = dot(reflectVec, CameraVec);
    if(reflectDot < 0.0){
        reflectDot = 0.0;
    }

    float specularAmount = pow(reflectDot, material.shininess);

    //float specularAmount = pow(max(dot(reflectVec, CameraVec), 0), material.shininess);
    //float specularAmount = 1.0;

    vec3 specular = material.specular * specularAmount * lightColor;

    //
    float diffuseDot = dot(lightDir, Normal);
    if(diffuseDot < 0.0){
        diffuseDot = 0.0;
    }

    vec3 diffuse = material.diffuse * diffuseDot * lightColor;

  
    //vec3 diffuse = material.diffuse * max(dot(lightDir, Normal), 0) * lightColor;
    //vec3 diffuse = material.diffuse * 1.0 * lightColor;

    vec3 ambient = material.ambient * ambientColor;
    FragColor = vec4((ambient + diffuse + specular) , 1.0) * texture(texture1, TexCoord);

    //FragColor = vec4(objColor, 1.0);

}