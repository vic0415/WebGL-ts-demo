import {Shader} from './Shader';
import {Camera} from './Camera';
import {LightDirectional} from './LightDirectional';
import * as GMath from './Math';
import GUI from 'lil-gui'; 
import { Transform } from './Transform';
import { vec3, mat4, quat, glMatrix} from "gl-matrix";
import { Material } from './Material';
import { InputParam } from './InputParam';

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
  var old_x:number, old_y: number;
  var dX = 0, dY = 0;
  var THETA = 0;
  var PHI = 0;

  var mouseDown = function (e: any) {
    console.log("mouseDown");

      drag = true;
      old_x = e.pageX;
      old_y = e.pageY;

      e.preventDefault();
      return false;
  };

  var mouseUp = function (e :any) {
    console.log("mouseUp");
      drag = false;
  };

  var mouseMove = function (e: any) {
      if (!drag) return false;
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
      
      -0.5, -0.5, -0.5,  0.0,  0.0,  0.0,  0.0, -1.0,
      0.5, -0.5, -0.5,  1.0,  0.0,  0.0,  0.0, -1.0,
      0.5,  0.5, -0.5,  1.0,  1.0,  0.0,  0.0, -1.0,
      0.5,  0.5, -0.5,  1.0,  1.0,  0.0,  0.0, -1.0,
      -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  0.0, -1.0,
      -0.5, -0.5, -0.5,  0.0,  0.0,  0.0,  0.0, -1.0,
  
      -0.5, -0.5,  0.5,  0.0,  0.0,  0.0,  0.0,  1.0,
      0.5, -0.5,  0.5,  1.0,  0.0,  0.0,  0.0,  1.0,
      0.5,  0.5,  0.5,  1.0,  1.0,  0.0,  0.0,  1.0,
      0.5,  0.5,  0.5,  1.0,  1.0,  0.0,  0.0,  1.0,
      -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  0.0,  1.0,
      -0.5, -0.5,  0.5,  0.0,  0.0,  0.0,  0.0,  1.0,
  
      -0.5,  0.5,  0.5,  1.0,  0.0, -1.0,  0.0,  0.0,
      -0.5,  0.5, -0.5,  1.0,  1.0, -1.0,  0.0,  0.0,
      -0.5, -0.5, -0.5,  0.0,  1.0, -1.0,  0.0,  0.0,
      -0.5, -0.5, -0.5,  0.0,  1.0, -1.0,  0.0,  0.0,
      -0.5, -0.5,  0.5,  0.0,  0.0, -1.0,  0.0,  0.0,
      -0.5,  0.5,  0.5,  1.0,  0.0, -1.0,  0.0,  0.0,
  
      0.5,  0.5,  0.5,  1.0,  0.0,  1.0,  0.0,  0.0,
      0.5,  0.5, -0.5,  1.0,  1.0,  1.0,  0.0,  0.0,
      0.5, -0.5, -0.5,  0.0,  1.0,  1.0,  0.0,  0.0,
      0.5, -0.5, -0.5,  0.0,  1.0,  1.0,  0.0,  0.0,
      0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  0.0,
      0.5,  0.5,  0.5,  1.0,  0.0,  1.0,  0.0,  0.0,
  
      -0.5, -0.5, -0.5,  0.0,  1.0,  0.0, -1.0,  0.0,
      0.5, -0.5, -0.5,  1.0,  1.0,  0.0, -1.0,  0.0,
      0.5, -0.5,  0.5,  1.0,  0.0,  0.0, -1.0,  0.0,
      0.5, -0.5,  0.5,  1.0,  0.0,  0.0, -1.0,  0.0,
      -0.5, -0.5,  0.5,  0.0,  0.0,  0.0, -1.0,  0.0,
      -0.5, -0.5, -0.5,  0.0,  1.0,  0.0, -1.0,  0.0,
  
      -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  1.0,  0.0,
      0.5,  0.5, -0.5,  1.0,  1.0,  0.0,  1.0,  0.0,
      0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,
      0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,
      -0.5,  0.5,  0.5,  0.0,  0.0,  0.0,  1.0,  0.0,
      -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  1.0,  0.0
      
/*
      // positions          // colors           // texture coords
      0.5,  0.5, 0.0,   1.0, 0.0, 0.0,   1.0, 1.0, // top right
      0.5, -0.5, 0.0,   0.0, 1.0, 0.0,   1.0, 0.0, // bottom right
      -0.5, -0.5, 0.0,   0.0, 0.0, 1.0,   0.0, 0.0, // bottom left
      -0.5,  0.5, 0.0,   1.0, 1.0, 0.0,   0.0, 1.0,  // top left 
*/
    ];

  const quadVertices = [// vertex attributes for a quad that fills the entire screen in Normalized Device Coordinates.
    // positions   // texCoords
    -1.0,  1.0,  0.0, 1.0,
    -1.0, -1.0,  0.0, 0.0,
      1.0, -1.0,  1.0, 0.0,

    -1.0,  1.0,  0.0, 1.0,
      1.0, -1.0,  1.0, 0.0,
      1.0,  1.0,  1.0, 1.0
  ];

    const indices = [
      0, 1, 3, 
      1, 2, 3  
  ];

  const quadShader = new Shader(gl, vertexTextureShaderSource, fragmentTextureShaderSource);

  const cubeShader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
  cubeShader.use();

  var isImageLoaded = false;

  const myMaterial = new Material(cubeShader, 
    loadTextureToGPU(gl, gl.getUniformLocation(cubeShader.program, "material.diffuse"), diffuseImage, 0),
    loadTextureToGPU(gl, gl.getUniformLocation(cubeShader.program, "material.specular"), specularImage, 1),
    vec3.fromValues(1.0, 1.0, 1.0),
    8.0
  );

  // Vertext buffer
  const cubeVAO = gl.createVertexArray();
  const cubeVBO = gl.createBuffer();
  gl.bindVertexArray(cubeVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);

  let vertexPosTypedArray = new Float32Array(vertices);
  gl.bufferData(gl.ARRAY_BUFFER, vertexPosTypedArray, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aPos'), 3, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, 0);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aTexCoord'), 2, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, vertexPosTypedArray.BYTES_PER_ELEMENT * 3);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(gl.getAttribLocation(cubeShader.program, 'aNormal'), 3, gl.FLOAT, false, vertexPosTypedArray.BYTES_PER_ELEMENT * 8, vertexPosTypedArray.BYTES_PER_ELEMENT * 5);

  const quadVAO = gl.createVertexArray();
  const quadVBO = gl.createBuffer();
  gl.bindVertexArray(quadVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
  let quadVerticesArray = new Float32Array(quadVertices);
  gl.bufferData(gl.ARRAY_BUFFER, quadVerticesArray, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(gl.getAttribLocation(quadShader.program, 'aPos'), 2, gl.FLOAT, false, quadVerticesArray.BYTES_PER_ELEMENT * 4, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(gl.getAttribLocation(quadShader.program, 'aTexCoords'), 2, gl.FLOAT, false, quadVerticesArray.BYTES_PER_ELEMENT * 4, quadVerticesArray.BYTES_PER_ELEMENT * 2);
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

  const transform = new Transform()
  //transform.rotate = 0;

/*  const camera = new Camera(new GMath.Vector3(0, 0.5, 3.0), 0, 3.14, new GMath.Vector3(0, 1, 0));

  let viewMat = new GMath.Matrix4();*/
  //let projMat = new GMath.Matrix4();
  //modelMat.translate(0.5, 0, 0);

  //projMat.setPerspective(60, 800.0/800.0, 0.001, 100.0);

    const light = new LightDirectional(vec3.fromValues(8, 10, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1.0, 1.0, 1.0));

    const camera = new Camera(vec3.fromValues(0, 0.5, 3.0), 0, 3.14, vec3.fromValues(0, 1, 0));

    let trans = mat4.create();
    let viewMat = mat4.create();
    let projMat = mat4.create();
    //modelMat.translate(0.5, 0, 0);
  
    //modelMat = glm::rotate(modelMat, glm::radians(-45.0f), glm::vec3(0.0f, 0.0f, 1.0f));
    //viewMat = glm::translate(viewMat, glm::vec3(0.0f, 0.0f, -3.0f));
    mat4.perspective(projMat, Math.PI/3, window.innerWidth/window.innerHeight, 0.001, 100.0);

    viewMat = camera.GetViewMatrix();

    var q = quat.create();
    var newrot = mat4.create();
    var model = mat4.create();

    let initRotQuat: quat = quat.create();
    quat.fromEuler(initRotQuat, 45, 45, 0);
    mat4.fromQuat(model, initRotQuat);

    // framebuffer configuration
    // -------------------------
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    // create a color attachment texture
    gl.activeTexture(gl.TEXTURE0 + 2);
    const screenTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, screenTexture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0, // level
      gl.RGBA, // internalFormat
      gl.canvas.width,
      gl.canvas.height,
      0, // border
      gl.RGBA, // format
      gl.UNSIGNED_BYTE, // type
      null, // data
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0, // attachment
      gl.TEXTURE_2D,
      screenTexture,
      0, // level
    );

    const rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, gl.canvas.width, gl.canvas.height); // use a single renderbuffer object for both a depth AND stencil buffer.
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo); // now actually attach it
    // now that we actually created the framebuffer and added all attachments we want to check if it is actually complete now
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
      console.error("ERROR::FRAMEBUFFER:: Framebuffer is not complete!");
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    const inputParam = new InputParam();
    
    var tick = function()
    {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      if(inputParam.isGrayScale){
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      }else{
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      // bind to framebuffer and draw scene as we normally would to color texture 
      gl.enable(gl.DEPTH_TEST); // enable depth testing (is disabled for rendering screen-space quad)
      // make sure we clear the framebuffer's content
      gl.clearColor(0.1, 0.1, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



      gl.bindVertexArray(cubeVAO);
      cubeShader.use();
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
      quat.fromEuler(q, dY * 180 / Math.PI, dX * 180 / Math.PI, 0);

      mat4.fromQuat(newrot, q);
      mat4.multiply(model, newrot, model);

      inputParam.update(myMaterial, light);


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

      gl.drawArrays(gl.TRIANGLES, 0, 36);


      if(inputParam.isGrayScale){

        // now bind back to default framebuffer and draw a quad plane with the attached framebuffer color texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.disable(gl.DEPTH_TEST); // disable depth test so screen-space quad isn't discarded due to depth test.
        // clear all relevant buffers
        gl.clearColor(0, 0, 0, 1.0); // set clear color to white (not really necessary actually, since we won't be able to see behind the quad anyways)
        gl.clear(gl.COLOR_BUFFER_BIT);

        quadShader.use();
        gl.bindVertexArray(quadVAO);
        gl.bindTexture(gl.TEXTURE_2D, screenTexture);	// use the color attachment texture as the texture of the quad plane
        quadShader.setUniform1i("screenTexture", 2);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

      }

      requestAnimationFrame(tick);
    };


    tick();
    const gui = new GUI();

    const materialGroup = gui.addFolder( 'Material' );
    materialGroup.add( inputParam, 'MaterialShininess', 1, 64 ).name( 'shininess' );
    materialGroup.add( inputParam, 'MaterialDiffuseStrength', 0, 1 ).name( 'MaterialDiffuseStrength' );
    materialGroup.add( inputParam, 'MaterialSpecularStrength', 0, 1 ).name( 'MaterialSpecularStrength' );
    materialGroup.add( inputParam, 'isGrayScale').name( 'gray scale' );

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
      mat4.perspective(projMat, Math.PI/3, canvas.width/canvas.height, 0.001, 100.0);
    }

  }

