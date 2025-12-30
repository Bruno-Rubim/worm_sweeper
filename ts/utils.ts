const logDict: Record<string, boolean> = {};

class Utils {
  logOnce(thing: any) {
    const text = JSON.stringify(thing);
    if (logDict[text]) {
      return;
    }
    console.log(text);
    logDict[text] = true;
  }

  randomArrayId(arr: any[]): number {
    return Math.floor(Math.random() * arr.length);
  }

  shuffleArray(arr: any[]) {
    const holdArr = [...arr];
    const shuffle: any[] = [];
    while (holdArr.length > 0) {
      let r = this.randomArrayId(holdArr);
      shuffle.push(holdArr[r]);
      holdArr.splice(r, 1);
    }
    return shuffle;
  }

  lastOfArray(arr: any[]) {
    return arr[arr.length - 1];
  }
}

export const utils = new Utils();
