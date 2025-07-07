import { memo, useEffect, useRef } from "react";
import * as THREE from "three";
import { COLOR_HEX } from "../MapSubwayLine";
import { useSearchParamStore } from "@/store/SearchContext";

interface Props {
  bearing: number;
  isUpShown?: boolean;
  // mapRef: React.MutableRefObject<MapRef>;
  //   scene: any;
  //   camera: any;
}

const width = 50;
const height = 50;
const radius = 4;

function Dimension3({ bearing, isUpShown }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { subwayNm } = useSearchParamStore((state) => state.searchParams);
  const color = COLOR_HEX[subwayNm];

  useEffect(() => {
    const scene = new THREE.Scene();

    const pitchRad = THREE.MathUtils.degToRad(45);
    const bearingRad = THREE.MathUtils.degToRad(0);

    const x = radius * Math.sin(bearingRad) * Math.cos(pitchRad);
    const y = radius * Math.sin(pitchRad);
    const z = radius * Math.cos(bearingRad) * Math.cos(pitchRad);

    // camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    // renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mountRef.current?.appendChild(renderer.domElement);

    // trainGroup: train + line + window
    const trainGroup = new THREE.Group();
    const train = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.6, 1),
      new THREE.MeshLambertMaterial({ color: 0xdedede })
    );

    trainGroup.add(train);

    const lineGeometry = new THREE.BoxGeometry(2, 0.3, 1.01); // 높이 0.05, 본체보다 살짝 앞
    const lineMaterial = new THREE.MeshPhongMaterial({
      color, // 예: 노란색 호선
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.y = 0; // 몸통의 위쪽에 위치
    trainGroup.add(line);

    const windowGeometry = new THREE.BoxGeometry(1, 0.6, 0.02);
    const windowMaterial = new THREE.MeshPhongMaterial({
      color: 0x222222,
      shininess: 30,
    });
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(1.01, 0, 0);
    windowMesh.rotation.y = Math.PI / 2;

    trainGroup.add(windowMesh);

    // rotation
    trainGroup.rotation.y = THREE.MathUtils.degToRad(90 - bearing);
    scene.add(trainGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-5, -10, -7);
    scene.add(backLight);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [bearing, isUpShown]);

  return <div ref={mountRef} />;
}

export default memo(Dimension3);
