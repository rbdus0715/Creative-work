import { Wave } from "./wave";

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas); 
        this.ctx = this.canvas.getContext('2d');

        this.wave = new Wave();

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        // 윈도우 창 크기가 변할 때마다 resize 호출
        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        window.requestAnimationFrame(this.animate.bind(this));
    }

    // 캔버스 사이즈 지정
    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.wave.resize();
    }

    // 그림 그리는 함수
    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        this.wave.draw();
    }
}

window.onload = () => {
    new App();
}
