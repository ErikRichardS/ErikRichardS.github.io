const map_size = 100;
const cell_size = 10;

var canvas;

var interval;

var snake;
var fruit_coordinates;

const directions = {
						"up": 0,
						"right": 1,
						"down": 2,
						"left": 3
					}



function initiate_game(){
	canvas = document.getElementById("game-field");

	snake = new Snake();

	

	
	draw();
	start_interval(1);

	document.getElementById("info-misc").innerHTML = "Test";


	document.addEventListener('keydown', function(event) {
		if(event.keyCode == 37) {
			alert('Left was pressed');
		}
		else if(event.keyCode == 39) {
			alert('Right was pressed');
		}
	});
}


class Snake {
	constructor() {
		this.length = 5;
		this.head = [10,10];
		this.direction = directions["right"];

		this.coordinates = new LinkedList();

		
		for (var i = 0; i < this.length; ++i) {
			this.coordinates.add([10, 10-i]);
		}
		
	}

	change_direction(new_direction) {
		// As long as the new direction isn't opposite 
		// of the new one, adopt the new direction
		if (! this.direction == (new_direction+2)%4 ) {
			this.direction = new_direction;
		}
	}

	update() {

		var x = this.coordinates.tail.value[0];
		var y = this.coordinates.tail.value[1];



		if (this.direction == directions["up"]) {
			this.coordinates.add([x, y-1]);
		}
		else if (this.direction == directions["right"]) {
			this.coordinates.add([x+1, y]);
		}
		else if (this.direction == directions["down"]) {
			this.coordinates.add([x, y+1]);
		}
		else {
			this.coordinates.add([x-1, y]);
		}

		document.getElementById("info-coord").innerHTML = "Head-X: ";

		this.coordinates.remove_first();
	}

	draw(ctx) {
		var current_node = this.coordinates.head;

		// Draw rest of body
		while (current_node.next != null) {
			draw_square(ctx, current_node.value[0], current_node.value[1], "#171", 1);
			current_node = current_node.next;
		}

		draw_square(ctx, current_node.value[0], current_node.value[1], "#191");
	}
}


function update() {
	
	snake.update();

	draw();
}


function draw() {
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	
	snake.draw(ctx);


}

function draw_square(ctx, x, y, color="#111", border=0) {
	ctx.beginPath();
	ctx.rect(x*cell_size + border, y*cell_size + border, cell_size - 2*border, cell_size - 2*border);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}





function pause_start(button) {
	if (interval) {
		clearInterval(interval); 
		interval = null;
		button.innerHTML = "Play";
	}
	else {

		start_interval( get_interval_time() );
		button.innerHTML = "Pause";
	}
}

function get_interval_time(){
	var slider_value = document.getElementById("interval").value;
	return Math.round( ( 100 - slider_value) ) / 100;
}

function start_interval(time_seconds){
	interval = setInterval( update, time_seconds * 1000 );
}

function restart() {
	set_game_field();
	draw();
}