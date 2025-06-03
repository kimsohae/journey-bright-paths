import { useRef } from 'react';
import { AnyLayer } from 'react-map-gl';
import * as THREE from 'three';

export function useRenderPark () {
    const threeLayerRef = useRef(null);

  const onThreeLayerLoad = ({ gl }) => {
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    // 공원 영역을 표현할 평면 생성
    const geometry = new THREE.PlaneGeometry(300, 200);
    const material = new THREE.MeshBasicMaterial({
      color: 0x228b22,
      side: THREE.DoubleSide,
      opacity: 0.6,
      transparent: true,
    });
    const parkPlane = new THREE.Mesh(geometry, material);

    // 평면을 지도 좌표에 맞게 약간 기울이기 (pitch 반영)
    parkPlane.rotation.x = -Math.PI / 2; // 바닥에 붙도록 회전
    parkPlane.position.set(0, 0, 0); // 중심

    scene.add(parkPlane);
    threeLayerRef.current = { scene, camera, parkPlane, gl };
  };

  const customLayer:AnyLayer = {
    id: "threejs-park-layer",
    type: "raster",
    onAdd: (map, gl) => {
      onThreeLayerLoad({ gl });
    },
    render: (gl, matrix) => {
      const { scene, camera, parkPlane } = threeLayerRef.current;

      camera.projectionMatrix.fromArray(matrix);

      // 공원 크기나 위치 조정 가능
      // parkPlane.position.set(x, y, z);

      gl.resetState();
      gl.render(scene, camera);
    },
  };

  return { customLayer }
}