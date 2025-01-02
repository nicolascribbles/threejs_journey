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
 * Lights
 */
const ambientLight = new THREE.AmbientLight('white', 0.5)
scene.add(ambientLight)

gui.add(ambientLight, 'intensity').min(0).max(10).step(0.001).name('ambient light intensity')
gui.addColor(ambientLight, 'color')
    .name('ambient light color')

const directionalLight = new THREE.DirectionalLight('pink', 0.5)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('directional light intensity')
gui.addColor(directionalLight, 'color')
    .name('directional light color')
gui.add(directionalLight.position, 'x').name('light direction x-axis').min(-3).max(3).step(0.001)
gui.add(directionalLight.position, 'y').name('light direction y-axis').min(-3).max(3).step(0.001)
gui.add(directionalLight.position, 'z').name('light direction z-axis').min(-3).max(3).step(0.001)

const hemisphereLight  = new THREE.HemisphereLight('lightpink', 'lightblue', 0.9)
scene.add(hemisphereLight)

gui.add(hemisphereLight, 'intensity').min(0).max(10).step(0.001).name('hemisphere light intensity')
gui.addColor(hemisphereLight, 'groundColor')
    .name('hemisphere light ground color')
gui.addColor(hemisphereLight, 'color')
    .name('hemisphere light sky color')


const pointLight = new THREE.PointLight('red', 1.5, 10, 3)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

gui.add(pointLight, 'intensity').min(0).max(10).step(0.001).name('point light intensity')
gui.addColor(pointLight, 'color')
    .name('point light color')
gui.add(pointLight.position, 'x').name('light position x-axis').min(-15).max(15).step(0.001)
gui.add(pointLight.position, 'y').name('light position y-axis').min(-15).max(15).step(0.001)
gui.add(pointLight.position, 'z').name('light position z-axis').min(-15).max(15).step(0.001)
gui.add(pointLight, 'distance').min(0).max(15).step(0.001).name('point light distance')
gui.add(pointLight, 'decay').min(0).max(5).step(0.001).name('point light decay')

const rectAreaLight = new THREE.RectAreaLight('blue', 3, 1, 1)
rectAreaLight.position.set(0, 1, 2)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

gui.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001).name('rect area light intensity')
gui.addColor(rectAreaLight, 'color')
    .name('rect area light color')
gui.add(rectAreaLight.position, 'x').name('light position x-axis').min(-3).max(3).step(0.001).onFinishChange(() => {
    rectAreaLight.lookAt(new THREE.Vector3())
})
gui.add(rectAreaLight.position, 'y').name('light position y-axis').min(-3).max(3).step(0.001).onFinishChange(() => {
    rectAreaLight.lookAt(new THREE.Vector3())
})
gui.add(rectAreaLight.position, 'z').name('light position z-axis').min(-3).max(3).step(0.001).onFinishChange(() => {
    rectAreaLight.lookAt(new THREE.Vector3())
})
gui.add(rectAreaLight, 'width').min(0).max(10).step(0.001).name('rect area light width')
gui.add(rectAreaLight, 'height').min(0).max(10).step(0.001).name('rect area light height')

const spotLight = new THREE.SpotLight('yellow', 1.5, 10, Math.PI * 0.1, 0.8, 1)
spotLight.position.set(0, 1, 2)
scene.add(spotLight)


gui.add(spotLight, 'intensity').min(0).max(10).step(0.001).name('spot light intensity')
gui.addColor(spotLight, 'color')
    .name('spot light color')
gui.add(spotLight.position, 'x').name('light position x-axis').min(-3).max(3).step(0.001).onFinishChange(() => {
    spotLight.updateMatrixWorld()
})
gui.add(spotLight.position, 'y').name('light position y-axis').min(-3).max(3).step(0.001).onFinishChange(() => {
    spotLight.updateMatrixWorld()
})
gui.add(spotLight.position, 'z').name('light position z-axis').min(-3).max(3).step(0.001).onFinishChange(() => {
    spotLight.updateMatrixWorld()
})
gui.add(spotLight, 'angle').min(0).max(Math.PI).step(0.001).name('spot light angle')
gui.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('spot light penumbra')
gui.add(spotLight, 'decay').min(0).max(1).step(0.001).name('spot light decay')
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()