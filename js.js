"use strict";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let modalMain = document.querySelector(".modal-main");
let primaryColor = document.querySelector(".primary-color input");
let select = document.querySelector(".squre-size select");
let newGame = document.querySelector(".modal-main button");
let header = document.querySelector("header");
let scoreText = document.querySelector("header p span");
let modalScore = document.querySelector(".modal-score");
// let switchToMainMenu = document.querySelector(".modal-score button");
let modalKeybordControl = document.querySelector(".modal-keybord-control");

let RECT_WIDTH = 60;
let RECT_HEIGHT = 60;

// в input выбора цвета ставим цвет canvas
primaryColor.value = RGBToHex(window.getComputedStyle(canvas, null).backgroundColor);

let dx = RECT_WIDTH;
let dy = 0;
let da = 90;

let count = 0;
let speed = 1;
let score = 0;

let food = {
	img: new Image(),
	x: 300,
	y: 300,
	init: function () {
		this.img.src = "food.svg";
		this.randomazer();
	},
	draw: function () {
		ctx.drawImage(this.img, this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
	},
	clear: function () {
		ctx.clearRect(this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
	},
	randomazer: function () {
		let randomY = Math.floor(Math.random() * (canvas.height / RECT_HEIGHT));
		let randomX = Math.floor(Math.random() * (canvas.width / RECT_WIDTH));
		this.x = randomX * RECT_WIDTH;
		this.y = randomY * RECT_HEIGHT;
	}
}

let snake = {
	tail: new Image(),
	body: new Image(),
	bodyModifyRight: new Image(),
	bodyModifyLeft: new Image(),
	head: new Image(),
	size: 5,
	x: [],
	y: [],
	angles: [],
	init: function () {
		this.head.src = "head.svg";
		this.body.src = "body.svg";
		this.tail.src = "tail.svg";
		this.bodyModifyRight.src = "bodyModifyRight.svg";
		this.bodyModifyLeft.src = "bodyModifyLeft.svg";
		this.x = [];
		this.y = [];
		this.angles = [];
		this.size = 5;
		for (let i = 0; i < this.size; i++) {
			this.x.push(RECT_WIDTH * 8 - i * RECT_WIDTH);
			this.y.push(RECT_HEIGHT * 6);
			this.angles.push(90);
		}
	},
	draw: function (x, y, image, degree) {
		let angle = (degree - 90) * Math.PI / 180;
		ctx.save();
		ctx.translate(x, y);
		ctx.translate(RECT_WIDTH / 2, RECT_HEIGHT / 2);
		ctx.rotate(angle);
		ctx.drawImage(image, -(RECT_WIDTH / 2), -(RECT_HEIGHT / 2), RECT_WIDTH, RECT_HEIGHT);
		ctx.restore();
	},
	new_coordinate(dx, dy, da) {
		for (let i = this.size - 1; i > 0; i--) {
			this.x[i] = this.x[i - 1];
			this.y[i] = this.y[i - 1];
			this.angles[i] = this.angles[i - 1];
		}
		this.x[0] += dx;
		this.y[0] += dy;
		this.angles[0] = da;
	},
	clear: function (x, y) {
		ctx.clearRect(x, y, RECT_WIDTH, RECT_HEIGHT);
	}
};

function start() {
	let promises = [];

	food.init();
	snake.init();

	promises.push(new Promise(resolve => {
		food.img.onload = function () {
			resolve();
		}
	}));

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
		.then(function () {
			snake.draw(snake.x[0], snake.y[0], snake.head, snake.angles[0]);
			for (let i = 1; i < snake.x.length - 1; i++) {
				snake.draw(snake.x[i], snake.y[i], snake.body, snake.angles[i]);
			}
			snake.draw(snake.x[snake.size - 1], snake.y[snake.size - 1], snake.tail, snake.angles[snake.size - 1]);
			food.draw();
		})
		.then(async function draw_test() {
			let test = requestAnimationFrame(draw_test);
			if (--count > speed) {
				return;
			}
			count = 20;
			// очистка головы, тулвища, которое идет за головой и хвоста
			snake.clear(snake.x[0], snake.y[0]);
			snake.clear(snake.x[snake.size - 1], snake.y[snake.size - 1]);
			snake.clear(snake.x[snake.size - 2], snake.y[snake.size - 2]);

			snake.new_coordinate(dx, dy, da);
			let overlap = false;

			// съел
			if ((snake.x[0] == food.x) && (snake.y[0] == food.y)) {
				snake.size++;
				score++;
				scoreText.innerHTML = score;
				if (snake.size % 3 == 0) {
					speed++;
				}
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
					break;
				}

			}
			if ((snake.x[0] == canvas.width) || (snake.x[0] < 0) || (snake.y[0] == canvas.height) || (snake.y[0] < 0)) {
				overlap = true;
			}
			if (overlap) {
				window.cancelAnimationFrame(test);
				modalScore.style.display = "flex";
				document.querySelector(".modal-score p span").innerHTML = score;
			}

		});
}



document.addEventListener("keydown", function (event) {
	if (event.repeat) {
		return;
	}
	if (event.code == "KeyW") {
		if (dy > 0) {
			return;
		}
		dy = -RECT_HEIGHT;
		dx = 0;
		da = 0;
	}
	if (event.code == "KeyS") {
		if (dy < 0) {
			return;
		}
		dy = RECT_HEIGHT;
		dx = 0;
		da = 180;
	}
	if (event.code == "KeyD") {
		if (dx < 0) {
			return;
		}
		dy = 0;
		dx = RECT_WIDTH;
		da = 90;
	}
	if (event.code == "KeyA") {
		if (dx > 0) {
			return;
		}
		dy = 0;
		dx = -RECT_WIDTH;
		da = 270;
	}
});

newGame.addEventListener("click", function () {
	modalMain.style.display = "none";
	modalKeybordControl.style.display = "block";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	dx = RECT_WIDTH;
	dy = 0;
	da = 90;
	speed = 1;
	score = 0;
	scoreText.innerHTML = 0;
	
});

document.querySelector(".modal-score button").addEventListener("click", function () {
	modalScore.style.display = "none";
	modalMain.style.display = "block";
});

document.querySelector(".modal-keybord-control button").addEventListener("click", function () {
	modalKeybordControl.style.display = "none";
	start();
});

primaryColor.addEventListener("change", function () {
	setTheme(this.value);
});

select.addEventListener("change", function () {
	RECT_WIDTH = Number(this.value);
	RECT_HEIGHT = Number(this.value);
	canvas.width = 900;
	canvas.height = 600;
	canvas.width = Math.floor(Number(canvas.width) / RECT_WIDTH) * RECT_WIDTH;
	header.style.width = `${canvas.width}px`;
	canvas.height = Math.floor(Number(canvas.height) / RECT_HEIGHT) * RECT_HEIGHT;
	canvas.style.backgroundPosition = `0 0, ${RECT_WIDTH}px ${RECT_HEIGHT}px`;
	canvas.style.backgroundSize = `${RECT_WIDTH*2}px ${RECT_HEIGHT*2}px`;
});

function setTheme(H) {
	// Convert hex to RGB first
	let r = 0,
		g = 0,
		b = 0;
	if (H.length == 4) {
		r = "0x" + H[1] + H[1];
		g = "0x" + H[2] + H[2];
		b = "0x" + H[3] + H[3];
	} else if (H.length == 7) {
		r = "0x" + H[1] + H[2];
		g = "0x" + H[3] + H[4];
		b = "0x" + H[5] + H[6];
	}
	// Then to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta == 0)
		h = 0;
	else if (cmax == r)
		h = ((g - b) / delta) % 6;
	else if (cmax == g)
		h = (b - r) / delta + 2;
	else
		h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0)
		h += 360;

	l = (cmax + cmin) / 2;
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	document.documentElement.style.setProperty(`--colorPrimary-h`, h);
	document.documentElement.style.setProperty(`--colorPrimary-s`, s + '%');
	document.documentElement.style.setProperty(`--colorPrimary-l`, l + '%');
}

function RGBToHex(rgb) {
	// Choose correct separator
	let sep = rgb.indexOf(",") > -1 ? "," : " ";
	// Turn "rgb(r,g,b)" into [r,g,b]
	rgb = rgb.substr(4).split(")")[0].split(sep);

	let r = (+rgb[0]).toString(16),
		g = (+rgb[1]).toString(16),
		b = (+rgb[2]).toString(16);

	if (r.length == 1)
		r = "0" + r;
	if (g.length == 1)
		g = "0" + g;
	if (b.length == 1)
		b = "0" + b;

	return "#" + r + g + b;
}