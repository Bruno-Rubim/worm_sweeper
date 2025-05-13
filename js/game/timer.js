import { getNow } from "../time_manager.js"

export class Timer {
    constructor({length=100, whenEnd=()=>{}, loop=false}){
        this.length = length
        this.whenEnd = whenEnd
        this.loop = loop
        this.starterTime = 0
        this.endTime = 0
        this.stopped = false
        this.stoppedTime = 0
        this.ended = false
    }
    get miliseconds(){
        if (this.stopped){
            return this.stoppedTime
        }
        if (this.starterTime != 0){
            let seconds = this.endTime - getNow()
            if (seconds <= 0 && !this.ended){
                this.whenEnd()
                if (this.loop){
                    this.endTime += this.length
                } else {
                    this.ended = true
                }
            }
            return seconds
        }
        return this.length
    }
    
    start(){
        this.starterTime = getNow()
        this.endTime = this.starterTime + (this.length)
        this.ended = false
    }

    addSeconds(seconds){
        this.endTime += seconds*1000
    }
    removeSeconds(seconds){
        this.endTime -= seconds*1000
    }
    stop(){
        this.stopped = true
        this.stoppedTime = this.miliseconds
    }
}