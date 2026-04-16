/* eslint-disable react/no-unknown-property */
/**
 * FluidGlass — lens-only hero background.
 * Stripped from the React Bits FluidGlass component:
 *   - No ScrollControls / demo images / typography
 *   - Transparent canvas (blends over the existing hero background)
 *   - Lens follows the mouse pointer
 */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

interface LensSceneProps {
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  scale?: number;
}

const LensScene = memo(function LensScene({
  ior = 1.15,
  thickness = 5,
  chromaticAberration = 0.1,
  anisotropy = 0.01,
  scale = 0.25,
}: LensSceneProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF('/assets/3d/lens.glb') as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };
  const buffer = useFBO();
  const [scene] = useState(() => new THREE.Scene());
  const { viewport: vp } = useThree();

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = (pointer.x * v.width) / 2;
    const destY = (pointer.y * v.height) / 2;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(null, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent opacity={0} />
      </mesh>
      <mesh
        ref={ref}
        scale={scale}
        rotation-x={Math.PI / 2}
        geometry={nodes['Cylinder']?.geometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior}
          thickness={thickness}
          anisotropy={anisotropy}
          chromaticAberration={chromaticAberration}
          transmission={1}
          roughness={0}
        />
      </mesh>
    </>
  );
});

export default function FluidGlass(props: LensSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <LensScene {...props} />
    </Canvas>
  );
}
