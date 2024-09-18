"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);
// the above can be also done using the for each loop

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// creating and inserting elements in dom for the cookie message displaying

const header = document.querySelector(".header");
const message = document.createElement("div"); //this will create a div object and stores it in the message variable

//adding a class to the message
message.classList.add("cookie-message");

// adding  content  using the innerhtml function
message.innerHTML =
  'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';

// adding the new element (div) to the header
header.prepend(message);

// deleting the cokie message if got it  btn was pressed
document.querySelector(".btn--close-cookie"),
  addEventListener("click", function () {
    message.remove();
  });

///////STYLES////////

message.style.backgroundColor = "#37383d";
message.style.color = "#FFFFFF";
message.style.width = "120%";

// increase the height of the message div
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";
// we are parsing the float because the getcomputedstyle will return the string value only

// IMPLEMENTING SMOOTH SCROLLING

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function () {
  /*
  
  const s1cords = section1.getBoundingClientRect(); //thiese are dimensions from the current top of browser and the section
  console.log(s1cords);
  console.log(document.documentElement.clientHeight); // this is the height of the section from the top of browser and it will remain same

  console.log("x-offset", window.pageXOffset);
  console.log("y-offset", window.pageYOffset); // this is the distance b/w the original top and the currnt top of the browser

  window.scrollTo({
    left: s1cords.left + window.pageXOffset,
    top: s1cords.top + window.pageYOffset,
    behavior: "smooth",
  });
  */
  //  uUSING THIS IS THE OLD AND MORE WORK INSTEAD THERE IS A MODERN WAY OF DOING IN  A SINGLE LINE
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////////////////////PAGE NAVIGATION//////////////////////////////////

/*
document.querySelectorAll(".nav__link").forEach(function (el) {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    const id = this.getAttribute("href"); //here this will refer to the current iterating nav__link and this will return the id inside the href
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
});

// */
// THIS IS NOT EFFECTIVE  IF IT CONTAINS MULTIPLE CLASSES
// INSTEAD OF THIS USE THE EVENT DELEGATION

// 1.Add event listener to the common parent element
// 2.determine what event originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

////////////TABBED CONTENT FOR OPERATIONS/////////////

// doing event delegation for operation tab container
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab"); //closest is to include the neighbour class also because that number span is deiffrenet class

  // guard clause
  if (!clicked) return; //this means if any other area than the tabs are clicked dont do any action just return

  // removing the active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active")); //removng the active class for all if the click happens
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  //activating the content area
  clicked.classList.add("operations__tab--active");

  document
    .querySelector(`.operations__content--${clicked.dataset.tab} `)
    .classList.add("operations__content--active");
});

///////doing menu fade animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link"); //selecting the nearby siblings (other nav buttons)
    const logo = link.closest(".nav").querySelector("img"); //selecting the logo

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
      logo.style.opacity = opacity;
    });
  }
};

nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});

// ////Sticky navigation////////

// using the Intersection API to implement the sticky

const headerVar = document.querySelector(".header");
const navheight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  // this if block means if the header is out of the view port the sticky should be added
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // here we are giving 0 bcoz we want to stick the nav if the header goes out of the view port
  rootMargin: `-${navheight}px`, // this is bcoz the sticky should be done little before the header ends as same as size of nav
});

headerObserver.observe(headerVar);

////////Revealing the sections on scroll///////

const allSections = document.querySelectorAll("section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // guard clause ---means if the section not came into view port do nothing
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden"); // the target is in the entry object just console the entry to check it

  // unobserve once after each section is once observed and revealed
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // means the section should reveal when the 15% of section came into view port
});

// iterate over all the section and add hidden class and apply observer
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

////////////LAZY LOADING OF IMAGES//////////
const imgSelectors = document.querySelectorAll("img[data-src]"); //this means select images only that contains data-src attribute (original img is in data-src )

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // guard clause
  if (!entry.isIntersecting) return;

  // remove the lazy image and displaying the original image
  entry.target.src = entry.target.dataset.src;

  // we need to remove the blur only if the image is loaded and so we use load event listner
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  // unobserve the target
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px", //this means the img should be loaded earlier b4 reaching it
});

imgSelectors.forEach((img) => imgObserver.observe(img));

// ==========SLIDER IMPLEMENTATIONS =================

// this is a example for image sliders implementation not in this project
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
const slides = document.querySelectorAll(".slide");
let curSlide = 0;
const maxSlide = slides.length;

/*slider.style.transform = "scale(0.3) translateX(-1200px)";  //this will just reduce the size of the slide  and not used in this project
 slider.style.overflow = "visible";*/

//  implementing dots
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"> </button>`
    );
  });
};
createDots();

// activate the dots
const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  // adding the active cls to the slide that was passed by selecting the dot class that contains the data-slide value same as slide number
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`) //this will make the current slide to translate 0 and previous to-100 and next to 100 and so on
  );
};
goToSlide(0); // to initilay display the first slide
activateDot(0);

// next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    //-1 bcoz the curSlide index start from 0
    curSlide = 0; //when reaches the last slide again come to the first slide
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

//previous slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1; //when reaches the first slide again comes to the last slide
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

// setting up the same functionality for the left and right arrow buttons

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const { slide } = e.target.dataset; //this will just hold the data-slide value in the slide obj
    goToSlide(slide);
    activateDot(slide);
  }
});

// to ask confirmation to leave the site
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
});
