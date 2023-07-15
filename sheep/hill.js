export class Hill {
    constructor(color, speed, total) 
    {
        this.color = color;
        this.speed = speed;
        this.total = total; // 언덕의 포인트들의 갯수
    }

    // 객체의 원하는 크기와 위치를 설정 
    // >> 필요한 위치값 혹은 크기값은 무엇일까 고민하기
    resize(stageWidth, stageHeight) 
    {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.points = [];
        this.gap = Math.ceil(this.stageWidth / (this.total - 2)); // 간격을 조금 더 넓게 정의
        
        for(let i=0; i<this.total; i++) 
        {
            this.points[i] = {
                x: i * this.gap,
                y: this.getY()
            };
        }
    }

    // 객체를 그리는 함수
    // >> 애니메이션은 각각 프레임마다의 사진을 정의해야함
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();

        let cur = this.points[0];
        let prev = cur;

        let dots = [];
        cur.x += this.speed;

        // 계속해서 앞에 언덕을 추가해주고, 뒤에 언덕은 삭제해줌
        if(cur.x > -this.gap) {
            this.points.unshift({
                x: -(this.gap * 2),
                y: this.getY()
            });
        } 
        else if(cur.x > this.stageWidth + this.gap) 
            this.points.splice(-1);
        

        ctx.moveTo(cur.x, cur.y);

        let prevCx = cur.x;
        let prevCy = cur.y;
        for(let i=1; i<this.points.length; i++) 
        {
            cur = this.points[i];
            cur.x += this.speed;    
            const cx = (prev.x + cur.x) / 2;
            const cy = (prev.y + cur.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
            dots.push({
                x1: prevCx,
                y1: prevCy,
                x2: prev.x,
                y2: prev.y,
                x3: cx,
                y3: cy,
            });

            prev = cur;
            prevCx = cx;
            prevCy = cy;
        }

        ctx.lineTo(prev.x, prev.y);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight);
        ctx.fill();

        return dots;
    }

    // 언덕의 y값을 랜덤으로 주는 함수
    getY() 
    {
        const min = this.stageHeight / 8;
        const max = this.stageHeight - min;
        return min + Math.random() * max;
    }
}
