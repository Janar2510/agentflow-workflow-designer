import { useEffect, useRef } from 'react';
import './Aurora.css';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  
  uniform float uTime;
  uniform float uAmplitude;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec2 uResolution;
  uniform float uBlend;
  
  vec3 permute(vec3 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }
  
  float snoise(vec2 v){
    const vec4 C = vec4(
        0.211324865405187, 0.366025403784439,
        -0.577350269189626, 0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
  
    vec3 p = permute(
        permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0)
    );
  
    vec3 m = max(
        0.5 - vec3(
            dot(x0, x0),
            dot(x12.xy, x12.xy),
            dot(x12.zw, x12.zw)
        ), 
        0.0
    );
    m = m * m;
    m = m * m;
  
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Create color gradient
    vec3 color1 = uColor1;
    vec3 color2 = uColor2;
    vec3 color3 = uColor3;
    
    vec3 rampColor;
    if (uv.x < 0.5) {
      rampColor = mix(color1, color2, uv.x * 2.0);
    } else {
      rampColor = mix(color2, color3, (uv.x - 0.5) * 2.0);
    }
    
    float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
    height = exp(height);
    height = (uv.y * 2.0 - height + 0.2);
    float intensity = 0.6 * height;
    
    float midPoint = 0.20;
    float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
    
    vec3 auroraColor = intensity * rampColor;
    
    gl_FragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
`;

export default function Aurora(props) {
  const { 
    colorStops = ['#5227FF', '#7cff67', '#5227FF'], 
    amplitude = 1.0, 
    blend = 0.5,
    speed = 1.0 
  } = props;
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    // Create shader
    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    // Create program
    function createProgram(vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return null;
      }
      return program;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = createProgram(vertexShader, fragmentShader);

    if (!program) return;

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'position');
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const amplitudeLocation = gl.getUniformLocation(program, 'uAmplitude');
    const color1Location = gl.getUniformLocation(program, 'uColor1');
    const color2Location = gl.getUniformLocation(program, 'uColor2');
    const color3Location = gl.getUniformLocation(program, 'uColor3');
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    const blendLocation = gl.getUniformLocation(program, 'uBlend');

    // Create geometry (full screen triangle)
    const positions = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Convert hex colors to RGB
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      ] : [0, 0, 0];
    }

    const color1 = hexToRgb(colorStops[0]);
    const color2 = hexToRgb(colorStops[1]);
    const color3 = hexToRgb(colorStops[2]);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function render(time) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      
      // Set uniforms
      gl.uniform1f(timeLocation, time * 0.001 * speed);
      gl.uniform1f(amplitudeLocation, amplitude);
      gl.uniform3f(color1Location, color1[0], color1[1], color1[2]);
      gl.uniform3f(color2Location, color2[0], color2[1], color2[2]);
      gl.uniform3f(color3Location, color3[0], color3[1], color3[2]);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(blendLocation, blend);
      
      // Set attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      
      animationRef.current = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, [colorStops, amplitude, blend, speed]);

  return <canvas ref={canvasRef} className="aurora-container" />;
}
