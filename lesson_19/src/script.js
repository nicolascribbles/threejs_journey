import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        
        material.color.set(parameters.materialColor)
        
    })
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture loader


const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
const gradientTexture2 = textureLoader.load('textures/gradients/4.jpg')
const gradientTexture3 = textureLoader.load('textures/gradients/5.jpg')

gradientTexture.magFilter = THREE.NearestFilter
gradientTexture2.magFilter = THREE.NearestFilter
gradientTexture3.magFilter = THREE.NearestFilter

/**
 * Objects
 */
const objectDistance = 4

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture3
})

const meshOne = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
meshOne.position.y = - (objectDistance * 0)

const meshTwo = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
meshTwo.position.y = - (objectDistance * 1)

const meshThree = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
meshThree.position.y = - (objectDistance * 2)

scene.add(meshOne, meshTwo, meshThree)

/**
 * Lights
 */
const light = new THREE.DirectionalLight('#ffffff', 3)
light.position.set(1, 1, 0)
scene.add(light)

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

const updateAllMaterials = () => {
    material.color.set(parameters.materialColor)
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()