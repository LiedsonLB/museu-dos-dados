const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

const fragmentShaderSource = `
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_FragColor = vColor;
    }
`;

let gl, program;
let selectedObject = 0;
let cameraPosition = [0, 2, 8];
let transforms = [
    { translation: [-2, 2, 0], rotation: [0, 0, 0], scale: [0.5, 0.5, 0.5] },
    { translation: [0, 2, 0], rotation: [0, 0, 0], scale: [0.7, 0.7, 0.7] },
    { translation: [2, 2, 0], rotation: [0, 0, 0], scale: [0.6, 0.6, 0.6] },
];

let cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer;
let roomVertexBuffer, roomColorBuffer, roomIndexBuffer;
let cubeIndices, roomGeometry;

function initWebGL() {
    const canvas = document.getElementById('webglCanvas');
    gl = canvas.getContext('webgl');
    
    if (!gl) {
        alert('WebGL não é suportado no seu navegador!');
        return false;
    }
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return false;
    
    program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return false;
    
    gl.clearColor(0.2, 0.5, 0.5, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    const cubeVertices = createCubeVertices();
    cubeIndices = createCubeIndices();
    const cubeColors = createCubeColors();
    roomGeometry = createRoomGeometry();
    
    cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    
    cubeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);
    
    cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIndices, gl.STATIC_DRAW);
    
    roomVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, roomVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, roomGeometry.vertices, gl.STATIC_DRAW);
    
    roomColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, roomColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, roomGeometry.colors, gl.STATIC_DRAW);
    
    roomIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, roomIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, roomGeometry.indices, gl.STATIC_DRAW);
    
    return true;
}

function render() {
    const canvas = document.getElementById('webglCanvas');
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    
    const programInfo = {
        attribLocations: {
            vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
        },
    };
    
    const projectionMatrix = createMat4();
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    
    perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    
    const viewMatrix = createMat4();
    lookAt(viewMatrix, cameraPosition, [0, 2, 0], [0, 1, 0]);
    
    const roomModelViewMatrix = createMat4();
    identity(roomModelViewMatrix);
    multiply(roomModelViewMatrix, viewMatrix, roomModelViewMatrix);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, roomVertexBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, roomColorBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, roomIndexBuffer);
    
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, roomModelViewMatrix);
    
    gl.drawElements(gl.TRIANGLES, roomGeometry.indices.length, gl.UNSIGNED_SHORT, 0);
    
    transforms.forEach((transform, index) => {
        const modelViewMatrix = createMat4();
        identity(modelViewMatrix);
        translate(modelViewMatrix, modelViewMatrix, transform.translation);
        rotateX(modelViewMatrix, modelViewMatrix, transform.rotation[0]);
        rotateY(modelViewMatrix, modelViewMatrix, transform.rotation[1]);
        rotateZ(modelViewMatrix, modelViewMatrix, transform.rotation[2]);
        scale(modelViewMatrix, modelViewMatrix, transform.scale);
        multiply(modelViewMatrix, viewMatrix, modelViewMatrix);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
        
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        
        gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
    });
    
    requestAnimationFrame(render);
}

function updateUI() {
    document.getElementById('camera-pos').textContent = 
        `x: ${cameraPosition[0].toFixed(1)}, y: ${cameraPosition[1].toFixed(1)}, z: ${cameraPosition[2].toFixed(1)}`;
    
    document.getElementById('selected-obj').textContent = selectedObject + 1;
    
    const transform = transforms[selectedObject];
    document.getElementById('obj-position').textContent = 
        `(${transform.translation.map(v => v.toFixed(2)).join(', ')})`;
    document.getElementById('obj-rotation').textContent = 
        `(${transform.rotation.map(v => v.toFixed(2)).join(', ')})`;
    document.getElementById('obj-scale').textContent = 
        `(${transform.scale.map(v => v.toFixed(2)).join(', ')})`;
}

function selectObject(index) {
    selectedObject = index;
    
    const buttons = document.querySelectorAll('.object-buttons button');
    buttons.forEach((button, i) => {
        button.classList.toggle('active', i === index);
    });
    
    updateUI();
}

function handleKeyPress(event) {
    const step = 0.1;
    const rotStep = 0.1;
    const scaleStep = 0.05;
    
    const current = transforms[selectedObject];
    
    switch (event.key.toLowerCase()) {
        case 'w':
            current.translation[2] -= step;
            break;
        case 's':
            current.translation[2] += step;
            break;
        case 'a':
            current.translation[0] -= step;
            break;
        case 'd':
            current.translation[0] += step;
            break;
        case 'q':
            current.translation[1] += step;
            break;
        case 'e':
            current.translation[1] -= step;
            break;
        
        case 'i':
            current.rotation[0] += rotStep;
            break;
        case 'k':
            current.rotation[0] -= rotStep;
            break;
        case 'j':
            current.rotation[1] += rotStep;
            break;
        case 'l':
            current.rotation[1] -= rotStep;
            break;
        case 'u':
            current.rotation[2] += rotStep;
            break;
        case 'o':
            current.rotation[2] -= rotStep;
            break;
        
        case 'r':
            current.scale = [
                Math.max(0.1, current.scale[0] + scaleStep),
                Math.max(0.1, current.scale[1] + scaleStep),
                Math.max(0.1, current.scale[2] + scaleStep)
            ];
            break;
        case 'f':
            current.scale = [
                Math.max(0.1, current.scale[0] - scaleStep),
                Math.max(0.1, current.scale[1] - scaleStep),
                Math.max(0.1, current.scale[2] - scaleStep)
            ];
            break;
        
        case '1':
        case '2':
        case '3':
            const objIndex = parseInt(event.key) - 1;
            if (objIndex < transforms.length) {
                selectObject(objIndex);
            }
            return;
    }
    
    updateUI();
}

window.addEventListener('load', () => {
    if (initWebGL()) {
        render();
        updateUI();
        
        window.addEventListener('keydown', handleKeyPress);
        
        console.log('Aplicação 3D WebGL inicializada com sucesso!');
        console.log('Use as teclas para controlar os objetos:');
        console.log('W/S/A/D/Q/E: Translação');
        console.log('I/K/J/L/U/O: Rotação');
        console.log('R/F: Escala');
        console.log('1/2/3: Selecionar objeto');
    } else {
        console.error('Falha ao inicializar WebGL');
    }
});