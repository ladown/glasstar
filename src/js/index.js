"use strict";

import gsap from "gsap";

import sal from "sal.js";
import "sal.js/dist/sal.css";

import "./pug-files";
import "../scss/style.scss";

window.addEventListener("DOMContentLoaded", () => {
  // Global variables
  const html = document.documentElement;
  const body = document.body;
  const mainContent = document.querySelector("main.content");

  // Show elements on scrolling
  sal({ threshold: 0.2 });

  // Mobile menu opening

  const header = document.querySelector('[data-header="block"]');
  const headerMenu = document.querySelector('[data-header="menu"]');

  header.addEventListener("click", function (event) {
    if (event.target && event.target.dataset.header === "menu-btn") {
      if (this.classList.contains("header--opened")) {
        this.classList.remove("header--opened");
        gsap.to(headerMenu, {
          opacity: 0,
          duration: 0.3,
          display: "none",
          ease: "power3.out",
          onComplete: function () {
            body.style.height = "100%";
            gsap.to(mainContent, {
              display: "block",
              ease: "power1.in",
              opacity: 1,
              duration: 0.6,
            });
          },
        });
      } else {
        gsap.to(mainContent, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: function () {
            header.classList.add("header--opened");
            body.style.height = "100vh";
            mainContent.style.display = "none";
            gsap.to(headerMenu, {
              ease: "power1.in",
              display: "flex",
              opacity: 1,
              duration: 0.3,
            });
          },
        });
      }
    }
  });

  window.addEventListener("resize", (event) => {
    if (event.target.innerWidth >= 993 && header.classList.contains("header--opened")) {
      header.classList.remove("header--opened");
      gsap.to(headerMenu, {
        opacity: 0,
        duration: 0.2,
        display: "none",
        ease: "power3.out",
        onComplete: function () {
          gsap.to(mainContent, {
            display: "block",
            ease: "power1.in",
            opacity: 1,
            duration: 0.6,
          });
        },
      });
    }
  });

  // Setting font size on resize

  const layoutSize = 1920;
  const defaultFontSize = 18;
  let windowWidth = window.innerWidth;
  let newFontSize = `${((windowWidth / layoutSize) * defaultFontSize).toFixed(4)}px`;

  if (windowWidth >= 1201) {
    html.setAttribute("style", `font-size: ${newFontSize}`);
  }

  window.addEventListener("resize", (event) => {
    windowWidth = event.target.innerWidth;
    newFontSize = `${((windowWidth / layoutSize) * defaultFontSize).toFixed(4)}px`;
    if (windowWidth >= 1201) {
      html.setAttribute("style", `font-size: ${newFontSize}`);
    }
  });

  // Good cards hover effect

  const goodsCards = document.querySelectorAll('[data-goods="item"]');

  if (goodsCards.length) {
    goodsCards.forEach((card) => {
      const cardImgBlock = card.querySelector(".goods__item-img");
      const cardImg = cardImgBlock.querySelector("img");
      const cardHeight = card.offsetHeight;
      const cardLine = card.querySelector(".goods__item-line");
      const cardArrow = card.querySelector(".goods__item-arrow");

      let isAnimationStared = false;

      card.addEventListener("mousemove", function (event) {
        const imgWidth = cardImg.offsetWidth;
        const imgHeight = Number(window.getComputedStyle(cardImg).height.replace("px", ""));
        const rect = this.getBoundingClientRect();
        const leftBorder = event.clientX - rect.left - imgWidth / 2 <= 0;
        const rightBorder = event.clientX + imgWidth / 2 > rect.left + rect.width;
        const isCardOverflowed = cardHeight <= event.clientY - rect.top;
        let xCord = null;
        let yCord = imgHeight / 2;
        if (leftBorder) {
          xCord = imgWidth / 2 - 2;
        } else if (rightBorder) {
          xCord = rect.width - imgWidth / 2 + 2;
        } else {
          xCord = event.clientX - rect.left;
        }
        if (isCardOverflowed) {
          gsap.killTweensOf([cardImgBlock, cardLine, cardArrow]);
          gsap.to(cardImgBlock, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.out",
            onComplete: function () {
              cardImgBlock.style.display = "none";
            },
            onStart: function () {
              cardImg.style.pointerEvents = "none";
              gsap.to(cardLine, { width: "0", duration: 0.4, ease: "power1.out" });
              gsap.to(cardArrow, { translateX: "0", duration: 0.4, ease: "power1.out" });
            },
          });
          isAnimationStared = false;
        } else {
          gsap.to(cardImgBlock, {
            top: `${yCord}px`,
            left: `${xCord}px`,
            display: "block",
            duration: 0.05,
            onComplete: function () {
              cardImg.style.pointerEvents = "all";
              gsap.to(cardImgBlock, {
                opacity: 1,
                duration: 0.2,
                ease: "power1.in",
                onComplete: function () {
                  if (!isAnimationStared) {
                    gsap.to(cardLine, {
                      width: "100vw",
                      duration: 0.3,
                      ease: "power1.in",
                    });
                    gsap.to(cardArrow, {
                      translateX: `-${window.innerWidth >= 1201 ? window.innerWidth - 100 : window.innerWidth <= 600 ? 0 : window.innerWidth - 60}px`,
                      delay: 0.1,
                      duration: 0.6,
                      ease: "power2.in",
                    });
                    isAnimationStared = true;
                  }
                },
              });
            },
          });
        }
      });

      card.addEventListener("mouseleave", function () {
        gsap.killTweensOf([cardImgBlock, cardLine, cardArrow]);
        gsap.to(cardImgBlock, {
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
          onComplete: function () {
            cardImgBlock.style.display = "none";
          },
          onStart: function () {
            cardImg.style.pointerEvents = "none";
            gsap.to(cardLine, { width: "0", duration: 0.4, ease: "power1.out" });
            gsap.to(cardArrow, { translateX: "0", duration: 0.4, ease: "power1.out" });
          },
        });
        isAnimationStared = false;
      });
    });
  }
});
