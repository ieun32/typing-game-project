const game = `
<div class="game">
    <div class="word-counter">
      <span>(</span>
      <span class="current"></span>
      <span>/</span>
      <span class="total"></span>
      <span>)</span>
    </div>

    <div class="word-viewer">
      <ul class="word"></ul>
    </div>

    <ul class="word-info">
      <li>
        <span>타수</span>
        <span class="speed"></span>
      </li>
      <li>
        <span>정확도</span>
        <span class="accurancy"></span>
      </li>
    </ul>

    <input type="text" placeholder="단어를 입력하세요" autofocus/>
  </div>
  `

  export default game;