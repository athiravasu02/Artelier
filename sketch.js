let brushColor;
let brushSize = 10;
let brushType = 'smooth';

let colors = ['#FF0000', '#FFC130', '#27CA40', '#27C2CA', '#2742CA', '#7E27CA', '#CA279F'];

let promptData = [
  {
    prompt: "Draw your mood as if it was a weather forecast.",
    reflections: [
      "What part of your drawing feels most accurate to how you’re feeling right now?",
      "Did your “weather” shift as you were drawing? If so, how?",
      "Is the weather in your drawing something you’ve been feeling for a while, or something in the moment?"
    ]
  },
  {
    prompt: "Fill the page with repeating shapes until your mind feels calm.",
    reflections: [
      "How did your breathing change while you were drawing the repeating shapes?",
      "What did the rhythm of making the shapes feel like in your body?",
      "Did your mind quiet down, wander, or stay active during the process?"
    ]
  },
  {
    prompt: "Draw what your breathing feels like right now.",
    reflections: [
      "What part of your body did you feel the most while drawing your breath?",
      "Did your breathing change as you created the drawing? How?",
      "Were your breaths deep, shallow, slow, tight, or uneven? How did that show up in the drawing?"
    ]
  },
  {
    prompt: "Draw what comfort looks like as a texture.",
    reflections: [
      "What sensations (softness, warmth, smoothness, weight) inspired the texture you drew?",
      "Does the texture feel like something you’ve felt before in real life?",
      "What part of the drawing feels the most soothing to look at?"
    ]
  },
  {
    prompt: "Use colors to show which parts of yourself feel most present.",
    reflections: [
      "Which parts of yourself did you choose to highlight, and why those today?",
      "Were there parts of yourself that felt quiet, missing, or harder to represent?",
      "Did any colors surprise you as you worked?"
    ]
  },
  {
    prompt: "Create a line for each emotion you’re feeling with varying thickness and movement.",
    reflections: [
      "Which emotions did you choose to represent?",
      "Which emotion was the easiest to draw a line for? Which was hardest?",
      "Did you notice any emotions appearing that you didn’t expect?"
    ]
  },
  {
    prompt: "Choose a color that matches your current mood and build an abstract shape around it.",
    reflections: [
      "What emotions, memories, or sensations does the color represent for you?",
      "How did the abstract shape evolve as you drew it?",
      "Did your mood change at all during or after creating the shape?"
    ]
  }
];

let canvasDiv, uiDiv, reflectionDiv, promptP;

function setup() {
  noCanvas();

  let mainDiv = createDiv().style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('justify-content', 'center')
    .style('gap', '20px')
    .style('padding', '20px')
    .style('font-family', 'Arial, sans-serif')
    .style('background-color', '#f8f9ff')
    .style('color', '#3B2CC7');

  uiDiv = createDiv().parent(mainDiv)
    .style('flex', '1 1 250px')
    .style('max-width', '300px')
    .style('background', 'white')
    .style('padding', '20px')
    .style('border-radius', '12px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,0.1)');

  canvasDiv = createDiv().parent(mainDiv)
    .style('flex', '2 1 600px')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center');

  let c = createCanvas(max(windowWidth * 0.5, 400), max(windowHeight * 0.5, 400));
  c.parent(canvasDiv);
  background(255);
  brushColor = color(0);

  // === Prompt Section ===
  let promptBtn = createButton('Generate A New Prompt')
    .parent(uiDiv)
    .mousePressed(generatePrompt);
  styleButton(promptBtn, '#FC5C14', 'white');

  // Initial prompt
  generatePrompt();

  // === Brush Type ===
  createP('Brush Type').parent(uiDiv).style('font-weight', 'bold');
  ['Smooth', 'Crayon', 'Watercolor'].forEach(type => {
    let btn = createButton(type).parent(uiDiv);
    styleButton(btn, '#4E3DE5', 'white');
    btn.mousePressed(() => brushType = type.toLowerCase());
  });

  // === Brush Size ===
  createP('Brush Thickness').parent(uiDiv).style('font-weight', 'bold').style('margin-top', '10px');
  [{ n: 'Small', v: 5 }, { n: 'Medium', v: 10 }, { n: 'Large', v: 20 }].forEach(s => {
    let btn = createButton(s.n).parent(uiDiv);
    styleButton(btn, '#EA53EA', 'white');
    btn.mousePressed(() => brushSize = s.v);
  });

  // === Colors ===
  createP('Colors').parent(uiDiv).style('font-weight', 'bold').style('margin-top', '10px');
  let colorDiv = createDiv().parent(uiDiv);
  colors.forEach(c => {
    let btn = createButton('').parent(colorDiv);
    btn.style('background-color', c)
      .style('width', '30px')
      .style('height', '30px')
      .style('margin', '4px')
      .style('border-radius', '50%')
      .style('border', '2px solid white');
    btn.mousePressed(() => brushColor = color(c));
  });

  // === Controls ===
  let controlsDiv = createDiv().parent(uiDiv).style('margin-top', '10px');
  let saveBtn = createButton('Save Image').parent(controlsDiv).mousePressed(() => saveCanvas('my_art', 'png'));
  let clearBtn = createButton('Clear Canvas').parent(controlsDiv).mousePressed(() => background(255));
  styleButton(saveBtn, 'white', '#3B2CC7');
  styleButton(clearBtn, 'white', '#3B2CC7');

  // === Reflection Section ===
  reflectionDiv = createDiv().style('background', 'white')
    .style('padding', '20px')
    .style('margin', '20px')
    .style('border-radius', '12px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,0.1)')
    .style('flex-basis', '100%')
    .parent(mainDiv);
}

