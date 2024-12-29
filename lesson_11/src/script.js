import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// GUI
const gui = new GUI()
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
 * Objects
 */
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.65

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)


material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 3
// material.color = new THREE.Color('purple')
// material.opacity = 0.5
// material.transparency = true
// material.alphaMap = doorAlphaTexture
material.side = THREE.DoubleSide
// material.matcap = matcapsTextureOne
// material.wireframe = true
material.shininess = 100
material.displacementMap = doorHeightTexture
material.displacementScale = 0.02

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) =>
{
    console.log(environmentMap)
})

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
sphere.position.x = - 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * Lights
 *
 * */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Environment map
 */

rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) =>
{
    scene.background = environmentMap
})

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