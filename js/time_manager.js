export const startTime = Date.now()

export function getNow(){
    return Date.now() - startTime;
}

export function timedCondition(doThis, miliseconds, condition){
    setTimeout(() => {
        if(condition){
            doThis()
        }
    }, miliseconds)
}