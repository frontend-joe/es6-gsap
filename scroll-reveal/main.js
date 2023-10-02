ScrollTrigger.batch("section > div", {
  interval: 0.1,
  batchMax: 3,
  onEnter: (batch) =>
    gsap.to(batch, { autoAlpha: 1, stagger: 0.15, overwrite: true }),
  onLeave: (batch) => gsap.set(batch, { autoAlpha: 0, overwrite: true }),
  onEnterBack: (batch) =>
    gsap.to(batch, { autoAlpha: 1, stagger: 0.15, overwrite: true }),
  onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0, overwrite: true }),
});
