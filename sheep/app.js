import {Hill} from './hill.js';
import { SheepController } from './sheepController.js';

class App 
{
    constructor() {
        //======= 1. 캔버스를 생성하여 body에 추가 =======//
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);


        //======= 2. 애니매이션으로 생성할 객체 =======//
        this.hills = [
            new Hill('#fd6bea', 0.2, 12),
            new Hill('#ff59c2', 0.5, 8),
            new Hill('#ff4674', 1.4, 6)
        ];

        this.SheepController = new SheepController();


        //======= 3. 객체들의 사이즈 정의 =======//
        // (1) 윈도우 크기가 변했을 때 사용하는 resize
        window.addEventListener('resize', this.resize.bind(this), false);
        // (2) 처음 페이지가 로딩되었을 때 기본적으로 설정해야하는 resize
        this.resize()


        //======= 4. 애니메이션 작동 (비동기함수) =======//
        requestAnimationFrame(this.animate.bind(this));
    }

    resize() 
    {
        //======= 1. 캔버스의 크기 =======//
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        // 캔버스의 크기를 2배로 해주어 선명하게 보이게 함
        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;

        // 요소들의 크기가 가로 세로 2배가 되도록 
        // (캔버스도 키웠으니 그 안의 요소도 키움)
        this.ctx.scale(2, 2);


        //======= 2. 객체들의 크기 =======//
        // (1) 언덕 크기 초기화
        for(let i=0; i<this.hills.length; i++) {
            this.hills[i].resize(this.stageWidth, this.stageHeight);
        }
        // (2) 양 크기 초기화
        this.SheepController.resize(this.stageWidth, this.stageHeight);
    }

    animate(t) 
    {
        //======= 1. 캔버스에 매 프레임당 그리고 지우기 =======//
        requestAnimationFrame(this.animate.bind(this));

        // 잔향이 남지 않게 매 프레임바다 지워줌
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        

        //======= 2. 객체들 그리기 =======//    
        let dots;
        for(let i=0; i<this.hills.length; i++) 
            dots = this.hills[i].draw(this.ctx);

        this.SheepController.draw(this.ctx, t, dots); 
    }
}

window.onload = () => {
    new App();
};
