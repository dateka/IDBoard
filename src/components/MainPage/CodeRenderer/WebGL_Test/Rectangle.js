import React, { useRef, useEffect, useState } from "react";
//import "./style.css";

const vertexShaderSource = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(0.386,0.912,0.418, 1);
  }
`;

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

export default function Rectangle() {
  const canvas = useRef(null);
  const [glSupport, setGlSupport] = useState(true);
  useEffect(() => {
    if (canvas.current) {
      const gl = canvas.current.getContext("webgl");
      if (!gl) {
        setGlSupport(false);
        return;
      }

      // create GLSL shaders, upload the GLSL source, compile the shaders
      var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      var fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );
      // Link the two shaders into a program
      var program = createProgram(gl, vertexShader, fragmentShader);

      // look up where the vertex data needs to go.
      var positionAttrLocation = gl.getAttribLocation(program, "a_position");

      // Create a buffer and put three 2d clip space points in it
      var positionBuffer = gl.createBuffer();

      // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      const positions = [-1.0, -1.0, +1.0, -1.0, +1.0, +1.0, -1.0, +1.0];

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
      );

      // code above this line is initialization code.
      // code below this line is rendering code.

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas
      //gl.clearColor(0, 45, 100, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);

      // Turn on the attribute
      gl.enableVertexAttribArray(positionAttrLocation);

      // Bind the position buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 2; // 2 components per iteration
      var type = gl.FLOAT; // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(
        positionAttrLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // draw
      // var primitiveType = gl.TRIANGLES;
      var primitiveType = gl.TRIANGLE_FAN;

      var count = 4;
      //var count = 4;
      gl.drawArrays(primitiveType, offset, count);
    }
  }, []);
  return (
    <div className="App">
      <canvas ref={canvas} />
      {!glSupport && <h2> This browser does not support WebGL.</h2>}
    </div>
  );
}
