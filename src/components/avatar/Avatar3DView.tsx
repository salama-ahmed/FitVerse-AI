import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ExerciseId } from '../../types/fitness';
import { Play, Pause, RotateCcw, Eye, ShieldCheck, ChevronDown, ChevronUp, Gauge, Compass } from 'lucide-react';

interface Avatar3DViewProps {
  exerciseId: ExerciseId;
  onExerciseChange?: (id: ExerciseId) => void;
  speed?: number;
  highlightJoints?: boolean;
}

export const Avatar3DView: React.FC<Avatar3DViewProps> = ({
  exerciseId,
  onExerciseChange,
  speed: initialSpeed = 1,
  highlightJoints: initialHighlight = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(initialSpeed);
  const [cameraPreset, setCameraPreset] = useState<'hero' | 'front' | 'side'>('hero');
  const [showJointNodes, setShowJointNodes] = useState(initialHighlight);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [currentSquatDepthAngle, setCurrentSquatDepthAngle] = useState(170);

  // References for animation state & Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const exerciseIdRef = useRef(exerciseId);
  const showJointsRef = useRef(showJointNodes);

  isPlayingRef.current = isPlaying;
  speedRef.current = speed;
  exerciseIdRef.current = exerciseId;
  showJointsRef.current = showJointNodes;

  // Avatar body part references
  const avatarRigRef = useRef<{
    rootGroup: THREE.Group;
    pelvis: THREE.Group;
    torso: THREE.Group;
    chest: THREE.Mesh;
    head: THREE.Group;
    leftShoulder: THREE.Group;
    rightShoulder: THREE.Group;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftForearm: THREE.Group;
    rightForearm: THREE.Group;
    leftGlove: THREE.Mesh;
    rightGlove: THREE.Mesh;
    leftHip: THREE.Group;
    rightHip: THREE.Group;
    leftThigh: THREE.Group;
    rightThigh: THREE.Group;
    leftKnee: THREE.Group;
    rightKnee: THREE.Group;
    leftShin: THREE.Group;
    rightShin: THREE.Group;
    leftFoot: THREE.Group;
    rightFoot: THREE.Group;
    jointMarkers: THREE.Group;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.075);

    // --- 2. Camera ---
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;
    camera.position.set(0, 1.45, 3.8);

    // --- 3. Renderer with SRGB Color space & Soft shadows ---
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- 4. Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below ground
    controls.minDistance = 1.8;
    controls.maxDistance = 6.5;
    controls.target.set(0, 1.1, 0);
    controls.update();

    // --- 5. Studio Lighting Rig ---
    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(2.5, 4.0, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -2;
    keyLight.shadow.camera.right = 2;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -0.5;
    scene.add(keyLight);

    // Cool fill light
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
    fillLight.position.set(-3.0, 2.5, 1.5);
    scene.add(fillLight);

    // Neon Rim backlight
    const rimLight = new THREE.DirectionalLight(0x10b981, 2.8);
    rimLight.position.set(0, 3.0, -3.5);
    scene.add(rimLight);

    // Hemisphere sky/ground fill
    const hemiLight = new THREE.HemisphereLight(0x1e293b, 0x090d16, 1.0);
    scene.add(hemiLight);

    // --- 6. Athletic Studio Ground Floor & Markings ---
    // Ground circular stage with glowing neon boundary ring
    const stageGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.08, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      roughness: 0.8,
      metalness: 0.2,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.04;
    stage.receiveShadow = true;
    scene.add(stage);

    // Glowing stage rim ring
    const ringGeo = new THREE.RingGeometry(2.35, 2.42, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.002;
    scene.add(ringMesh);

    // Inner concentric guide ring
    const innerRingGeo = new THREE.RingGeometry(1.2, 1.22, 64);
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.position.y = 0.002;
    scene.add(innerRingMesh);

    // Soft Contact Shadow Plane underneath avatar feet
    const shadowGeo = new THREE.PlaneGeometry(1.8, 1.8);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.y = 0.003;
    scene.add(contactShadow);

    // --- 7. Build Procedural Articulated 3D Human Avatar (Biomechanic Rig) ---
    // Materials
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.3,
    });
    const suitAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.6,
    });
    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const neonEmeraldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const gloveMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Athletic leather tan/amber boxing glove
      roughness: 0.3,
      metalness: 0.2,
    });
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6,
      metalness: 0.1,
    });
    const shoeSoleMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.3,
      metalness: 0.5,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Pelvis / Hips (Root of humanoid kinetic chain)
    const pelvis = new THREE.Group();
    pelvis.position.set(0, 0.98, 0);
    rootGroup.add(pelvis);

    const pelvisMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.18, 16),
      suitAccentMat
    );
    pelvisMesh.castShadow = true;
    pelvis.add(pelvisMesh);

    // Pelvis neon belt trim
    const beltRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.182, 0.015, 8, 24),
      neonEmeraldMat
    );
    beltRing.rotation.x = Math.PI / 2;
    pelvis.add(beltRing);

    // Torso / Spine / Chest
    const torso = new THREE.Group();
    torso.position.set(0, 0.09, 0);
    pelvis.add(torso);

    // Segmented athletic chest
    const chestGeo = new THREE.CylinderGeometry(0.24, 0.17, 0.38, 16);
    const chest = new THREE.Mesh(chestGeo, suitMat);
    chest.position.y = 0.19;
    chest.castShadow = true;
    torso.add(chest);

    // Athletic chest plate armor accent
    const chestPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.22, 0.14),
      suitAccentMat
    );
    chestPlate.position.set(0, 0.22, 0.08);
    chestPlate.castShadow = true;
    torso.add(chestPlate);

    // Glowing core reactor / FitVerse emblem on chest
    const emblemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    emblemGeo.rotateX(Math.PI / 2);
    const emblem = new THREE.Mesh(emblemGeo, neonCyanMat);
    emblem.position.set(0, 0.24, 0.155);
    torso.add(emblem);

    // Neck & Head
    const head = new THREE.Group();
    head.position.set(0, 0.42, 0);
    torso.add(head);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.09, 0.1, 16),
      suitAccentMat
    );
    neck.position.y = 0.05;
    head.add(neck);

    const skull = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      suitMat
    );
    skull.position.y = 0.18;
    skull.castShadow = true;
    head.add(skull);

    // Futuristic Biomechanics Athletic Visor
    const visorGeo = new THREE.BoxGeometry(0.22, 0.07, 0.14);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.19, 0.08);
    head.add(visor);

    // --- ARMS RIGGING ---
    // Left Shoulder & Arm
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(0.26, 0.32, 0);
    torso.add(leftShoulder);

    const leftShoulderPad = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      suitAccentMat
    );
    leftShoulder.add(leftShoulderPad);

    const leftArm = new THREE.Group();
    leftShoulder.add(leftArm);

    const leftBicep = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.055, 0.26, 16),
      suitMat
    );
    leftBicep.position.y = -0.13;
    leftBicep.castShadow = true;
    leftArm.add(leftBicep);

    const leftForearm = new THREE.Group();
    leftForearm.position.set(0, -0.26, 0);
    leftArm.add(leftForearm);

    const leftForearmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.045, 0.24, 16),
      suitMat
    );
    leftForearmMesh.position.y = -0.12;
    leftForearmMesh.castShadow = true;
    leftForearm.add(leftForearmMesh);

    // Boxing Glove / Hand
    const leftGlove = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.14, 0.13),
      gloveMat
    );
    leftGlove.position.set(0, -0.26, 0.01);
    leftGlove.castShadow = true;
    leftForearm.add(leftGlove);

    // Right Shoulder & Arm
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(-0.26, 0.32, 0);
    torso.add(rightShoulder);

    const rightShoulderPad = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      suitAccentMat
    );
    rightShoulder.add(rightShoulderPad);

    const rightArm = new THREE.Group();
    rightShoulder.add(rightArm);

    const rightBicep = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.055, 0.26, 16),
      suitMat
    );
    rightBicep.position.y = -0.13;
    rightBicep.castShadow = true;
    rightArm.add(rightBicep);

    const rightForearm = new THREE.Group();
    rightForearm.position.set(0, -0.26, 0);
    rightArm.add(rightForearm);

    const rightForearmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.045, 0.24, 16),
      suitMat
    );
    rightForearmMesh.position.y = -0.12;
    rightForearmMesh.castShadow = true;
    rightForearm.add(rightForearmMesh);

    const rightGlove = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.14, 0.13),
      gloveMat
    );
    rightGlove.position.set(0, -0.26, 0.01);
    rightGlove.castShadow = true;
    rightForearm.add(rightGlove);

    // --- LEGS RIGGING ---
    // Left Hip & Leg
    const leftHip = new THREE.Group();
    leftHip.position.set(0.13, -0.05, 0);
    pelvis.add(leftHip);

    const leftThigh = new THREE.Group();
    leftHip.add(leftThigh);

    const leftThighMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.075, 0.42, 16),
      suitMat
    );
    leftThighMesh.position.y = -0.21;
    leftThighMesh.castShadow = true;
    leftThigh.add(leftThighMesh);

    // Quad kinetic stripe
    const leftQuadStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.32, 0.17),
      neonEmeraldMat
    );
    leftQuadStripe.position.set(0.08, -0.21, 0);
    leftThigh.add(leftQuadStripe);

    const leftKnee = new THREE.Group();
    leftKnee.position.set(0, -0.42, 0);
    leftThigh.add(leftKnee);

    const leftKneePad = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 16, 16),
      suitAccentMat
    );
    leftKnee.add(leftKneePad);

    const leftShin = new THREE.Group();
    leftKnee.add(leftShin);

    const leftShinMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.055, 0.42, 16),
      suitMat
    );
    leftShinMesh.position.y = -0.21;
    leftShinMesh.castShadow = true;
    leftShin.add(leftShinMesh);

    const leftFoot = new THREE.Group();
    leftFoot.position.set(0, -0.42, 0);
    leftShin.add(leftFoot);

    const leftShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.24),
      shoeMat
    );
    leftShoe.position.set(0, -0.04, 0.05);
    leftShoe.castShadow = true;
    leftFoot.add(leftShoe);

    const leftSole = new THREE.Mesh(
      new THREE.BoxGeometry(0.125, 0.02, 0.25),
      shoeSoleMat
    );
    leftSole.position.set(0, -0.08, 0.05);
    leftFoot.add(leftSole);

    // Right Hip & Leg
    const rightHip = new THREE.Group();
    rightHip.position.set(-0.13, -0.05, 0);
    pelvis.add(rightHip);

    const rightThigh = new THREE.Group();
    rightHip.add(rightThigh);

    const rightThighMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.075, 0.42, 16),
      suitMat
    );
    rightThighMesh.position.y = -0.21;
    rightThighMesh.castShadow = true;
    rightThigh.add(rightThighMesh);

    const rightQuadStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.32, 0.17),
      neonEmeraldMat
    );
    rightQuadStripe.position.set(-0.08, -0.21, 0);
    rightThigh.add(rightQuadStripe);

    const rightKnee = new THREE.Group();
    rightKnee.position.set(0, -0.42, 0);
    rightThigh.add(rightKnee);

    const rightKneePad = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 16, 16),
      suitAccentMat
    );
    rightKnee.add(rightKneePad);

    const rightShin = new THREE.Group();
    rightKnee.add(rightShin);

    const rightShinMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.055, 0.42, 16),
      suitMat
    );
    rightShinMesh.position.y = -0.21;
    rightShinMesh.castShadow = true;
    rightShin.add(rightShinMesh);

    const rightFoot = new THREE.Group();
    rightFoot.position.set(0, -0.42, 0);
    rightShin.add(rightFoot);

    const rightShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.08, 0.24),
      shoeMat
    );
    rightShoe.position.set(0, -0.04, 0.05);
    rightShoe.castShadow = true;
    rightFoot.add(rightShoe);

    const rightSole = new THREE.Mesh(
      new THREE.BoxGeometry(0.125, 0.02, 0.25),
      shoeSoleMat
    );
    rightSole.position.set(0, -0.08, 0.05);
    rightFoot.add(rightSole);

    // --- Biomechanical Joint Angle Nodes (Glowing HUD spheres) ---
    const jointMarkers = new THREE.Group();
    scene.add(jointMarkers);

    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
    });
    const createJointNode = () => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), nodeMat);
      mesh.visible = showJointsRef.current;
      jointMarkers.add(mesh);
      return mesh;
    };

    const nodeLeftKnee = createJointNode();
    const nodeRightKnee = createJointNode();
    const nodeLeftHip = createJointNode();
    const nodeRightHip = createJointNode();
    const nodeLeftElbow = createJointNode();
    const nodeRightElbow = createJointNode();

    avatarRigRef.current = {
      rootGroup,
      pelvis,
      torso,
      chest,
      head,
      leftShoulder,
      rightShoulder,
      leftArm,
      rightArm,
      leftForearm,
      rightForearm,
      leftGlove,
      rightGlove,
      leftHip,
      rightHip,
      leftThigh,
      rightThigh,
      leftKnee,
      rightKnee,
      leftShin,
      rightShin,
      leftFoot,
      rightFoot,
      jointMarkers,
    };

    // --- 8. Animation Loop ---
    let localClock = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      if (isPlayingRef.current) {
        localClock += delta * speedRef.current;
      }

      controls.update();

      const rig = avatarRigRef.current;
      if (rig) {
        const curEx = exerciseIdRef.current;

        // Reset positions each frame before kinematics
        rig.pelvis.position.y = 0.98;
        rig.pelvis.position.x = 0;
        rig.pelvis.position.z = 0;
        rig.pelvis.rotation.set(0, 0, 0);

        rig.torso.rotation.set(0, 0, 0);
        rig.head.rotation.set(0, 0, 0);

        rig.leftThigh.rotation.set(0, 0, 0);
        rig.rightThigh.rotation.set(0, 0, 0);
        rig.leftShin.rotation.set(0, 0, 0);
        rig.rightShin.rotation.set(0, 0, 0);
        rig.leftFoot.rotation.set(0, 0, 0);
        rig.rightFoot.rotation.set(0, 0, 0);

        rig.leftArm.rotation.set(0, 0, 0);
        rig.rightArm.rotation.set(0, 0, 0);
        rig.leftForearm.rotation.set(0, 0, 0);
        rig.rightForearm.rotation.set(0, 0, 0);

        // --- PROCEDURAL EXERCISE KINEMATICS ---
        if (curEx === 'squats') {
          // Squat Cycle: Smooth sine-based descent & ascent
          const cycle = (localClock * 1.8) % (Math.PI * 2);
          // depth: 0 is standing tall, 1 is parallel deep squat
          const depth = (Math.cos(cycle) + 1) / 2; // smooth 0 -> 1 -> 0

          // Calculate visual knee angle: 175° standing down to 90° at bottom
          const kneeDeg = Math.round(175 - depth * 85);
          setCurrentSquatDepthAngle(kneeDeg);

          // Pelvis drops down and shifts slightly back for hip hinge
          rig.pelvis.position.y = 0.98 - depth * 0.42;
          rig.pelvis.position.z = -depth * 0.18;

          // Thighs hinge forward/upward
          rig.leftThigh.rotation.x = -depth * 1.52;
          rig.rightThigh.rotation.x = -depth * 1.52;
          rig.leftThigh.rotation.z = -0.12 - depth * 0.15; // natural outward knee flare
          rig.rightThigh.rotation.z = 0.12 + depth * 0.15;

          // Shins bend at knee
          rig.leftShin.rotation.x = depth * 1.55;
          rig.rightShin.rotation.x = depth * 1.55;

          // Feet remain planted flat on ground
          rig.leftFoot.rotation.x = -depth * 0.05;
          rig.rightFoot.rotation.x = -depth * 0.05;

          // Torso leans forward 25° for balance counter-torque
          rig.torso.rotation.x = depth * 0.48;

          // Arms raise forward to shoulder height at bottom for athletic counter-balance
          rig.leftArm.rotation.x = -0.3 - depth * 1.35;
          rig.rightArm.rotation.x = -0.3 - depth * 1.35;
          rig.leftForearm.rotation.x = -0.2 - depth * 0.35;
          rig.rightForearm.rotation.x = -0.2 - depth * 0.35;
          rig.leftArm.rotation.z = -0.15;
          rig.rightArm.rotation.z = 0.15;

        } else if (curEx === 'boxing') {
          // Boxing Jab-Cross Combos: High-energy rotational striking
          const cycle = (localClock * 4.0) % (Math.PI * 4); // 2 full punch beats
          const boxerBounce = Math.sin(localClock * 7.5) * 0.03;
          rig.pelvis.position.y = 0.98 + Math.abs(boxerBounce);

          // Athletic orthodox stance: right foot back, 35° angled stance
          rig.pelvis.rotation.y = 0.35;
          rig.leftThigh.rotation.z = -0.15;
          rig.rightThigh.rotation.z = 0.15;
          rig.leftThigh.rotation.x = -0.12;
          rig.rightThigh.rotation.x = 0.12;
          rig.leftShin.rotation.x = 0.15;
          rig.rightShin.rotation.x = 0.2;

          // Base Guard posture: Hands shielding chin
          let lArmX = -1.35;
          let rArmX = -1.45;
          let lForearmX = -1.6;
          let rForearmX = -1.65;
          let lArmZ = 0.25;
          let rArmZ = -0.25;
          let torsoRotY = 0;

          // Phase 1: Jab (Left hand punch: cycle in [0, PI])
          if (cycle < Math.PI) {
            const jabExt = Math.sin(cycle);
            // Snap jab straight forward
            lArmX = -1.35 + jabExt * 1.35; // straightens to horizontal
            lForearmX = -1.6 + jabExt * 1.5;
            torsoRotY = -jabExt * 0.25; // torso rotates into punch
            rig.pelvis.position.z = jabExt * 0.08;
          }
          // Phase 2: Cross (Right hand punch: cycle in [2PI, 3PI])
          else if (cycle >= Math.PI * 2 && cycle < Math.PI * 3) {
            const crossCycle = cycle - Math.PI * 2;
            const crossExt = Math.sin(crossCycle);
            // Powerful right cross driven by hip and shoulder rotation
            rArmX = -1.45 + crossExt * 1.45;
            rForearmX = -1.65 + crossExt * 1.55;
            torsoRotY = crossExt * 0.55; // strong rotational power
            rig.pelvis.rotation.y = 0.35 - crossExt * 0.45;
            rig.rightThigh.rotation.y = -crossExt * 0.3; // rear foot pivot
          }

          rig.torso.rotation.y = torsoRotY;
          rig.head.rotation.y = -torsoRotY * 0.6; // head stays fixed on opponent

          rig.leftArm.rotation.x = lArmX;
          rig.leftArm.rotation.z = lArmZ;
          rig.leftForearm.rotation.x = lForearmX;

          rig.rightArm.rotation.x = rArmX;
          rig.rightArm.rotation.z = rArmZ;
          rig.rightForearm.rotation.x = rForearmX;

        } else if (curEx === 'jumping_jacks') {
          // Dynamic Jumping Jacks Rhythm
          const cycle = (localClock * 4.5) % (Math.PI * 2);
          const jackProgress = (Math.sin(cycle) + 1) / 2; // 0 (closed) to 1 (open)
          const bounce = Math.sin(cycle * 2) * 0.07;
          rig.pelvis.position.y = 0.98 + Math.max(0, bounce);

          // Legs abduct outward
          rig.leftThigh.rotation.z = -jackProgress * 0.45;
          rig.rightThigh.rotation.z = jackProgress * 0.45;
          rig.leftShin.rotation.z = jackProgress * 0.12;
          rig.rightShin.rotation.z = -jackProgress * 0.12;

          // Arms sweep overhead in wide arc
          rig.leftArm.rotation.z = -jackProgress * 2.8;
          rig.rightArm.rotation.z = jackProgress * 2.8;
          rig.leftArm.rotation.y = jackProgress * 0.2;
          rig.rightArm.rotation.y = -jackProgress * 0.2;

        } else if (curEx === 'high_knees') {
          // Explosive High Knees running cadence
          const cycle = (localClock * 6.5) % (Math.PI * 2);
          const bounce = Math.abs(Math.sin(cycle)) * 0.05;
          rig.pelvis.position.y = 0.98 + bounce;

          const leftDrive = Math.max(0, Math.sin(cycle));
          const rightDrive = Math.max(0, Math.sin(cycle + Math.PI));

          // Alternating knee drives up to 90 degrees
          rig.leftThigh.rotation.x = -leftDrive * 1.6;
          rig.leftShin.rotation.x = leftDrive * 1.5;
          rig.rightThigh.rotation.x = -rightDrive * 1.6;
          rig.rightShin.rotation.x = rightDrive * 1.5;

          // Opposite runner's arm pump
          rig.leftArm.rotation.x = rightDrive * 0.8 - leftDrive * 0.8;
          rig.rightArm.rotation.x = leftDrive * 0.8 - rightDrive * 0.8;
          rig.leftForearm.rotation.x = -1.2;
          rig.rightForearm.rotation.x = -1.2;
        }

        // Update joint marker visibility & world positions
        rig.jointMarkers.visible = showJointsRef.current;
        if (showJointsRef.current) {
          const tempV = new THREE.Vector3();
          rig.leftKnee.getWorldPosition(tempV);
          nodeLeftKnee.position.copy(tempV);

          rig.rightKnee.getWorldPosition(tempV);
          nodeRightKnee.position.copy(tempV);

          rig.leftHip.getWorldPosition(tempV);
          nodeLeftHip.position.copy(tempV);

          rig.rightHip.getWorldPosition(tempV);
          nodeRightHip.position.copy(tempV);

          rig.leftForearm.getWorldPosition(tempV);
          nodeLeftElbow.position.copy(tempV);

          rig.rightForearm.getWorldPosition(tempV);
          nodeRightElbow.position.copy(tempV);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      stageGeo.dispose();
      stageMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Handle camera presets smoothly
  const applyCameraPreset = (preset: 'hero' | 'front' | 'side') => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (preset === 'hero') {
      camera.position.set(1.4, 1.45, 3.4);
      controls.target.set(0, 1.05, 0);
    } else if (preset === 'front') {
      camera.position.set(0, 1.35, 3.5);
      controls.target.set(0, 1.05, 0);
    } else if (preset === 'side') {
      // 90° pure sagittal profile view for biomechanics squat depth analysis
      camera.position.set(3.5, 1.25, 0);
      controls.target.set(0, 0.95, 0);
    }
    controls.update();
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#090d16] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Overlay Badges */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          <span>FitVerse 3D Trainer Avatar</span>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 text-xs font-medium text-cyan-300">
          Pure Three.js Kinematics
        </div>
      </div>

      {/* Top Right Biomechanical HUD Metric */}
      {exerciseId === 'squats' && (
        <div className="absolute top-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/40 text-right shadow-xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Avatar Joint Flexion</div>
          <div className="text-xl font-bold font-heading text-emerald-400">
            {currentSquatDepthAngle}° <span className="text-xs text-slate-400 font-normal">Knee Flexion</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {currentSquatDepthAngle <= 100 ? '✅ Target Parallel Depth Reached' : '⏳ Descending to 90°'}
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Sleek Pinned Bottom Controls Dock (collapsible, 100% viewport unobstructed) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl transition-all duration-300">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-3.5">
          {/* Header Row of Dock */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Exercise Simulation</span>
              <div className="flex items-center gap-1">
                {(['squats', 'boxing', 'jumping_jacks', 'high_knees'] as ExerciseId[]).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => onExerciseChange?.(ex)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      exerciseId === ex
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {ex === 'squats' ? 'Squats' : ex === 'boxing' ? 'Boxing' : ex === 'jumping_jacks' ? 'Jumping Jacks' : 'High Knees'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60"
              title="Toggle HUD details"
            >
              {isControlsCollapsed ? (
                <><span>Options</span><ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <><span>Collapse</span><ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          {/* Controls body */}
          {!isControlsCollapsed && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-md ${
                    isPlaying
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                </button>

                <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700">
                  {[0.5, 1, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                        speed === s
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Presets */}
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Angle:</span>
                <button
                  onClick={() => applyCameraPreset('hero')}
                  className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                    cameraPreset === 'hero' ? 'bg-slate-700 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Hero 45°
                </button>
                <button
                  onClick={() => applyCameraPreset('front')}
                  className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                    cameraPreset === 'front' ? 'bg-slate-700 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => applyCameraPreset('side')}
                  className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                    cameraPreset === 'side' ? 'bg-slate-700 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                  title="Sagittal profile for squat depth"
                >
                  Profile 90°
                </button>
              </div>

              {/* Biomechanical Joint Overlay Toggle */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowJointNodes(!showJointNodes)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
                    showJointNodes
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Joint Biomechanics</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
