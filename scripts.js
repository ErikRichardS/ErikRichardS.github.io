
var map_field;
var map_size = 100;


function initiate_game(){
	map_field = [];
	var string_map = ""
	
	for (let x = 0; x < map_size; ++x) { 
		map_field.push([])

		for (let y = 0; y < map_size; ++y) {
			if (0.5 < Math.random()) {
				map_field[x].push( true );
				string_map += "1";
			}
			else{
				map_field[x].push( false );
				string_map += "0";
			}
		}
		string_map += "\n";
	}
}


function draw() {
	var canvas = document.getElementById("gameOfLife");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let x = 0; x < map_size; ++x) { 
		for (let y = 0; y < map_size; ++y) {

			if (map_field[x][y]) {
				ctx.beginPath();
				ctx.rect(x*10 + 1, y*10 + 1, 8, 8);
				ctx.fillStyle = "#0095DD";
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

setInterval( update, 500 );
