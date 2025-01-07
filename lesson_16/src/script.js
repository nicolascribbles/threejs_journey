import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

// Floor textures
const fogGradientTexture = textureLoader.load('./floor/alpha.jpg')
const coastSandRockDispTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg')
const coastSandRockDiffTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
const coastSandRockNorGLTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg')
const coastSandRockARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')


coastSandRockDiffTexture.repeat.set(8, 8)
coastSandRockDiffTexture.wrapS = THREE.RepeatWrapping
coastSandRockDiffTexture.wrapT = THREE.RepeatWrapping
coastSandRockDiffTexture.colorSpace = THREE.SRGBColorSpace

coastSandRockDispTexture.repeat.set(8, 8)
coastSandRockDispTexture.wrapS = THREE.RepeatWrapping
coastSandRockDispTexture.wrapT = THREE.RepeatWrapping


coastSandRockNorGLTexture.repeat.set(8, 8)
coastSandRockNorGLTexture.wrapS = THREE.RepeatWrapping
coastSandRockNorGLTexture.wrapT = THREE.RepeatWrapping

coastSandRockARMTexture.repeat.set(8, 8)
coastSandRockARMTexture.wrapS = THREE.RepeatWrapping
coastSandRockARMTexture.wrapT = THREE.RepeatWrapping

// wall textures

const wallTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
wallTexture.colorSpace = THREE.SRGBColorSpace

const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg')
const wallDifferenceTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
const wallNorGLTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg')

/**
 * House
 */
// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// scene.add(sphere)

const floorMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    roughness: 0.9,
    transparent: true,
    map: coastSandRockDiffTexture,
    displacementMap: coastSandRockDispTexture,
    displacementScale: 0.3,
    displacementBias: -0.1,
    differenceMap: coastSandRockDiffTexture,
    normalMap: coastSandRockNorGLTexture,
    metalnessMap: coastSandRockARMTexture,
    roughnessMap: coastSandRockARMTexture,
    aoMap: coastSandRockARMTexture,
    alphaMap: fogGradientTexture,
    fog: true,
    fogColor: 0x00ff00,
    fogDensity: 0.01,
})

gui.add(floorMaterial, 'displacementScale').min(0).max(1).step(0.001).name('displacementScale')
gui.add(floorMaterial, 'displacementBias').min(-1).max(1).step(0.001).name('displacementBias')

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 50, 50),
    floorMaterial
)

floor.rotation.x = -(Math.PI / 2)

scene.add(floor)


// Group 1
// House
const house = new THREE.Group()
scene.add(house)

// Walls
const wallsGeometry = new THREE.BoxGeometry(4, 2.5, 4)
const walls = new THREE.Mesh(
    wallsGeometry,
    new THREE.MeshStandardMaterial({
        map: wallTexture,
        aoMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        differenceMap: wallDifferenceTexture,
        normalMap: wallNorGLTexture,
    })
)

walls.position.y = 1.25

house.add(walls)


// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 2, 4, 1),
    new THREE.MeshStandardMaterial({ color: 0x885522 })
)
roof.position.y = 3.5
roof.rotation.y = Math.PI / 4

house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
)

door.position.y = 1
door.position.z = 2.01

house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial()

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 })

const graves = new THREE.Group()

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3.9 + Math.random() * 4

    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z

    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}

scene.add(graves)
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()