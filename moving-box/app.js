import {Point} from './point.js';
import {Dialog} from './dialog.js'; 

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        // 캔버스에 그림 그릴 때 캔버스의 컨텍스트를 가져와서 사용해야함
        this.ctx = this.canvas.getContext('2d')
        
        // 디스플레이 해상도의 화소 확인
        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        
        this.mousePos = new Point();
        this.curItem = null;

        this.items = [];
        this.total = 5;
        for(let i = 0; i<this.total; i++) {
            this.items[i] = new Dialog();
        }

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        window.requestAnimationFrame(this.animate.bind(this));

        document.addEventListener('pointerdown', this.onDown.bind(this), false);
        document.addEventListener('pointermove', this.onMove.bind(this), false);
        document.addEventListener('pointerup', this.onUp.bind(this), false);
    }

    resize() {
        // clientWidth : border 제외 padding까지의 사이즈
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = `rgba(0, 0, 0, 0.1)`;

        this.ctx.lineWidth = 2;

        for(let i=0; i<this.items.length; i++) {
            this.items[i].resize(this.stageWidth, this.stageHeight);
        }
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        for(let i=0; i<this.items.length; i++) {
            this.items[i].animate(this.ctx);
        }

        if(this.curItem) {
            this.ctx.fillStyle = `#ff4338`;
            this.ctx.strokeStyle = `#ff4338`;

            // 마우스에 빨간 점
            this.ctx.beginPath();
            this.ctx.arc(this.mousePos.x, this.mousePos.y, 8, 0, Math.PI*2);
            this.ctx.fill();

            // 아이템에 빨간 점 (?)
            this.ctx.beginPath();
            this.ctx.arc(this.curItem.centerPos.x, this.curItem.centerPos.y, 8, 0, Math.PI*2);
            this.ctx.fill();

            // 연결 선
            this.ctx.beginPath();
            this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
            this.ctx.lineTo(this.curItem.centerPos.x, this.curItem.centerPos.y);
            this.ctx.stroke();
        }
    }

    onDown(e) {
        // client x, y : 스크롤바에 상관없이, 사용자에게 보여지는 영역을 기준으로 좌표 표시
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;

        for(let i=this.items.length-1; i>=0; i--) {
            const item = this.items[i].down(this.mousePos.clone());
            if(item) {
                this.curItem = item;
                const index = this.items.indexOf(item);
                this.items.push(this.items.splice(index, 1)[0]);
                break;
            }
        }
    }

    onMove(e) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;

        for(let i=0; i<this.items.length; i++) {
            this.items[i].move(this.mousePos.clone());
        }
    }

    onUp(e) {
        this.curItem = null;

        for(let i=0; i<this.items.length; i++) {
            this.items[i].up();
        }
    }
}

window.onload = () => {
    new App();
};
