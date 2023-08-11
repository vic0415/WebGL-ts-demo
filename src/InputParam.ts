import { glMatrix, vec3 } from "gl-matrix";
import { Material } from './Material';
import { LightDirectional } from "./LightDirectional";

export class InputParam{
    public MaterialShininess: number = 4;
    public MaterialDiffuseStrength: number = 1;
    public MaterialSpecularStrength: number = 1;
    public LightDirectionX: number = 1;
    public LightDirectionY: number = 1;

    private whiteColor: vec3 = vec3.fromValues(1.0, 1.0, 1.0);

    update(material: Material, light: LightDirectional){
        material.shininess = this.MaterialShininess;

    }


}