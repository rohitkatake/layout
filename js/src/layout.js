(function(window, document, $, Layouts, undefined) {

  if(!window.LayoutApp) {
    window.LayoutApp = {};
  }

  window.LayoutApp = (function() {

    var images = [],

        layoutOptions = $('#layout-options'),
        gallery = $('#gallery'),
        camera,

        layouts = Layouts.getLayouts(),

        CANVAS = 'canvas',
        MAX_IMAGES = Layouts.getImagesPerLayout(),
        MAX_MEASURE = Layouts.getCanvasMaxHeight(),

        initCamera = function() {
          if(!window.JpegCamera) {
            alert('Camera access is not available in your browser');
          } else {
            camera = new JpegCamera('#camera').ready(function() {

            }).error(function() {
                alert('Camera access was denied');
            });
          }
        },

        updateGallery = function(canvas) {
          gallery.append($(canvas).height(200));
        },

        setImageMeasures = function(layout, targetCanvas) {
          if(Layouts.isVertical(layout)) {
            return {
              width: $(targetCanvas).width(),
              height: $(targetCanvas).height() / images.length
            };
          } else if(Layouts.isHorizontal(layout)) {
            return {
              width: $(targetCanvas).width() / images.length,
              height: $(targetCanvas).height()
            };
          } else if(layout.callback && layout.callback.constructor === 'Function') {
            return layout.callback(layout, targetCanvas, images);
          }

          return {
            width: $(targetCanvas).width(),
            height: $(targetCanvas).height()
          };
        },

        setImageCoordinates = function(targetCanvas, layout, imageWidth, imageHeight, imageIndex) {
          if(Layouts.isVertical(layout)) {
            return {
              x: 0,
              y: imageHeight * imageIndex
            };
          } else if(Layouts.isHorizontal(layout)) {
            return {
              x: imageWidth * imageIndex,
              y: 0
            };
          }
        },

        /**
         * Fix to the intrinsic width as per:
         * http://stackoverflow.com/questions/3186150/image-draws-stretched-to-html-canvas-when-created-using-jquery
         */
        setUpCanvas = function() {
          var elem = $('<canvas>', {
                width: MAX_MEASURE,
                height: MAX_MEASURE
              }),
              targetCanvas = elem[0];

          targetCanvas.width = targetCanvas.height = MAX_MEASURE;
          return targetCanvas;
        },

        updateLayouts = function(canvas) {
          // ctx.drawImage(image, dx, dy, dWidth, dHeight);
          layoutOptions.html('');

          for(var i = 0, layout; layout = layouts[i]; i++) {
            var targetCanvas = setUpCanvas(),
                context = targetCanvas.getContext('2d'),
                imageMeasure = setImageMeasures(layout, targetCanvas);

            for(var j = 0, image; image = images[j]; j++) {
              var coordinates = setImageCoordinates(targetCanvas, layout, imageMeasure.width, imageMeasure.height, j);

              // context.drawImage(image._canvas, coordinates.x, coordinates.y, imageWidth, imageHeight);
              context.drawImage(image._canvas, coordinates.x, coordinates.y, imageMeasure.width, imageMeasure.height);
            }

            layoutOptions.append(targetCanvas);
          }
        },

        /**
         * To be completed
         */
        updateImages = function(snapshot) {
          newImages = [];

          for(var i = 0, image; image = images[i]; i++) {
            newImages.push(image);
          }

          if(newImages.length < MAX_IMAGES) {

          }

          images = newImages;
        },

        updateView = function(canvas) {
          updateGallery(canvas);
          updateLayouts(canvas);
        },

        capture = function() {
          var snapshot = camera.capture();

          if(images.length < MAX_IMAGES) {
            // updateImages(snapshot);
            images.push(snapshot);
            snapshot.get_canvas(updateView);
          }
        },

        bindEvents = function() {
          $('#camera-wrapper').on('click', '#shoot', capture);
        };

    return {
      init: function() {
        initCamera();
        bindEvents();
      }
    }

  })();

})(window, document, jQuery, window.LayoutApp.Layouts);
