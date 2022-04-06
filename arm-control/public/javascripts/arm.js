
const PI = 3.1415926535


export  class ArmBase extends THREE.Group {
    constructor() {
        super();
        let heightBottom = 4
        this.bottomBaseGeo = new THREE.CylinderGeometry(10, 10, heightBottom, 40, 20);
        this.bottomBaseMat = new THREE.MeshLambertMaterial({ color: 0x737373 });
        this.bottomBase = new THREE.Mesh(this.bottomBaseGeo, this.bottomBaseMat);
        this.bottomBase.position.set(0, heightBottom / 2, 0)
        let heightSecond = 0.5
        this.secondBaseGeo = new THREE.CylinderGeometry(9, 9, heightSecond, 40, 20);
        this.secondBaseMat = new THREE.MeshLambertMaterial({ color: 0x858585 });
        this.secondBase = new THREE.Mesh(this.secondBaseGeo, this.secondBaseMat);

        this.secondBase.position.set(0, (heightBottom + heightSecond / 2), 0);
        this.add(this.bottomBase)
        this.add(this.secondBase)

    }
}

export class Joint extends THREE.Group {
    constructor() {
        super();
        this.jointBallGeo = new THREE.SphereGeometry(2, 64, 32);
        this.jointBallMat = new THREE.MeshLambertMaterial({ wireframe: false, color: 0xffffff });
        this.jointBall = new THREE.Mesh(this.jointBallGeo, this.jointBallMat);
        this.jointBall.name = "ball"
        this.add(this.jointBall);
    }

    addLimb(limb) {
        this.limb = limb
        this.add(this.limb);
        
    }
}


export class arm extends THREE.Group {
    constructor() {
        super();

    }

    init() {
        this.shoulder = this.children[1]
        this.limb1 = this.shoulder.children[1]
        this.elbow = this.limb1.children[1]
        this.limb2 = this.elbow.children[1]
        this.wrist = this.limb2.children[1]
        this.limb3 = this.wrist.children[1]
        this.gripper = this.limb3.children[1]
        this.shoulderRot = { angle: 0 }
        this.shoulderExt = { angle: 90 }
        this.elbowExt = { angle: 0 }
        this.WristFlex = { angle: 0 }
        this.WristRot = { angle: 0 }
        this.GripperRot = { angle: 0 }
        this.GripperOpen = { angle: 100 }
        this.coords = {x: 0, y: 51, z: 0, Angle: 0, Pitch:90}
    }
    // moves to angle not adds to previous


    rotateShoulder() {
        this.shoulder.rotation.y = this.shoulderRot.angle * PI / 180
    }
    extendShoulder() {
        this.shoulder.rotation.z = (this.shoulderExt.angle - 90) * PI / 180 
    }
    extendElbow() {
        this.elbow.rotation.z = this.elbowExt.angle * PI / 180
    }
    flexWrist() {
        this.wrist.rotation.z = this.WristFlex.angle * PI / 180
    }
    rotateWrist() { 
        this.wrist.rotation.y = this.WristRot.angle * PI / 180
    }
    rotateGripper() {16
        this.gripper.rotateGripper(this.GripperRot.angle * PI / 180)
    }
    rotateShoulderAdd(angle) {
        this.shoulder.rotation.y += angle
    }
    extendShoulderAdd(angle) {
        this.shoulder.rotation.z += angle
    }
    extendElbowAdd(angle) {
        this.elbow.rotation.z += angle
    }
    flexWristAdd(angle) {
        this.wrist.rotation.z += angle
    }
    rotateWristAdd(angle) { 
        this.wrist.rotation.y += angle
    }
    rotateGripperAdd(angle) {
        this.gripper.rotateGripperAdd(angle)
    }
    closeGripper() {
        this.gripper.closeGripper(this.GripperOpen.angle)
    }

    forwardKinematics() {

        let limb1Vector = new THREE.Vector3(0, this.limb1.length, 0)
        limb1Vector.applyQuaternion(this.shoulder.quaternion)        

        let limb2Vector = new THREE.Vector3(0, this.limb2.length, 0)
        limb2Vector.applyQuaternion(this.elbow.quaternion)
        limb2Vector.applyQuaternion(this.shoulder.quaternion)


        let limb3Vector = new THREE.Vector3(0, this.limb3.length + 1, 0)
        limb3Vector.applyQuaternion(this.wrist.quaternion)
        limb3Vector.applyQuaternion(this.elbow.quaternion)
        limb3Vector.applyQuaternion(this.shoulder.quaternion)
        
        console.log(this.limb3.length)

        let position = new THREE.Vector3(0, 4.5, 0)
        position.add(limb1Vector)
        position.add(limb2Vector)
        position.add(limb3Vector)

        this.coords.x = position.x
        this.coords.y = position.y
        this.coords.z = position.z
        
        }
    
