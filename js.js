"use strict";
const RECT_WIDTH = 60;
const RECT_HEIGHT = 60;

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");



let dx = RECT_WIDTH;
let dy = 0;
let da = 90;

let count = 0;

let deg;
let drawX = 0;
let drawY = 10;
let time = 150;
let interval;
let foodX = 330;
let foodY = 450;
let doStep = false;
let score = 0;
let game_ON = true;



let food = {
	img: new Image(),
	x: 300,
	y: 300,
	// width: RECT_WIDTH,
	// height: RECT_HEIGHT,
	init: function () {
		this.img.src = "food.svg";

		// this.randomazer();
		// console.log(this.x);
		// console.log(this.y);
		this.randomazer();
		this.img.onload = function () {
			ctx.drawImage(this.img, this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
			// ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}.bind(this);
	},
	draw: function () {
		ctx.drawImage(this.img, this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
		// ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	},
	clear: function () {
		ctx.clearRect(this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
		// ctx.clearRect(this.x, this.y, this.width, this.height);
	},
	randomazer: function () {
		let randomY = Math.floor(Math.random() * (10));
		let randomX = Math.floor(Math.random() * (15));
		this.x = randomX * 60;
		this.y = randomY * 60;
	}


}
let snake = {
	tail: new Image(),
	body: new Image(),
	bodyModifyRight: new Image(),
	bodyModifyLeft: new Image(),
	head: new Image(),
	size: 5,
	// width: 60,
	// height: 60,
	x: [],
	y: [],
	angles: [],
	init: function () {
		this.head.src = "head.svg";
		this.body.src = "body.svg";
		this.tail.src = "tail.svg";
		this.bodyModifyRight.src = "bodyModifyRight.svg";
		this.bodyModifyLeft.src = "bodyModifyLeft.svg";
		for (let i = 0; i < this.size; i++) {
			this.x.push(540 - i * RECT_WIDTH);
			this.y.push(300);
			this.angles.push(90);
		}
		/*
				this.head.onload = function () {
					// ctx.drawImage(this.head, 120, 0, rect, this.height);
					// ctx.drawImage(this.head, 120, 0, this.width, this.height);
				}.bind(this);
				this.body.onload = function () {
					// ctx.drawImage(this.body, 60, 0, this.width, this.height);
				}.bind(this);
				this.tail.onload = function () {
					// ctx.drawImage(this.tail, 0, 0, this.width, this.height);
				}.bind(this);
				this.body_p.onload = function () {
					// ctx.drawImage(this.body_p, 0, 60, this.width, this.height);
				}.bind(this); */

	},
	draw: function (x, y, image, degree) {
		let angle = (degree - 90) * Math.PI / 180;
		ctx.save();
		ctx.translate(x, y);
		ctx.translate(RECT_WIDTH / 2, RECT_HEIGHT / 2);
		// ctx.translate(this.width / 2, this.height / 2);
		ctx.rotate(angle);
		ctx.drawImage(image, -(RECT_WIDTH / 2), -(RECT_HEIGHT / 2), RECT_WIDTH, RECT_HEIGHT);
		// ctx.drawImage(image, -(this.width / 2), -(this.height / 2), this.width, this.height);
		ctx.restore();
	},
	/*clearHead: function () {
		ctx.clearRect(this.x[0], this.y[0], this.width, this.height);
	},
	clearTail: function () {
		ctx.clearRect(this.x[this.size - 1], y[this.size - 1], this.width, this.height);
	},*/
	new_coordinate(dx, dy, da) {
		// let head_x = this.x[0];
		// let head_y = this.y[0];
		for (let i = this.size - 1; i > 0; i--) {
			this.x[i] = this.x[i - 1];
			this.y[i] = this.y[i - 1];
			this.angles[i] = this.angles[i - 1];
		}
		this.x[0] += dx;
		this.y[0] += dy;
		this.angles[0] = da;
		// this.angles[1] = da;
	},
	clear: function (x, y) {
		ctx.clearRect(x, y, RECT_WIDTH, RECT_HEIGHT);
		// ctx.clearRect(x, y, this.width, this.height);
	}
};






// randomazer();
// food();
food.init();
snake.init();
// setTimeout(function () {
// 	snake.draw(120, 120, snake.head, 180);
// }, 1000);


let promises = [];

for (let key in snake) {
	if (snake[key] instanceof Image) {
		promises.push(new Promise(resolve => {
			snake[key].onload = function () {
				resolve();
			}
		}));
	}
}
Promise.all(promises)
	// .then(alert)
	.then(function () {
		snake.draw(snake.x[0], snake.y[0], snake.head, snake.angles[0]);
		for (let i = 1; i < snake.x.length - 1; i++) {
			snake.draw(snake.x[i], snake.y[i], snake.body, snake.angles[i]);
		}
		snake.draw(snake.x[snake.size - 1], snake.y[snake.size - 1], snake.tail, snake.angles[snake.size - 1]);
	})
	.then(async function draw_test() {
		let test = requestAnimationFrame(draw_test);
		if (++count < 20) {
			return;
		}
		count = 0;
		// очистка головы, тулвища, которое идет за головой и хвоста
		snake.clear(snake.x[0], snake.y[0]);
		snake.clear(snake.x[snake.size - 1], snake.y[snake.size - 1]);
		snake.clear(snake.x[snake.size - 2], snake.y[snake.size - 2]);

		snake.new_coordinate(dx, dy, da);
		let overlap = false;
		

		if ((snake.x[0] == food.x) && (snake.y[0] == food.y)) {
			snake.size++;
			snake.x.push(snake.x[snake.size - 2]);
			snake.y.push(snake.y[snake.size - 2]);
			snake.angles.push(snake.angles[snake.size - 2]);
			food.clear();
			
			do {
				overlap = false;
				food.randomazer();
				for (let i = 0; i < snake.size; i++) {
					if ((snake.x[i] == food.x) && (snake.y[i] == food.y)) {
						overlap = true;
					}
				}
				console.log("отработал");
			} while (overlap);
			food.draw();
		}
		// рисование головы
		snake.draw(snake.x[0], snake.y[0], snake.head, snake.angles[0]);
		// рисование тулвища, если не было поворота то рисуем обычное тулвище, если произошел поворот, то тулвище в зависимости от поворота
		if (snake.angles[0] == snake.angles[1]) {
			snake.draw(snake.x[1], snake.y[1], snake.body, snake.angles[1]);
		} else {
			let angle = 0;
			let image = snake.bodyModifyRight;
			// поворот вправо
			if (snake.x[0] > snake.x[1]) {
				if (snake.y[1] > snake.y[2]) {
					image = snake.bodyModifyLeft;
					angle = 180;
				} else {
					angle = 90;
				}
			}
			// поворот влево
			if (snake.x[0] < snake.x[1]) {
				if (snake.y[1] > snake.y[2]) {
					angle = 270;
				} else {
					image = snake.bodyModifyLeft;
					angle = 0;
				}
			}
			// поворот вниз
			if (snake.y[0] > snake.y[1]) {
				if (snake.x[1] > snake.x[2]) {
					angle = 180;
				} else {
					image = snake.bodyModifyLeft;
					angle = 270;
				}
			}
			// поворот вверх
			if (snake.y[0] < snake.y[1]) {
				if (snake.x[1] > snake.x[2]) {
					image = snake.bodyModifyLeft;
					angle = 90;
				} else {
					angle = 0;
				}
			}
			snake.angles[1] = snake.angles[0];
			snake.draw(snake.x[1], snake.y[1], image, angle);
		}
		// рисование хвоста
		snake.draw(snake.x[snake.size - 1], snake.y[snake.size - 1], snake.tail, snake.angles[snake.size - 1]);
		
		//  конец игры
		overlap = false;
		for (let i = 1; i < snake.size; i++) {
			if ((snake.x[i] == snake.x[0]) && (snake.y[i] == snake.y[0])) {
				overlap = true;
				console.log("проверил")
			}
		}
		if (overlap) {
			console.log("game over");
			window.cancelAnimationFrame(test);
			// return;
		}
		// snake.draw(snake.x[1],snake.y[1],snake.body, snake.angles[1]);
		/*let test = new Promise((resolve, reject) => {
			setTimeout(() => resolve("готово!"), 0)
		  });
		let result = await test; */

	});

// alert(snake.head instanceof Image);
// snake.draw(120, 120, snake.head, 180);
// console.log(snake);
// snake_new.draw();
// setInterval(function(){
// 	food_new.draw();
// }, 2000);
// new_draw();
// draw();
// interval = setInterval(draw,time);



document.addEventListener("keydown", function (event) {
	if (event.repeat) {
		return;
	}
	console.log(event.code);
	if (event.code == "KeyW") {
		/*if (drawY == -10 || !doStep) {
			return;
		}
		doStep = false;*/
		dy = -RECT_HEIGHT;
		dx = 0;
		da = 0;
		// drawX = 0;
		// drawY = 10;
	}
	if (event.code == "KeyS") {
		/*if (drawY == 10 || !doStep) {
			return;
		}
		doStep = false; */
		dy = RECT_HEIGHT;
		dx = 0;
		da = 180;
		// drawX = 0;
		// drawY = -10;
	}
	if (event.code == "KeyD") {
		/*if (drawX == 10 || !doStep) {
			return;
		}
		doStep = false;*/
		dy = 0;
		dx = RECT_WIDTH;
		da = 90;
		// drawX = -10;
		// drawY = 0;
	}
	if (event.code == "KeyA") {
		/*if (drawX == -10 || !doStep) {
			return;
		}
		doStep = false;*/
		dy = 0;
		dx = -RECT_WIDTH;
		da = 270;
		// drawX = 10;
		// drawY = 0;
	}
	/*if (game_ON) {
		clearInterval(interval);
		// interval = setInterval(draw,time);
	}*/
});