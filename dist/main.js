"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shader_1 = require("./Shader");
const Camera_1 = require("./Camera");
const lil_gui_1 = __importDefault(require("lil-gui"));
const Transform_1 = require("./Transform");
const gl_matrix_1 = require("gl-matrix");
const Material_1 = require("./Material");
const main = () => {
    // Find the canvas element
    const canvas = document.getElementById('webgl');
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('No html canvas element.');
    }
    // WebGL rendering context
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        throw new Error('Unable to initialize WebGL.');
    }
    var AMORTIZATION = 0.95;
    var drag = false;
    var old_x, old_y;
    var dX = 0, dY = 0;
    var THETA = 0;
    var PHI = 0;
    var mouseDown = function (e) {
        console.log("mouseDown");
        drag = true;
        old_x = e.pageX;
        old_y = e.pageY;
        e.preventDefault();
        return false;
    };
    var mouseUp = function (e) {
        console.log("mouseUp");
        drag = false;
    };
    var mouseMove = function (e) {
        if (!drag)
            return false;
        dX = (e.pageX - old_x) * 2 * Math.PI / canvas.width;
        dY = (e.pageY - old_y) * 2 * Math.PI / canvas.height;
        THETA += dX;
        PHI += dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    };
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mouseout', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    console.log("webgl start");
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    const vertices = [
        -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, -1.0,
        0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, -1.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 0.0, -1.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 0.0, -1.0,
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, -1.0,
        -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, -1.0,
        -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
        -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5, 1.0, 0.0, -1.0, 0.0, 0.0,
        -0.5, 0.5, -0.5, 1.0, 1.0, -1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 1.0, -1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 1.0, -1.0, 0.0, 0.0,
        -0.5, -0.5, 0.5, 0.0, 0.0, -1.0, 0.0, 0.0,
        -0.5, 0.5, 0.5, 1.0, 0.0, -1.0, 0.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, -1.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 1.0, 0.0, -1.0, 0.0,
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0,
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0,
        -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, -1.0, 0.0,
        -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, -1.0, 0.0,
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,
        -0.5, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0, 0.0,
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0
        /*
              // positions          // colors           // texture coords
              0.5,  0.5, 0.0,   1.0, 0.0, 0.0,   1.0, 1.0, // top right
              0.5, -0.5, 0.0,   0.0, 1.0, 0.0,   1.0, 0.0, // bottom right
              -0.5, -0.5, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, // bottom left
              -0.5,  0.5, 0.0,   1.0, 1.0, 0.0,   0.0, 1.0,  // top left
        */
    ];
    const indices = [
        0, 1, 3,
        1, 2, 3
    ];
    const myShader = new Shader_1.Shader(gl, vertexShaderSource, fragmentShaderSource);
    myShader.use();
    var isImageLoaded = false;
    const myMaterial = new Material_1.Material(myShader, loadTextureToGPU(gl, gl.getUniformLocation(myShader.program, "material.diffuse"), diffuseImage, 0), loadTextureToGPU(gl, gl.getUniformLocation(myShader.program, "material.specular"), specularImage, 1), gl_matrix_1.vec3.fromValues(1.0, 1.0, 1.0), 8.0);
    // Vertext buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var vertexPosTypedArray = new Float32Array(vertices);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPosTypedArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(gl.getAttribLocation(myShader.program, 'aPos'), 3, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(gl.getAttribLocation(myShader.program, 'aTexCoord'), 2, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, vertexPosTypedArray.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(gl.getAttribLocation(myShader.program, 'aNormal'), 3, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, vertexPosTypedArray.BYTES_PER_ELEMENT * 5);
    gl.enableVertexAttribArray(1);
    /*
    gl.vertexAttribPointer(gl.getAttribLocation(myShader.program, 'aPos'), 3, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(gl.getAttribLocation(myShader.program, 'aTexCoord'), 2, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, vertexPosTypedArray.BYTES_PER_ELEMENT * 6);
    gl.enableVertexAttribArray(1);
    
    const EBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    var indicesTypedArray = new Uint16Array(indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTypedArray, gl.STATIC_DRAW);
    */
    //ext?.bindVertexArrayOES(null);  
    const transform = new Transform_1.Transform();
    //transform.rotate = 0;
    /*  const camera = new Camera(new GMath.Vector3(0, 0.5, 3.0), 0, 3.14, new GMath.Vector3(0, 1, 0));
    
      let viewMat = new GMath.Matrix4();*/
    //let projMat = new GMath.Matrix4();
    //modelMat.translate(0.5, 0, 0);
    //projMat.setPerspective(60, 800.0/800.0, 0.001, 100.0);
    const camera = new Camera_1.Camera(gl_matrix_1.vec3.fromValues(0, 0.5, 3.0), 0, 3.14, gl_matrix_1.vec3.fromValues(0, 1, 0));
    let trans = gl_matrix_1.mat4.create();
    let viewMat = gl_matrix_1.mat4.create();
    let projMat = gl_matrix_1.mat4.create();
    //modelMat.translate(0.5, 0, 0);
    //modelMat = glm::rotate(modelMat, glm::radians(-45.0f), glm::vec3(0.0f, 0.0f, 1.0f));
    //viewMat = glm::translate(viewMat, glm::vec3(0.0f, 0.0f, -3.0f));
    gl_matrix_1.mat4.perspective(projMat, Math.PI / 3, 800.0 / 800.0, 0.001, 100.0);
    viewMat = camera.GetViewMatrix();
    var eye = gl_matrix_1.vec3.fromValues(0, 0.5, 1.0);
    var target = gl_matrix_1.vec3.fromValues(0, 0, 0);
    var up = gl_matrix_1.vec3.fromValues(0, 1, 0);
    var vm = gl_matrix_1.mat4.create();
    var pvm = gl_matrix_1.mat4.create();
    var q = gl_matrix_1.quat.create();
    var newrot = gl_matrix_1.mat4.create();
    var model = gl_matrix_1.mat4.create();
    let initRotQuat = gl_matrix_1.quat.create();
    gl_matrix_1.quat.fromEuler(initRotQuat, 45, 45, 0);
    gl_matrix_1.mat4.fromQuat(model, initRotQuat);
    // 1. perspective matrix
    gl_matrix_1.mat4.perspective(pvm, 60, 800.0 / 800.0, 0.001, 100.0);
    // 2. view matrix
    gl_matrix_1.mat4.lookAt(vm, eye, target, up);
    gl_matrix_1.mat4.multiply(pvm, pvm, vm);
    var tick = function () {
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        /*
              let modelMat = new GMath.Matrix4();
        
              //modelMat.setRotate(transform.rotate.x, 1, 0, 0);
              //modelMat.setRotate(transform.rotate.y, 0, 1, 0);
              modelMat = GMath.rotate(transform.rotate.x, Math.cos(-transform.rotate.y * Math.PI / 180), 0, Math.sin(-transform.rotate.y * Math.PI / 180)).concat(GMath.rotate(transform.rotate.y, 0, 1, 0));
        
              var modelMatNew = mat4.create();
              */
        //modelMat.rotateXY(transform.rotate.x*Math.PI/180, transform.rotate.y*Math.PI/180);
        //modelMat.rotateX(transform.rotate.x*Math.PI/180);
        /*
              let modelMat = glMatrix.mat4.create();
        
              let newMat = glMatrix.mat4.create();
              let MyQuaternion = glMatrix.quat.fromEuler(glMatrix.quat.create(), transform.rotate.x, transform.rotate.y, transform.rotate.z);
              glMatrix.mat4.fromQuat(newMat, MyQuaternion);
              glMatrix.mat4.multiply(modelMat, newMat, modelMat);
        */
        var degY = transform.rotate.x;
        var degX = transform.rotate.y;
        var degZ = transform.rotate.z;
        //glMatrix.quat.fromEuler(q, degY, degX, degZ);
        gl_matrix_1.quat.fromEuler(q, dY * 180 / Math.PI, dX * 180 / Math.PI, 0);
        gl_matrix_1.mat4.fromQuat(newrot, q);
        gl_matrix_1.mat4.multiply(model, newrot, model);
        var final = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.multiply(final, pvm, model);
        gl.uniformMatrix4fv(gl.getUniformLocation(myShader.program, "modelMat"), false, model);
        gl.uniformMatrix4fv(gl.getUniformLocation(myShader.program, "viewMat"), false, viewMat);
        gl.uniformMatrix4fv(gl.getUniformLocation(myShader.program, "projMat"), false, projMat);
        gl.uniform3f(gl.getUniformLocation(myShader.program, "objColor"), 1.0, 1.0, 1.0);
        gl.uniform3f(gl.getUniformLocation(myShader.program, "ambientColor"), 0.2, 0.2, 0.2);
        gl.uniform3f(gl.getUniformLocation(myShader.program, "lightPos"), 8, 10, 0);
        gl.uniform3f(gl.getUniformLocation(myShader.program, "lightColor"), 1.0, 1.0, 1.0);
        gl.uniform3f(gl.getUniformLocation(myShader.program, "CameraPos"), camera.Position[0], camera.Position[1], camera.Position[2]);
        myMaterial.shader.setUniform3f("material.ambient", myMaterial.ambient);
        myMaterial.shader.SetUniform1i("material.diffuse", 0);
        myMaterial.shader.SetUniform1i("material.specular", 1);
        myMaterial.shader.setUniform1f("material.shininess", myMaterial.shininess);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        //gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(tick);
    };
    tick();
    const gui = new lil_gui_1.default();
    const materialGroup = gui.addFolder('Material');
    materialGroup.add(myMaterial, 'shininess', 1, 64);
    /*
        const gui = new GUI();
        gui.add( transform.rotate, 'x', -360, 360 ); 	// checkbox
        gui.add( transform.rotate, 'y', -360, 360 ); 	// checkbox
        gui.add( transform.rotate, 'z', -360, 360 ); 	// checkbox
    */
};
function loadShaderFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(filename);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}.`);
        }
        return yield response.text();
    });
}
const loadImage = (url, image) => new Promise((resolve, reject) => {
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.src = url;
});
function LoadResources() {
    return __awaiter(this, void 0, void 0, function* () {
        vertexShaderSource = yield loadShaderFile("vertexShader.glsl");
        fragmentShaderSource = yield loadShaderFile("fragmentShader.glsl");
        console.log("Vertex Shader:", vertexShaderSource);
        console.log("Fragment Shader:", fragmentShaderSource);
        loadImage("./image/container2.png", diffuseImage).then(img => {
            loadImage("./image/container2_specular.png", specularImage).then(img => {
                main();
            })
                .catch(err => console.error(err));
        })
            .catch(err => console.error(err));
    });
}
var vertexShaderSource = "";
var fragmentShaderSource = "";
var diffuseImage = new Image();
var specularImage = new Image();
function loadTextureToGPU(gl, u_Sampler, image, texUnit) {
    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE0 + texUnit);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // Set the texture unit 0 to the sampler
    //gl.uniform1i(u_Sampler, texUnit);
    gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
}
window.onload = LoadResources;
