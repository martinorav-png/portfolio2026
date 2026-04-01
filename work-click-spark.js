/**
 * Full-page pastel click sparks for static work.html (matches GlobalClickSpark on the React site).
 */
(function () {
  function hslToHex(h, s, l) {
    var s1 = s / 100;
    var l1 = l / 100;
    var a = s1 * Math.min(l1, 1 - l1);
    function f(n) {
      var k = (n + h / 30) % 12;
      var c = l1 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c)
        .toString(16)
        .padStart(2, '0');
    }
    return '#' + f(0) + f(8) + f(4);
  }

  function randomPastelHex() {
    return hslToHex(Math.random() * 360, 38 + Math.random() * 32, 74 + Math.random() * 18);
  }

  function randomVibrantHex() {
    return hslToHex(Math.random() * 360, 78 + Math.random() * 22, 36 + Math.random() * 24);
  }

  function randomSparkHexForTheme() {
    return document.documentElement.dataset.theme === 'dark' ? randomPastelHex() : randomVibrantHex();
  }

  function easeOut(t) {
    return t * (2 - t);
  }

  var sparkSize = 11;
  var sparkRadius = 18;
  var sparkCount = 10;
  var duration = 420;
  var extraScale = 1;

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:900;display:block;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var sparks = [];
  var rafId = 0;

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  resize();
  window.addEventListener('resize', resize);

  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparks = sparks.filter(function (spark) {
      var elapsed = ts - spark.startTime;
      if (elapsed >= duration) return false;

      var progress = elapsed / duration;
      var eased = easeOut(progress);
      var distance = eased * sparkRadius * extraScale;
      var lineLength = sparkSize * (1 - eased);

      var x1 = spark.x + distance * Math.cos(spark.angle);
      var y1 = spark.y + distance * Math.sin(spark.angle);
      var x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      var y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = spark.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    rafId = requestAnimationFrame(draw);
  }

  rafId = requestAnimationFrame(draw);

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var now = performance.now();

    for (var i = 0; i < sparkCount; i++) {
      sparks.push({
        x: x,
        y: y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
        color: randomSparkHexForTheme()
      });
    }
  }

  document.addEventListener('pointerdown', onPointerDown, true);
})();
