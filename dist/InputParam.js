"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputParam = void 0;
const gl_matrix_1 = require("gl-matrix");
class InputParam {
    constructor() {
        this.MaterialShininess = 4;
        this.MaterialDiffuseStrength = 1;
        this.MaterialSpecularStrength = 1;
        this.LightDirectionX = 1;
        this.LightDirectionY = 1;
        this.isGrayScale = false;
        this.whiteColor = gl_matrix_1.vec3.fromValues(1.0, 1.0, 1.0);
    }
    update(material, light) {
        material.shininess = this.MaterialShininess;
    }
}
exports.InputParam = InputParam;
