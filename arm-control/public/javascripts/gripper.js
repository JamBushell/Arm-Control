

export default class Gripper extends THREE.Group {
    constructor() {
        super()
        this.connectionPointHeight = 0.5
        this.connectionPointGeo = new THREE.CylinderGeometry(1, 1, this.connectionPointHeight, 20, 32);
        this.connectionPointMat = new THREE.MeshLambertMaterial({ color: 0xffa826 });
        this.connectionPoint = new THREE.Mesh(this.connectionPointGeo, this.connectionPointMat);
        this.add(this.connectionPoint);
        this.connectionPoint.position.set(0, this.connectionPointHeight / 2, 0)

        this.baseHeight = 0.5
        this.baseGeo = new THREE.BoxGeometry(8, this.baseHeight, 2);
        this.baseMat = new THREE.MeshLambertMaterial({ color: 0xffa826 })
        this.base = new THREE.Mesh(this.baseGeo, this.baseMat);
        this.add(this.base);
        this.base.position.set(0, this.connectionPointHeight + this.baseHeight / 2, 0);

        this.leftGripperGeo = new THREE.BoxGeometry(5, 1, 2)
        this.leftGripperMat = new THREE.MeshLambertMaterial({ color: 0xffa826 })
        this.leftGripper = new THREE.Mesh(this.leftGripperGeo, this.leftGripperMat)


        this.rightGripperGeo = new THREE.BoxGeometry(5, 1, 2)
        this.rightGripperMat = new THREE.MeshLambertMaterial({ color: 0xffa826 })
        this.rightGripper = new THREE.Mesh(this.rightGripperGeo, this.rightGripperMat);

        this.leftGripper.position.set(-4 + 0.5, this.connectionPointHeight + this.baseHeight + 2.5, 0)
        this.rightGripper.position.set(4 - 0.5, this.connectionPointHeight + this.baseHeight + 2.5, 0)
        this.leftGripper.rotation.z = 1.5708
        this.rightGripper.rotation.z = 1.5708
        this.add(this.leftGripper);
        this.add(this.rightGripper)
    }

    rotateGripper(angle) {
        this.rotation.y = angle
    }
    rotateGripperAdd(angle) {
        this.rotation.y += angle
    }
    closeGripper(percentage) {
        this.leftGripper.position.x = -3 * percentage/100 - 0.5
        this.rightGripper.position.x = 3 * percentage/100 + 0.5
        this.base.scale.x = (Math.abs(this.leftGripper.position.x - this.rightGripper.position.x) + 1) / 8
    }

}