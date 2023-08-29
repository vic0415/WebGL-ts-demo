import { vec3, mat4, glMatrix} from "gl-matrix";

export class LightDirectional{
    public position : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    public angle : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    public color : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    public direction : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    public WorldUp : vec3 = vec3.set(vec3.create(), 0, 0, 0);

    constructor(_position: vec3, _angle: vec3, _color: vec3){
        this.position = _position;
        this.angle = _angle;
        this.color = _color;
        this.updateDirection();
    }

    updateDirection(){
        this.direction = vec3.set(vec3.create(), 0, 0, 1.0);
        this.direction = vec3.rotateZ(this.direction, this.position, this.direction, this.angle[2]);
        this.direction = vec3.rotateX(this.direction, this.position, this.direction, this.angle[0]);
        this.direction = vec3.rotateY(this.direction, this.position, this.direction, this.angle[1]);
        //this.direction = vec3.mul(this.direction, this.direction, vec3.fromValues(-1.0, -1.0, -1.0));
    }
}