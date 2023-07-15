/*
fps(frame per sec) 개념을 적용하여 양이 움직이는 것을 구현한다

필요한 변수 (멤버 변수로 저장해놓음)
    - 이미지
        - img  (원하는 프레임 만큼을 붙여놓은 사진)
        - 가로 세로 크기
    - 프레임
        - 내가 갖고있는 애니메이션 프레임 개수, 현재 프레임
        - 초당 몇 개 프레임
        - 1 프레임당 걸리는 시간 (1000/fps) 

로직
    - draw() : 현재 프레임 계산과 animate() 실행을 담당
        - 매 프레임마다 animate에서 시간 정보를 불러와 dt(시간의 변화량)을 구하고
        - 일정 시간이 지나면 다음 프레임으로 넘어감
        - 프레임이 끝에 도달하면 처음 프레임으로 돌아오기 (순환)
    - animate() : 이미지 좌표와 크기 계산해서 출력
*/

export class Sheep 
{
    constructor(img, stageWidth) 
    {
        this.img = img;

        this.totalFrame = 8;
        this.curFrame = 0;

        // 이미지 크기
        this.imgWidth = 360;
        this.imgHeight = 300;

        // 양의 크기 (레티나 디스플레이 고려)
        this.sheepWidth = 180;
        this.sheepHeight = 150;

        this.sheepWidthHalf = this.sheepWidth / 2;
        this.x = stageWidth + this.sheepWidth;
        this.y = 0;
        this.speed = Math.random() * 2 + 1;

        // 초당 프레임 수
        this.fps = 24;
        this.fpsTime = 1000 / this.fps;
    }

    draw(ctx, t, dots) 
    {
        if(!this.time)
            this.time = t;

        // dt
        const now = t - this.time;
        if(now > this.fpsTime) 
        {
            this.time = t;
            this.curFrame += 1;
            if(this.curFrame == this.totalFrame)
                this.curFrame = 0;
        }

        this.animate(ctx, dots);
    }

    animate(ctx, dots) 
    {
        this.x -= this.speed;
        const closest = this.getY(this.x, dots);
        this.y = closest.y;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(closest.rotation);
        ctx.drawImage(
            this.img,
            this.imgWidth * this.curFrame,
            0,
            this.imgWidth,
            this.imgHeight,
            -this.sheepWidthHalf,
            -this.sheepHeight + 20,
            this.sheepWidth,
            this.sheepHeight
        );
        ctx.restore();
    }

    getY(x, dots) 
    {
        for(let i=1; i<dots.length; i++) 
        {
            if(x >= dots[i].x1 && x <= dots[i].x3)
                return this.getY2(x, dots[i]);
        }

        return {y: 0, rotation: 0};
    }

    getY2(x, dot) {
        const total = 200;
        let pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, 0);
        let prevX = pt.x;

        for(let i=1; i<total; i++) 
        {
            const t = i/total;
            pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);
            
            if(x>=prevX && x<=pt.x) 
                return pt;
            
                prevX = pt.x;
        }

        return pt;
    }

    getQuadValue(p0, p1, p2, t) 
    {
        return (1 -t) * (1-t) * p0 + 2 * (1-t) * t * p1 + t * t * p2;
    }

    getPointOnQuad(x1, y1, x2, y2, x3, y3, t) 
    {
        const tx = this.quadTangent(x1, x2, x3, t);
        const ty = this.quadTangent(y1, y2, y3, t);
        const rotation = -Math.atan2(tx, ty) + (90 * Math.PI / 180);
        return {
            x: this.getQuadValue(x1, x2, x3, t),
            y: this.getQuadValue(y1, y2, y3, t),
            rotation: rotation,
        };
    }

    quadTangent(a, b, c, t) 
    {
        return 2*(1-t)*(b-a) + 2*(c-b)*t;
    }
}
