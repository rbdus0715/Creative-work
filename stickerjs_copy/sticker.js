(function() 
{
    // 전역 변수
    var _prefixes = ['webkit', 'Moz', 'ms', 'O'];
        _direction = null;
        _aniTrans = 'all 0.6s cubic-bezier(.23,1,.32,1)', // transition 속성
        _setTrans = 'all 0s', // 첫 세팅

    // 새로운 스타일을 이렇게 삽입할 수 있음 (document의 head에 삽입)
    newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
    .shadowL {background: -moz-linear-gradient(right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, right top, left top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowR {background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowB {background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowT {background: -moz-linear-gradient(bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left bottom, left top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}"));
    document.head.appendChild(newStyle);

    /**
     * (1) 웹 브라우저가 어떤 벤더 프리픽스를 지원하는지 체크 
     * (2) 해당 속성에 적절한 벤더 프리픽스를 붙여 반환
     * 
     * @param {*} el element 
     * @param {*} prop css 속성
     * @returns css 속성에 벤더프리픽스를 붙여 반환
     */
    function vendor(el, prop) {
        var s = el.style, pp, i;
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for(i=0; i<_prefixes.length; i++) {
            pp = _prefixes[i]+prop;
            if(s[pp] !== undefined) return pp;
        }
        if(s[prop] !== undefined) return prop;
    }

    function css(el, prop) {
        for(var n in prop)
            el.style[vendor(el, n) || n] = prop[n];
    }

    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div');
        css(el, prop);
        return el;
    }

    /**
     * 
     * @param {*} e 마우스 이벤트
     * @param {*} pos 요소의 위치를 나타내는 객체
     * @param {*} sizeQ 크기를 기준으로 하는 변수
     * @returns 마우스가 어디서 오는지 방향 체크
     */
    function checkDerection(e, pos, sizeQ) {
        var fx = pos.x, fy = pos.y, tx = e.pageX - fx, ty = e.pageY - fy, direction;
        if(tx < sizeQ) direction = 0; // left
        else if(tx  > sizeQ * 3) direction = 1; // right
        else if(ty < sizeQ) direction = 2; // top
        else direction = 3; // bottom
        return direction;
    }

    function checkPos(e, pos, size) {
        var fx = pos.x, fy = pos.y, // 객체의 좌표
            tx = e.pageX - fx, ty = e.pageY - fy, // 마우스와 상대 위치
            value, 
            a = size - tx, b = size - ty, 
            c = tx >> 1, d = ty >> 1, e = a >> 1, f = b >> 1;
        if (_direction == 0) value = {bx:-size, by:0, sx:-1, sy:1, bs:'shadowL', bmx:-size + tx, bmy:0, bsw:tx, bsh:size, bsx:a, bsy:0, cw:size - c, ch:size, cx:c, cy:0, dw:c, dh:size, dx:c - (c >> 1), dy:0}; // left
        else if (_direction == 1) value = {bx:size, by:0, sx:-1, sy:1, bs:'shadowR', bmx:tx, bmy:0, bsw:a, bsh:size, bsx:0, bsy:0, cw:size - e, ch:size, cx:0, cy:0, dw:e, dh:size, dx:size - a + (e >> 1), dy:0}; // right
        else if (_direction == 2) value = {bx:0, by:-size, sx:1, sy:-1, bs:'shadowT', bmx:0, bmy:-size + ty, bsw:size, bsh:ty, bsx:0, bsy:b, cw:size, ch:size - d, cx:0, cy:d, dw:size, dh:d, dx:0, dy:d - (d >> 1)}; // top
        else value = {bx:0, by:size, sx:1, sy:-1, bs:'shadowB', bmx:0, bmy:ty, bsw:size, bsh:b, bsx:0, bsy:0, cw:size, ch:size - f, cx:0, cy:0, dw:size, dh:f, dx:0, dy:size - b + (f >> 1)}; // bottom
        return value;
    }

    /**
     * 마우스가 스티커로 들어갈 때
     * @param {*} e 
     * @param {*} value 
     */
    function onEnter(e, value) {
        var cpos = value.container.getBoundingClientRect(),
            // 스크롤까지 포함한 실제 좌표
            mpos = {x:cpos.left + window.pageXOffset, y:cpos.top + window.pageYOffset};
        // 마우스가 오는 방향 계산    
        _direction = checkDerection(e, mpos, value.sizeQ);
        //
        _savePos = checkPos(e, mpos, value.size);
        _savePos.pos = mpos;
        var bx = _savePos.bx, by = _savePos.by, sx = _savePos.sx, sy = _savePos.sy, bs = _savePos.bs;
        value.backShadow.className = value.depth.className = 'sticker-shadow ' + bs;
        
        css(value.mask, {
            transition: _setTrans,
            width: value.size + 'px',
            height: value.size + 'px',
            transform: 'translate(' + 0 + 'px, ' + 0 + 'px)',
        });
        css(value.move, {
            transition: _setTrans,
            transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
        });
        
    }

    function onLeave(e, value) {

    }

    function onMove(e, value) {

    }

    var sticker = {
        init: function init(dom) {
            if(typeof dom === 'string') {
                var item = document.querySelectorAll(dom), i, total = item.length;
                for(i=0; i<total; i++) init(item[i]);
                return;
            }
        
            var value,
                pos = dom.getBoundingClientRect(),
                size = pos.width,
                sizeQ = size >> 2,
                container = createEl('div', {
                    position: 'relative',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden',
                }),
                mask = createEl('div', {
                    position: 'relative',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden',
                });
                move = createEl('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden',
                });
                front = createEl('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    zIndex: 1,
                });
            
            front.className = 'sticker-img sticker-front';
            backImg.className = 'sticker-img sticker-back';
            backShadow.className = depth.className = 'sticker-shadow';
            dom.appendChild(container);
            container.appendChild(mask);
            mask.appendChild(move);
            move.appendChild(front);
            move.appendChild(depth);
            move.appendChild(back);
            back.appendChild(backImg);
            back.appendChild(backShadow);

            value = {
                container:container,
                size:size, 
                sizeQ:sizeQ, 
                mask:mask, 
                move:move, 
                depth:depth, 
                back:back, 
                backImg:backImg, 
                backShadow:backShadow
            };

            dom.addEventListener('mouseenter', function(e){
                onEnter(e, value);
            }, false);
            dom.addEventListener('mouseleave', function(e) {
                onLeave(e, value);
            });
            dom.addEventListener('mousemove', function(e){
                onMove(e, value);
            });

            return this;
        }
    }
    
    /* commonJS */
    if(typeof exports == 'object') module.exports = sticker;
    /* AMD module */
    else if(typeof define == 'function.amd') define(function(){return sticker});
    /* browser global */
    else this.Sticker = sticker;
})();
