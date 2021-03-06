var gl;
var program;

var setColor;
var isColorSet = true;

window.onload = function init() {
	var canvas = document.getElementById('game-surface');
	gl = canvas.getContext('webgl');
	
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	//-------------------------------------------------------
	var Vertices = 
	[
		// for rectangle
		-0.5, -0.5,
		0.5, -0.5,
		0.5, 0.5,
		-0.5, 0.5,
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
	setColorButton = document.getElementById('SetColorButton'); 
	setColorButton.onclick = function () {
		isColorSet = !isColorSet;
	}

	setInterval(render, 8);
};

function render () {
	gl.clearColor(0.9, 0.9, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if(isColorSet)
	{
		setColor = 2;
	}
	else
	{
		setColor = 1;
	}
	gl.uniform1i(gl.getUniformLocation(program, "setColor"), setColor % 2);

	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}