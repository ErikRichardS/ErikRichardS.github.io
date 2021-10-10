const map_size = 100;
const cell_size = 10;

var slider;


function initial_field_value() {
	if (0.5 < Math.random()) {
		return true;
	}
	return false;
}

function initiate_game(){
	set_game_field( initial_field_value );

	canvas = document.getElementById("game-field");

	canvas.addEventListener("click", function(e) {
		getCanvasPosition(canvas, e);
	});

	slider = document.getElementById("interval-slider");


	time_seconds = get_interval_time();
	document.getElementById("interval-label").innerHTML = "Game speed: "+ time_seconds + " seconds";
	start_interval(time_seconds);

	
	slider.onchange = function() {
		
		time_seconds = get_interval_time();
		document.getElementById("interval-label").innerHTML = "Game speed: "+ time_seconds + " seconds";

		if (interval) {
			clearInterval(interval);
			start_interval(time_seconds);
		}
	}
}


function getCanvasPosition(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	var top = rect.top;
	var left = rect.left;

	var x = Math.floor( (event.clientX - rect.left) / rect.width * canvas.width / map_size * cell_size );
	var y = Math.floor( (event.clientY - rect.top) / rect.height * canvas.height / map_size * cell_size );

	map_field[x][y] = !map_field[x][y];
	draw();

	document.getElementById("info-coord").innerHTML = "x: "+x+" y: "+y;
	//document.getElementById("info-corn").innerHTML = "top: "+top+" bot: "+left

	//document.getElementById("info-misc").innerHTML = "width: "+canvas.width;
}


function draw() {
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let x = 0; x < map_size; ++x) { 
		for (let y = 0; y < map_size; ++y) {

			if (map_field[x][y]) {
				draw_square(ctx, x, y, cell_size, color="#111", border=1);
			}
			
		}
	}
}

function update() {
	var changes = [];

	for (let x = 0; x < map_size; ++x) { 
		for (let y = 0; y < map_size; ++y) {
			alive_neighbors = 0;

			alive_neighbors += ( check_alive(x-1,y-1) ) ? 1 : 0
			alive_neighbors += ( check_alive(x-1,y) ) ? 1 : 0
			alive_neighbors += ( check_alive(x,y-1) ) ? 1 : 0

			alive_neighbors += ( check_alive(x+1,y+1) ) ? 1 : 0
			alive_neighbors += ( check_alive(x+1,y) ) ? 1 : 0
			alive_neighbors += ( check_alive(x,y+1) ) ? 1 : 0

			alive_neighbors += ( check_alive(x+1,y-1) ) ? 1 : 0
			alive_neighbors += ( check_alive(x-1,y+1) ) ? 1 : 0

			// If a cell is alive, but has too few or too many living neighbors, it dies.
			if ( map_field[x][y] && !(alive_neighbors == 2 || alive_neighbors == 3) ) {
				changes.push([x, y]);
			} 
			// If a cell is dead, but has exactly 3 living neighbors, it comes alive.
			else if ( !map_field[x][y] && alive_neighbors ==3 ) {
				changes.push([x, y]);
			}
		}
	}

	for (var i = 0; i < changes.length; i++) {
		x = changes[i][0];
		y = changes[i][1];
		map_field[x][y] = !map_field[x][y];
	}

	draw();
}


function check_alive(x, y) {
	alive_neighbors = 0;

	if (0 < x && x < map_size) {
		if (0 < y && y < map_size) {
			return map_field[x][y];
		}
	}

	return false;
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
	var slider_value = slider.value;
	return Math.round( ( 100 - slider_value) ) / 100;
}

function start_interval(time_seconds){
	interval = setInterval( update, time_seconds * 1000 );
}

function restart() {
	set_game_field();
	draw();
}