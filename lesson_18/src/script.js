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
 * Galaxy
 */
const galaxyParameters = {
    count: 100000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    trail: 1,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
}

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    material = new THREE.PointsMaterial({
        size: galaxyParameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })
    
    const positions = new Float32Array(galaxyParameters.count * 3)
    const colors = new Float32Array(galaxyParameters.count * 3)

    const colorInside = new THREE.Color(galaxyParameters.insideColor)
    const colorOutside = new THREE.Color(galaxyParameters.outsideColor)
    
    for(let i = 0; i < galaxyParameters.count; i++) {
        const i3 = i * 3
        const radius = Math.random() * galaxyParameters.radius
        const branchAngle = ((i % galaxyParameters.branches) / galaxyParameters.branches) * Math.PI * 2


        const spin = radius * galaxyParameters.spin
        const randomX = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        
        const x = Math.cos(branchAngle + spin) * radius
        const y = 0
        const z = Math.sin(branchAngle + spin) * radius

        const mixColor = colorInside.clone()
        mixColor.lerp(colorOutside, radius / galaxyParameters.radius)
        
        positions[i3] = x + randomX
        positions[i3+1] = y + randomY
        positions[i3+2] = z + randomZ

        colors[i3] = mixColor.r
        colors[i3+1] = mixColor.g
        colors[i3+2] = mixColor.b
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )



    points = new THREE.Points(geometry, material)
    scene.add(points)


}

generateGalaxy()

gui.add(galaxyParameters, 'count').min(100).max(10000000).step(100).onFinishChange(generateGalaxy)
gui.add(galaxyParameters, 'size').min(0.01).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.add(galaxyParameters, 'radius').min(0).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(galaxyParameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(galaxyParameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(galaxyParameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(galaxyParameters, 'randomnessPower').min(0).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.add(galaxyParameters, 'trail').min(0).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(galaxyParameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(galaxyParameters, 'outsideColor').onFinishChange(generateGalaxy)

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
camera.position.x = 3
camera.position.y = 3
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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()