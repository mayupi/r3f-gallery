import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, MapControls } from '@react-three/drei'
import { Gallery } from './Gallery'
import { Floor } from './Floor'

import './style.css'

function App() {
  return (
    <Suspense fallback={null}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ near: 0.1, far: 1000, fov: 60, position: [-6, 1.5, 0] }}
      >
        <group>
          <Gallery />
          <Floor />
        </group>
        <ambientLight intensity={0.3} />
        <Environment
          path={process.env.PUBLIC_URL + 'textures/'}
          files="noon_grass_1k.hdr"
        />
        <OrbitControls makeDefault />
      </Canvas>
    </Suspense>
  )
}

export default App
