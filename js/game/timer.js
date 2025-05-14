import { getNow } from "../time_manager.js"

export class Timer {
    constructor({length=100, whenEnd=()=>{}, loop=false}){
        this.length = length
        this.whenEnd = whenEnd
        this.loop = loop
        this.starterTime = 0
        this.endTime = 0
        this.paused = false
        this.stoppedTime = 0
        this.ended = false
    }
    get miliseconds(){
        if (this.paused){
            return this.stoppedTime
        }
        if (this.starterTime != 0){
            let seconds = this.endTime - getNow()
            if (seconds <= 0 && !this.ended){
                this.whenEnd()
                this.stoppedTime = 0
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
    get seconds(){
        return Math.ceil(this.miliseconds/1000)
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
    pause(){
        if (this.stoppedTime != 0){
            this.stoppedTime = this.miliseconds
        }
        this.paused = true
    }
    continue(){
        this.paused = false
        this.length = this.stoppedTime
        this.start()
    }
}