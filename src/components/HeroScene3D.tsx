/**
 * HeroScene3D — Three.js WebGL background for the hero section.
 *
 * Device compatibility strategy:
 *  - checks WebGL support before mounting the canvas
 *  - respects prefers-reduced-motion (disables rotation/float animation)
 *  - on first render error (e.g. low-end mobile GPU), ErrorBoundary shows nothing
 *  - canvas is absolutely positioned behind hero content, pointer-events: none
 *  - full Suspense boundary so it never blocks the rest of the page
 */

import { Suspense, useRef, useMemo, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Detect WebGL support ──────────────────────────────────────────────────
function supportsWebGL(): boolean {
    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch {
        return false;
    }
}

// ── Detect reduced motion preference ─────────────────────────────────────
function prefersReducedMotion(): boolean {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// ── Floating particles (Three.js Points) ─────────────────────────────────
function StarField() {
    const ref = useRef<THREE.Points>(null!);
    const reduced = prefersReducedMotion();

    // 1200 random points in a sphere
    const positions = useMemo(() => {
        const arr = new Float32Array(1200 * 3);
        for (let i = 0; i < 1200; i++) {
            const r = Math.random() * 4 + 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            arr[i * 3 + 2] = r * Math.cos(phi);
        }
        return arr;
    }, []);

    useFrame((_, delta) => {
        if (reduced) return;
        ref.current.rotation.x -= delta * 0.04;
        ref.current.rotation.y -= delta * 0.06;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#7dd3fc"
                size={0.014}
                sizeAttenuation
                depthWrite={false}
                opacity={0.55}
            />
        </Points>
    );
}

// ── Floating 3D torus knot ────────────────────────────────────────────────
function FloatingShape() {
    const ref = useRef<THREE.Mesh>(null!);
    const reduced = prefersReducedMotion();

    useFrame((state) => {
        if (reduced) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = t * 0.18;
        ref.current.rotation.y = t * 0.24;
        ref.current.position.y = Math.sin(t * 0.5) * 0.18;
    });

    return (
        <mesh ref={ref} position={[2.4, 0, -1.5]}>
            <torusKnotGeometry args={[0.55, 0.18, 128, 16]} />
            <meshPhongMaterial
                color="#3b82f6"
                emissive="#1d4ed8"
                emissiveIntensity={0.35}
                transparent
                opacity={0.18}
                wireframe
            />
        </mesh>
    );
}

// ── Rotating icosahedron ──────────────────────────────────────────────────
function Icosahedron() {
    const ref = useRef<THREE.Mesh>(null!);
    const reduced = prefersReducedMotion();

    useFrame((state) => {
        if (reduced) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = t * 0.12;
        ref.current.rotation.z = t * 0.09;
        ref.current.position.y = Math.cos(t * 0.4) * 0.15;
    });

    return (
        <mesh ref={ref} position={[-2.6, 0.4, -2]}>
            <icosahedronGeometry args={[0.7, 1]} />
            <meshPhongMaterial
                color="#38bdf8"
                emissive="#0ea5e9"
                emissiveIntensity={0.4}
                transparent
                opacity={0.14}
                wireframe
            />
        </mesh>
    );
}

// ── Scene lights ──────────────────────────────────────────────────────────
function Lights() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[4, 4, 4]} intensity={1.2} color="#60a5fa" />
            <pointLight position={[-4, -2, -4]} intensity={0.6} color="#818cf8" />
        </>
    );
}

// ── Error boundary so a WebGL crash doesn't break the page ────────────────
class SceneErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
    state = { error: false };
    static getDerivedStateFromError() { return { error: true }; }
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.warn("[HeroScene3D] WebGL error, falling back to CSS:", error.message, info);
    }
    render() { return this.state.error ? null : this.props.children; }
}

// ── Public component ──────────────────────────────────────────────────────
export function HeroScene3D() {
    if (!supportsWebGL()) return null;   // silent fallback for unsupported devices

    return (
        <SceneErrorBoundary>
            <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
            >
                <Suspense fallback={null}>
                    <Canvas
                        camera={{ position: [0, 0, 4.5], fov: 60 }}
                        dpr={[1, Math.min(window.devicePixelRatio, 2)]} // cap DPR for perf on high-density screens
                        gl={{
                            antialias: false,       // cheaper on mobile
                            alpha: true,
                            powerPreference: "low-power",  // request integrated GPU on dual-GPU devices
                        }}
                        style={{ background: "transparent" }}
                    >
                        <Lights />
                        <StarField />
                        <FloatingShape />
                        <Icosahedron />
                    </Canvas>
                </Suspense>
            </div>
        </SceneErrorBoundary>
    );
}
