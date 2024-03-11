import React, { useMemo, useRef, useState } from 'react'
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion } from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'

const boxGeometry = new BoxGeometry(1, 1, 1)

const floor1Material = new MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new MeshStandardMaterial({ color: 'slategrey' })

export function BlockStart({ position = [0, 0, 0] }) {
    return <group position={position}>
        <Float rotationIntensity={0.25} rotationIntensityY={0.25}>
            <Text
                font="./bebas-neue-v9-latin-regular.woff"
                scale={0.5}
                maxWidth={0.25}
                lineHeight={0.75}
                textAlign="right"
                position={[0.75, 0.65, 0]}
                rotation-y={- 0.25}
            >
                Marble Race
            </Text>
            <meshBasicMaterial toneMapped={false} />
        </Float>
        <mesh
            geometry={boxGeometry}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            material={floor1Material}
            receiveShadow
        />
    </group>
}

export function BlockEnd({ position = [0, 0, 0] }) {
    const hamburger = useGLTF('./hamburger.glb')
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })


    return <group position={position}>
        <Text
            font="./bebas-neue-v9-latin-regular.woff"
            scale={8}
            position={[0, 2.25, 2]}
        >
            FINISH
            <meshBasicMaterial toneMapped={false} />
        </Text>
        <mesh
            geometry={boxGeometry}
            position={[0, 0, 0]}
            scale={[4, 0.2, 4]}
            material={floor1Material}
            receiveShadow
        />

        <RigidBody
            type='fixed'
            colliders="hull"
            position={[0, 0.25, 0]}
            restitution={0.2}
            friction={0}
        >
            <primitive object={hamburger.scene} scale={0.2} />
        </RigidBody>
    </group>
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const obstacle = useRef(null)

    const [speed] = useState((Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const rotation = new Quaternion()
        rotation.setFromEuler(new Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />

        <RigidBody ref={obstacle}
            type='kinematicPosition'
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    </group>
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const obstacle = useRef(null)

    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />

        <RigidBody
            ref={obstacle}
            type='kinematicPosition'
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    </group>
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const obstacle = useRef(null)

    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime() * 1.25

        const x = Math.sin(time + timeOffset)
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />

        <RigidBody
            ref={obstacle}
            type='kinematicPosition'
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[1.5, 1.3, 0.3]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    </group>
}

export function Bounds({ length = 1 }) {
    return <RigidBody type='fixed' restitution={0.2} friction={0}>
        <mesh
            geometry={boxGeometry}
            material={wallMaterial}
            position={[2.15, 0.75, - (length * 2) + 2]}
            scale={[0.3, 1.5, 4 * length]}
            castShadow
        />
        <mesh
            geometry={boxGeometry}
            material={wallMaterial}
            position={[-2.15, 0.75, - (length * 2) + 2]}
            scale={[0.3, 1.5, 4 * length]}
            receiveShadow
        />
        <mesh
            geometry={boxGeometry}
            material={wallMaterial}
            position={[0, 0.75, - (length * 4) + 2]}
            scale={[4, 1.5, 0.3]}
            receiveShadow
        />
        <CuboidCollider
            args={[2, 0.1, 2 * length]}
            position={[0, -0.1, - (length * 2) + 2]}
        />
    </RigidBody>
}

export function Level({
    numOfTraps = 5,
    type = [BlockSpinner, BlockLimbo, BlockAxe],
    seed = 0,
}) {

    const blocks = useMemo(() => {
        const blocks = []

        for (let i = 0; i < numOfTraps; i++) {
            const typeIndex = Math.floor(Math.random() * type.length)
            blocks.push(type[typeIndex])
        }

        return blocks
    }, [numOfTraps, type, seed])

    const distance = useMemo(() => {
        return 4
    }, [])


    return (
        <>
            <BlockStart position={[0, 0, 0]} />
            {
                blocks.map((Block, i) => (
                    <Block key={i} position={[0, 0, - distance * (i + 1)]} />
                ))
            }
            <BlockEnd position={[0, 0, - distance * (numOfTraps + 1)]} />
            <Bounds length={numOfTraps + 2} />
        </>
    )
}
