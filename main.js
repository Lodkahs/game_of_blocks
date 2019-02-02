var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var animationFrame, rectCreationTimeout;

var rectArr = [];

let currentScore = 0;
let score = document.getElementById('score');
let clickToStart = document.getElementById('start');
let clickToStop = document.getElementById('stop');
let clickToAdd = document.getElementById('add');

function animate() {  
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);  

	for(let rect of rectArr){
		ctx.fillStyle = rect.color;
		ctx.fillRect(rect.currentX, rect.currentY, rect.size, rect.size);
		rect.currentY += rect.speed;
		if(rect.currentY >= canvas.clientHeight) {
			rect.currentY = 0;
		}
	}

	animationFrame = requestAnimationFrame(animate);
}

function stopAnimate(){
	rectArr = [];
	cancelAnimationFrame(animationFrame);
}

function randomColor() {
	var r = Math.floor(Math.random()*256);
	var g = Math.floor(Math.random()*256);    
	var b = Math.floor(Math.random()*256);      
	var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';

	return rgb;
}

function randomFromTo(from, to) {
	var s = from + Math.floor(Math.random() * (to- from));

	return s;
}

function addRect(size, color, speed){
	rectArr.push({
		currentX: (canvas.clientWidth - size) * Math.random(), 
		currentY: 0, 
		color: color, 
		size: size,
		speed: speed});
}

function clearBoard () {
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
}

function addRectInfinite(){
	rectCreationTimeout = setTimeout(function(){
		addRect(randomFromTo(20, 40), randomColor(), randomFromTo(1,4));
		addRectInfinite();
	}, randomFromTo(500, 2000));
}

function isInsideRect(x, y) {
	for (let i in rectArr) {
		let rect = rectArr[i];
		if (x >= rect.currentX && x <= (rect.currentX + rect.size) &&
			 y >= rect.currentY && y <= (rect.currentY + rect.size)) {
				rectArr.splice(i, 1);
				score.innerText = ++currentScore;
		}
		
	}
}

clickToStart.onclick = function() {
	animate();
	addRectInfinite();
	score.innerText = currentScore = 0;
	clickToStart.disabled = true;
}

clickToStop.onclick = function() {
	clearTimeout(rectCreationTimeout); 
	stopAnimate();
	clearBoard();
	clickToStart.disabled = false;
}

canvas.addEventListener('click', (evt) => {
	isInsideRect(evt.layerX, evt.layerY);
});