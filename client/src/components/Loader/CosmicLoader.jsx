import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  Vector2
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import "./CosmicLoader.css";

const TIMINGS = {
  flash: 3600,
  vishnu: 4300,
  fade: 5900,
  finish: 6600
};

const PRELOAD_ASSETS = ["/assets/galaxy.jpg", "/assets/vishnu.png"];

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.onload = resolve;
    image.onerror = resolve;
  });
}

function BloomLayer() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new Vector2(size.width, size.height), 1.2, 0.9, 0.3));
    composer.setSize(size.width, size.height);
    composerRef.current = composer;

    return () => {
      composer.dispose();
      composerRef.current = null;
    };
  }, [camera, gl, scene, size.height, size.width]);

  useFrame(() => {
    composerRef.current?.render();
  }, 1);

  return null;
}

function StarField() {
  const pointsRef = useRef(null);
  const geometry = useMemo(() => {
    const starGeometry = new BufferGeometry();
    const positions = new Float32Array(1800 * 3);

    for (let index = 0; index < 1800; index += 1) {
      const stride = index * 3;
      positions[stride] = (Math.random() - 0.5) * 9;
      positions[stride + 1] = (Math.random() - 0.5) * 9;
      positions[stride + 2] = -Math.random() * 8 - 1;
    }

    starGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    return starGeometry;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y += delta * 0.015;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
    pointsRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.18) * 0.15;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#fff8dd"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    camera.position.z = Math.max(camera.position.z - 0.01, -1.35);
    camera.position.x = MathUtils.lerp(camera.position.x, Math.sin(elapsed * 0.18) * 0.18, delta * 0.9);
    camera.position.y = MathUtils.lerp(camera.position.y, Math.cos(elapsed * 0.14) * 0.12, delta * 0.9);
    camera.lookAt(0, 0, -5);
  });

  return null;
}

function GalaxySphere() {
  const meshRef = useRef(null);
  const texture = useLoader(TextureLoader, "/assets/galaxy.jpg");

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
  }, [texture]);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
    </mesh>
  );
}

function GalaxyCore() {
  const glowRef = useRef(null);
  const coreRef = useRef(null);

  useFrame((state, delta) => {
    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * 0.03;
      glowRef.current.material.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    }

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05);
      coreRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <>
      <mesh ref={glowRef} position={[0, 0, -4.6]}>
        <planeGeometry args={[4.8, 4.8]} />
        <meshBasicMaterial
          color="#6f88ff"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={coreRef} position={[0, 0, -4.8]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial
          color="#fff1c7"
          transparent
          opacity={0.95}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

function GalaxyScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ fov: 58, position: [0, 0, 1.35] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#000000"]} />
      <fogExp2 attach="fog" args={["#000000", 0.25]} />
      <ambientLight intensity={0.3} color="#7187ff" />
      <pointLight position={[0, 0, -4.2]} intensity={10} color="#ffe4b0" distance={12} />
      <CameraRig />
      <GalaxySphere />
      <GalaxyCore />
      <StarField />
      <BloomLayer />
    </Canvas>
  );
}

export default function CosmicLoader({ onFinish }) {
  const [phase, setPhase] = useState("galaxy");
  const timeoutRef = useRef([]);
  const previousOverflowRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    Promise.all(PRELOAD_ASSETS.map(preloadImage)).catch(() => null);

    timeoutRef.current = [
      window.setTimeout(() => !cancelled && setPhase("flash"), TIMINGS.flash),
      window.setTimeout(() => !cancelled && setPhase("vishnu"), TIMINGS.vishnu),
      window.setTimeout(() => !cancelled && setPhase("fade"), TIMINGS.fade),
      window.setTimeout(() => {
        document.body.style.overflow = previousOverflowRef.current;
        onFinish?.();
      }, TIMINGS.finish)
    ];

    return () => {
      cancelled = true;
      timeoutRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [onFinish]);

  return (
    <motion.div
      className="cosmic-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fade" ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      role="presentation"
      aria-hidden="true"
    >
      <div className="cosmic-loader__scene">
        <GalaxyScene />
      </div>

      <div className={`cosmic-loader__flash ${phase === "flash" ? "is-active" : ""}`} />

      <motion.div
        className="cosmic-loader__vishnu-shell"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{
          opacity: phase === "vishnu" || phase === "fade" ? 1 : 0,
          scale: phase === "vishnu" || phase === "fade" ? 1 : 1.04
        }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="cosmic-loader__aura" />
        <motion.img
          src="/assets/vishnu.png"
          alt="Lord Vishnu reclining on Shesha Naag"
          className="cosmic-loader__vishnu-image"
          loading="eager"
          initial={{ opacity: 0, y: 28 }}
          animate={{
            opacity: phase === "vishnu" || phase === "fade" ? 1 : 0,
            y: phase === "vishnu" || phase === "fade" ? 0 : 28
          }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <div className="cosmic-loader__veil" />
    </motion.div>
  );
}
