var gl;

var isDirClockwise = true;
var isRotStarted = false;
var scaleSliderVal = 20;
var radioColorVal = [1.0, 0.0, 0.0];

var vertTheta = 0;
var vertThetaLoc;

var vertScale = 1.0;
var vertScaleLoc;

var fragColor = [1.0, 0.0, 0.0];
var fragColorLoc;

var vertLeftRight = 0.0;
var vertLeftRightLoc;
var vertUpDown = 0.0;
var vertUpDownLoc;

var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec4 vertPosition;',
'uniform float vertTheta;',
'uniform float vertScale;',
'uniform float vertLeftRight;',
'uniform float vertUpDown;',
'',
'void main()',
'{',
'	gl_Position.x = ( cos(vertTheta) * vertPosition.x - sin(vertTheta) * vertPosition.y ) / vertScale + vertLeftRight;',
'	gl_Position.y = ( sin(vertTheta) * vertPosition.x + cos(vertTheta) * vertPosition.y ) / vertScale + vertUpDown;',
'	gl_Position.z = 0.0;',
'	gl_Position.w = 1.0;',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'',
'uniform vec3 fragColor;',
'void main()',
'{',
'	gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('demo-surface');
	gl = canvas.getContext('webgl');

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	var triangleVertices = 
	[
		// C yan
		-0.8, -0.4,
		-0.6, -0.5,
		-0.8, 0.4,

		-0.8, 0.4,
		-0.6, 0.5,
		-0.6, -0.5,

		// C üst
		-0.1, 0.5,
		-0.6, 0.5,
		-0.6, 0.3,

		-0.1, 0.5,
		-0.1, 0.3,
		-0.6, 0.3,

		// C alt
		-0.1, -0.5,
		-0.6, -0.3,
		-0.6, -0.5,

		-0.1, -0.5,
		-0.6, -0.3,
		-0.1, -0.3,

		// R sol yan
		0.1, -0.5,
		0.3, -0.5,
		0.1, 0.5,

		0.1, 0.5,
		0.3, 0.5,
		0.3, -0.5,

		// R üst
		0.6, 0.5,
		0.3, 0.5,
		0.3, 0.3,

		0.6, 0.5,
		0.6, 0.3,
		0.3, 0.3,

		// R orta
		0.7, 0.1,
		0.1, 0.1,
		0.1, -0.1,

		0.7, 0.1,
		0.7, -0.1,
		0.1, -0.1,

		// R sağ yan
		0.6, -0.1,
		0.8, 0.0,
		0.6, 0.5,

		0.6, 0.5,
		0.8, 0.4,
		0.8, 0.0,

		// R sağ kuyruk
		0.8, -0.5,
		0.5, -0.1,
		0.6, -0.5,

		0.8, -0.5,
		0.5, -0.1,
		0.7, -0.1,

	];

	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.useProgram(program);

	// Objelerin dönme yönünü belirleyen HTML butona erişimi sağlar.
	rotateDirectionButton = document.getElementById('DirectionButton');
	var outputRotButton = document.getElementById("outputRotate");
	outputRotButton.innerHTML = isDirClockwise ? "Clockwise" : "Counter Clockwise"
	rotateDirectionButton.onclick = function () {
		isDirClockwise = !isDirClockwise;
		outputRotButton.innerHTML = isDirClockwise ? "Clockwise" : "Counter Clockwise"
	}

	// Objelerin dönüşünü durduran başlatan HTML butona erişimi sağlar.
	//rotateStartStopButton = document.getElementById('StartStopButton'); 
	document.getElementById('StartStopButton').onclick = function () {
		isRotStarted = !isRotStarted;
	}

	// Objelerin boyutunu belirleyen HTML range slidera erişimi sağlar.
	scaleSliderVal = document.getElementById('scaleSlider');
	var outputSlider = document.getElementById("scaleValue");
	outputSlider.innerHTML = scaleSliderVal.value;

	scaleSliderVal.oninput = function() {
		outputSlider.innerHTML = this.value;
	}

	// Objelerin rengini belirleyen HTML radio butonlara erişimi sağlar.
	var radioColorLoc = document.querySelectorAll('input[type=radio][name="colorRadio"]');
	radioColorLoc.forEach(radio => radio.onchange = function() { 
		switch (radio.value) {
			case 'red':
				fragColor = [1.0, 0.0, 0.0];
				break;
			case 'green':
				fragColor = [0.0, 1.0, 0.0];
				break;
			case 'blue':
				fragColor = [0.0, 0.0, 1.0];
				break;
            }
		});

	// Objeleri hareket ettiren keyboard arrow butonlara erişimi sağlar.
	window.onkeydown = function(key) {
		if( key.keyCode == 39) {
			vertLeftRight += 0.025;
		} else if ( key.keyCode == 37 ) {
 			vertLeftRight -= 0.025;
		} else if ( key.keyCode == 38 ) {
 			vertUpDown += 0.025;
		} else if ( key.keyCode == 40 ) {
 			vertUpDown -= 0.025;
		}
	};

	gl.vertexAttribPointer(
		positionAttribLocation,
		2,
		gl.FLOAT,
		gl.FALSE,
		0,
		0
	);

	gl.enableVertexAttribArray(positionAttribLocation);

	gl.clearColor(0.9, 0.9, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Shaderdaki vertTheta değişkenine erişimi sağlar.
	vertThetaLoc = gl.getUniformLocation(program, 'vertTheta');

	// Shaderdaki vertScale değişkenine erişimi sağlar.
	vertScaleLoc = gl.getUniformLocation(program, 'vertScale');

	// Shaderdaki fragColor değişkenine erişimi sağlar.
	fragColorLoc = gl.getUniformLocation(program, 'fragColor');

	// Shaderdaki vertLeftRight ve vertUpDown değişkenlerine erişimi sağlar.
	vertLeftRightLoc = gl.getUniformLocation(program, 'vertLeftRight');
	vertUpDownLoc = gl.getUniformLocation(program, 'vertUpDown');

	setInterval(render, 8);
};

function render () {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	vertTheta += ( isRotStarted ? ( isDirClockwise ? -0.00625 : 0.00625 ) : 0 );
	vertScale = scaleSliderVal.max - scaleSliderVal.value + 1;

	gl.uniform1f(vertThetaLoc, vertTheta);
	gl.uniform1f(vertScaleLoc, vertScale);
	gl.uniform3fv(fragColorLoc, fragColor);
	gl.uniform1f(vertLeftRightLoc, vertLeftRight);
	gl.uniform1f(vertUpDownLoc, vertUpDown);

	gl.drawArrays(gl.TRIANGLES, 0, 48);
}