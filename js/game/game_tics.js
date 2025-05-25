import { getNow } from "../time_manager.js"

const ticPerSec = 24
const ticInterval = 1000 / ticPerSec
let previousTicTime = 0
let ticCoutner = 0

export function gameTic(){

}

export function checkTic(){
    if (getNow() - previousTicTime > ticInterval){
        previousTicTime += ticInterval
        gameTic()
        ticCoutner++
    }
}