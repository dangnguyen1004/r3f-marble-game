import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Physics } from '@react-three/rapier'
import { BlockAxe, BlockLimbo, BlockSpinner, Level } from './Level.jsx'
import Player from './Player.jsx'
import { useGame } from './store/useGame.jsx'

export default function Experience() {
    const numOfTraps = useGame(state => state.numOfTraps)
    const blocksSeed = useGame(state => state.blocksSeed)

    return <>

        {/* <OrbitControls makeDefault /> */}

        <color args={['#bdedfc']} attach="background" />


        <Physics debug>
            <Lights />

            <Level numOfTraps={numOfTraps} type={[BlockSpinner, BlockLimbo, BlockAxe]} seed={blocksSeed} />

            <Player />
        </Physics>
    </>
}