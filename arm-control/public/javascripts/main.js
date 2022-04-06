import * as arm from "./arm.js"
import Gripper from "./gripper.js"
import Limb from "./limb.js"
class ArmLimb extends THREE.Mesh {
    constructor(length = 5, radius = 0.5, color = 0xffffff) {
        let geometry = new THREE.CylinderGeometry(radius, radius, length, 10, 10, false);
        let material = new THREE.MeshLambertMaterial({ color: color });
        super(geometry, material);
        this.length = length;
        this.radius = radius;
        this.color = color;
        this.geometry = geometry;
        this.material = material;
    }
}

const PI = 3.1415


function main() {
//Setup
    const domElement = document.getElementById("sim");
    const fov = 50;
    const near = 0.1;
    const far = 1000; 
    console.log(domElement);
    let canvasHeight = domElement.clientHeight;
    let canvasWidth = domElement.clientWidth;
    let aspectRatio = canvasWidth / canvasHeight;

    const renderer = new THREE.WebGLRenderer({ canvas: domElement });
    renderer.setSize(canvasWidth, canvasHeight, false);
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    camera.position.z = 3;
    camera.position.y = 3;

    const scene = new THREE.Scene();

    // Grid

    let planeGeo = new THREE.PlaneGeometry(75, 75, 10, 10);
    let planeMat = new THREE.MeshBasicMaterial({ color: 0x32a852, side: THREE.DoubleSide });
    let plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = 3.141 / 2;

    scene.add(plane);

    // Lighting

    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, 0);
    topLight.position.set(5, 15, 20);
    topLight.target = lightTarget;
    scene.add(topLight);

    const sceneLight = new THREE.PointLight(0xffffff, 1.5);
    sceneLight.position.set(25, 45, 25);
    scene.add(sceneLight);


    // Orbit Controls
    let controls = new THREE.OrbitControls(camera, domElement);


    //Arm Code and Objects
    let Arm = new arm.arm();
    
    let base = new arm.ArmBase();
    base.name = "base"
    Arm.add(base);
    base.position.set(0, 0, 0);

    let shoulderJoint = new arm.Joint();
    shoulderJoint.name = "shoulder"

    Arm.add(shoulderJoint);
    shoulderJoint.position.set(0, 4.5, 0);

    let limb1 = new Limb(15);
    limb1.name = "limb_1"
    shoulderJoint.addLimb(limb1);

    let elbowJoint = new arm.Joint();
    elbowJoint.name = "elbow"
    limb1.addJoint(elbowJoint);

    let limb2 = new Limb(15);
    limb2.name = "limb_2"
    elbowJoint.addLimb(limb2);

    let wristJoint = new arm.Joint();
    wristJoint.name = "wrist"
    limb2.addJoint(wristJoint);
    
    let limb3 = new Limb(15)
    limb3.name = "limb_3"
    wristJoint.addLimb(limb3);

    let gripper = new Gripper();
    limb3.addJoint(gripper);

    Arm.init();
    Arm.forwardKinematics();
    console.log(Arm)
    

    Arm.position.set(0, 0, 0);
    scene.add(Arm);

    const desiredPointGeometry = new THREE.SphereGeometry( 1, 16, 8 );
    const desiredPointMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const desiredPoint = new THREE.Mesh( desiredPointGeometry, desiredPointMaterial );
    desiredPoint.position.set(10, 12, -5);
    scene.add( desiredPoint );

    // Controls

    let mainControls = new dat.GUI({autoplace: true, width: 400});


    mainControls.domElement.id = "gui";

    let angles = mainControls.addFolder("Joint Angles")
    angles.add(Arm.shoulderExt, 'angle', 0, 180).onChange(() => {
        Arm.extendShoulder()
        Arm.forwardKinematics()
    }).listen().name('Shoulder Extension')

    angles.add(Arm.shoulderRot, 'angle', 0, 360).onChange(() => {
        Arm.rotateShoulder()
        Arm.forwardKinematics()
    }).listen().name("Shoulder Rotation")

    angles.add(Arm.elbowExt, 'angle', -150, 150).onChange(() => {
        Arm.extendElbow()
        Arm.forwardKinematics()
    }).listen().name("Elbow Extension")

    angles.add(Arm.WristFlex, 'angle', -150, 150).onChange(() => {
        Arm.flexWrist()
        Arm.forwardKinematics()
    }).listen().name("Wrist Flexion")

    angles.add(Arm.WristRot, 'angle', 0, 360).onChange(() => {
        Arm.rotateWrist()
        Arm.forwardKinematics()
    }).listen().name("Wrist Rotation")

    angles.add(Arm.GripperRot, 'angle', 0, 360).onChange(() => {
        Arm.rotateGripper()
    }).listen().name("Gripper Rotation")

    angles.add(Arm.GripperOpen, 'angle', 0, 100).onChange(() => {
        Arm.closeGripper()
    }).listen().name("Gripper Opening")
    
    let coordinates = mainControls.addFolder("Coordinates")

    coordinates.add(Arm.coords, 'x', -51, 51).listen().onChange(
        () => {desiredPoint.position.x = Arm.coords.x;
            Arm.inverseKinematics()}
    )
    coordinates.add(Arm.coords, 'y', 0, 55).listen().onChange(
        () => {desiredPoint.position.y = Arm.coords.y;
            Arm.inverseKinematics()}
    )
    coordinates.add(Arm.coords, 'z', -51, 51).listen().onChange(
        () => {desiredPoint.position.z = Arm.coords.z;
        Arm.inverseKinematics()}
    )
    coordinates.add(Arm.coords, 'Pitch', -180, 180).listen().onChange(
        () => {Arm.inverseKinematics();}
    )
    coordinates.add(Arm.coords, 'Angle', 0, 360).listen().onChange(
        () => {Arm.inverseKinematics();}
    )
    
    Arm.coords.x = 10;
    Arm.coords.y = 12;
    Arm.coords.z = -5;
    

    //Rendering 
    Arm.inverseKinematics(10, 12, -5, 0, 0, 0);
    Arm.forwardKinematics();

    document.getElementById("inverseKin").onclick = function(e) {
        Arm.inverseKinematics(Arm.coords.x, Arm.coords.y, Arm.coords.z, 0 , 0, 0);
    }

    function render(time) {      

        controls.update();
        requestAnimationFrame(render);


        if (domElement.clientHeight != canvasHeight || domElement.clientWidth != canvasWidth) {
            canvasHeight = domElement.clientHeight;
            canvasWidth = domElement.clientWidth;
            camera.aspect = canvasWidth / canvasHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasWidth, canvasHeight, false);
        }

        renderer.render(scene, camera);
    }
    render();
}

window.onload = main;