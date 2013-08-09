/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

//グローバル変数
var game = null;

//定数
var BAR_SPEED = 5;

window.onload = function() {
	game = new Game(200, 250);
	game.preload('ball.png', 'bar.png', 'block.png', 'lock2.wav');
	game.fps = 60;
	game.score = 0;
	game.onload = function() {
		var bar = new Bar(100, 200);
		var ball = new Ball(100, 190);
		var blocks = [];
		//ブロックを配置する
		for (var i=0; i < 8; i++) {
			for (var j=0; j < 4; j++) {
				blocks[i*4 + j] = new Block(j*40+20, i*15+20);
			}
		}
		var scoreLabel = new ScoreLabel(2, 2);
		game.rootScene.backgroundColor = '#eee';

		this.addEventListener('enterframe', function() {
			//ボールとバーの接触判定
			if (ball.intersect(bar)) {
				ball.y = bar.y - ball.height;
				ball.dy *= -1;
				//ボールとバーの中心座標の差からx移動量を決める
				ball.dx = ((ball.x+ball.width/2 - (bar.x+bar.width/2)) / 25) * 3;
				bar.se.play();
			}
			//ボールとブロックの接触判定
			for (var i=0; i < 32; i++) {
				if (blocks[i].flag == 1) continue;
				if (blocks[i].intersect(ball)) {
					//ボールの移動量が4以上にならないのが前提
					if (ball.y+ball.height < blocks[i].y+4) {
						ball.dy = (ball.dy < 0 ? ball.dy*-1 : ball.dy);
					} else if (blocks[i].y+blocks[i].height-4 < ball.y) {
						ball.dy = (ball.dy > 0 ? ball.dy*-1 : ball.dy);
					} else if (ball.x+ball.width < blocks[i].x+4) {
						ball.dx = (ball.dx > 0 ? ball.dx*-1 : ball.dx);
					} else if (blocks[i].x+blocks[i].width-4 < ball.x) {
						ball.dx = (ball.dx < 0 ? ball.dx*-1 : ball.dx);
					}
					blocks[i].flag = 1;
					blocks[i].se.play();
					game.score += blocks[i].score;
					game.rootScene.removeChild(blocks[i]);
				}
			}
			//クリア判定
			for (var i=0; i < 32; i++) {
				if (blocks[i].flag == 0) break;
				if (i == 31) game.end();
			}
		});
	}
	game.start();
};

var Bar = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this, 40, 10);
		this.image = game.assets['bar.png'];
		this.se = game.assets['lock2.wav'].clone();
		this.x = x - this.width/2;
		this.y = y;
		this.addEventListener('enterframe', function() {
			if (game.input.left) this.x -= BAR_SPEED;
			if (game.input.right) this.x += BAR_SPEED;
			if (game.width - this.width < this.x) this.x = game.width - this.width;
			if (this.x < 0) this.x = 0;
		});
        game.rootScene.addChild(this);
	},
});

var Ball = Class.create(Sprite, {
	initialize: function (x, y)  {
		Sprite.call(this, 10, 10);
		this.image = game.assets['ball.png'];
		this.x = x - this.width/2;
		this.y = y;
		this.dx = 2;
		this.dy = -3;
		this.angle = 40;
		this.addEventListener('enterframe', function() {
			this.x += this.dx;
			this.y -= this.dy;
			if (this.x < 0) {
				this.x = 0;
				this.dx *= -1;
			}
			if (this.x > game.width - this.width) {
				this.x = game.width - this.width;
				this.dx *= -1;
			}
			if (this.y < 0) {
				this.y = 0;
				this.dy *= -1;
			}
			if (this.y > game.height) {
				game.end();
			}
		});
		game.rootScene.addChild(this);
	},
});

var Block = Class.create(Sprite, {
	initialize: function (x, y) {
		Sprite.call(this, 40, 15);
		this.image = game.assets['block.png'];
		this.se = game.assets['lock2.wav'].clone();
		this.x = x;
		this.y = y;
		this.flag = 0;
		this.score = 100;
		game.rootScene.addChild(this);
	},
});

var ScoreLabel = Class.create(Label, {
	initialize: function (x, y) {
		Label.call(this);
		this.x = x;
		this.y = y;
		this.color = "#393939";
		this.font = "12px 'Arial'";
		this.text = "SCORE:" + game.score;
		this.addEventListener('enterframe', function() {
			this.text = "SCORE:" + game.score;
		});
		game.rootScene.addChild(this);
	},
});
