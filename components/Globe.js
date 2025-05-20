// usage : <Globe />

"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import useOnScreen from "../shared/hooks/useOnScreen";

export default function Globe() {
    const canvasRef = useRef(null);
    const isVisible = useOnScreen(canvasRef, "-100px");
    const [animationTriggered, setAnimationTriggered] = useState(false);

    useEffect(() => {
        if(isVisible && !animationTriggered) setAnimationTriggered(true);
    }, [isVisible])

    useEffect(() => {
        // scene, camera, renderer, controls
        const scene = new THREE.Scene();
        const sizes = { width: window.innerHeight, height: window.innerHeight };
        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
        camera.position.z = 12;
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 5;
        controls.enablePan = false;
        controls.enableZoom = false;

        scene.add(new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 1.1));
        const light = new THREE.PointLight(0xffffff, 100, 300);
        light.position.set(10, 10, 10);
        scene.add(light);

        // load Earth model
        const loader = new GLTFLoader();
        const modelRoot = new THREE.Group();
        scene.add(modelRoot);

        loader.load(
            "/coolModels/Earth.glb",
            (gltf) => {
                const earth = gltf.scene;

                earth.traverse((obj) => {
                    if (obj.isMesh && obj.material) {
                        if (Array.isArray(obj.material)) {
                            obj.material.forEach((mat) => {
                                mat.transparent = false;
                                mat.opacity = 1;
                                mat.alphaTest = 0;
                            });
                        } else {
                            obj.material.transparent = false;
                            obj.material.opacity = 1;
                            obj.material.alphaTest = 0;
                        }
                    }
                });

                // Center pivot
                const box = new THREE.Box3().setFromObject(earth);
                const center = box.getCenter(new THREE.Vector3());
                earth.position.sub(center);

                modelRoot.add(earth);
                modelRoot.scale.set(5, 5, 5);
                modelRoot.position.set(0, -0.5, 0);
                controls.target.copy(modelRoot.position);
                controls.update();

                // halo layer
                const size = 512;
                const gradCanvas = document.createElement("canvas");
                gradCanvas.width = gradCanvas.height = size;
                const ctx = gradCanvas.getContext("2d");
                const grad = ctx.createRadialGradient(
                    size / 2,
                    size / 2,
                    0,
                    size / 2,
                    size / 2,
                    size / 2
                );
                grad.addColorStop(0, "rgba(255,255,255,1)");
                grad.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, size, size);

                const gradientTex = new THREE.CanvasTexture(gradCanvas);

                const spriteMat = new THREE.SpriteMaterial({
                    map: gradientTex,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    opacity: 0.25, // opacity of halo
                });

                // halo will always face camera
                const sprite = new THREE.Sprite(spriteMat);
                const worldSize = 7.3; // size of halo
                sprite.scale.set(worldSize, worldSize, 1);
                sprite.position.copy(modelRoot.position);
                scene.add(sprite);
            },
            undefined,
            (err) => console.error("GLTF load error:", err)
        );

        // resize handler
        const onResize = () => {
            sizes.width = window.innerHeight;
            sizes.height = window.innerHeight;
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
        };
        window.addEventListener("resize", onResize);

        // render loop
        let frameId;
        const tick = () => {
            controls.update();
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", onResize);
            controls.dispose();
            renderer.dispose();
            scene.traverse((obj) => {
                if (obj.isMesh || obj.isSprite) {
                    if (obj.geometry) obj.geometry.dispose();
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                    else if (obj.material) obj.material.dispose();
                }
            });
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`webgl w-full h-full block bg-transparent mob:scale-[70%] transition-all duration-1000 ease-out ${
                animationTriggered ? "scale-100" : "scale-0"
            }`}
        />
    );
}