    forwardKinematicsVectors() {
        let limb1Vector = new THREE.Vector3(0, this.limb1.length, 0)
        limb1Vector.applyQuaternion(this.shoulder.quaternion)  
              

        let limb2Vector = new THREE.Vector3(0, this.limb2.length, 0)
        limb2Vector.applyQuaternion(this.elbow.quaternion)
        limb2Vector.applyQuaternion(this.shoulder.quaternion)


        let limb3Vector = new THREE.Vector3(0, this.limb3.length + 1, 0)
        limb3Vector.applyQuaternion(this.wrist.quaternion)
        limb3Vector.applyQuaternion(this.elbow.quaternion)
        limb3Vector.applyQuaternion(this.shoulder.quaternion)
        
        console.log(this.limb3.length)

        let position = new THREE.Vector3(0, 4.5, 0)
        position.add(limb1Vector)
        position.add(limb2Vector)
        position.add(limb3Vector)

        return {
            position: position,
            limb1: limb1Vector,
            limb2: limb2Vector,
            limb3: limb3Vector
        }
    }

    inverseKinematics() { // solves for the 6 angles of the arm given x, y, z and orientation (pitch, roll, yaw)
        let x = this.coords.x;
        let y = this.coords.y;
        let z = this.coords.z;
        let theta = this.coords.Angle;
        let gamma = this.coords.Pitch;

        // Redo angles system around axes not arm starting position.
        // Convert A and B angle to Control angles (dat gui controls)
        // Check up on base offsets (might not be 4.5)
        // Correct Rounding Errors
        // Figure out how to onclude wrist
        let wristVector = new THREE.Vector3(this.limb3.length + 1, 0, 0);
        wristVector.applyAxisAngle(new THREE.Vector3(0, 0, 1), (gamma * PI)/180)
        wristVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), (theta * PI)/180)
        let desiredVector = new THREE.Vector3(x,y,z);
        let elbowVector = desiredVector.sub(wristVector);
        console.log(elbowVector);
        elbowVector.sub(new THREE.Vector3(0, 4.5, 0))
        let shoulderRot = Math.atan2(-elbowVector.z, elbowVector.x)
        let deltaW = Math.sqrt((elbowVector.z) * (elbowVector.z) + elbowVector.x * elbowVector.x);
        let deltaY = elbowVector.y;
        let A_prime = Math.atan(deltaY/deltaW);
        let A = Math.acos(((elbowVector.length() * elbowVector.length() + this.limb1.length * this.limb1.length - this.limb2.length * this.limb2.length)/(2*elbowVector.length()*this.limb1.length)))
        A = A + A_prime;
        let B = PI - Math.acos(((this.limb2.length * this.limb2.length + this.limb1.length * this.limb1.length - elbowVector.length() * elbowVector.length())/(2 * this.limb2.length * this.limb1.length)))

        console.log(`a=${A* 180/PI}, b=${B * 180/PI}, shoulderRot = ${shoulderRot * 180/PI}`);

        if (shoulderRot < 0) { shoulderRot += 2 * PI};
        this.shoulderRot.angle = shoulderRot * 180 / PI;
        this.shoulderExt.angle = A * 180/PI;
        this.elbowExt.angle = -B * 180/PI;
        this.extendElbow();
        this.extendShoulder();
        this.rotateShoulder();
        

        let limb2Vector = new THREE.Vector3(0, this.limb2.length, 0)
        limb2Vector.applyQuaternion(this.elbow.quaternion)
        limb2Vector.applyQuaternion(this.shoulder.quaternion)

        

        let wristFlexion = limb2Vector.angleTo(wristVector);
        console.log(`Wrist Flexion: ${wristFlexion * 180 / PI}`);
        this.WristFlex.angle = wristFlexion * 180 / PI;
        this.flexWrist();


        let limb3Vector = new THREE.Vector3(0, this.limb3.length + 1, 0)
        limb3Vector.applyQuaternion(this.wrist.quaternion)
        limb3Vector.applyQuaternion(this.elbow.quaternion)
        limb3Vector.applyQuaternion(this.shoulder.quaternion)

        let a = limb3Vector.normalize();
        let b = wristVector.normalize();
        let u = limb2Vector.normalize();


        let c = a.sub(u.clone().multiplyScalar(a.dot(u)));
        let e = c.normalize();
        
        let f = new THREE.Vector3().crossVectors(u, e);

        let wristRot = Math.atan2(b.dot(f), b.dot(e));
        console.log(`Wrist Rotation = ${wristRot * 180/PI}`);

        this.WristRot.angle += wristRot * 180/PI;
        this.rotateWrist();
    }


}