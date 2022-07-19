import * as THREE from 'three'
import { Loader } from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

import spectrumFrag from "../shaders/spectrum.frag"
import spectrumVert from "../shaders/spectrum.vert"

import MyGUI from '../utils/MyGUI'

import LoadingController from './LoadingController'

class Spectrum {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader(LoadingController)
        this.textureLoader = new THREE.TextureLoader(LoadingController)
    }

    init(scene) {
        this.scene = scene

        this.uniforms = {
            uMatCap: {
                value: this.textureLoader.load('assets/textures/blackMetal.png')
            },
            uSpecterSize :{
                value: 0.8
            },
            uTime :{
                value: 0
            },
            uWaveSpeed :{
                value: 0.1
            },
            uWaveBorder :{
                value: 0.3
            },
            uBorderColor :{
                value: new THREE.Color("hsl(7, 87%, 59%)")
            }
        }

        const shaderFolder = MyGUI.addFolder("Spectrum Folder")
        shaderFolder.open()
        shaderFolder.add(this.uniforms.uSpecterSize, "value", -1, 1).name('Spectrum Size')
        shaderFolder.add(this.uniforms.uWaveBorder, "value", 0, 1).name('Border Size')
        shaderFolder.add(this.uniforms.uWaveSpeed, "value", 0, 1).name('Wave Speed')
        

        this.shaderMat = new THREE.ShaderMaterial({
            fragmentShader : spectrumFrag,
            vertexShader : spectrumVert,
            uniforms: this.uniforms,
            transparent: true

        })
        
        this.modelLoader.load('./assets/models/spectrum.glb', (glb)=>{
            glb.scene.traverse(child => {
                if(child instanceof THREE.Mesh)
                    child.material = this.shaderMat
            child.scale.multiplyScalar(1.62)
            child.position.y = -1.14
            })
            this.scene.add(glb.scene)
        })
    }

    update() {
        this.uniforms.uTime.value += 1
    }

    bind() {

    }
}

const _instance = new Spectrum()
export default _instance