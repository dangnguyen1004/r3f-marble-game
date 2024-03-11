import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const STATE = {
    ready: 'ready',
    playing: 'playing',
    ended: 'ended',
}

export const useGame = create(subscribeWithSelector((set, get) => ({
    numOfTraps: 10,
    blocksSeed: 0,
    phase: STATE.ready,
    startTime: 0,
    endTime: 0,
    start: () => {
        if (get().phase === STATE.ready)
            set({ phase: STATE.playing, startTime: Date.now(), endTime: 0 })
    },
    restart: () => {
        if (get().phase === STATE.playing || get().phase === STATE.ended)
            set({ phase: STATE.ready, startTime: 0, endTime: 0, blocksSeed: Math.random() })
    },
    end: () => {
        if (get().phase === STATE.playing)
            set({ phase: STATE.ended, endTime: Date.now() })
    },
})))