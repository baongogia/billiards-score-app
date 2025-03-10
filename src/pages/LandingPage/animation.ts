/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";

const checkElementExists = (selector: string) => {
  return document.querySelector(selector) !== null;
};
const safeGSAP = (selector: string, options: any) => {
  if (checkElementExists(selector)) {
    gsap.to(selector, options);
  } else {
    console.warn(`GSAP target ${selector} not found.`);
  }
};
// Data
const data = [
  {
    place: "Billiards",
    title: "BIDA",
    title2: "CARAMBOL",
    description:
      "Carom billiards is a pocketless game that requires advanced techniques, precise spin control, and strategic shot planning.",
    image:
      "https://gcs.tripi.vn/public-tripi/tripi-feed/img/474072Muj/background-bida-dep_100735723.jpg",
  },
  {
    place: "Billiards",
    title: "BIDA",
    title2: "CARAMBOL",
    description:
      "Carom billiards is a pocketless game that requires advanced techniques, precise spin control, and strategic shot planning.",
    image:
      "https://images.pexels.com/photos/5986316/pexels-photo-5986316.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    place: "Billiards",
    title: "BIDA",
    title2: "POOL",
    description:
      "Pool billiards is the most popular type, played on a six-pocket table with various game modes like 8-ball, 9-ball, and 10-ball.",
    image:
      "https://images.pexels.com/photos/7403778/pexels-photo-7403778.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    place: "Billiards",
    title: "BIDA",
    title2: "SNOOKER",
    description:
      "Snooker is a professional game played on a large table with multiple red and colored balls, demanding strategic play and precision.",
    image:
      "https://images.pexels.com/photos/6253682/pexels-photo-6253682.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    place: "Billiards",
    title: "BIDA",
    title2: "ENGLISH",
    description:
      "English billiards is a hybrid game combining elements of carom and snooker, often played on a snooker table.",
    image:
      "https://images.pexels.com/photos/7403774/pexels-photo-7403774.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const _ = (id: any) => document.getElementById(id);
const cards = data
  .map(
    (i, index) =>
      `<div class="card bg-cover bg-center bg-no-repeat" id="card${index}" style="background-image:url(${
        i.image ? i.image : ""
      })"></div>`
  )
  .join("");

const cardContents = data
  .map(
    (i, index) => `
    <div class="card-content" id="card-content-${index}">
      <div class="content-start"></div>
      <div class="content-place">${i.place}</div>
      <div class="content-title-1">${i.title}</div>
      <div class="content-title-2">${i.title2}</div>
    </div>`
  )
  .join("");

const sildeNumbers = data
  .map(
    (_, index) =>
      `<div class="item" id="slide-item-${index}" >${index + 1}</div>`
  )
  .join("");
const demoElement = _("demo");
if (demoElement) {
  demoElement.innerHTML = cards + cardContents;
  document.body.appendChild(demoElement);
}
const slideNumbersElement = _("slide-numbers");
if (slideNumbersElement) {
  slideNumbersElement.innerHTML = sildeNumbers;
}

const set = gsap.set;

function getCard(index: any) {
  return `#card${index}`;
}
function getCardContent(index: any) {
  return `#card-content-${index}`;
}
function getSliderItem(index: any) {
  return `#slide-item-${index}`;
}

function animate(target: any, duration: any, properties: any) {
  return new Promise((resolve) => {
    safeGSAP(target, {
      ...properties,
      duration: duration,
      onComplete: resolve,
    });
  });
}

const order = [0, 1, 2, 3, 4];
const originalOrder = [...order];
let detailsEven = true;
let offsetTop = 200;
let offsetLeft = 700;
const cardWidth = 200;
const cardHeight = 300;
const gap = 40;
const numberSize = 50;
const ease = "sine.inOut";
// Init
function init() {
  const [active, ...rest] = order;
  gsap.set(".card", { opacity: 1 });
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;
  offsetTop = height - 430;
  offsetLeft = width - 830;

  gsap.set("#pagination", {
    top: offsetTop + 330,
    left: offsetLeft,
    y: 200,
    opacity: 0,
    zIndex: 60,
  });
  gsap.set("nav", { y: -200, opacity: 0 });

  gsap.set(getCard(active), {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  gsap.set(getCardContent(active), {
    x: 0,
    y: 0,
    opacity: 0,
  });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .text`, { y: 100 });
  gsap.set(`${detailsInactive} .title-1`, { y: 100 });
  gsap.set(`${detailsInactive} .title-2`, { y: 100 });
  gsap.set(`${detailsInactive} .desc`, { y: 50 });

  gsap.set(".progress-sub-foreground", {
    width: 500 * (1 / order.length) * (active + 1),
  });

  rest.forEach((i, index) => {
    gsap.set(getCard(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 10,
    });
    gsap.set(getCardContent(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      zIndex: 40,
      y: offsetTop + cardHeight - 100,
    });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });

  gsap.set(".indicator", { x: -window.innerWidth });

  const startDelay = 0.6;

  safeGSAP(".cover", {
    x: width + 400,
    delay: 0.5,
    ease,
    onComplete: () => {
      setTimeout(() => {
        loop();
      }, 500);
    },
  });
  rest.forEach((i, index) => {
    safeGSAP(getCard(i), {
      x: offsetLeft + index * (cardWidth + gap),
      zIndex: 30,
      delay: 0.05 * index,
      ease,
    });
    safeGSAP(getCardContent(i), {
      x: offsetLeft + index * (cardWidth + gap),
      zIndex: 40,
      delay: 0.05 * index,
      ease,
    });
  });
  safeGSAP("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  safeGSAP("nav", { y: 0, opacity: 1, ease, delay: startDelay });
  safeGSAP(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

let clicks = 0;
// Step
function step() {
  return new Promise((resolve) => {
    if (order.length === 0) {
      order.push(...originalOrder);
    }

    const shifted = order.shift();
    if (shifted !== undefined) detailsEven = !detailsEven;

    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

    if (shifted === undefined) {
      console.error("No more slides available, resetting order.");
      order.push(...originalOrder);
      return;
    }

    if (order.length === 0) {
      console.warn("Resetting order...");
      order.push(...originalOrder);
    }

    if (typeof order[0] === "undefined" || !data[order[0]]) {
      console.error("Invalid slide index:", order[0]);
      return;
    }

    const placeBoxText = document.querySelector(
      `${detailsActive} .place-box .text`
    );
    if (placeBoxText) placeBoxText.textContent = data[order[0]]?.place;
    const title1Element = document.querySelector(`${detailsActive} .title-1`);
    if (title1Element) {
      title1Element.textContent = data[order[0]]?.title;
    }
    const title2Element = document.querySelector(`${detailsActive} .title-2`);
    if (title2Element) {
      title2Element.textContent = data[order[0]]?.title2;
    }
    const descElement = document.querySelector(`${detailsActive} .desc`);
    if (descElement) {
      descElement.textContent = data[order[0]]?.description;
    }

    gsap.set(detailsActive, { zIndex: 22 });
    safeGSAP(detailsActive, { opacity: 1, delay: 0.4, ease });
    safeGSAP(`${detailsActive} .text`, {
      y: 0,
      delay: 0.1,
      duration: 0.7,
      ease,
    });
    safeGSAP(`${detailsActive} .title-1`, {
      y: 0,
      delay: 0.15,
      duration: 0.7,
      ease,
    });
    safeGSAP(`${detailsActive} .title-2`, {
      y: 0,
      delay: 0.15,
      duration: 0.7,
      ease,
    });
    safeGSAP(`${detailsActive} .desc`, {
      y: 0,
      delay: 0.3,
      duration: 0.4,
      ease,
    });
    safeGSAP(`${detailsActive} .cta`, {
      y: 0,
      delay: 0.35,
      duration: 0.4,
      onComplete: resolve,
      ease,
    });
    gsap.set(detailsInactive, { zIndex: 12 });

    const [active, ...rest] = order;
    const prv = rest[rest.length - 1];

    // gsap.set(getCard(prv), { zIndex: 10 });
    gsap.set(getCard(active), { zIndex: 20 });
    safeGSAP(getCard(prv), {
      onComplete: () => {
        gsap.set(getCard(prv), { zIndex: 30 });
      },
    });

    safeGSAP(getCardContent(active), {
      y: offsetTop + cardHeight - 10,
      opacity: 0,
      duration: 0.3,
      ease,
    });
    safeGSAP(getSliderItem(active), { x: 0, ease });
    safeGSAP(getSliderItem(prv), { x: -numberSize, ease });
    safeGSAP(".progress-sub-foreground", {
      width: 500 * (1 / order.length) * (active + 1),
      ease,
    });

    safeGSAP(getCard(active), {
      x: 0,
      y: 0,
      ease,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      onComplete: () => {
        const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
        gsap.set(getCard(prv), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
          transition: "all 0.2s",
          willChange: "transform",
          ease,
          scale: 1,
        });

        gsap.set(getCardContent(prv), {
          x: xNew,
          y: offsetTop + cardHeight - 100,
          opacity: 1,
          transition: "all 0.2s",
          willChange: "transform",
          borderRadius: 10,
          zIndex: 40,
        });
        gsap.set(getSliderItem(prv), { x: rest.length * numberSize });

        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 100 });
        gsap.set(`${detailsInactive} .title-1`, { y: 100 });
        gsap.set(`${detailsInactive} .title-2`, { y: 100 });
        gsap.set(`${detailsInactive} .desc`, { y: 50 });
        gsap.set(`${detailsInactive} .cta`, { y: 60 });

        clicks -= 1;
        if (clicks > 0) {
          step();
        }
      },
    });

    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), { zIndex: 30 });
        safeGSAP(getCard(i), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          borderRadius: 10,
          ease,
          delay: 0.1 * (index + 1),
        });

        safeGSAP(getCardContent(i), {
          x: xNew,
          y: offsetTop + cardHeight - 100,
          borderRadius: 10,
          opacity: 1,
          zIndex: 40,
          ease,
          delay: 0.1 * (index + 1),
        });
        safeGSAP(getSliderItem(i), { x: (index + 1) * numberSize, ease });
      }
    });
  });
}
// Loop
async function loop() {
  await animate(".indicator", 2, { x: 0 });
  await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
  set(".indicator", { x: -window.innerWidth });
  await step();
  loop();
}
// Load Image
async function loadImage(src: any) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadImages() {
  const promises = data.map(({ image }) => loadImage(image));
  return Promise.all(promises);
}
// Start
async function start() {
  try {
    await loadImages(); // Đợi ảnh load xong trước khi tiếp tục

    setTimeout(() => {
      const demoElement = document.getElementById("demo");
      if (!demoElement) {
        console.error("Element with ID 'demo' not found!");
        return;
      }
      demoElement.innerHTML = cards + cardContents;
      demoElement.style.opacity = "1";
      init();
      loop();
    }, 500);
  } catch (error) {
    console.error("One or more images failed to load", error);
  }
}
// Event Listeners: Đảm bảo chỉ gọi `start()` khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", start);
export { start };
