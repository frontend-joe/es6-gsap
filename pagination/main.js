gsap.config({ trialWarn: false });
console.clear();

let select = (s) => document.querySelector(s),
  toArray = (s) => gsap.utils.toArray(s),
  mainSVG = select("#mainSVG"),
  allDots = toArray(".dot"),
  spacerX = (allDots.length * allDots[0].getAttribute("r")) / 1.35,
  currentDotId = 0,
  oldDotId = 0,
  currentDotArray = [],
  mainTl = gsap.timeline({ onComplete: reset }),
  viewbox = mainSVG
    .getAttribute("viewBox")
    .split(" ")
    .map((x) => parseInt(x)),
  sizeObj = {
    width: viewbox[2],
    height: viewbox[3],
  },
  mapX = gsap.utils.mapRange(
    0,
    allDots.length - 1,
    sizeObj.width / 2 - 2 * spacerX,
    sizeObj.width / 2 + 2 * spacerX
  ),
  mapDuration = gsap.utils.mapRange(
    (4 * spacerX) / allDots.length,
    4 * spacerX,
    0.4,
    0.66
  );

gsap.set("svg", {
  visibility: "visible",
});
function blendEases(startEase, endEase, blender) {
  var parse = function (ease) {
      return typeof ease === "function" ? ease : gsap.parseEase("power4.inOut");
    },
    s = gsap.parseEase(startEase),
    e = gsap.parseEase(endEase),
    blender = parse(blender);
  return function (v) {
    var b = blender(v);
    return s(v) * (1 - b) + e(v) * b;
  };
}

function reset() {
  allDots.forEach((c, i) => {
    gsap.set(c, {
      x: () => mapX(i),
      y: 300,
      fillOpacity: () => (i == currentDotId ? 1 : 0),
      rotation: 0,
    });
  });
}
function clickDot(id) {
  if (mainTl.isActive()) {
    mainTl.seek(mainTl.duration()).vars.onComplete();
  }
  oldDotId = currentDotId;
  currentDotId = id;
  currentDotArray = [];
  currentDotArray.push(allDots[oldDotId], allDots[currentDotId]);
  let distance =
    gsap.getProperty(allDots[oldDotId], "x") -
    gsap.getProperty(allDots[currentDotId], "x");
  let origin = null;
  let originDotId = distance > 0 ? 1 : 0;
  let direction = originDotId ? 1 : -1;
  origin = `${
    gsap.getProperty(currentDotArray[originDotId], "x") +
    direction * (distance / 2)
  } ${sizeObj.height / 2}`;
  mainTl.to(currentDotArray, {
    rotation: -direction * 180,
    svgOrigin: origin,
    duration: mapDuration(Math.abs(distance)),
    ease: blendEases("sine.in", "elastic(0.3, 0.6)"),
  });
}

allDots.forEach((c, i) => {
  reset();
  //want tootips?
  let t = document.createElementNS("http://www.w3.org/2000/svg", "title");
  //c.appendChild(t).innerHTML = `Page ${i+1}`;
  c.onclick = (e) => clickDot(i);
});

gsap.from(allDots, {
  scale: 0,
  transformOrigin: "50% 50%",
  y: "+=120",
  stagger: {
    each: 0.048,
  },
  duration: 0.8,
  ease: "elastic(0.6, 0.5)",
});
