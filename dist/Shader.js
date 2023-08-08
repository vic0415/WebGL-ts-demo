"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shader = void 0;
class Shader {
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = null;
        this.gl = gl;
        const vertexShader = gl.createShader(gl['VERTEX_SHADER']);
        if (!vertexShader) {
            throw new Error('Unable to create a vertexShader.');
        }
        const fragmentShader = gl.createShader(gl['FRAGMENT_SHADER']);
        if (!fragmentShader) {
            throw new Error('Unable to create a fragmentShader.');
        }
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error(`An error occurred compiling the vertexShader: ${gl.getShaderInfoLog(vertexShader)}`);
        }
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(fragmentShader)}`);
        }
        this.program = gl.createProgram() || new WebGLProgram();
        if (!this.program) {
            throw new Error('Unable to create the program.');
        }
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw new Error(`Unable to link the shaders: ${gl.getProgramInfoLog(this.program)}`);
        }
    }
    use() {
        var _a;
        (_a = this.gl) === null || _a === void 0 ? void 0 : _a.useProgram(this.program);
    }
    setUniform3f(paranNameString, param) {
        var _a, _b;
        (_a = this.gl) === null || _a === void 0 ? void 0 : _a.uniform3f((_b = this.gl) === null || _b === void 0 ? void 0 : _b.getUniformLocation(this.program, paranNameString), param[0], param[1], param[2]);
    }
    setUniform1f(paranNameString, param) {
        var _a;
        (_a = this.gl) === null || _a === void 0 ? void 0 : _a.uniform1f(this.gl.getUniformLocation(this.program, paranNameString), param);
    }
    SetUniform1i(paranNameString, slot) {
        var _a;
        (_a = this.gl) === null || _a === void 0 ? void 0 : _a.uniform1i(this.gl.getUniformLocation(this.program, paranNameString), slot);
    }
}
exports.Shader = Shader;
