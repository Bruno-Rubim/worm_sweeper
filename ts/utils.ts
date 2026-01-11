const logDict: Record<string, boolean> = {};

class Utils {
  /**
   * Returns a random integer between a given minimum and maximum, exclusive
   * @param max
   * @param min
   * @returns
   */
  randomInt(max: number, min: number = 0) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    return r;
  }

  /**
   * Check if the string version of a given object has been saved to its log dictionary,
   * if not logs it on console and saves to dictionary
   * @param thing
   * @returns
   */
  logOnce(thing: any) {
    const text = JSON.stringify(thing);
    if (logDict[text]) {
      return;
    }
    console.log(text);
    logDict[text] = true;
  }

  /**
   * Logs something if a given condition is met
   * @param con
   * @param thing
   */
  conLog(con: boolean, thing: any) {
    if (con) {
      console.log(thing);
    }
  }

  /**
   * Gets a random id from any array
   * @param arr
   * @returns
   */
  randomArrayId(arr: any[]): number {
    return Math.floor(Math.random() * arr.length);
  }

  /**
   * Returns a shuffled version of an array
   * @param arr
   * @returns
   */
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

  /**
   * Returns the value at the last position of an array
   * @param arr
   * @returns
   */
  lastOfArray(arr: any[]) {
    return arr[arr.length - 1];
  }
}

// Object used for useful time and code saving functions
export const utils = new Utils();
