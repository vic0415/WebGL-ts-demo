#version 300 es
precision highp float;

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoord;
in vec4 FragPosLightSpace;

struct Material {
    vec3 ambient;
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
    float diffuseStrength;
    float specularStrength;
};

uniform sampler2D shadowMap;
uniform Material material;
//uniform sampler2D ourTexture;
//uniform sampler2D ourFace;
uniform vec3 objColor;
uniform vec3 ambientColor;
//uniform vec3 lightPos;
uniform vec3 lightDir;

uniform vec3 lightColor;
uniform vec3 CameraPos;

out vec4 FragColor;

// texture samplers
/*
float max(float a, float b)
{
    return a > b ? a : b;
}
*/
float ShadowCalculation(vec4 fragPosLightSpace)
{
    // 执行透视除法
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // 变换到[0,1]的范围
    projCoords = projCoords * 0.5 + 0.5;
    // 取得最近点的深度(使用[0,1]范围下的fragPosLight当坐标)
    float closestDepth = texture(shadowMap, projCoords.xy).r; 
    // 取得当前片段在光源视角下的深度
    float currentDepth = projCoords.z;
    // 检查当前片段是否在阴影中
    float bias = max(0.05 * (1.0 - dot(Normal, lightDir)), 0.0001);

    float shadow = currentDepth - bias > closestDepth  ? 1.0 : 0.0;

    return shadow;
}

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

    vec3 specular = texture(material.specular, TexCoord).rgb * specularAmount * lightColor * material.specularStrength;

    //
    float diffuseDot = dot(lightDirN, Normal);
    if(diffuseDot < 0.0){
        diffuseDot = 0.0;
    }

    vec3 diffuse = texture(material.diffuse, TexCoord).rgb * diffuseDot * lightColor * material.diffuseStrength;

  
    //vec3 diffuse = material.diffuse * max(dot(lightDir, Normal), 0) * lightColor;
    //vec3 diffuse = material.diffuse * 1.0 * lightColor;

    vec3 ambient = texture(material.diffuse, TexCoord).rgb * ambientColor * material.diffuseStrength;
    //vec3 ambient = 0.15 * ambientColor;
    // 计算阴影
    float shadow = ShadowCalculation(FragPosLightSpace);       
    FragColor = vec4((ambient + (1.0 - shadow) * (diffuse + specular)) * objColor, 1.0);

    //FragColor = vec4((ambient + diffuse + specular) * objColor, 1.0);

    //FragColor = vec4(objColor, 1.0);

}