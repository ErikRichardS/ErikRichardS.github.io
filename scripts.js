
var map_field;
const map_size = 100;
const cell_size = 10;

var interval;

var locked = false;

function initiate_game(){
	set_game_field();

	var canvas = document.getElementById("gameOfLife");

	canvas.addEventListener("click", function(e) {
		getCanvasPosition(canvas, e);
	});


	time_seconds = get_interval_time();
	document.getElementById("interval-label").innerHTML = "Game speed: "+ time_seconds + " seconds";
	start_interval(time_seconds);

	var slide = document.getElementById("interval");
	slide.onchange = function() {
		
		time_seconds = get_interval_time();
		document.getElementById("interval-label").innerHTML = "Game speed: "+ time_seconds + " seconds";

		if (interval) {
			clearInterval(interval);
			start_interval(time_seconds);
		}
	}
}

function set_game_field() {
	map_field = [];
	
	for (let x = 0; x < map_size; ++x) { 
		map_field.push([])

		for (let y = 0; y < map_size; ++y) {
			if (0.5 < Math.random()) {
				map_field[x].push( true );
			}
			else{
				map_field[x].push( false );
			}
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
	var canvas = document.getElementById("gameOfLife");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let x = 0; x < map_size; ++x) { 
		for (let y = 0; y < map_size; ++y) {

			if (map_field[x][y]) {
				ctx.beginPath();
				ctx.rect(x*cell_size + 1, y*cell_size + 1, 8, 8);
				ctx.fillStyle = "#111";
				ctx.fill();
				ctx.closePath();
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