function random_int(max_value) {
	return Math.floor(Math.random() * max_value);
}

function random_int_span(min_value, max_value) {
	return min_value + Math.floor( Math.random() * (max_value - min_value) );
}