// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"canvasMask.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyCanvasMask = applyCanvasMask;

/*
Canvas Mask Utility v0.2
Use HTML5 Canvas to apply an alpha mask to an image element.
---
http://github.com/benbarnett/canvas-mask
http://benbarnett.net
@benpbarnett
---
Copyright (c) 2011 Ben Barnett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---

*/

/**
	@private
	@name applyCanvasMask
	@function
	@description Use Canvas to apply an Alpha Mask to an <img>. Preload images first.
	@param {object} [image] The <img> to apply the mask
	@param {object} [mask] The <img> containing the PNG-24 mask image
	@param {int} [width] The width of the image (should be the same as the mask)
	@param {int} [height] The height of the image (should be the same as the mask)
	@param {boolean} [asBase64] Option to return the image as Base64
*/
function applyCanvasMask(image, mask, width, height, asBase64) {
  // check we have Canvas, and return the unmasked image if not
  if (!document.createElement('canvas').getContext && !asBase64) {
    return image;
  } else if (!document.createElement('canvas').getContext && asBase64) {
    return image.src;
  }

  var bufferCanvas = document.createElement('canvas'),
      buffer = bufferCanvas.getContext('2d'),
      outputCanvas = document.createElement('canvas'),
      output = outputCanvas.getContext('2d'),
      contents = null,
      imageData = null,
      alphaData = null; // set sizes to ensure all pixels are drawn to Canvas

  bufferCanvas.width = width;
  bufferCanvas.height = height * 2;
  outputCanvas.width = width;
  outputCanvas.height = height; // draw the base image

  buffer.drawImage(image, 0, 0); // draw the mask directly below

  buffer.drawImage(mask, 0, height); // grab the pixel data for base image

  contents = buffer.getImageData(0, 0, width, height); // store pixel data array seperately so we can manipulate

  imageData = contents.data; // store mask data

  alphaData = buffer.getImageData(0, height, width, height).data; // loop through alpha mask and apply alpha values to base image

  for (var i = 3, len = imageData.length; i < len; i = i + 4) {
    if (imageData[i] > alphaData[i]) {
      imageData[i] = alphaData[i];
    }
  } // return the pixel data with alpha values applied


  if (asBase64) {
    output.clearRect(0, 0, width, height);
    output.putImageData(contents, 0, 0);
    return outputCanvas.toDataURL();
  } else {
    return contents;
  }
}
},{}]},{},["canvasMask.js"], null)
//# sourceMappingURL=/canvasMask.b3abcca2.js.map