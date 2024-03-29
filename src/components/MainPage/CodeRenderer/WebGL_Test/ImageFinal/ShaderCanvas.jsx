import React from "react";
import PropTypes from "prop-types";
import { createShaderProgramFromSource, createFrameBuffer, } from "./webgl-utils.js";

const defaultVertexShader = `
	attribute vec2 a_position;
	attribute vec2 a_texCoord;

	varying vec2 v_position;
	varying vec2 v_texCoord;

	void main() {
		v_texCoord = a_texCoord;
		// map coord space from [-1, 1] -> [0, 1]
		v_position = (a_position + 1.) / 2.;
		gl_Position = vec4(a_position, 0.0, 1.0);
	}
`;

const defaultFragmentShader = `
	precision mediump float;
	varying vec2 v_position;

	void main() {
		gl_FragColor = vec4(v_position, 0.5, 1.0);
	}
`;

const ShaderCanvas = ({
  width,
  height,
  uniforms,
  renderLoop,
  vertexShader,
  fragmentShaders,
  texture,
}) => {
  const canvasRef = React.useRef();
  const dataRef = React.useRef({});

  React.useEffect(() => {
    // console.log("in useEffect!!!1");
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    let currentFrameBufferObject = createFrameBuffer(gl, width, height);
    let previousFrameBufferObject = createFrameBuffer(gl, width, height);

    // Define a surface quad to draw stuff on. It will cover the entire canvas draw area.
    const positionVerts = [
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
    ];
    const textureCoords = [
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
    ];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionVerts), gl.STATIC_DRAW);

    // Map the corners of the texture to our quad.
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW
);

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1.0);

    const numVerts = positionVerts.length / 2;

    const prepareRenderPass = (shaderProgram, uniformsObj) => {
      gl.useProgram(shaderProgram);

      const positionAttrLocation = gl.getAttribLocation(shaderProgram, "a_position");
      if (positionAttrLocation !== null) {
        // console.log("enable vertex positions!");

        // Turn on the position attribute
        gl.enableVertexAttribArray(positionAttrLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
          positionAttrLocation,
          2, // size (2 floats per vertex)
          gl.FLOAT, // type (32bit floats)
          false, // normalize
          0, // stride (bytes per vertex, ignored if 0)
          0 // offset (byte offset in stride to read data, ignored if 0)
        );
      }

      const textureCoordAttrLocation = gl.getAttribLocation(shaderProgram, "a_texCoord");
      if (textureCoordAttrLocation !== null) {
        // console.log("enable texture coords!");
        // Turn on the texcoord attribute
        gl.enableVertexAttribArray(textureCoordAttrLocation);

        // bind the texcoord buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
        // location, size, type, normalize, stride, offset
        gl.vertexAttribPointer(textureCoordAttrLocation, 2, gl.FLOAT, false, 0, 0);
      }

      const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
      if (resolutionUniformLocation !== null) {
        gl.uniform2f(resolutionUniformLocation, width, height);
      }

// HERE HERE HERE HERE HERE ----------------------------------
      const textureSizeUniformLocation = gl.getUniformLocation(shaderProgram, "u_texSize");
      if (textureSizeUniformLocation !== null && texture) {
        // set the size of the image
        gl.uniform2f(textureSizeUniformLocation, texture.width, texture.height);
      }

      // const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time");
      // if (timeUniformLocation !== null) {
      //   // set time since mount
      //   gl.uniform1f(timeUniformLocation, (Date.now() - dataRef.current.mountTime) / 1000);
      // }

      if (uniformsObj) {
        const uniformsKeys = Object.keys(uniformsObj);
        for (let t = 0, len = uniformsKeys.length; t < len; t++) {
          const uniformName = uniformsKeys[t];
          const uniformLocation = gl.getUniformLocation(
            shaderProgram,
            uniformName
          );
          if (uniformLocation !== null) {
            gl.uniform1f(uniformLocation, uniformsObj[uniformName]);
          }
        }
      }
    };

    const render = (uniformArray) => {
      const { shaderPrograms } = dataRef.current;
      if (!shaderPrograms) {
        return;
      }
      // clear canvas
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (dataRef.current.startTexture) {
        gl.bindTexture(gl.TEXTURE_2D, dataRef.current.startTexture);
      }

      const numShaderPrograms = shaderPrograms.length;
      for (let x = 0, len = numShaderPrograms - 1; x < len; x++) {
        const shaderProgram = shaderPrograms[x];
        const uniforms = uniformArray[x];

        prepareRenderPass(shaderProgram, uniforms);
        // drawing to an internal texture as part of a multi-pass render pipeline
        gl.bindFramebuffer(
          gl.FRAMEBUFFER,
          currentFrameBufferObject.frameBuffer
        );
        // draw with current shader (prim type, offset, num verts)
        gl.drawArrays(gl.TRIANGLES, 0, numVerts);
        // set the current texture to the result so the next shader can pick it up
        gl.bindTexture(gl.TEXTURE_2D, currentFrameBufferObject.texture);
        // swap the buffers.
        const temp = currentFrameBufferObject;
        currentFrameBufferObject = previousFrameBufferObject;
        previousFrameBufferObject = temp;
      }

      prepareRenderPass(
        shaderPrograms[numShaderPrograms - 1],
        uniformArray[numShaderPrograms - 1]
      );

      // finally draw to the screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.drawArrays(gl.TRIANGLES, 0, numVerts);
    };

    dataRef.current.gl = gl;
    dataRef.current.render = render;
    dataRef.current.mountTime = Date.now();
  }, [height, texture, width]);

  React.useEffect(() => {
    const { gl } = dataRef.current;
    const shaderPrograms = fragmentShaders.map((fragmentShader) =>
      createShaderProgramFromSource(gl, vertexShader, fragmentShader)
    );
    dataRef.current.shaderPrograms = shaderPrograms;
  }, [vertexShader, fragmentShaders, dataRef.current.gl]);

  React.useEffect(() => {
    const { gl } = dataRef.current;
    if (texture) {
      // flip y axis of textures because html canvas 0,0 is not the same as opengl 0,0
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      // Create a texture.
      const glTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTexture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);

      dataRef.current.startTexture = glTexture;
      dataRef.current.render(uniforms);
    }
  }, [texture, uniforms]);

  React.useEffect(() => {
    if (renderLoop) {
      let frameId;
      const renderLoopFunc = () => {
        dataRef.current.render(uniforms);
        frameId = window.requestAnimationFrame(renderLoopFunc);
      };
      renderLoopFunc();
      return () => {
        window.cancelAnimationFrame(frameId);
      };
    } else {
      dataRef.current.render(uniforms);
    }
  }, [uniforms, renderLoop]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #000" }}
    />
  );
};

ShaderCanvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  uniforms: PropTypes.arrayOf(PropTypes.shape({})),
  renderLoop: PropTypes.bool,
  vertexShader: PropTypes.string,
  fragmentShaders: PropTypes.arrayOf(PropTypes.string),
  texture: PropTypes.shape({}),
};

ShaderCanvas.defaultProps = {
  uniforms: [],
  renderLoop: true,
  vertexShader: defaultVertexShader,
  fragmentShaders: [defaultFragmentShader],
  texture: null,
};

export default ShaderCanvas;
