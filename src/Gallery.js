import { useGLTF, useTexture } from '@react-three/drei'
import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import {
  sRGBEncoding,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
  Quaternion,
  Vector3
} from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RepeatWrapping } from 'three'

export function Gallery(props) {
  const { scene } = useGLTF(process.env.PUBLIC_URL + 'models/gallery.glb')

  const [woodColor, woodRoughness, woodMetalness, woodNormal] = useTexture([
    process.env.PUBLIC_URL + 'textures/wood/woodmat_Base_Color.png',
    process.env.PUBLIC_URL + 'textures/wood/woodmat_Roughness.png',
    process.env.PUBLIC_URL + 'textures/wood/woodmat_Metallic.png',
    process.env.PUBLIC_URL + 'textures/wood/woodmat_Normal_OpenGL.png'
  ])
  woodColor.encoding = sRGBEncoding

  const [metalColor, metalMetalness, metalNormal] = useTexture([
    process.env.PUBLIC_URL + 'textures/metal/blackmetal_Base_Color.png',
    process.env.PUBLIC_URL + 'textures/metal/blackmetal_Metallic.png',
    process.env.PUBLIC_URL + 'textures/metal/blackmetal_Normal_OpenGL.png'
  ])
  metalColor.encoding = sRGBEncoding

  const lightmap1 = useTexture(
    process.env.PUBLIC_URL + 'textures/lightmap1.jpg'
  )

  const paint = useTexture(process.env.PUBLIC_URL + 'textures/paint.jpg')
  paint.wrapS = RepeatWrapping
  paint.wrapT = RepeatWrapping
  paint.encoding = sRGBEncoding

  const raycaster = new Raycaster()
  const state = useThree()
  const currentPaint = useRef(null)
  let [q] = useState(new Quaternion())
  let [p] = useState(new Vector3())
  let [tq] = useState(new Quaternion())
  let [tp] = useState(new Vector3())
  const GOLDENRATIO = 1.61803398875

  const get = useThree((state) => state.get)

  useFrame((state, dt) => {
    console.log(state.camera.position)
    const controls = get().controls
    if (controls && !controls.enabled) {
      state.camera.position.lerp(p, 0.1)
      state.camera.quaternion.slerp(q, 0.1)
    }
  })

  useEffect(() => {
    const pointer = new Vector2()

    function onPointerDown(event) {
      const controls = get().controls
      const camera = get().camera
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(pointer, state.camera)
      const intersects = raycaster.intersectObjects(scene.children)
      if (intersects.length > 0) {
        const object = intersects[0].object
        if (object.name.indexOf('paint') !== -1) {
          currentPaint.current = object
          currentPaint.current.updateWorldMatrix(true, true)
          currentPaint.current.localToWorld(p.set(0, GOLDENRATIO / 30, 2))
          currentPaint.current.getWorldQuaternion(q)
          controls.enabled = false
          tp.copy(camera.position)
          tq.copy(camera.quaternion)
        } else {
          currentPaint.current = null
          if (!controls.enabled) {
            p.copy(tp)
            q.copy(tq)
            setTimeout(() => {
              controls.update()
              controls.enabled = true
            }, 1000)
          }
        }
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
  }, [])

  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        if (o.name === 'Cube001_floormat_0') {
          o.visible = false
        }
        if (o.material.name === 'woodmat') {
          o.material.roughness = 0
          o.material.map = woodColor
          o.material.metalnessMap = woodMetalness
          o.material.roughnessMap = woodRoughness
          o.material.normalMap = woodNormal
          o.material.envMapIntensity = 1.2
        }
        if (o.material.name === 'blackmetalbench') {
          o.material.roughness = 0
          o.material.map = metalColor
          o.material.metalnessMap = metalMetalness
          o.material.normalMap = metalNormal
        }
        if (o.material.name === 'whitematwalls') {
          o.material = new MeshBasicMaterial({
            map: lightmap1
          })
        }
        if (o.material.name === 'paint') {
          o.scale.set(1, 1.01, 1)
          o.material.envMapIntensity = 1.2
          o.material.metalness = 0.2
          o.material.roughness = 0
          o.material.map = paint
        }
      }
    })3
  })
  return <primitive object={scene} {...props} />
}
