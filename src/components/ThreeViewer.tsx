'use client'
// components/ThreeViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

interface ThreeViewerProps {
  width?: number;
  height?: number;
  stlUrl?: string | File;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ 
  width = 800, 
  height = 600,
  stlUrl 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    setLoading(true);

    // Scene 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 10);

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Controls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;

    // 조명 설정
    const addLights = () => {
      // 전방 조명
      const frontLight = new THREE.DirectionalLight(0xffffff, 1);
      frontLight.position.set(0, 0, 0);
      scene.add(frontLight);

      // 후방 조명
      const backLight = new THREE.DirectionalLight(0xffffff, 1);
      backLight.position.set(0, 0, -1);
      scene.add(backLight);

      // 상단 조명
      const topLight = new THREE.DirectionalLight(0xffffff, 1);
      topLight.position.set(0, 1, 0);
      scene.add(topLight);

      // 환경광
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
    };

    addLights();

    // STL 파일 로드
    const loadSTL = (url: string | File) => {
      const loader = new STLLoader();
      
      const loadGeometry = (url: string | File) => {
        if (url instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arrayBuffer = e.target?.result;
            if (arrayBuffer instanceof ArrayBuffer) {
              try {
                const geometry = loader.parse(arrayBuffer);
                handleGeometry(geometry);
              } catch (err) {
                setError('STL 파일 파싱 중 오류가 발생했습니다.');
                console.error('STL parsing error:', err);
              }
            }
          };
          reader.readAsArrayBuffer(url);
        } else {
          loader.load(
            url,
            handleGeometry,
            (xhr) => {
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (err) => {
              setError('STL 파일을 불러오는 중 오류가 발생했습니다.');
              console.error('STL loading error:', err);
              setLoading(false);
            }
          );
        }
      };

      const handleGeometry = (geometry: THREE.BufferGeometry) => {
        // 기존 메쉬 제거
        scene.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            scene.remove(child);
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });

        // 모델 크기 계산
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        const boundingBox = geometry.boundingBox!;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;

        // 재질 설정
        const material = new THREE.MeshPhongMaterial({
          color: 0x808080,
          specular: 0x111111,
          shininess: 200,
          side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);
        mesh.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        scene.add(mesh);

        // 카메라 위치 조정
        const boundingSphere = geometry.boundingSphere!;
        const radius = boundingSphere.radius * scale;
        camera.position.set(radius * 2, radius * 2, radius * 2);
        camera.lookAt(scene.position);
        controls.target.set(0, 0, 0);
        controls.update();

        setLoading(false);
        setError(null);
      };

      loadGeometry(url);
    };

    if (stlUrl) {
      loadSTL(stlUrl);
    }

    // Animation 루프
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [width, height, stlUrl]);

  return (
    <div className="relative">
      <div ref={mountRef} className="w-full h-full" />
      {loading && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white p-2 text-center">
          로딩 중...
        </div>
      )}
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ThreeViewer;