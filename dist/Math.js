"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotate = exports.lookAt = exports.normalize = exports.cross = exports.Matrix4 = exports.Vector3 = void 0;
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    // 設置 x、y、z 值
    setValues(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    // 向量相加，回傳一個新的向量結果
    add(vector) {
        const resultX = this.x + vector.x;
        const resultY = this.y + vector.y;
        const resultZ = this.z + vector.z;
        return new Vector3(resultX, resultY, resultZ);
    }
    // 向量相減，回傳一個新的向量結果
    sub(vector) {
        const resultX = this.x - vector.x;
        const resultY = this.y - vector.y;
        const resultZ = this.z - vector.z;
        return new Vector3(resultX, resultY, resultZ);
    }
    mul(scalar) {
        const resultX = this.x * scalar;
        const resultY = this.y * scalar;
        const resultZ = this.z * scalar;
        return new Vector3(resultX, resultY, resultZ);
    }
    // 向量點積（內積），回傳一個數值結果
    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
    // 向量叉積（外積），回傳一個新的向量結果
    cross(vector) {
        const resultX = this.y * vector.z - this.z * vector.y;
        const resultY = this.z * vector.x - this.x * vector.z;
        const resultZ = this.x * vector.y - this.y * vector.x;
        return new Vector3(resultX, resultY, resultZ);
    }
    // 歸一化向量，回傳一個新的向量結果
    normalize() {
        const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        const resultX = this.x / length;
        const resultY = this.y / length;
        const resultZ = this.z / length;
        return new Vector3(resultX, resultY, resultZ);
    }
}
exports.Vector3 = Vector3;
class Matrix4 {
    constructor() {
        this.data = new Float32Array(16);
        this.setIdentity();
    }
    set(src) {
        var i, s, d;
        s = src.data;
        d = this.data;
        if (s === d) {
            return this;
        }
        for (i = 0; i < 16; ++i) {
            d[i] = s[i];
        }
        return this;
    }
    ;
    // 新增 setIdentity 方法，用於設置單位矩陣
    setIdentity() {
        this.data.fill(0);
        this.data[0] = this.data[5] = this.data[10] = this.data[15] = 1;
    }
    // 新增 setPerspective 方法
    setPerspective(fovy, aspectRatio, near, far) {
        var e, rd, s, ct;
        if (near === far || aspectRatio === 0) {
            throw 'null frustum';
        }
        if (near <= 0) {
            throw 'near <= 0';
        }
        if (far <= 0) {
            throw 'far <= 0';
        }
        fovy = Math.PI * fovy / 180 / 2;
        s = Math.sin(fovy);
        if (s === 0) {
            throw 'null frustum';
        }
        rd = 1 / (far - near);
        ct = Math.cos(fovy) / s;
        e = this.data;
        e[0] = ct / aspectRatio;
        e[1] = 0;
        e[2] = 0;
        e[3] = 0;
        e[4] = 0;
        e[5] = ct;
        e[6] = 0;
        e[7] = 0;
        e[8] = 0;
        e[9] = 0;
        e[10] = -(far + near) * rd;
        e[11] = -1;
        e[12] = 0;
        e[13] = 0;
        e[14] = -2 * near * far * rd;
        e[15] = 0;
        return this;
    }
    // 設置矩陣元素的值
    setValues(values) {
        if (values.length !== 16) {
            throw new Error("Invalid matrix dimensions. Matrix4 should be 4x4.");
        }
        this.data = values;
    }
    // 取得指定位置的元素值
    getValue(row, col) {
        if (row < 0 || row >= 4 || col < 0 || col >= 4) {
            throw new Error("Invalid matrix index.");
        }
        return this.data[row + col * 4];
    }
    translate(x, y, z) {
        var e = this.data;
        e[12] += e[0] * x + e[4] * y + e[8] * z;
        e[13] += e[1] * x + e[5] * y + e[9] * z;
        e[14] += e[2] * x + e[6] * y + e[10] * z;
        e[15] += e[3] * x + e[7] * y + e[11] * z;
        return this;
    }
    ;
    // 新增 rotate 方法
    setRotate(angle, x, y, z) {
        var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;
        angle = Math.PI * angle / 180;
        e = this.data;
        s = Math.sin(angle);
        c = Math.cos(angle);
        if (0 !== x && 0 === y && 0 === z) {
            // Rotation around X axis
            if (x < 0) {
                s = -s;
            }
            e[0] = 1;
            e[4] = 0;
            e[8] = 0;
            e[12] = 0;
            e[1] = 0;
            e[5] = c;
            e[9] = -s;
            e[13] = 0;
            e[2] = 0;
            e[6] = s;
            e[10] = c;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
        }
        else if (0 === x && 0 !== y && 0 === z) {
            // Rotation around Y axis
            if (y < 0) {
                s = -s;
            }
            e[0] = c;
            e[4] = 0;
            e[8] = s;
            e[12] = 0;
            e[1] = 0;
            e[5] = 1;
            e[9] = 0;
            e[13] = 0;
            e[2] = -s;
            e[6] = 0;
            e[10] = c;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
        }
        else if (0 === x && 0 === y && 0 !== z) {
            // Rotation around Z axis
            if (z < 0) {
                s = -s;
            }
            e[0] = c;
            e[4] = -s;
            e[8] = 0;
            e[12] = 0;
            e[1] = s;
            e[5] = c;
            e[9] = 0;
            e[13] = 0;
            e[2] = 0;
            e[6] = 0;
            e[10] = 1;
            e[14] = 0;
            e[3] = 0;
            e[7] = 0;
            e[11] = 0;
            e[15] = 1;
        }
        else {
            // Rotation around another axis
            len = Math.sqrt(x * x + y * y + z * z);
            if (len !== 1) {
                rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
            }
            nc = 1 - c;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * s;
            ys = y * s;
            zs = z * s;
            e[0] = x * x * nc + c;
            e[1] = xy * nc + zs;
            e[2] = zx * nc - ys;
            e[3] = 0;
            e[4] = xy * nc - zs;
            e[5] = y * y * nc + c;
            e[6] = yz * nc + xs;
            e[7] = 0;
            e[8] = zx * nc + ys;
            e[9] = yz * nc - xs;
            e[10] = z * z * nc + c;
            e[11] = 0;
            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
        }
        return this;
    }
    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
        fx = centerX - eyeX;
        fy = centerY - eyeY;
        fz = centerZ - eyeZ;
        // Normalize f.
        rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;
        // Calculate cross product of f and up.
        sx = fy * upZ - fz * upY;
        sy = fz * upX - fx * upZ;
        sz = fx * upY - fy * upX;
        // Normalize s.
        rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;
        // Calculate cross product of s and f.
        ux = sy * fz - sz * fy;
        uy = sz * fx - sx * fz;
        uz = sx * fy - sy * fx;
        // Set to this.
        e = this.data;
        e[0] = sx;
        e[1] = ux;
        e[2] = -fx;
        e[3] = 0;
        e[4] = sy;
        e[5] = uy;
        e[6] = -fy;
        e[7] = 0;
        e[8] = sz;
        e[9] = uz;
        e[10] = -fz;
        e[11] = 0;
        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;
        // Translate.
        return this.translate(-eyeX, -eyeY, -eyeZ);
    }
    ;
    concat(other) {
        var i, e, a, b, ai0, ai1, ai2, ai3;
        // Calculate e = a * b
        e = this.data;
        a = this.data;
        b = other.data;
        // If e equals b, copy b to temporary matrix.
        if (e === b) {
            b = new Float32Array(16);
            for (i = 0; i < 16; ++i) {
                b[i] = e[i];
            }
        }
        for (i = 0; i < 4; i++) {
            ai0 = a[i];
            ai1 = a[i + 4];
            ai2 = a[i + 8];
            ai3 = a[i + 12];
            e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
            e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
            e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
            e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
        }
        return this;
    }
    ;
}
exports.Matrix4 = Matrix4;
function cross(vectorA, vectorB) {
    return vectorA.cross(vectorB);
}
exports.cross = cross;
function normalize(vector) {
    return vector.normalize();
}
exports.normalize = normalize;
function lookAt(eye, target, up) {
    const matrix = new Matrix4();
    /*
      const zAxis = eye.sub(target).normalize();
      const xAxis = up.cross(zAxis).normalize();
      const yAxis = zAxis.cross(xAxis);
    
      matrix.setValues(new Float32Array([
        xAxis.x, yAxis.x, zAxis.x, 0,
        xAxis.y, yAxis.y, zAxis.y, 0,
        xAxis.z, yAxis.z, zAxis.z, 0,
        -xAxis.dot(eye), -yAxis.dot(eye), -zAxis.dot(eye), 1,
      ]));
    */
    matrix.setLookAt(eye.x, eye.y, eye.z, target.x, target.y, target.z, up.x, up.y, up.z);
    return matrix;
}
exports.lookAt = lookAt;
function rotate(angle, x, y, z) {
    const matrix = new Matrix4();
    /*
      const zAxis = eye.sub(target).normalize();
      const xAxis = up.cross(zAxis).normalize();
      const yAxis = zAxis.cross(xAxis);
    
      matrix.setValues(new Float32Array([
        xAxis.x, yAxis.x, zAxis.x, 0,
        xAxis.y, yAxis.y, zAxis.y, 0,
        xAxis.z, yAxis.z, zAxis.z, 0,
        -xAxis.dot(eye), -yAxis.dot(eye), -zAxis.dot(eye), 1,
      ]));
    */
    matrix.setRotate(angle, x, y, z);
    return matrix;
}
exports.rotate = rotate;
