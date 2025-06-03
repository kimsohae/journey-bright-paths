import { useRef, useEffect } from "react";
import { Layer, Marker, Source } from "react-map-gl";
import * as THREE from "three";

/**
 * 매헌시민의숲 위치 : https://data.seoul.go.kr/dataList/OA-394/S/1/datasetView.do
 */
const CITIZEN_FOREST_POSITION = {
  longitude: 127.14942,
  latitude: 37.376225,
};

const polygonCoordinates = [
  [127.14853557412403, 37.37372381944506],
  [127.14918058013092, 37.37408479168376],
  [127.15047967673445, 37.374113669387626],
  [127.15065228397538, 37.374431323398454],
  [127.15049784591872, 37.375304864991236],
  [127.15117919029115, 37.37610620411667],
  [127.15117919029115, 37.3763588768407],
  [127.15167884283125, 37.37698694535236],
  [127.15210581863857, 37.37819975242137],
  [127.15214215700428, 37.378632893050494],
  [127.15158799691432, 37.37945585335402],
  [127.15103383682441, 37.37963632589724],
  [127.15057052265138, 37.3787989296286],
  [127.150179885211, 37.37844519908539],
  [127.14965297889523, 37.37774495206912],
  [127.14800866780831, 37.377333463659156],
  [127.14752718445106, 37.37679924726753],
  [127.14749993067687, 37.37638053446315],
  [127.14761803036794, 37.3760340117537],
  [127.14729098506882, 37.375651391069326],
  [127.14771796087615, 37.37511716269694],
  [127.14853557412403, 37.37372381944506],
];

export default function ParkMarker() {
  const { longitude, latitude } = CITIZEN_FOREST_POSITION;
  const mountRef = useRef(null);

  const routeGeoJson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [polygonCoordinates],
    },
  };

  useEffect(() => {
    const width = 100;
    const height = 100;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    // 바닥 (잔디)
    const groundGeometry = new THREE.PlaneGeometry(4, 4);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 }); // 녹색
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    // ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    scene.add(ground);

    // 나무 기둥
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // 갈색
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -1;
    scene.add(trunk);

    // 나무 잎
    const leavesGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 }); // 진한 녹색
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = -0.3;
    scene.add(leaves);

    // 광원 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // 언마운트 시 정리
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <Source id="park" type="geojson" data={routeGeoJson as any}>
      {/* <Layer
        id={`park-fill`}
        type="fill"
        paint={{
          "fill-color": "#cef593",
        }}
      /> */}
      <Marker longitude={longitude} latitude={latitude}>
        <div ref={mountRef} style={{ width: 100, height: 100 }} />
      </Marker>
    </Source>
  );
}
