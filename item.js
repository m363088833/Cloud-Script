let drawFloaty = {
    // 悬浮实例

    instacne: null,
    thread: null,
    toDraw: [],
    option: {
        statusBarHeight: 0
    },

    // 初始化

    init: function(option) {
        if (!!this.instacne) return;
        
        if (option) {
            this.option.statusBarHeight = option.statusBarHeight || 0
        }
        
        let self = this;
        self.instacne = floaty.rawWindow(
            <frame>
                <canvas id="board"/>
            </frame>
        );
        // console.log(self.instacne)
        ui.post(() => {
            self.instacne.setTouchable(false);
            self.instacne.setSize(-1, -1);
        });

        // 命中框画笔（绿）
        var paintGreen = new Paint();
        paintGreen.setAntiAlias(true); //抗锯齿
        paintGreen.setAlpha(255); //0~255透明度
        paintGreen.setFakeBoldText(true);
        paintGreen.setStrokeWidth(3);
        paintGreen.setStyle(Paint.Style.STROKE);
        paintGreen.setColor(colors.parseColor("#FF00FF00"));

        // 未命中框画笔（红）
        var paintRed = new Paint();
        paintRed.setAntiAlias(true); //抗锯齿
        paintRed.setAlpha(255); //0~255透明度
        paintRed.setFakeBoldText(true);
        paintRed.setStrokeWidth(3);
        paintRed.setStyle(Paint.Style.STROKE);
        paintRed.setColor(colors.parseColor("#FFFF0000"));

        // 点击区域画笔（橙）
        var paintOrange = new Paint();
        paintOrange.setAntiAlias(true); //抗锯齿
        paintOrange.setAlpha(255); //0~255透明度
        paintOrange.setFakeBoldText(true);
        paintOrange.setStrokeWidth(3);
        paintOrange.setStyle(Paint.Style.STROKE);
        paintOrange.setColor(colors.parseColor("#FF963200"));

        self.instacne.board.on("draw", function(canvas) {
            canvas.drawColor(0, android.graphics.PorterDuff.Mode.CLEAR);
            let toDraw = self.toDraw || [];
            // if (toDraw.length) {
            //     console.log(`准备绘制：${JSON.stringify(toDraw)}`);
            // }
            let toMove = 0;
            let now = new Date().getTime();
            for (let item of toDraw) {
                if (now >= item.et) {
                    toMove++
                    continue;
                }
                let color = item.color;
                let region = item.region;
                let paint = null;
                switch (color) {
                    case 'green':
                        paint = paintGreen;
                        break;
                    case 'red':
                        paint = paintRed;
                        break;
                    case 'orange':
                        paint = paintOrange;
                        break;
                }
                if (!paint) return;
                // console.log(`绘制：${JSON.stringify(item)}`);
                //canvas.drawLine.apply(canvas, region.concat(paint));
                 
                canvas.drawRect.apply(canvas, region.concat(paint));
                 
            };
            self.toDraw.splice(0, toMove)
            
        });
        this.thread = threads.start(function() {
            //设置一个空的定时来保持线程的运行状态
            setInterval(function() {}, 1000);
        });
    },

    /**
     * 绘制数组
     * @param {*} arr 
     * @param {*} time 
     */
    draw: function(arr, time) {
        arr.forEach(i => {
            i.region[1] = i.region[1] - this.option.statusBarHeight;
            i.region[3] = i.region[3] - this.option.statusBarHeight;
            i.et = new Date().getTime() + time;
        });
        this.toDraw = this.toDraw.concat(arr);
    },

    // 销毁

    destroy: function() {
        if (this.instacne) {
            this.instacne.close();
            this.instacne = null;
        }
        if (this.thread) {
            this.thread.interrupt();
            this.thread = null;
        }
    }
}


drawFloaty.init({
    // 小米11状态栏高度138px
    statusBarHeight: 138
});

events.on("exit", () => {
   drawFloaty.destroy();
});

//console.show()

//drawFloaty.destroy();
//中心坐标锁定
智能方框锁定目标(1, 627, 337)
//范围锁定
智能方框锁定目标(2, 24, 400, 158,459)
sleep(2000)

function 智能方框锁定目标(md, x1, y1, x2, y2, py) {
    let toDraw = [];
    if (md == 1) {

        if (py == undefined) {
            py = 80;
        }
        toDraw.push({
            region: [x1 - py / 2 + 2, y1 + py + 10, x1 + py - py / 2 + 2, y1 + py + py + 10],
            color: 'green'
        });
        drawFloaty.draw(toDraw, 500)
    } else if (md == 2) {
        if (py == undefined) {
            py = 83;
        }
        toDraw.push({
            region: [x1, y1 + py, x2, y2 + py],
            color: 'green'
        });
        drawFloaty.draw(toDraw, 500)
    }
}
