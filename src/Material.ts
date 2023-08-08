import { vec3, mat4, glMatrix} from "gl-matrix";
import { Shader } from "./Shader";

export class Material{
    public shader: Shader;
    public diffuse : WebGLTexture | null;
    public specular : WebGLTexture | null;
    public ambient : vec3;
    public shininess : number;

    constructor(shader: Shader, diffuse: WebGLTexture | null, specular: WebGLTexture | null, ambient: vec3, shininess: number){
        this.shader = shader;
        this.diffuse = diffuse;
        this.specular = specular;
        this.ambient = ambient;
        this.shininess = shininess;
    }
}