"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
class Material {
    constructor(shader, diffuse, specular, ambient, shininess) {
        this.shader = shader;
        this.diffuse = diffuse;
        this.specular = specular;
        this.ambient = ambient;
        this.shininess = shininess;
    }
}
exports.Material = Material;
