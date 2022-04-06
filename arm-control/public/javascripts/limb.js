

export default class Limb extends THREE.Object3D {
    constructor(length) {
        super();
        this.length = length
        this.base_vector = new THREE.Vector3(0, this.length, 0)
        this.armGeo = new THREE.CylinderGeometry(1, 1, length, 64, 32);
        this.armMat = new THREE.MeshLambertMaterial({ color: 0xc7c7c7 });
        this.arm = new THREE.Mesh(this.armGeo, this.armMat);
        this.arm.position.y = length / 2;

        this.add(this.arm);
    }

    addJoint(joint) {
        this.joint = joint;
        this.add(joint)
        this.joint.position.set(0, this.length, 0)

    }
}