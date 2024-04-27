import words from './words.js'
import Caculate from './caculate.js'

export default class Game {
  constructor(proto) {
    this.proto = proto;
    this.cacFlag = true; // 타수, 정확도 계산의 초기화를 위한 플래그: true면 초기화, false면 초기화 X
    this.interval; // 타수, 정확도 계산의 시작, 중지를 위한 interval ID

    this.words = [...words].map((w) => w.split('')) // 문자 단위로 이차원 배열 생성
    this.wordIdx = 0;
    this.curWord = words[this.wordIdx] // 현재 단어

    this.startTime;
    this.totalTyped = 0;
    this.totalCharacter = 0;
    this.totalCorrect = 0;
    this.caculate = new Caculate()

    this.speed = 0;
    this.accurancy = 0;

    this.speedArr = [];
    this.accurancyArr = [];

    this.$input = document.querySelector('div.game > input[type=text]')
    this.$word = document.querySelector('div.game > div.word-viewer > ul.word')
    this.$current = document.querySelector('div.game > div.word-counter > span.current')
    this.$total = document.querySelector('div.game > div.word-counter > span.total')
    this.$speed = document.querySelector('div.game > ul.word-info > li > span.speed')
    this.$accurancy = document.querySelector('div.game > ul.word-info > li > span.accurancy')

    this.initial()
  }

  /**
   * @description 게임 초기화 메서드
   */
  initial() {
    const inactiveLI = (c, i) => `<li class="inactive" key="${i}">${c}</li>`

    // 비활성화된 첫번째 단어 할당
    this.$word.innerHTML = [...this.curWord].reduce((per, cur, i) => per + inactiveLI(cur, i), "")

    // 각종 변수 할당
    this.$current.innerHTML = 1;
    this.$total.innerHTML = words.length
    this.$speed.innerHTML = 0;
    this.$accurancy.innerHTML = 0;

    // 이벤트 핸들러 등록
    this.$input.addEventListener('input', (e) => {
      this.inputHandler(e)
    })

    this.$input.addEventListener('keydown', this.keydownHandler.bind(this))
  }

  /**
   * @description 인풋 이벤트 핸들러,
   * @kind 계산 함수 호출
   */
  inputHandler(e) {
    // 하이라이팅 처리
    this.highlighting()
    // Mutex: 재시작할 경우 필요한 변수 초기화 후 Flag 값 false로 변경
    if (this.cacFlag) {
      this.startTime = new Date().getTime() // 재시작하는 시점 시간 할당
      this.totalCharacter = this.curWord.length;
      this.interval = setInterval(this.caculateAndSet.bind(this), 100) //0.1초마다 계산하고 화면 할당
      this.cacFlag = false;
    }
  }

  /**
   * @description 키 이벤트 핸들러
   * @kind 백스페이스, 엔터 등 처리
   */
  keydownHandler(e) {
    console.log(e.key)
    switch (e.key) {
      // 백스페이스: 패널티, 공백이 되었을 경우 계산 멈추고 초기화
      case 'Backspace':
        this.totalTyped--;
        const length = this.$input.value.length
        console.log(length)
        if (length <= 1) {
          this.clearCaculate()
        }
        break;

      // 엔터: 계산 멈추고 초기화, 다음 단어로 변경
      case 'Enter':
        this.$input.value = '';
        this.keyEnterHandler();
        break;

      default:
        this.totalTyped++;
        break;
    }
  }

  /**
   * @description 타수, 정확도 계산 후 화면 할당
   */
  caculateAndSet() {
    console.log('계산중', this.caculate)
    const cpm = this.caculate.speed({ ST: this.startTime, TT: this.totalTyped })
    const accurancy = this.caculate.accurancy({ TC: this.totalCharacter, CC: this.totalCorrect })
    this.speed = cpm;
    this.accurancy = accurancy;
    this.$speed.innerHTML = cpm;
    this.$accurancy.innerHTML = accurancy;
  }

  /**
   * @description 계산을 중지하고 싶을 때 호출
   * @kind 계산과 관련된 변수 및 화면 값 초기화
   */
  clearCaculate() {
    clearInterval(this.interval)
    this.totalTyped = 0;
    this.speed = 0;
    this.accurancy = 0;
    this.$speed.innerHTML = 0;
    this.$accurancy.innerHTML = 0;
    this.cacFlag = true;
  }

  /**
   * @description match되는 문자 하이라이팅
   * @kind li 태그 classname 변경
   */
  highlighting() {
    const correctIdx = this.isMatched()
    const lis = document.querySelectorAll(`div.game > div.word-viewer > ul.word > li`);

    correctIdx.map((bool, i) => {
      const target = lis[i]

      if (bool) {
        target.classList.replace('inactive', 'active')
      } else {
        target.classList.replace('active', 'inactive')
      }
    })
  }

  /**
   * 현재 단어와 사용자 입력 문자 일치 여부 확인
   * @returns Array
   */
  isMatched() {
    const userInput = this.$input.value;
    const correctIdx = Array.from({ length: this.curWord.length }, () => false);
    [...this.curWord].map((w, i) => {
      if (w === userInput[i]) {
        correctIdx[i] = true;
      }
    })

    this.totalCorrect = correctIdx.filter((i) => i).length
    return correctIdx
  }

  /**
   * Enter 누른 경우 타수와 정확도 정보 업데이트, 다음 단어로 이동
   * 만약 다음 단어가 없다면 종료 메서드 호출
   */
  keyEnterHandler() {
    this.totalCharacter += this.curWord.length // 단계 누적 문자수 할당
    this.speedArr.push(this.speed)
    this.accurancyArr.push(this.accurancy)

    this.clearCaculate()
    if (this.words[this.wordIdx + 1] === undefined) {
      const avgSpeed = Math.floor(this.speedArr.reduce((per, cur) => per + cur) / this.speedArr.length)
      console.log(this.accurancyArr)
      const FinalAccurancy = Math.floor(this.accurancyArr.reduce((per, cur) => per + cur) / this.accurancyArr.length)
      this.proto.speed = avgSpeed;
      this.proto.accurancy = FinalAccurancy;

      this.proto.initial();
    } else {
      this.wordIdx++;
      this.curWord = words[this.wordIdx]
      const inactiveLI = (c, i) => `<li class="inactive" key="${i}">${c}</li>`

      // 비활성화된 첫번째 단어 할당
      this.$word.innerHTML = [...this.curWord].reduce((per, cur, i) => per + inactiveLI(cur, i), "")

      // 각종 변수 할당
      this.$current.innerHTML = this.wordIdx;
      this.$speed.innerHTML = 0;
      this.$accurancy.innerHTML = 0;
    }
  }

}