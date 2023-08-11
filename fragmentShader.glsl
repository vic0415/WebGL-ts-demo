#version 300 es
precision highp float;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoord;

struct Material {
    vec3 ambient;
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
}; 

uniform Material material;
//uniform sampler2D ourTexture;
//uniform sampler2D ourFace;
uniform vec3 objColor;
uniform vec3 ambientColor;
uniform vec3 lightPos;
uniform vec3 lightDir;

uniform vec3 lightColor;
uniform vec3 CameraPos;

out vec4 FragColor;


// texture samplers

void main() {
    //FragColor = vertexColor;
    //FragColor = texture(ourTexture, TexCoord) * texture(ourFace, TexCoord);

    //vec3 lightDir = normalize(lightPos - FragPos);
    vec3 lightDirN = normalize(lightDir);
    vec3 reflectVec = reflect(-lightDirN, Normal);
    vec3 CameraVec = normalize(CameraPos - FragPos);


    float reflectDot = dot(reflectVec, CameraVec);
    if(reflectDot < 0.0){
        reflectDot = 0.0;
    }

    float specularAmount = pow(reflectDot, material.shininess);

    //float specularAmount = pow(max(dot(reflectVec, CameraVec), 0), material.shininess);
    //float specularAmount = 1.0;

    vec3 specular = texture(material.specular, TexCoord).rgb * specularAmount * lightColor;

    //
    float diffuseDot = dot(lightDirN, Normal);
    if(diffuseDot < 0.0){
        diffuseDot = 0.0;
    }

    vec3 diffuse = texture(material.diffuse, TexCoord).rgb * diffuseDot * lightColor;

  
    //vec3 diffuse = material.diffuse * max(dot(lightDir, Normal), 0) * lightColor;
    //vec3 diffuse = material.diffuse * 1.0 * lightColor;

    vec3 ambient = texture(material.diffuse, TexCoord).rgb * ambientColor;
    FragColor = vec4((ambient + diffuse + specular) * objColor, 1.0);

    //FragColor = vec4(objColor, 1.0);

}