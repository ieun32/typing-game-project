import homeView from '../component/home.js'
import gameView from '../component/game.js'
import Game from '../js/game.js'

class App {
  constructor() {
    // 전역 변수: 초기 화면, 인게임 화면이 공유하는 변수
    this.flag = false;
    this.speed = 0;
    this.accurancy = 0;

    this.initial()
  }
  
  // 초기화 메서드
  initial() {
    // 루트 HTML 객체
    this.$root = document.querySelector('.root')

    // 초기 화면 할당
    this.$root.innerHTML = homeView;

    // 초기 화면 타수, 정확도 할당
    this.$home_speed = document.querySelector('div.home > ul > li > h2#speed')
    this.$home_speed.innerHTML = this.speed;

    this.$home_accurancy = document.querySelector('div.home > ul > li > h2#accurancy')
    this.$home_accurancy.innerHTML = this.accurancy;

    // 이벤트 핸들러: 초기 화면 시작 버튼을 클릭하면 startGame 메서드 호출
    this.$startButton = document.querySelector('.startButton')
    this.$startButton.addEventListener('click', this.startGame.bind(this))
  }

  // 시작 버튼 클릭 시 인게임 화면 할당하고 게임 시작
  startGame() {
    this.$root.innerHTML = gameView;
    const newGame = new Game(this)
  }
}

new App()

