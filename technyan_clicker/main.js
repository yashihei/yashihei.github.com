/*
 * TechnyanClicker
 */
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 480;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var ASSETS = {
    "background" : "dat/background.png",
    "tekunyan" : "dat/tekunyan.png",
    "tekunyan_little" : "dat/tekunyan_little.png",
    "shine" : "dat/shine.png",
};

tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    // app.enableStats();
    app.fps = 30;

    var loading = tm.app.LoadingScene({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        assets: ASSETS,
        nextScene: MainScene,
    });
    app.replaceScene(loading);

    app.run();
});

tm.define("MainScene", {
    superClass : tm.app.Scene,
    init : function () {
        this.superInit();

        var background = tm.app.Sprite("background", 640, 480);
        background.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.addChild(background);

        var tekuMinis = [];//プールで
        var index = 0;
        var tekuMiniGroup = tm.app.CanvasElement();
        this.addChild(tekuMiniGroup);

        var shine = tm.app.Sprite("shine", 500, 500);
        shine.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        shine.alpha = 0.25;
        shine.update = function () {
            shine.rotation += 1;
        };
        this.addChild(shine);

        var teku = Teku();
        this.addChild(teku);

        var bar = tm.app.Shape(SCREEN_WIDTH, 50);
        bar.setPosition(SCREEN_CENTER_X, teku.y - 197);
        bar.canvas.clearColor("hsla(0, 0%, 20%, 0.7)");
        this.addChild(bar);

        var num = 0;
        this.fromJSON({
            children: [
                {
                    type: "Label", name: "scoreLabel",
                    text: "0technyans",
                    x: SCREEN_CENTER_X,
                    y: teku.y - 200,
                    fillStyle: "#eee",
                    fontSize: 45,
                    align: "center",
                    baseline: "middle",
                    fontFamily: "'Kavoon', 'Consolas'",
                },
            ]
        });

        var self = this;
        var aryNum = 0;
        document.title = num + " technyans - TechnyanClicker";
        
        teku.onpointingstart = function() {
            num++;
            // num += tm.util.Random.randint(1, 100000);
            // console.log(num);
            self.scoreLabel.text = num;
            self.scoreLabel.text += " technyans";
            document.title = num + " technyans - TechnyanClicker";

            //TODO:+1とかのあれ

            teku.setSize(this.width / 1.1, this.height / 1.1);

            if (tekuMinis[index]) {
                tekuMiniGroup.removeChild(tekuMinis[index]);//これしないと描画が更新され続け
            }
            tekuMinis[index] = TekuMini().addChildTo(tekuMiniGroup);
            tekuMinis[index].setPosition(tm.util.Random.randint(0, SCREEN_WIDTH), 0);
            tekuMinis[index].speed = tm.util.Random.randint(3, 8);
            index++;
            if (index > 200) index = 0;
            // for (var tete in tekuMinis) {
            //     aryNum++;
            // }
            // console.log(aryNum);
            // aryNum = 0;
        };
    },
});

tm.define("Teku", {
    superClass : tm.app.Sprite,
    init : function () {
        this.superInit("tekunyan", 300, 300);
        this.setInteractive(true);
        this.setBoundingType("circle");
        this.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
    },
    // onpointingstart : function () {
    //     this.setSize(this.width / 1.1, this.height / 1.1);
    // },
    onpointingend : function () {
        this.setSize(this.width * 1.1, this.height * 1.1);
    },
    onpointingover : function () {
        this.setSize(this.width * 1.1, this.height * 1.1);
    },
    onpointingout : function () {
        this.setSize(this.width / 1.1, this.height / 1.1);
    },
});

tm.define("TekuMini", {
    superClass : tm.app.Sprite,
    speed : 0,
    cnt : 0,
    init : function () {
        this.superInit("tekunyan_little", 70, 67);
        this.setInteractive(true);
    },
    update : function() {
        this.y += this.speed;
        if (this.y > SCREEN_HEIGHT) this.speed = 0;
    },
});
