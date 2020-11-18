"use strict";
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let deg; 
let x = 450;
let y = 270;
let dx = 0;
let dy = -60;
let drawX = 0;
let drawY = 10;
let time = 150;
let interval;
let foodX = 330;
let foodY = 450;
let doStep = false;
let score = 0;
let game_ON = true;



let food_new = {
	img: new Image(),
	x: 300,
	y: 300,
	width: 60,
	height: 60,
	init: function() {
		this.img.src = "food.svg";

		this.randomazer();
		console.log(this.x);
		console.log(this.y);
		this.img.onload = function(){
			ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
		}.bind(this);
	},
	draw: function() {
		this.clear();
		this.randomazer();
		ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
	},
	clear: function() {
		ctx.clearRect(this.x,this.y, this.width, this.height);
	},
	randomazer: function (){
		let randomY = Math.floor(Math.random()*(10));
		let randomX = Math.floor(Math.random()*(15));
		this.x = randomX*60;
		this.y = randomY*60;
	}


}
let snake_new = {
	tail: new Image(),
	body: new Image(),
	body_p: new Image(),
	head: new Image(),
	size: 2,
	width: 60,
	height: 60,
	x: [120,60,0],
	y: [0,0,0],
	init: function() {
		this.head.src = "head.svg";
		this.body.src = "body.svg";
		this.tail.src = "tail.svg";
		this.body_p.src = "body_p.svg";
		
		this.head.onload = function(){
			ctx.drawImage(this.head,120,0,this.width,this.height);
		}.bind(this);
		this.body.onload = function(){
			ctx.drawImage(this.body,60,0,this.width,this.height);
		}.bind(this);
		this.tail.onload = function(){
			ctx.drawImage(this.tail,0,0,this.width,this.height);
		}.bind(this);
		this.body_p.onload = function(){
			ctx.drawImage(this.body_p,0,60,this.width,this.height);
		}.bind(this);
	},
	draw: function(x, y, image) {
		ctx.drawImage(image,x,y,this.width,this.height);
	},
	clearHead: function() {
		ctx.clearRect(this.x[0],this.y[0], this.width, this.height);
	},
	clearTail: function() {
		ctx.clearRect(this.x[this.size - 1],y[this.size - 1], this.width, this.height);
	},
	new_coordinate(x, y) {

	}
};






// randomazer();
// food();
food_new.init();
snake_new.init();
console.log(snake_new);
snake_new.draw();
// setInterval(function(){
// 	food_new.draw();
// }, 2000);
// new_draw();
// draw();
	// interval = setInterval(draw,time);



document.addEventListener("keydown", function(event) { 
	if (event.repeat) {
		return;
	}
	console.log(event.code);
	if (event.code == "KeyW") {
		if (drawY == -10 || !doStep) {
			return;
		}
		doStep = false;
		dy = -60;
		dx = 0;
		drawX = 0;
		drawY = 10;
	}
	if (event.code == "KeyS") {
		if (drawY == 10 || !doStep) {
			return;
		}
		doStep = false;
		dy = 60;
		dx = 0;
		drawX = 0;
		drawY = -10;
	}
	if (event.code == "KeyD") {
		if (drawX == 10 || !doStep) {
			return;
		}
		doStep = false;
		dy = 0;
		dx = 60;
		drawX = -10;
		drawY = 0;
	}
	if (event.code == "KeyA") {
		if (drawX == -10 || !doStep) {
			return;
		}
		doStep = false;
		dy = 0;
		dx = -60;
		drawX = 10;
		drawY = 0;
	}
	if (game_ON) {
		clearInterval(interval);
		// interval = setInterval(draw,time);
	}
});