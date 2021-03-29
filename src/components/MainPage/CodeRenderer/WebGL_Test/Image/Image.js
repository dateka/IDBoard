import React, { useRef, useEffect, useState } from "react";
//import './WebGL_Test/Image/Utils';

const vertexShaderSource = `
attribute vec3 a_position;
attribute vec2 a_texCoord;
    
uniform vec2 u_resolution;
    
varying vec2 v_texCoord;
    
void main() {
    // convert the rectangle from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;
    
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
        
    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace * vec2(1, -1), a_position.z, 1);
        
    // pass the texCoord to the fragment shader
    // The GPU will interpolate this value between points.
    v_texCoord = a_texCoord;
}
`;

const fragmentShaderSource = `
precision mediump float;
                
// our texture
uniform sampler2D u_image;

// our opacity
uniform float alpha_u;
    
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;
    
void main() {
    float alpha = 1.0; //between 0.0 and 1.0
    gl_FragColor = vec4(texture2D(u_image, v_texCoord).rgb, alpha_u);
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

  function setRectangle(gl, x, y, width, height, z) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height; 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1, z,
        x2, y1, z,
        x1, y2, z,
        x1, y2, z,
        x2, y1, z,
        x2, y2, z]), gl.STATIC_DRAW);
    //          ^ added this column
}

  export default function Image(image, width, height, Xaxis, Yaxis, Zaxis, Opacity) {
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
        gl.useProgram(program);
        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
        const alpha_u = gl.getUniformLocation(program, "alpha_u");

        // provide texture coordinates for the rectangle.
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        
        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        // set opacity on the image
        // 1.0 = no opacity    0.0 = opacity 100%
        gl.uniform1f(alpha_u, Opacity);
        
        // set the resolution
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        
        // Create a buffer for the position of the rectangle corners.
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        
        // Set a rectangle the same size as the image.
        setRectangle(gl, Xaxis, Yaxis, width, height, Zaxis);
        //          this is the depth, higher is farther ^^
        // NOTE: the same way that x and y can only be seen between -1 and 1, z also cannot 
        // be seen if greater than -1 and 1
        
        // in order for "things in front" to be drawn over "things behind", 
        // enable the depth test.
        gl.enable(gl.DEPTH_TEST); 
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_ALPHA); 

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
  })
  return (
    <div>
      
      <canvas ref={canvas} />
      <script>
        var image = new Image();
        ./WebGL_Test/Image = "intro.jpg";
        Image(image, 500, 900, 400, 150, 0.3, 0.5)
    </script>
      
    </div>
  );
}
  



        

