import { vec3, mat4, glMatrix} from "gl-matrix";

export class Camera{
    Position : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    Forward : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    Right : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    Up : vec3 = vec3.set(vec3.create(), 0, 0, 0);
    WorldUp : vec3 = vec3.set(vec3.create(), 0, 0, 0);

    Pitch : number = 0;
    Yaw : number = 0;
    SenseX : number = 0.01;
    SenseY : number = 0.01;
    SpeedX : number = 0;
    SpeedY : number = 0;
    SpeedZ : number = 0;
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
    constructor(position: vec3, pitch: number, yaw: number, worldup: vec3){
        this.Position = position;
        this.WorldUp = worldup;
        this.Pitch = pitch;
        this.Yaw = yaw;
        this.Forward[0] = Math.cos(this.Pitch) * Math.sin(this.Yaw); // 译注：direction代表摄像机的前轴(Front)，这个前轴是和本文第一幅图片的第二个摄像机的方向向量是相反的
        this.Forward[1] = Math.sin(this.Pitch);
        this.Forward[2] = Math.cos(this.Pitch) * Math.cos(this.Yaw);
        this.Right = vec3.normalize(this.Right, vec3.cross(this.Right, this.Forward, this.WorldUp));
        this.Up = vec3.normalize(this.Up, vec3.cross(this.Up, this.Right, this.Forward));
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

    GetViewMatrix(): mat4 {
        return mat4.lookAt(mat4.create(), this.Position, vec3.add(vec3.create(), this.Position, this.Forward), this.WorldUp);
    }
/*
    glm::mat4 Camera::GetViewMatrix(){
        return glm::lookAt(Position, Position + Forward, WorldUp);
    }
*/

    UpdateCameraVectors(){
        this.Forward[0] = Math.cos(this.Pitch) * Math.sin(this.Yaw); 
        this.Forward[1] = Math.sin(this.Pitch);
        this.Forward[2] = Math.cos(this.Pitch) * Math.cos(this.Yaw);
        this.Right = vec3.normalize(this.Right, vec3.cross(this.Right, this.Forward, this.WorldUp));
        this.Up = vec3.normalize(this.Up, vec3.cross(this.Up, this.Right, this.Forward));
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

    ProcessMouseMovement(deltaX: number, deltaY: number)
    {

    }
/*
    void Camera::ProcessMouseMovement(float deltaX, float deltaY)
    {
        Pitch -= deltaY * SenseY;
        Yaw -= deltaX * SenseX;
        UpdateCameraVectors();
    }
*/

    UpdateCameraPos(){
        //this.Position = this.Position.add(this.Forward.mul(this.SpeedZ * 0.1).add(this.Right.mul(this.SpeedX * 0.1).add(this.Up.mul(this.SpeedY * 0.1))));

    }
/*
    void Camera::UpdateCameraPos(){
        Position += Forward * SpeedZ * 0.1f + Right * SpeedX * 0.1f + Up * SpeedY * 0.1f;
    }
    */
}