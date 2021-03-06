window.onload = function init() {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');
	
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	//-------------------------------------------------------
	var Vertices = 
	[
		// for hollow rectangle
		-0.8, -0.8,
		-0.2, -0.8,
		-0.2, -0.2,
		-0.8, -0.2,

		// for colored triangle
		0.0, 0.0,
		0.5, 0.0,
		0.25, 0.5
	];

	var VertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		0,
		0
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	//-------------------------------------------------------
	var Colors =
	[
		// for hollow rectangle
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		// for colored triangle
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
	];

	var ColorBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, ColorBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Colors), gl.STATIC_DRAW);

	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		colorAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		0,
		0
	);
	gl.enableVertexAttribArray(colorAttribLocation);

	//-------------------------------------------------------
	gl.useProgram(program);
	gl.drawArrays(gl.LINE_LOOP, 0, 4);
	gl.drawArrays(gl.TRIANGLES, 4, 7);
};