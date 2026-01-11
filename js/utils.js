const logDict = {};
class Utils {
    randomInt(max, min = 0) {
        const r = Math.floor(Math.random() * (max - min)) + min;
        return r;
    }
    logOnce(thing) {
        const text = JSON.stringify(thing);
        if (logDict[text]) {
            return;
        }
        console.log(text);
        logDict[text] = true;
    }
    conLog(con, thing) {
        if (con) {
            console.log(thing);
        }
    }
    randomArrayId(arr) {
        return Math.floor(Math.random() * arr.length);
    }
    shuffleArray(arr) {
        const holdArr = [...arr];
        const shuffle = [];
        while (holdArr.length > 0) {
            let r = this.randomArrayId(holdArr);
            shuffle.push(holdArr[r]);
            holdArr.splice(r, 1);
        }
        return shuffle;
    }
    lastOfArray(arr) {
        return arr[arr.length - 1];
    }
}
export const utils = new Utils();
