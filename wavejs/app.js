import { WaveGroup } from './wavegroup.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.WaveGroup = new WaveGroup();

    // 윈도우 창 크기가 변할 때마다 resize 호출
    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  // 캔버스 사이즈 지정
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.WaveGroup.resize(this.stageWidth, this.stageHeight);
  }

  // 그림 그리는 함수
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.WaveGroup.draw(this.ctx);
  }
}

window.onload = () => {
  new App();
};