async function loadShaderFile(filename: string): Promise<string> {
  const response = await fetch(filename);
  if (!response.ok) {
    throw new Error(`Failed to load ${filename}.`);
  }
  return await response.text();
}

const loadImage = (url: string, image: HTMLImageElement) => new Promise((resolve, reject) => {
  image.addEventListener('load', () => resolve(image));
  image.addEventListener('error', (err) => reject(err));
  image.src = url;
});

async function LoadResources() {
  vertexShaderSource = await loadShaderFile("shader/vertexShader.glsl");
  fragmentShaderSource = await loadShaderFile("shader/fragmentShader.glsl");
  vertexTextureShaderSource = await loadShaderFile("shader/vertexShader_texture.glsl");
  fragmentTextureShaderSource = await loadShaderFile("shader/fragmentShader_texture.glsl");

  console.log("Vertex Shader:", vertexShaderSource);
  console.log("Fragment Shader:", fragmentShaderSource);

  loadImage("./image/container2.png", diffuseImage).then(img => {
    loadImage("./image/container2_specular.png", specularImage).then(img => {
      main();
    })
    .catch(err => console.error(err));
  })
  .catch(err => console.error(err));

}

var vertexShaderSource : string = "";
var fragmentShaderSource  : string = "";
var vertexTextureShaderSource : string = "";
var fragmentTextureShaderSource  : string = "";
var diffuseImage = new Image();
var specularImage = new Image();

function loadTextureToGPU(gl: WebGL2RenderingContext, u_Sampler: WebGLUniformLocation | null, image: TexImageSource, texUnit:number): WebGLTexture | null{
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



