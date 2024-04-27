/**
 * Caculate speed and acuurancy
 */
export default class Caculate {
  constructor() {

  }

  /**
   * @description caculate character per min
   * @param ST: Start time
   * @param TT: Total characters user typed
   * @returns number
   */
  speed({ ST, TT }) {
    const totalTyped = TT;
    const startTime = ST;
    const currentTime = new Date().getTime()

    const totalTime = (currentTime - startTime) / 1000 //초 단위로 변경
    const cpm = Math.round((totalTyped / totalTime) * 60)
    return cpm
  }

  /**
   * @description caculate accurancy
   * @param TC: Total cumulative character count
   * @param CC: Total cumulative correct character count
   * @returns number
   */
  accurancy({ TC, CC }) {
    const totalCharacterCount = TC;
    const totalCorrectCount = CC;
    console.log(totalCharacterCount, totalCorrectCount)
    const accurancy = Math.floor((totalCorrectCount / totalCharacterCount) * 100)
    return accurancy
  }
}