let CLEAR_BLOCKS_PER_AXIS = 7;

function clearScreen() {
  let x = 0;
  let y = 0;
  window.requestAnimationFrame(() => {
    clearBlock(x, y);
  });
}

function clearBlock(x, y) {
  let canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  let clearBlockWidthSizePixels = parseInt(canvas.width / CLEAR_BLOCKS_PER_AXIS, 10);
  let clearBlockHeightSizePixels = parseInt(canvas.height / CLEAR_BLOCKS_PER_AXIS, 10);

  ctx.clearRect(x, y, clearBlockWidthSizePixels, clearBlockHeightSizePixels);

  if (x < canvas.width) {
    x += clearBlockWidthSizePixels;
  } else if (y < canvas.width) {
    x = 0;
    y += clearBlockHeightSizePixels;
  }

  if (x < canvas.width || y < canvas.height) {
    // console.log('X: ', x);
    // console.log('Y: ', y);
    window.requestAnimationFrame(() => {
      clearBlock(x, y);
    });
  }
}





// for drag events
// store the mouse coordinate
// brush action
let canvas = document.getElementById('canvas');
var canvasCtx = canvas.getContext("2d");


function clearCircle(x, y, radius) {
	canvasCtx.save();
	canvasCtx.beginPath();
	canvasCtx.arc(x, y, radius, 0, 2*Math.PI, true);
	canvasCtx.clip();
	canvasCtx.clearRect(x-radius,y-radius,radius*2,radius*2);
	canvasCtx.restore();
}

var mouse = {
  x: 0,
  y: 0
};

// get the mouse position given a mouse event
function getPosition(event) {
  if (event.x != undefined && event.y != undefined) {
    mouse.x = event.x;
    mouse.y = event.y;
  } else if (event.pageX != undefined && event.pageY != undefined) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  } else {
    mouse.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    mouse.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  mouse.x -= canvas.offsetLeft;
  mouse.y -= canvas.offsetTop;
};

var drag = false;

// configure handlers for mouse events
canvas.addEventListener("mousedown", function (event) {
    drag = true;
    // prevent event defaults
    event.preventDefault();
    event.stopPropagation();
    return false;
}, false);

canvas.addEventListener("mouseup", function (event) {
    drag = false;
    // prevent event defaults
    event.preventDefault();
    event.stopPropagation();
    return false;
}, false);

canvas.addEventListener("mousemove", function (event) {
    if (drag) {
      getPosition(event);
      clearCircle(mouse.x, mouse.y, 30);
    }

    // prevent event defaults
    event.preventDefault();
    event.stopPropagation();
    return false;
}, false);

