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

        // 메모장 리스트
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


    // 윈도우 창 크기 변할 때마다 실행되는 함수
    resize() {
        // clientWidth : border 제외 padding까지의 사이즈
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        // 그림자 & 테두리라인 설정
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 3; // 그림자가 3 만큼 아래부터 있다
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = `rgba(0, 0, 0, 0.1)`;
        this.ctx.lineWidth = 2;

        // 각각의 포스트잇에 대해서도 사이즈 계산
        for(let i=0; i<this.items.length; i++) {
            this.items[i].resize(this.stageWidth, this.stageHeight);
        }
    }

    animate() {
        // 비동기함수 > 호출 결과를 기다리지 않음
        window.requestAnimationFrame(this.animate.bind(this));

        // 사각형 영역을 지우는 용도 : 포스트잇의 전 상태를 지움으로써 계속 쌓이지 않게 함
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        // 포스트잇의 현 상태를 그림
        for(let i=0; i<this.items.length; i++) {
            this.items[i].animate(this.ctx);
        }

        // 마우스가 클릭되었을 때
        if(this.curItem) {
            this.ctx.fillStyle = `#ff4338`;
            this.ctx.strokeStyle = `#ff4338`;

            // 마우스에 빨간 점
            this.ctx.beginPath();
            this.ctx.arc(this.mousePos.x, this.mousePos.y, 8, 0, Math.PI*2);
            this.ctx.fill();

            // 아이템에 빨간 점
            this.ctx.beginPath();
            this.ctx.arc(this.curItem.centerPos.x, this.curItem.centerPos.y, 8, 0, Math.PI*2); // arc(x,y,반지름,시작 각도 , 끝 각도 , 방향 설정)
            this.ctx.fill();

            // 연결 선
            this.ctx.beginPath();
            this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
            this.ctx.lineTo(this.curItem.centerPos.x, this.curItem.centerPos.y);
            this.ctx.stroke(); // 직선
        }
    }

    onDown(e) {
        // 현재 마우스의 좌표
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;

        for(let i=this.items.length-1; i>=0; i--) {
            const item = this.items[i].down(this.mousePos.clone());
            if(item) {
                this.curItem = item;
                const index = this.items.indexOf(item);
                // 클릭한 요소를 배열에서 삭제해서 맨 뒤에 다시 삽입
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
