import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// door textures
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/color.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/color.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

// environment map texture
// const environmentMap = textureLoader.load('/textures/environmentMap/2k.hdr')

// gradients textures
const gradientTexture = textureLoader.load('./textures/gradients/3.jpg')

// matcaps textures
const matcapsTextureOne = textureLoader.load('./textures/matcaps/1.png')
const matcapsTextureTwo = textureLoader.load('./textures/matcaps/2.png')
const matcapsTextureThree = textureLoader.load('./textures/matcaps/3.png')
const matcapsTextureFour = textureLoader.load('./textures/matcaps/4.png')
const matcapsTextureFive = textureLoader.load('./textures/matcaps/5.png')
const matcapsTextureSix = textureLoader.load('./textures/matcaps/6.png')
const matcapsTextureSeven = textureLoader.load('./textures/matcaps/7.png')
const matcapsTextureEight = textureLoader.load('./textures/matcaps/8.png')

matcapsTextureOne.colorSpace = THREE.SRGBColorSpace

/**
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = - 0.15 * elapsedTime
    plane.rotation.x = - 0.15 * elapsedTime
    torus.rotation.x = - 0.15 * elapsedTime
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()