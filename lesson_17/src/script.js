import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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


/**
 * Geometry
 */
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)

// My attempt
// const  particlesGeometry = new THREE.BufferGeometry()

// particlesGeometry.setDrawRange(0, 100)

// const positions = new Float32Array(100 * 3)

// for(let i = 0; i < 100; i++) {
//     positions[i * 3] = (Math.random() - 0.5) * 4
//     positions[i * 3 + 1] = (Math.random() - 0.5) * 4
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 4
// }

// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// End of my attempt
// textures
const particlesTexture = textureLoader.load('./textures/particles/2.png')

// Start of tutorial
const particlesGeometry = new THREE.BufferGeometry()
const count = 500
const colors = new Float32Array(count * 3)
const positions = new Float32Array(count * 3)

for(let i =0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}


particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// particlesGeometry.setAttribute(

// )

/**
 * Material
 */
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    alphaMap: particlesTexture,
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    // blending: THREE.AdditiveBlending,
    vertexColors: true,
})





// GUI
gui.add(particlesMaterial, 'size').min(0.01).max(0.1).step(0.001)
gui.add(particlesMaterial, 'sizeAttenuation').min(0).max(1).step(0.001)


/**
 * Points
 */
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

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
camera.position.z = 3
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

    // Update controls
    controls.update()

    // Update particles
    // particles.rotation.x = Math.sin(elapsedTime * 0.1)
    // particles.rotation.y = Math.cos(elapsedTime * 0.1)
    for(let i = 0; i < count; i++) {
        const i3 = i * 3
        // positions[i3] = Math.sin(elapsedTime + i)
        // positions[i3 + 1] = Math.cos(elapsedTime + i)
        // positions[i3 + 2] = 0
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3+1] = Math.sin(elapsedTime + x)

    }
    // particlesGeometry.attributes.position.needsUpdate = true
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


}

tick()