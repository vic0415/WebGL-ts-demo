"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightDirectional = void 0;
const gl_matrix_1 = require("gl-matrix");
class LightDirectional {
    constructor(_position, _angle, _color) {
        this.position = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.angle = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.color = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.direction = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.WorldUp = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.position = _position;
        this.angle = _angle;
        this.color = _color;
        this.updateDirection();
    }
    updateDirection() {
        this.direction = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 1.0);
        this.direction = gl_matrix_1.vec3.rotateZ(this.direction, this.position, this.direction, this.angle[2]);
        this.direction = gl_matrix_1.vec3.rotateX(this.direction, this.position, this.direction, this.angle[0]);
        this.direction = gl_matrix_1.vec3.rotateY(this.direction, this.position, this.direction, this.angle[1]);
        //this.direction = vec3.mul(this.direction, this.direction, vec3.fromValues(-1.0, -1.0, -1.0));
    }
}
exports.LightDirectional = LightDirectional;
