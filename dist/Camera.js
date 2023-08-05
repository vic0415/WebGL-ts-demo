"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const gl_matrix_1 = require("gl-matrix");
class Camera {
    /*
        constructor(position: GMath.Vector3, target: GMath.Vector3, worldup: GMath.Vector3)
        {
            this.Position = position;
            this.WorldUp = worldup;
            this.Forward = GMath.normalize(target.sub(position));
            this.Right = GMath.normalize(GMath.cross(this.Forward, this.WorldUp));
            this.Up = GMath.normalize(GMath.cross(this.Right, this.Forward));
        }
    */
    constructor(position, pitch, yaw, worldup) {
        this.Position = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.Forward = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.Right = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.Up = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.WorldUp = gl_matrix_1.vec3.set(gl_matrix_1.vec3.create(), 0, 0, 0);
        this.Pitch = 0;
        this.Yaw = 0;
        this.SenseX = 0.01;
        this.SenseY = 0.01;
        this.SpeedX = 0;
        this.SpeedY = 0;
        this.SpeedZ = 0;
        this.Position = position;
        this.WorldUp = worldup;
        this.Pitch = pitch;
        this.Yaw = yaw;
        this.Forward[0] = Math.cos(this.Pitch) * Math.sin(this.Yaw); // 译注：direction代表摄像机的前轴(Front)，这个前轴是和本文第一幅图片的第二个摄像机的方向向量是相反的
        this.Forward[1] = Math.sin(this.Pitch);
        this.Forward[2] = Math.cos(this.Pitch) * Math.cos(this.Yaw);
        this.Right = gl_matrix_1.vec3.normalize(this.Right, gl_matrix_1.vec3.cross(this.Right, this.Forward, this.WorldUp));
        this.Up = gl_matrix_1.vec3.normalize(this.Up, gl_matrix_1.vec3.cross(this.Up, this.Right, this.Forward));
    }
    /*
    Camera::Camera(glm::vec3 position, glm::vec3 target, glm::vec3 worldup)
    {
        Position = position;
        WorldUp = worldup;
        Forward = glm::normalize(target - position);
        Right = glm::normalize(glm::cross(Forward, WorldUp));
        Up = glm::normalize(glm::cross(Right, Forward));
    }

    Camera::Camera(glm::vec3 position, float pitch, float yaw, glm::vec3 worldup)
    {
        Position = position;
        WorldUp = worldup;
        Pitch = pitch;
        Yaw = yaw;
        Forward.x = glm::cos(Pitch) * glm::sin(Yaw); // 译注：direction代表摄像机的前轴(Front)，这个前轴是和本文第一幅图片的第二个摄像机的方向向量是相反的
        Forward.y = glm::sin(Pitch);
        Forward.z = glm::cos(Pitch) * glm::cos(Yaw);
        Right = glm::normalize(glm::cross(Forward, WorldUp));
        Up = glm::normalize(glm::cross(Right, Forward));
    }

    Camera::~Camera()
    {

    }
    */
    GetViewMatrix() {
        return gl_matrix_1.mat4.lookAt(gl_matrix_1.mat4.create(), this.Position, gl_matrix_1.vec3.add(gl_matrix_1.vec3.create(), this.Position, this.Forward), this.WorldUp);
    }
    /*
        glm::mat4 Camera::GetViewMatrix(){
            return glm::lookAt(Position, Position + Forward, WorldUp);
        }
    */
    UpdateCameraVectors() {
        this.Forward[0] = Math.cos(this.Pitch) * Math.sin(this.Yaw);
        this.Forward[1] = Math.sin(this.Pitch);
        this.Forward[2] = Math.cos(this.Pitch) * Math.cos(this.Yaw);
        this.Right = gl_matrix_1.vec3.normalize(this.Right, gl_matrix_1.vec3.cross(this.Right, this.Forward, this.WorldUp));
        this.Up = gl_matrix_1.vec3.normalize(this.Up, gl_matrix_1.vec3.cross(this.Up, this.Right, this.Forward));
    }
    /*
    void Camera::UpdateCameraVectors(){
        Forward.x = glm::cos(Pitch) * glm::sin(Yaw);
        Forward.y = glm::sin(Pitch);
        Forward.z = glm::cos(Pitch) * glm::cos(Yaw);
        Right = glm::normalize(glm::cross(Forward, WorldUp));
        Up = glm::normalize(glm::cross(Right, Forward));
    }
*/
    ProcessMouseMovement(deltaX, deltaY) {
    }
    /*
        void Camera::ProcessMouseMovement(float deltaX, float deltaY)
        {
            Pitch -= deltaY * SenseY;
            Yaw -= deltaX * SenseX;
            UpdateCameraVectors();
        }
    */
    UpdateCameraPos() {
        //this.Position = this.Position.add(this.Forward.mul(this.SpeedZ * 0.1).add(this.Right.mul(this.SpeedX * 0.1).add(this.Up.mul(this.SpeedY * 0.1))));
    }
}
exports.Camera = Camera;
