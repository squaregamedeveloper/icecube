

//document.addEventListener("DOMContentLoaded", function(event) {
  c = document.getElementById("game");
  c.setAttribute('width', document.body.clientWidth); //max width
  c.setAttribute('height', document.body.clientHeight); //max height
  ctx = c.getContext("2d");
  let baseWidth = 1853;
  let baseHeight = 951;
  let scale = 1;
  // ctx.globalAlpha = 0.1;
  mousePosition = {x: 250, y: 250};
  controls = new Controls();
  const g = 9.8 / 16;
  document.addEventListener("mousemove", (e) => {
    mousePosition = {x: e.clientX / scale, y: e.clientY / scale};
  });
  document.addEventListener("mousedown", controls.mouseDown);
  document.addEventListener("mouseup", controls.mouseUp);
  document.addEventListener("keyup", controls.keyUp);
  document.addEventListener("keydown", controls.keyDown);

  player1_id = generateID();
  player2_id = generateID();
  let initialState = {
    players: {
      player1_id: {
        x: 150,
        y: 200
      }
    },
    walls: {
      "leftWall": {x: 0, y: 0, width: 50, height: baseHeight, color: "#9ed8f0"},
      "topWall": {x: 0, y: 0, width: baseWidth, height: 50, color: "#9ed8f0"},
      "rightWall": {x: baseWidth - 50, y: 0, width: 50, height: baseHeight, color: "#9ed8f0"},
      "bottomWall": {x: 0, y: baseHeight - 50, width: baseWidth, height: 50, color: createGradient(0, baseHeight - 50, 0, baseHeight)},
      "platform": {x: 150, y: baseHeight - 300, width: baseWidth / 4, height: 50, color: createGradient(150, baseHeight - 300, 150, baseHeight - 250)},
    },
  };

  let world = new World(initialState);

  function handleCanvas() {
    c.setAttribute('width', document.body.clientWidth); //max width
    c.setAttribute('height', document.body.clientHeight); //max height
    let scaleX = document.body.clientWidth / baseWidth;
    let scaleY = document.body.clientHeight / baseHeight;
    scale = Math.min(scaleX, scaleY);
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, c.width, c.height);
  }

  function loop(a) {
    // Update
    world.update();

    // Draw
    handleCanvas();
    world.draw();

    // Loop
    window.requestAnimationFrame(loop);

    // Debug
    ctx.font = "30px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText(`${JSON.stringify(mousePosition)}`, 20, 30)
  }

  window.requestAnimationFrame(loop);
//});


