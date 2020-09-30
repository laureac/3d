import React, { useRef, useEffect, useState, Suspense } from "react";
import "./App.scss";

import Header from "./components/header";
import { Section } from "./components/section";


import state from "./components/state";


import { Canvas, useFrame } from "react-three-fiber";
import { Html, useProgress, useGLTFLoader, Sphere } from "drei";


import { a, useTransition } from "@react-spring/web";

import { useInView } from "react-intersection-observer";

const Model= ({modelPath}) => {
  const gltf = useGLTFLoader(modelPath, true);
  return <primitive object={gltf.scene} dispose={null}/>;
}

const HTMLContent = ({})

const Lights = () => {
  return (
    <>

    <ambientLight intensity={0.3} />

    <directionalLight position={[10, 10, 5]} intensity={1} />
    <directionalLight
      castShadow
      position={[0, 10, 0]}
      intensity={1.5}
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-far={50}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
    />

    <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
  </>
  )
}

const HtmlContent = ({
  domContent,
  children,
  bgColor,
  modelPath,
  positionY,
}) =>{
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, 200, 0]}>
        <mesh ref={ref} position={[0, positionY, 0]}>
          <Model modelPath={modelPath}/>
        </mesh>
        <Html fullScreen portal={domContent}> 
          {children}
        </Html>
      </group>
    </Section>
  );
}

function Loader() {
  const { active, progress } = useProgress();
  const transition = useTransition(active, {
    from: { opacity: 1, progress: 0 },
    leave: { opacity: 0 },
    update: { progress },
  });
  return transition(
    ({ progress, opacity }, active) =>
      active && (
        <a.div className='loading' style={{ opacity }}>
          <div className='loading-bar-container'>
            <a.div className='loading-bar' style={{ width: progress }}></a.div>
          </div>
        </a.div>
      )
  );
}

function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);
  return (
    <>
      <Header />
      <Canvas
        colorManagement
        camera={{ position: [0, 0, 120], fov: 60 }}
      >
        <Lights/>
        <Suspense fallback={null}>
          <HtmlContent modelPath={'/armchairGray.gltf'} positionY={-35}>
            <div className='container'>
              <div className='title'>
                <span> New Shopping Experience </span>
              </div>
            </div>
          </HtmlContent>
       </Suspense>
      </Canvas>
      <Loader />
      <div
        className='scrollArea'
        ref={scrollArea}
        onScroll={onScroll}
        >
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  );
}

export default App;