function draw() {
  if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (brushType === 'smooth') {
      stroke(brushColor);
      strokeWeight(brushSize);
      line(pmouseX, pmouseY, mouseX, mouseY);
    } else if (brushType === 'crayon') {
      noStroke();
      for (let i = 0; i < 20; i++) {
        let offsetX = random(-brushSize, brushSize);
        let offsetY = random(-brushSize, brushSize);
        fill(red(brushColor), green(brushColor), blue(brushColor), random(150, 255));
        ellipse(mouseX + offsetX, mouseY + offsetY, random(1, 3));
      }
    } else if (brushType === 'watercolor') {
      noStroke();
      let wc = color(red(brushColor), green(brushColor), blue(brushColor), 40);
      for (let i = 0; i < 5; i++) {
        let offsetX = random(-brushSize / 2, brushSize / 2);
        let offsetY = random(-brushSize / 2, brushSize / 2);
        fill(wc);
        ellipse(mouseX + offsetX, mouseY + offsetY, brushSize * 2);
      }
    }
  }
}

function generatePrompt() {
  if (!uiDiv || !reflectionDiv) return;

  let choice = random(promptData);

  // Update prompt
  if (!promptP) {
    promptP = createP(choice.prompt).parent(uiDiv)
      .style('background', '#fff')
      .style('padding', '10px')
      .style('border-radius', '8px')
      .style('box-shadow', '0 2px 5px rgba(0,0,0,0.1)');
  } else {
    promptP.html(choice.prompt);
  }

  // Clear previous reflections safely
  reflectionDiv.html('');
  createElement('h3', 'Reflect on your Process').parent(reflectionDiv)
    .style('color', '#3B2CC7');

  createP('Questions to help guide your reflection:').parent(reflectionDiv);

  choice.reflections.forEach(q => {
    createP(q).parent(reflectionDiv)
      .style('padding', '10px')
      .style('background', '#f8f9ff')
      .style('border-radius', '8px')
      .style('box-shadow', '0 1px 3px rgba(0,0,0,0.05)');
  });

  // Only one textarea
  let existingTA = reflectionDiv.elt.querySelector('textarea');
  if (!existingTA) {
    createElement('textarea').attribute('rows', 5).attribute('cols', 50)
      .style('border', '2px solid #3B2CC7')
      .style('border-radius', '8px')
      .style('padding', '10px')
      .style('width', '100%')
      .style('margin-top', '10px')
      .parent(reflectionDiv);
  }
}

function styleButton(btn, bg, color) {
  btn.style('background', bg)
    .style('color', color)
    .style('border', 'none')
    .style('border-radius', '6px')
    .style('padding', '8px 12px')
    .style('margin', '4px')
    .style('cursor', 'pointer')
    .style('font-family', 'Arial, sans-serif');
  btn.mouseOver(() => btn.style('opacity', '0.8'));
  btn.mouseOut(() => btn.style('opacity', '1'));
}

function windowResized() {
  if (typeof resizeCanvas === 'function') {
    let w = max(windowWidth * 0.5, 400);
    let h = max(windowHeight * 0.5, 400);
    resizeCanvas(w, h);
    background(255);
  }
}
