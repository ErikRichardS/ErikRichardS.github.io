const map_size = 30;
const cell_size = 30;

const starting_length = 5;
var score;
var update_time;

var snake;
var snake_alive;
var fruit_coordinates;

var interval;


const directions = {
						"up": 0,
						"right": 1,
						"down": 2,
						"left": 3
					}


function zero(){
	return 0;
}


function initiate_game(){
	canvas = document.getElementById("game-field");

	restart();

	document.addEventListener('keydown', function(event) {

		//document.getElementById("info-misc").innerHTML = event.keyCode;
		if(event.keyCode == 87 || event.keyCode == 38) {
			event.preventDefault();
			change_direction("up");
		}
		else if(event.keyCode == 83 || event.keyCode == 40) {
			event.preventDefault();
			change_direction("down");
		}
		else if(event.keyCode == 65 || event.keyCode == 37) {
			change_direction("left");
		}
		else if(event.keyCode == 68 || event.keyCode == 39) {
			//document.getElementById("info-corn").innerHTML = event.keyCode;
			change_direction("right");
		}
	});
}


class Snake {
	constructor() {
		this.direction = directions["down"];
		this.new_direction = -1;

		this.body = new LinkedList();

		
		for (var i = 0; i < starting_length; ++i) {
			var x = 10;
			var y = 10-i;
			this.body.push([x, y]);

			map_field[x][y] = 1;
		}
		
	}

	change_direction(new_direction) {
		// As long as the new direction isn't opposite 
		// of the new one, adopt the new direction		 
		var is_opposite = ( this.direction == ( (new_direction+2) % 4 ) )

		if ( !is_opposite ) {
			this.new_direction = new_direction;
		}
	}

	// Return true if the snake is still alive
	// Return false in case of game over
	update() {
		if (this.new_direction > -1) {
			this.direction = this.new_direction;
			this.new_direction = -1;
		}

		var x = this.body.tail.value[0];
		var y = this.body.tail.value[1];

		if (this.direction == directions["up"]) {
			y = y-1;
		}
		else if (this.direction == directions["right"]) {
			x = x+1;
		}
		else if (this.direction == directions["down"]) {
			y = y+1;
		}
		else {
			x = x-1;
		}
		document.getElementById("info-misc").innerHTML = "X: "+x+" | Y: "+y;

		// Check if snake ran into a wall or itself
		if (x < 0 || x >= map_size || y < 0 || y >= map_size || map_field[x][y] == 1) {
			return false;
		}

		// Head moves forward
		this.body.add([x, y]);
		map_field[x][y] = 1;

		// If no fruit was eaten, tail moves forward
		if  ( x == fruit_coordinates[0] && y == fruit_coordinates[1] ) {
			new_fruit();
		}
		else {
			var tail = this.body.remove_first().value;
			map_field[tail[0]][tail[1]] = 0;
		}
		

		return true;
	}

	draw(ctx) {
		var current_node = this.body.head;

		// Draw body
		while (current_node.next != null) {
			draw_square(ctx, current_node.value[0], current_node.value[1], cell_size, "#171", 1);
			current_node = current_node.next;
		}

		// Draw head
		draw_square(ctx, current_node.value[0], current_node.value[1], cell_size, "#191");
	}
}

function change_direction(new_direction) {
	snake.change_direction(directions[new_direction]);
}

function new_fruit() {
	score++;
	document.getElementById("score-board").innerHTML = "Score: "+score;

	var x = random_int(map_size);
	var y = random_int(map_size);

	while ( map_field[x][y] != 0 ) {
		x = random_int(map_size);
		y = random_int(map_size);
	}

	fruit_coordinates = [x, y];

	if (update_time > 100) {
		update_time -= 2;

		clearInterval(interval); 
		interval = setInterval( update, update_time );
	}
}

function update() {
	if (snake_alive) {
		snake_alive = snake.update();
		draw();

		if (!snake_alive){
			document.getElementById("game-over-score").innerHTML = "Final Score: " + score;
			document.getElementById("game-over-screen").style.display = "block";
		}
	}


}


function draw() {
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	snake.draw(ctx);

	draw_square(ctx, fruit_coordinates[0], fruit_coordinates[1], cell_size, "#722");
}

function pause_start(button) {
	if (interval) {
		clearInterval(interval); 
		interval = null;
		button.innerHTML = "Play";
	}
	else {
		interval = setInterval( update, update_time );
		button.innerHTML = "Pause";
	}
}

function restart() {
	set_game_field( zero );

	snake = new Snake();
	snake_alive = true;

	update_time = 1000;
	score = 0;
	
	fruit_coordinates = [random_int(map_size), random_int(map_size)];
	draw();

	clearInterval(interval); 
	interval = null;

	document.getElementById("button-pause").innerHTML = "Play";
	document.getElementById("score-board").innerHTML = "Score: "+score;
	document.getElementById("game-over-screen").style.display = "none";
}