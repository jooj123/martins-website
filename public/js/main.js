import { cover } from 'https://unpkg.com/intrinsic-scale@3.0.3/dist/intrinsic-scale.es-modules.js';
import debounce from 'https://unpkg.com/lodash-es@4.17.10/debounce.js';

let PROFILE_IMAGE_WIDTH = 1500;
let PROFILE_IMAGE_HEIGHT = 1000;
let PROFILE_IMAGE_PATH = 'images/martin.jpg';

let loadingIndicatorCount = 0;
let loading = false;
let loaded = false;

function loadBackground(ctx, screenWidth, screenHeight, imageWidth, imageHeight, callback) {
  let backgroundImage = new Image();

  backgroundImage.onload = function () {
    // calculate "background-size: cover;" equivalent in canvas
    const imageCoords = cover(screenWidth, screenHeight, imageWidth, imageHeight);

    ctx.drawImage(backgroundImage, imageCoords.x, imageCoords.y, imageCoords.width, imageCoords.height);

    // optional callback
    if (callback) {
      callback(imageCoords);
    }
  };

  backgroundImage.src = PROFILE_IMAGE_PATH;
}

function start() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');

  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;

  canvas.width = screenWidth;
  canvas.height = screenHeight;

  loadBackground(ctx, screenWidth, screenHeight, PROFILE_IMAGE_WIDTH, PROFILE_IMAGE_HEIGHT);
}

function pixelAnimation() {
  window.requestAnimationFrame(() => {
    pixelate(0.50);
  });
}

function pixelate(size) {

  let ctx = canvas.getContext('2d');

  if (size <= 0) {
    clearScreen(ctx);
    return;
  }

  // turn off image aliasing so are able to get pixelated effect
  ctx.msImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  // get scaled width and height
  let w = canvas.width * size;
  let h = canvas.height * size;

  // load scaled image and then scale up the same canvas to get pixelated effect
  loadBackground(ctx, w, h, w, h, (imageCoords) => {
    const newImageCoords = cover(canvas.width, canvas.height, PROFILE_IMAGE_WIDTH, PROFILE_IMAGE_HEIGHT);
    ctx.drawImage(
      canvas,
      imageCoords.x, imageCoords.y, imageCoords.width, imageCoords.height,
      newImageCoords.x, newImageCoords.y, newImageCoords.width, newImageCoords.height
    );
  });

  window.requestAnimationFrame(() => {
    pixelate(size - 0.003);
  });
}

function clearScreen(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeStatus(text) {
  let element = document.getElementById('status');
  element.innerHTML = text;
}

function setLoaded() {
  let element = document.getElementById('main');
  element.classList.add('active');
}

// simulate a loader
function runLoader() {
  let maxIndicators = 15;

  setTimeout(function() {
    let str = '';

    // only need max amount of indicators
    if (loadingIndicatorCount === maxIndicators) {
      loaded = true;
      loading = false;
    }

    if (loading) {
      let indicators = '';

      loadingIndicatorCount += 1;
      str += 'Loading [';

      for (let index = 0; index < loadingIndicatorCount; index++) {
        indicators += '#';
      }

      str += indicators.padEnd(maxIndicators, "\u00A0") + ']';

      changeStatus(str);
    } else if (loaded) {
      str += 'Loaded 🎉';
      changeStatus(str);
      setLoaded();
      return;
    }

    window.requestAnimationFrame(runLoader);
  }, 170);
}

start();

// regen image / canvas on resize
window.addEventListener('resize', debounce(start, 300));

// register continue event
// only register this after a small delay so you can see my profile pic :)
setTimeout(function() {
  document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    loading = true;
    runLoader();
    pixelAnimation();
  });
}, 2000);






