import { useTexture, MeshReflectorMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import { RepeatWrapping } from 'three'

export function Floor(props) {
  const [floorRoughness, floorNormal] = useTexture([
    process.env.PUBLIC_URL + 'textures/floor/terrain-roughness.jpg',
    process.env.PUBLIC_URL + 'textures/floor/terrain-normal.jpg'
  ])

  const lightmap = useTexture(process.env.PUBLIC_URL + 'textures/lightmap2.jpg')

  floorRoughness.wrapS = RepeatWrapping
  floorRoughness.wrapT = RepeatWrapping
  floorRoughness.repeat.set(15, 15)

  floorNormal.wrapS = RepeatWrapping
  floorNormal.wrapT = RepeatWrapping
  floorNormal.repeat.set(15, 15)

  // const { ...config } = useControls({
  //   mixStrength: { value: 100, min: 30, max: 500, step: 0.1 },
  //   mixBlur: { value: 10, min: 10, max: 100, step: 0.1 }
  // })

  return (
    <>
      <mesh rotation-x={-Math.PI * 0.5} position={[0, -0, 0]}>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial
          color={0xe0dfcf}
          envMapIntensity={0.3}
          normalMap={floorNormal}
          roughnessMap={floorRoughness}
          lightMap={lightmap}
          metalness={0.3}
          opacity={0.8}
          transparent
        />
      </mesh>
      <mesh rotation-x={-Math.PI * 0.5} position={[0, -0.1, 0]}>
        <planeGeometry args={[20, 30]} />
        <MeshReflectorMaterial
          envMapIntensity={0.01}
          dithering={true}
          roughness={0}
          blur={[1000, 400]}
          resolution={1024}
          mixBlur={100}
          mirror={0}
          mixStrength={100}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          mixContrast={1}
          color="#101010"
          metalness={0.2}
          alpha={0.3}
        />
      </mesh>
    </>
  )
}
