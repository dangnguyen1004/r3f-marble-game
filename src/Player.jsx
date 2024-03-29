import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import { STATE, useGame } from './store/useGame'

function Player() {
    const [subscribeKeys, getKeys] = useKeyboardControls()

    const body = useRef(null);

    const { rapier, world } = useRapier()

    const [start, end, numOfTraps, restart] = useGame(state => [state.start, state.end, state.numOfTraps, state.restart])

    const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new Vector3())

    useFrame((state, delta) => {
        const keys = getKeys()
        const { forward, backward, leftward, rightward, jump } = keys

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.1 * delta

        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }

        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        if (leftward) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }

        if (rightward) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }
        body.current?.applyImpulse(impulse)
        body.current?.applyTorqueImpulse(torque)

        const bodyPosition = body.current?.translation()

        const cameraPosition = new Vector3()
        cameraPosition.copy(bodyPosition)

        cameraPosition.y += 0.65
        cameraPosition.z += 2.25

        const cameraTarget = new Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        const isEnd = bodyPosition.z < - (numOfTraps * 4 + 2)
        if (isEnd) {
            end()
        }

        const isAtStart = bodyPosition.z > 4
        if (isAtStart) {
            restart()
        }
    })

    const jump = useCallback(() => {
        const origin = body.current?.translation();
        origin.y -= 0.31 // get the position of the bottom of the capsule
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)
        if (hit.toi < 0.15) {
            body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 })
        }
    }, [body])

    useEffect(() => {
        const unSubscribeJump = subscribeKeys((state) => state.jump, (jumpPressed) => {
            if (jumpPressed) {
                jump()
            }
        })

        const unSubscribeAny = subscribeKeys(() => start())

        return () => {
            unSubscribeJump();
            unSubscribeAny();
        }
    }, [])

    const reset = () => {
        body.current?.setTranslation({ x: 0, y: 1, z: 0 })
        body.current?.setLinvel({ x: 0, y: 0, z: 0 })
        body.current?.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useEffect(() => {
        const unsubscribeReset = useGame.subscribe(
            state => state.phase,
            phase => {
                if (phase === STATE.ready) {
                    reset()
                }
            }
        )

        return () => {
            unsubscribeReset()
        }
    }, [useGame])

    return (
        <RigidBody
            ref={body}
            position={[0, 1, 0]}
            colliders="ball"
            restitution={0.2}
            friction={0}
            canSleep={false}
            linearDamping={0.5}
            angularDamping={0.5}
        >
            <mesh castShadow >
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>
    )
}

export default Player