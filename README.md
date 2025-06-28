# Computação Gráfica Avaliação III - Museu dos Cubos (Francisco Liédson)  
<!-- imagem do projeto -->
![Museu do Cubo](/snapshots/banner_app.png)

## Sobre o Projeto  
Este projeto é uma galeria interativa 3D chamada **Museu dos Cubos**, desenvolvida para a disciplina de Computação Gráfica do curso de Ciência da Computação da UESPI – Campus Piripiri. O sistema permite ao usuário aplicar transformações geométricas (translação, rotação, escala) em um objeto tridimensional por meio do teclado, além de utilizar visualização com **projeção perspectiva**. O projeto também demonstra o uso de uma câmera posicionada e orientada com base na função `lookAt`.

A aplicação é baseada em WebGL e está disponível online via GitHub Pages.

## Tecnologias Utilizadas  
HTML5  
CSS3  
JavaScript  
WebGL  
GLMatrix  
GitHub Pages  

## Funcionalidades  
**Transformações 3D**  
Permite aplicar transformações no objeto em tempo real:
- **Translação** (movimentação)
- **Rotação** nos eixos X, Y e Z
- **Escala**
- **Composição de transformações** em sequência

**Projeção Perspectiva**  
Utiliza projeção com base em ângulo de visão (fov), aspecto da tela e planos de recorte (near e far), criando uma sensação de profundidade na visualização 3D.

**Câmera com lookAt**  
A posição do observador é definida manualmente e orientada com a função `lookAt`, simulando uma câmera posicionada em `[0, 0, 10]`, observando o centro da cena `[0, 0, 0]`.

**Controles via Teclado**  
O usuário pode interagir com o cubo usando as seguintes teclas:

| Ação         | Tecla(s)      |
|--------------|---------------|
| Rotação X    | I / K         |
| Rotação Y    | J / L         |
| Rotação Z    | U / O         |
| Translação   | W / A / S / D |
| Aumentar Escala | R          |
| Diminuir Escala | F          |

## Visualização do Projeto  
A aplicação está disponível online no seguinte link:  
👉 **[Museu dos cubos - Liedson Barros](https://liedsonlb.github.io/museu-dos-dados/)**

## Requisitos Atendidos  
- ✅ Transformações simples (translação, rotação e escala)  
- ✅ Composição de transformações  
- ✅ Controle de transformações via teclado  
- ✅ Aplicação de projeção perspectiva  
- ✅ Indicação da posição do observador/câmera  
- ✅ Estrutura de projeto documentada  

## Estrutura do Projeto

- `index.html`: Página principal do projeto  
- `style.css`: Estilização da galeria  
- `script.js`: Lógica de renderização, transformações e controles  
- `gl-matrix-min.js`: Biblioteca para operações matriciais e vetoriais  

## Documentação das Transformações  
As transformações aplicadas são realizadas por funções implementadas manualmente ou com auxílio da biblioteca GLMatrix:

- **createMat4()**: Criação de uma matriz identidade 4x4  
- **translate()**: Aplicação de translação  
- **rotateX(), rotateY(), rotateZ()**: Rotação em torno dos eixos  
- **scale()**: Escala uniforme ou não-uniforme  
- **perspective()**: Criação da matriz de projeção  
- **lookAt()**: Definição da matriz de visualização (câmera)  
- **multiply()**: Multiplicação de matrizes para compor transformações  

## Observações Finais  
Este projeto foi desenvolvido como desafio final da disciplina e representa a aplicação prática dos conceitos de transformações geométricas, visualização 3D, pipeline gráfico e interação com o usuário em ambiente WebGL.

## Autor  
Francisco Liédson – [@LiedsonLB](https://github.com/LiedsonLB)