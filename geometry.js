function createCubeVertices() {
    return new Float32Array([
        // Face Frente
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        
        // Face Trás
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
        
        // Face Cima
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        
        // Face Baixo
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Face Direita
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        
        // Face Esquerda
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ]);
}

function createCubeIndices() {
    return new Uint16Array([
        0,  1,  2,      0,  2,  3,    // Frente
        4,  5,  6,      4,  6,  7,    // Trás
        8,  9,  10,     8,  10, 11,   // Cima
        12, 13, 14,     12, 14, 15,   // Baixo
        16, 17, 18,     16, 18, 19,   // Direita
        20, 21, 22,     20, 22, 23,   // Esqueda
    ]);
}

function createCubeColors() {
    const faceColors = [
        [1.0, 0.0, 0.0, 1.0],  // Cor Frente
        [1.0, 0.5, 0.0, 1.0],  // Cor Trás
        [1.0, 1.0, 0.0, 1.0],  // Cor Cima
        [1.0, 1.0, 1.0, 1.0],  // Cor Baixo
        [0.0, 1.0, 0.0, 1.0],  // Cor Direita
        [0.0, 0.0, 1.0, 1.0],  // Cor Esquerda
    ];
    
    let colors = [];
    for (let j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        for (let i = 0; i < 4; ++i) {
            colors = colors.concat(c);
        }
    }
    
    return new Float32Array(colors);
}

function createRoomGeometry() {
    const vertices = new Float32Array([
        // Floor
        -5.0, 0.0, -5.0,
         5.0, 0.0, -5.0,
         5.0, 0.0,  5.0,
        -5.0, 0.0,  5.0,
        
        // Ceiling
        -5.0, 4.0, -5.0,
         5.0, 4.0, -5.0,
         5.0, 4.0,  5.0,
        -5.0, 4.0,  5.0,
        
        // Back wall
        -5.0, 0.0, -5.0,
        -5.0, 4.0, -5.0,
         5.0, 4.0, -5.0,
         5.0, 0.0, -5.0,
        
        // Left wall
        -5.0, 0.0, -5.0,
        -5.0, 0.0,  5.0,
        -5.0, 4.0,  5.0,
        -5.0, 4.0, -5.0,
        
        // Right wall
         5.0, 0.0, -5.0,
         5.0, 4.0, -5.0,
         5.0, 4.0,  5.0,
         5.0, 0.0,  5.0,
    ]);
    
    const indices = new Uint16Array([
        // Floor
        0, 1, 2,  0, 2, 3,
        // Ceiling
        4, 6, 5,  4, 7, 6,
        // Back wall
        8, 9, 10,  8, 10, 11,
        // Left wall
        12, 13, 14,  12, 14, 15,
        // Right wall
        16, 17, 18,  16, 18, 19,
    ]);
    
    const roomColor = [0.9, 0.9, 0.9, 1.0];
    const floorColor = [0.8, 0.7, 0.6, 1.0];
    const colors = [];
    
    // Floor
    for (let i = 0; i < 4; i++) colors.push(...floorColor);
    // Ceiling
    for (let i = 0; i < 4; i++) colors.push(...roomColor);
    // Walls
    for (let i = 0; i < 12; i++) colors.push(...roomColor);
    
    return {
        vertices,
        indices,
        colors: new Float32Array(colors)
    };
}