$('#generate-palette').click(generateColors)
$('.color-window').click(lockColor)

var safeColors = ['00', '33', '66', '99', 'cc', 'ff'];
var rand = function() {
  return Math.floor(Math.random() * 6);
};
var randomColor = function() {
  var r = safeColors[rand()];
  var g = safeColors[rand()];
  var b = safeColors[rand()];

  return "#" + r + g + b;
};

function generateColors() {
  const windows = [$('#window-one'), $('#window-two'), $('#window-three'), $('#window-four'), $('#window-five')];

  windows.forEach(window => {
    if (!window.hasClass('locked')) {
      const random = randomColor();

      window.css('background', random);
      window.text(random.toUpperCase())
    }
  })
}

function lockColor() {
  $(this).toggleClass('locked')

  if ($(this).text() == $(this).data("text-swap")) {
    $(this).text($(this).data("text-original"));
  } else {
    $(this).data("text-original", $(this).text());
    $(this).text($(this).data("text-swap"));
  }
}


$(document).ready(function() {
  generateColors();
});

