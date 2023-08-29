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
const LightDirectional_1 = require("./LightDirectional");
const lil_gui_1 = __importDefault(require("lil-gui"));
const gl_matrix_1 = require("gl-matrix");
const Material_1 = require("./Material");
const InputParam_1 = require("./InputParam");
const main = () => {
    const canvas = document.getElementById('webgl');
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('No html canvas element.');
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
        -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0,
        1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 0.0,
        1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0,
        // front face
        -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        // left face
        -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0,
        -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
        // right face
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
        1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0,
        // bottom face
        -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0,
        1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0,
        1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0,
        -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0,
        -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 1.0,
        // top face
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
        1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0 // bottom-left       
        /*
              // positions          // colors           // texture coords
              0.5,  0.5, 0.0,   1.0, 0.0, 0.0,   1.0, 1.0, // top right
              0.5, -0.5, 0.0,   0.0, 1.0, 0.0,   1.0, 0.0, // bottom right
              -0.5, -0.5, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, // bottom left
              -0.5,  0.5, 0.0,   1.0, 1.0, 0.0,   0.0, 1.0,  // top left
        */
    ];
    const planeVertices = [
        // positions            // normals         // texcoords
        25.0, -0.5, 25.0, 0.0, 1.0, 0.0, 25.0, 0.0,
        -25.0, -0.5, 25.0, 0.0, 1.0, 0.0, 0.0, 0.0,
        -25.0, -0.5, -25.0, 0.0, 1.0, 0.0, 0.0, 25.0,
        25.0, -0.5, 25.0, 0.0, 1.0, 0.0, 25.0, 0.0,
        -25.0, -0.5, -25.0, 0.0, 1.0, 0.0, 0.0, 25.0,
        25.0, -0.5, -25.0, 0.0, 1.0, 0.0, 25.0, 25.0
    ];
    const quadVertices = [
        // positions   // texCoords
        -1.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0, 1.0,
        1.0, -1.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 1.0
    ];
    const indices = [
        0, 1, 3,
        1, 2, 3
    ];
    const quadShader = new Shader_1.Shader(gl, vertexTextureShaderSource, fragmentTextureShaderSource);
    //const floorShader = new Shader(gl, vertexFloorShaderSource, fragmentFloorShaderSource);
    const cubeShader = new Shader_1.Shader(gl, vertexShaderSource, fragmentShaderSource);
    const simpleDepthShader = new Shader_1.Shader(gl, vertexSimpleDepthShaderSource, fragmentSimpleDepthShaderSource);
    const debugDepthShader = new Shader_1.Shader(gl, vertexDebugDepthShaderSource, fragmentDebugDepthShaderSource);
    cubeShader.use();
    var isImageLoaded = false;
    const myMaterial = new Material_1.Material(cubeShader, loadTextureToGPU(gl, gl.getUniformLocation(cubeShader.program, "material.diffuse"), diffuseImage, 0), loadTextureToGPU(gl, gl.getUniformLocation(cubeShader.program, "material.specular"), specularImage, 1), gl_matrix_1.vec3.fromValues(1.0, 1.0, 1.0), 8.0);
    // Vertext buffer
    const cubeVAO = gl.createVertexArray();
    const cubeVBO = gl.createBuffer();
    gl.bindVertexArray(cubeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
    let cubeVerticeArray = new Float32Array(vertices);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVerticeArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(gl.getAttribLocation(simpleDepthShader.program, 'aPos'), 3, gl.FLOAT, false, cubeVerticeArray.BYTES_PER_ELEMENT * 8, 0);
    gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aPos'), 3, gl.FLOAT, false, cubeVerticeArray.BYTES_PER_ELEMENT * 8, 0);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aTexCoord'), 2, gl.FLOAT, false, cubeVerticeArray.BYTES_PER_ELEMENT * 8, cubeVerticeArray.BYTES_PER_ELEMENT * 6);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aNormal'), 3, gl.FLOAT, false, cubeVerticeArray.BYTES_PER_ELEMENT * 8, cubeVerticeArray.BYTES_PER_ELEMENT * 3);
    const planeVAO = gl.createVertexArray();
    const planeVBO = gl.createBuffer();
    gl.bindVertexArray(planeVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, planeVBO);
    let planeVerticeArray = new Float32Array(planeVertices);
    gl.bufferData(gl.ARRAY_BUFFER, planeVerticeArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(gl.getAttribLocation(simpleDepthShader.program, 'aPos'), 3, gl.FLOAT, false, planeVerticeArray.BYTES_PER_ELEMENT * 8, 0);
    gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aPos'), 3, gl.FLOAT, false, planeVerticeArray.BYTES_PER_ELEMENT * 8, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aNormal'), 3, gl.FLOAT, false, planeVerticeArray.BYTES_PER_ELEMENT * 8, planeVerticeArray.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aTexCoord'), 2, gl.FLOAT, false, planeVerticeArray.BYTES_PER_ELEMENT * 8, planeVerticeArray.BYTES_PER_ELEMENT * 6);
    const quadVAO = gl.createVertexArray();
    const quadVBO = gl.createBuffer();
    gl.bindVertexArray(quadVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    let quadVerticesArray = new Float32Array(quadVertices);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerticesArray, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(gl.getAttribLocation(debugDepthShader.program, 'aPos'), 2, gl.FLOAT, false, quadVerticesArray.BYTES_PER_ELEMENT * 4, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(gl.getAttribLocation(debugDepthShader.program, 'aTexCoords'), 2, gl.FLOAT, false, quadVerticesArray.BYTES_PER_ELEMENT * 4, quadVerticesArray.BYTES_PER_ELEMENT * 2);
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
    const light = new LightDirectional_1.LightDirectional(gl_matrix_1.vec3.fromValues(4, 2, 0), gl_matrix_1.vec3.fromValues(0, 0, 0), gl_matrix_1.vec3.fromValues(1.0, 1.0, 1.0));
    const camera = new Camera_1.Camera(gl_matrix_1.vec3.fromValues(0, 0.5, 6.0), 0, 3.14, gl_matrix_1.vec3.fromValues(0, 1, 0));
    let trans = gl_matrix_1.mat4.create();
    let viewMat = gl_matrix_1.mat4.create();
    let projMat = gl_matrix_1.mat4.create();
    //modelMat.translate(0.5, 0, 0);
    //modelMat = glm::rotate(modelMat, glm::radians(-45.0f), glm::vec3(0.0f, 0.0f, 1.0f));
    //viewMat = glm::translate(viewMat, glm::vec3(0.0f, 0.0f, -3.0f));
    gl_matrix_1.mat4.perspective(projMat, Math.PI / 3, window.innerWidth / window.innerHeight, 0.001, 100.0);
    viewMat = camera.GetViewMatrix();
    var q = gl_matrix_1.quat.create();
    var newrot = gl_matrix_1.mat4.create();
    var model = gl_matrix_1.mat4.create();
    let initRotQuat = gl_matrix_1.quat.create();
    gl_matrix_1.quat.fromEuler(initRotQuat, 0, 0, 0);
    gl_matrix_1.mat4.fromQuat(model, initRotQuat);
    // framebuffer configuration
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // create a color attachment texture
    gl.activeTexture(gl.TEXTURE0 + 2);
    const screenTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, screenTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, // level
    gl.RGBA, // internalFormat
    gl.canvas.width, gl.canvas.height, 0, // border
    gl.RGBA, // format
    gl.UNSIGNED_BYTE, // type
    null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, // attachment
    gl.TEXTURE_2D, screenTexture, 0);
    const rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, gl.canvas.width, gl.canvas.height); // use a single renderbuffer object for both a depth AND stencil buffer.
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo); // now actually attach it
    // now that we actually created the framebuffer and added all attachments we want to check if it is actually complete now
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
        console.error("ERROR::FRAMEBUFFER:: Framebuffer is not complete!");
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // depth map
    const depthMapFBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthMapFBO);
    const SHADOW_WIDTH = 2048, SHADOW_HEIGHT = 2048;
    gl.activeTexture(gl.TEXTURE0 + 3);
    const depthMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthMap);
    gl.texImage2D(gl.TEXTURE_2D, 0, // level
    gl.DEPTH_COMPONENT24, // internalFormat
    SHADOW_WIDTH, SHADOW_HEIGHT, 0, // border
    gl.DEPTH_COMPONENT, // format
    gl.UNSIGNED_INT, // type
    null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, // attachment
    gl.TEXTURE_2D, depthMap, 0);
    //gl.drawBuffers([gl.NONE]); // opengl: drawbuffer
    //gl.readBuffer(gl.NONE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const inputParam = new InputParam_1.InputParam();
    let initRotQuatFloor = gl_matrix_1.quat.fromEuler(gl_matrix_1.quat.create(), 0, 0, 0);
    let modelFloor = gl_matrix_1.mat4.fromQuat(gl_matrix_1.mat4.create(), initRotQuatFloor);
    gl_matrix_1.mat4.translate(modelFloor, modelFloor, gl_matrix_1.vec3.fromValues(0, -0.5, 0));
    //mat4.translate(model, model, vec3.fromValues(0, 0.5, 0));
    // rended loop
    var tick = function () {
        inputParam.update(myMaterial, light);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.1, 0.6, 0.6, 1.0);
        /*
        let modelMat = glMatrix.mat4.create();
  
        let newMat = glMatrix.mat4.create();
        let MyQuaternion = glMatrix.quat.fromEuler(glMatrix.quat.create(), transform.rotate.x, transform.rotate.y, transform.rotate.z);
        glMatrix.mat4.fromQuat(newMat, MyQuaternion);
        glMatrix.mat4.multiply(modelMat, newMat, modelMat);
  */
        /*
              var degY = transform.rotate.x;
              var degX = transform.rotate.y;
              var degZ = transform.rotate.z;
        
              glMatrix.quat.fromEuler(q, degY, degX, degZ);
              */
        gl_matrix_1.quat.fromEuler(q, dY * 180 / Math.PI, dX * 180 / Math.PI, 0);
        gl_matrix_1.mat4.fromQuat(newrot, q);
        gl_matrix_1.mat4.multiply(model, newrot, model);
        // depth map
        let lightProjection = gl_matrix_1.mat4.create();
        let lightView = gl_matrix_1.mat4.create();
        let lightSpaceMatrix = gl_matrix_1.mat4.create();
        let near_plane = 0.001, far_plane = 100;
        gl_matrix_1.mat4.ortho(lightProjection, -10.0, 10.0, -10.0, 10.0, near_plane, far_plane);
        lightView = gl_matrix_1.mat4.lookAt(lightView, light.position, gl_matrix_1.vec3.fromValues(0, 0, 0), gl_matrix_1.vec3.fromValues(0.0, 1.0, 0.0));
        lightSpaceMatrix = gl_matrix_1.mat4.mul(lightSpaceMatrix, lightProjection, lightView);
        simpleDepthShader.use();
        gl.uniformMatrix4fv(gl.getUniformLocation(simpleDepthShader.program, "lightSpaceMatrix"), false, lightSpaceMatrix);
        gl.enable(gl.DEPTH_TEST);
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.viewport(0, 0, SHADOW_WIDTH, SHADOW_HEIGHT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, depthMapFBO);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_2D, depthMap);
        gl.bindVertexArray(cubeVAO);
        gl.uniformMatrix4fv(gl.getUniformLocation(simpleDepthShader.program, "model"), false, model);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gl.bindVertexArray(planeVAO);
        gl.uniformMatrix4fv(gl.getUniformLocation(simpleDepthShader.program, "model"), false, modelFloor);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.disable(gl.CULL_FACE);
        /*
        //depth map debug
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
        debugDepthShader.use();
        gl.bindVertexArray(quadVAO);
        gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_2D, depthMap);	// use the color attachment texture as the texture of the quad plane
        debugDepthShader.setUniform1i("depthMap", 3);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
  */
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        if (inputParam.isGrayScale) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        }
        else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        // bind to framebuffer and draw scene as we normally would to color texture 
        gl.enable(gl.DEPTH_TEST); // enable depth testing (is disabled for rendering screen-space quad)
        // make sure we clear the framebuffer's content
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.bindVertexArray(cubeVAO);
        cubeShader.use();
        gl.uniformMatrix4fv(gl.getUniformLocation(cubeShader.program, "lightSpaceMatrix"), false, lightSpaceMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(cubeShader.program, "modelMat"), false, model);
        gl.uniformMatrix4fv(gl.getUniformLocation(cubeShader.program, "viewMat"), false, viewMat);
        gl.uniformMatrix4fv(gl.getUniformLocation(cubeShader.program, "projMat"), false, projMat);
        gl.uniform3f(gl.getUniformLocation(cubeShader.program, "objColor"), 1.0, 1.0, 1.0);
        gl.uniform3f(gl.getUniformLocation(cubeShader.program, "ambientColor"), 0.2, 0.2, 0.2);
        //gl.uniform3f(gl.getUniformLocation(myShader.program, "lightPos"), 8, 10, 0);
        gl.uniform3f(gl.getUniformLocation(cubeShader.program, "lightColor"), light.color[0], light.color[1], light.color[2]);
        gl.uniform3f(gl.getUniformLocation(cubeShader.program, "lightDir"), light.direction[0], light.direction[1], light.direction[2]);
        gl.uniform3f(gl.getUniformLocation(cubeShader.program, "CameraPos"), camera.Position[0], camera.Position[1], camera.Position[2]);
        myMaterial.shader.setUniform3f("material.ambient", myMaterial.ambient);
        myMaterial.shader.setUniform1i("material.diffuse", 0);
        myMaterial.shader.setUniform1i("material.specular", 1);
        myMaterial.shader.setUniform1f("material.shininess", myMaterial.shininess);
        myMaterial.shader.setUniform1f("material.diffuseStrength", inputParam.MaterialDiffuseStrength);
        myMaterial.shader.setUniform1f("material.specularStrength", inputParam.MaterialSpecularStrength);
        gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_2D, depthMap); // use the color attachment texture as the texture of the quad plane
        cubeShader.setUniform1i("shadowMap", 3);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        //floor
        //floorShader.use();
        gl.bindVertexArray(planeVAO);
        //gl.bindTexture(GL_TEXTURE_2D, floorTexture);
        gl.uniformMatrix4fv(gl.getUniformLocation(cubeShader.program, "modelMat"), false, modelFloor);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
        if (inputParam.isGrayScale) {
            // now bind back to default framebuffer and draw a quad plane with the attached framebuffer color texture
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.disable(gl.DEPTH_TEST); // disable depth test so screen-space quad isn't discarded due to depth test.
            // clear all relevant buffers
            gl.clearColor(0, 0, 0, 1.0); // set clear color to white (not really necessary actually, since we won't be able to see behind the quad anyways)
            gl.clear(gl.COLOR_BUFFER_BIT);
            quadShader.use();
            gl.bindVertexArray(quadVAO);
            gl.bindTexture(gl.TEXTURE_2D, screenTexture); // use the color attachment texture as the texture of the quad plane
            quadShader.setUniform1i("screenTexture", 2);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        requestAnimationFrame(tick);
    };
    tick();
    const gui = new lil_gui_1.default();
    const materialGroup = gui.addFolder('Material');
    materialGroup.add(inputParam, 'MaterialShininess', 1, 64).name('shininess');
    materialGroup.add(inputParam, 'MaterialDiffuseStrength', 0, 1).name('MaterialDiffuseStrength');
    materialGroup.add(inputParam, 'MaterialSpecularStrength', 0, 1).name('MaterialSpecularStrength');
    materialGroup.add(inputParam, 'isGrayScale').name('gray scale');
    /*
    const lightGroup = gui.addFolder( 'Light' );
    lightGroup.add( light, 'shininess', 1, 64 );
    */
    /*
        const gui = new GUI();
        gui.add( transform.rotate, 'x', -360, 360 ); 	// checkbox
        gui.add( transform.rotate, 'y', -360, 360 ); 	// checkbox
        gui.add( transform.rotate, 'z', -360, 360 ); 	// checkbox
    */
    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl_matrix_1.mat4.perspective(projMat, Math.PI / 3, canvas.width / canvas.height, 0.001, 100.0);
    };
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
        vertexShaderSource = yield loadShaderFile("shader/vertexShader.glsl");
        fragmentShaderSource = yield loadShaderFile("shader/fragmentShader.glsl");
        vertexTextureShaderSource = yield loadShaderFile("shader/vertexShader_texture.glsl");
        fragmentTextureShaderSource = yield loadShaderFile("shader/fragmentShader_texture.glsl");
        vertexFloorShaderSource = yield loadShaderFile("shader/vertexShader_floor.glsl");
        fragmentFloorShaderSource = yield loadShaderFile("shader/fragmentShader_floor.glsl");
        vertexSimpleDepthShaderSource = yield loadShaderFile("shader/vertexShaderSimpleDepth.glsl");
        fragmentSimpleDepthShaderSource = yield loadShaderFile("shader/fragmentShaderSimpleDepth.glsl");
        vertexDebugDepthShaderSource = yield loadShaderFile("shader/vertexShaderDebugDepth.glsl");
        fragmentDebugDepthShaderSource = yield loadShaderFile("shader/fragmentShaderDebugDepth.glsl");
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
var vertexTextureShaderSource = "";
var fragmentTextureShaderSource = "";
var vertexFloorShaderSource = "";
var fragmentFloorShaderSource = "";
var vertexSimpleDepthShaderSource = "";
var fragmentSimpleDepthShaderSource = "";
var vertexDebugDepthShaderSource = "";
var fragmentDebugDepthShaderSource = "";
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
