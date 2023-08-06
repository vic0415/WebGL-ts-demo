import { vec3 } from "gl-matrix";

export class Shader{
    gl: WebGL2RenderingContext| null= null;
    program: WebGLProgram;


    constructor(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string){
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

    use(){
        this.gl?.useProgram(this.program);
    }

    setUniform3f(paranNameString: string, param: vec3){
        this.gl?.uniform3f(this.gl?.getUniformLocation(this.program, paranNameString), param[0], param[1], param[2]);
    }
    
    setUniform1f(paranNameString: string, param: number){
        this.gl?.uniform1f(this.gl.getUniformLocation(this.program, paranNameString), param);
    }

}