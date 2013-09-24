/*
 * TechnyanClicker
 */
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 480;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var ASSETS = {
    "background" : "background.png",
    "tekunyan" : "tekunyan.png",
    "tekunyan_little" : "tekunyan_little.png",
};

tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    // app.enableStats();

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

        var tekuMiniGroup = tm.app.CanvasElement();
        this.addChild(tekuMiniGroup);

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
                    fontSize: 50,
                    align: "center",
                    baseline: "middle",
                },
            ]
        });

        var self = this;
        teku.onpointingstart = function() {
            num++;
            console.log(num);
            self.scoreLabel.text = num;
            self.scoreLabel.text += "technyans";
            document.title = num + " technyans - TechnyanClicker";

            teku.setSize(this.width / 1.1, this.height / 1.1);//ここに書きたくはない

            var tekuMini = TekuMini().addChildTo(tekuMiniGroup);//addChildTo:parentに自分を子どもとして追加
            tekuMini.setPosition(tm.util.Random.randint(0, SCREEN_WIDTH), 0);
            tekuMini.speed = tm.util.Random.randint(2, 5);
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
        if (this.y > SCREEN_HEIGHT) this.isUpdate = false;
    },
});
