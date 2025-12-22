class Utils {
  logDict: Record<string, boolean> = {};

  logOnce(thing: any) {
    const text = JSON.stringify(thing);
    if (this.logDict[text]) {
      return;
    }
    console.log(text);
    this.logDict[text] = true;
  }

  randomArrayId(arr: any[]): number {
    return Math.floor(Math.random() * arr.length);
  }

  shuffleArray(arr: any[]) {
    const holdArr = [...arr];
    const shuffle: any[] = [];
    while (holdArr.length > 0) {
      let r = this.randomArrayId(arr);
      shuffle.push(arr[r]);
      holdArr.splice(r, 1);
    }
    return shuffle;
  }
}

export const utils = new Utils();
