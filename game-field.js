var map_field;

var canvas;

var interval;


function set_game_field(value_function) {
	map_field = [];
	
	for (let x = 0; x < map_size; ++x) { 
		map_field.push([])

		for (let y = 0; y < map_size; ++y) {

			map_field[x].push( value_function() );

		}
	}
}

function draw_square(ctx, x, y, cell_size, color="#111", border=0) {
	ctx.beginPath();
	ctx.rect(x*cell_size + border, y*cell_size + border, cell_size - 2*border, cell_size - 2*border);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}