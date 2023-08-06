import { vec3, mat4, glMatrix} from "gl-matrix";
import { Shader } from "./Shader";

export class Material{
    public shader: Shader;
    public diffuse : vec3;
    public specular : vec3;
    public ambient : vec3;
    public shininess : number;

    constructor(shader: Shader, diffuse: vec3, specular: vec3, ambient: vec3, shininess: number){
        this.shader = shader;
        this.diffuse = diffuse;
        this.specular = specular;
        this.ambient = ambient;
        this.shininess = shininess;
    }
}