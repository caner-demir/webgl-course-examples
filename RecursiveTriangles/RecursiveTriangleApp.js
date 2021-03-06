const numTimesToSubdivide = 3;
var points;
var colors;

var baseColors = [
	vec3(0.0, 1.0, 0.0),
	vec3(0.0, 0.0, 1.0),
	vec3(0.0, 0.0, 0.0),
	vec3(1.0, 0.0, 0.0)
];

function triangle(a, b, c, color) {
	colors.push(baseColors[color]);
	points.push(a);
	colors.push(baseColors[color]);
	points.push(b);
	colors.push(baseColors[color]);
	points.push(c);
}


function tetra(a, b, c, d) {
	triangle(a, c, b, 0);
	triangle(a, c, d, 1);
	triangle(a, b, d, 2);
	triangle(b, c, d, 3);
}


function divideTetra(a, b, c, d, count) {
	if (count == 0) {
		tetra(a, b, c, d);
	}
	else {
		var ab = mix(a, b, 0.5);
		var ac = mix(a, c, 0.5);
		var ad = mix(a, d, 0.5);
		var bc = mix(b, c, 0.5);
		var bd = mix(b, d, 0.5);
		var cd = mix(c, d, 0.5);
		--count;
		divideTetra( a, ab, ac, ad, count);
		divideTetra(ab, b, bc, bd, count);
		divideTetra(ac, bc, c, cd, count);
		divideTetra(ad, bd, cd, d, count);
	}
}

var InitDemo = function () {
	console.log('This is working');


	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	var program = initShaders(gl, "vertex-shader", "fragment-shader");

	var vertices = [
		vec3(-0.9, -0.9, -0.9),
		vec3(0.9, -0.9, -0.9),
		vec3(0.0, 0.9, 0.0),
		vec3(0.0, 0.0, 0.9)
	];

	points = [];
	colors = [];

	divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], numTimesToSubdivide);

	//------------------------------------------------------------------------
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	//------------------------------------------------------------------------
	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);


	var vertColor = gl.getAttribLocation(program, "vertColor");
	gl.vertexAttribPointer(
		vertColor,
		3,
		gl.FLOAT,
		false,
		0,
		0
	);
	gl.enableVertexAttribArray(vertColor);

	//------------------------------------------------------------------------
	gl.useProgram(program);

	gl.clearColor(0.95, 0.95, 0.95, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, points.length);
};