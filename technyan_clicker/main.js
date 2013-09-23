/*
 * TechnyanClicker
 */
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 480;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var ASSETS = {
    "tekunyan" : "tekunyan.png",
    "tekunyan_little" : "tekunyan_little.png",
    "background" : "background.png"
};

tm.main(function() {
    // アプリケーション作成
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT); // リサイズ
    app.fitWindow();    // 自動フィット
    // app.enableStats();

    var scene = app.currentScene;
    tm.asset.AssetManager.load(ASSETS);

    var background = tm.app.Sprite("background");
    background.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
    scene.addChild(background);

    var tekuMiniGroup = tm.app.CanvasElement();
    scene.addChild(tekuMiniGroup);

    var teku = Teku();
    scene.addChild(teku);

    var bar = tm.app.Shape(SCREEN_WIDTH, 50);
    bar.setPosition(SCREEN_CENTER_X, teku.y - 197);
    bar.canvas.clearColor("hsla(0, 0%, 20%, 0.7)");
    scene.addChild(bar);

    var num = 0;
    scene.fromJSON({
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

    teku.onpointingstart = function() {
        num++;
        console.log(num);
        scene.scoreLabel.text = num;
        scene.scoreLabel.text += "technyans";
        document.title = num + " technyans - TechnyanClicker";

        var tekuMini = TekuMini().addChildTo(tekuMiniGroup);//addChildTo:parentに自分を子どもとして追加
        tekuMini.setPosition(tm.util.Random.randint(0, SCREEN_WIDTH), 0);
        tekuMini.speed = tm.util.Random.randint(2, 5);
    };

    scene.update = function () {
    };

    app.run();//実行
});

tm.define("Teku", {
    superClass : tm.app.Sprite,
    init : function () {
        this.superInit("tekunyan", 300, 300);
        this.setInteractive(true);
        this.setBoundingType("circle");
        this.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
    },
    onmousedown : function () {
        this.setSize(this.width / 1.1, this.height / 1.1);
    },
    onmouseup : function () {
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
    init : function () {
        this.superInit("tekunyan_little");
        this.setInteractive(true);
        this.x = 0;
        this.y = 0;
    },
    update : function() {
        this.y += this.speed;
        if (this.y > SCREEN_HEIGHT) this.isUpdate = false;
    },
});
