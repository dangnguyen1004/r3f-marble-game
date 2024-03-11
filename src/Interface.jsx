import { useKeyboardControls } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import { STATE, useGame } from './store/useGame'
import { addEffect } from '@react-three/fiber'

function Interface() {
    const forward = useKeyboardControls(state => state.forward)
    const backward = useKeyboardControls(state => state.backward)
    const leftward = useKeyboardControls(state => state.leftward)
    const rightward = useKeyboardControls(state => state.rightward)
    const jump = useKeyboardControls(state => state.jump)

    const [restart, phase] = useGame(state => [state.restart, state.phase])

    const time = useRef(null)

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const gameState = useGame.getState()

            let elapsedTime = 0;

            if (gameState.phase === STATE.ended) {
                elapsedTime = gameState.endTime - gameState.startTime
            } else if (gameState.phase === STATE.playing) {
                elapsedTime = Date.now() - gameState.startTime
            }

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            if (time.current) {
                time.current.textContent = elapsedTime
            }
        })

        return () => {
            unsubscribeEffect()
        }
    }, [])

    return (
        <div className='interface'>
            <div ref={time} className="time">
                0.00
            </div>
            {phase === STATE.ended && <div className="restart" onClick={restart} >Restart</div>}

            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward ? 'active' : ''}`}></div>
                    <div className={`key ${backward ? 'active' : ''}`}></div>
                    <div className={`key ${rightward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${jump ? 'active' : ''} large`}></div>
                </div>
            </div>
        </div>
    )
}

export default Interface