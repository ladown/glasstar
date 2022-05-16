"use strict";

import gsap from "gsap";

import sal from "sal.js";
import "sal.js/dist/sal.css";

import Scrollbar from "smooth-scrollbar";

import Swiper, { Navigation, Pagination, Grid } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

import "./pug-files";
import "../scss/style.scss";

window.addEventListener("DOMContentLoaded", () => {
  // Global variables
  const html = document.documentElement;
  const body = document.body;
  const mainContent = document.querySelector("main.content");
  const header = document.querySelector('[data-header="block"]');

  // Define touch devices

  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  // Show elements on scrolling

  sal({ threshold: 0.2 });

  // Setting font size on resize

  const layoutSize = 1920;
  const defaultFontSize = 18;
  let windowWidth = window.innerWidth;
  let newFontSize = `${((windowWidth / layoutSize) * defaultFontSize).toFixed(4)}px`;

  html.setAttribute("style", `font-size: ${newFontSize}`);
  window.addEventListener("resize", (event) => {
    windowWidth = event.target.innerWidth;
    newFontSize = `${((windowWidth / layoutSize) * defaultFontSize).toFixed(4)}px`;
    html.setAttribute("style", `font-size: ${newFontSize}`);
  });

  // Loader

  const imagesToLoad = mainContent.querySelectorAll("img");
  const countImagesToLoad = imagesToLoad.length;

  let loadingProgress = 0;
  let loadedItems = 0;
  const percentForPerImage = 100 / countImagesToLoad;

  const loaderBlock = document.querySelector('[data-loader="block"]');
  const loaderBlockPercents = document.querySelector('[data-loader="percents"]');

  if (imagesToLoad.length) {
    imagesToLoad.forEach((el) => {
      if (el) {
        let image = new Image();
        image.src = el.src;
        image.onload = loadImage;
        image.onerror = (e) => {
          console.log(e);
        };
      } else {
        console.error("Unexpected element");
      }
    });
  } else {
    destroyLoader();
  }

  function loadImage() {
    loadingProgress += percentForPerImage;
    loadedItems++;
    if (loadingProgress === 100 || loadedItems === countImagesToLoad) {
      loaderBlockPercents.textContent = Math.round(loadingProgress);
      setTimeout(() => {
        destroyLoader();
      }, 500);
    } else {
      loaderBlockPercents.textContent = Math.round(loadingProgress);
    }
  }

  function destroyLoader() {
    gsap.to(loaderBlock, {
      translateY: "100%",
      ease: "slow(0.1, 0.7, false)",
      duration: 0.5,
      onStart: function () {
        gsap.to([header, mainContent], {
          display: "block",
          opacity: 1,
          duration: 0.3,
          delay: 0.1,
          ease: "power1.in",
        });
      },
      onComplete: function () {
        gsap.to(loaderBlock, { display: "none" });
        if (!isTouchDevice()) {
          Scrollbar.init(mainContent);
          body.classList.add("scroll-enabled");
        } else {
          body.classList.remove("scroll-enabled");
        }
      },
    });
  }

  const redirectedLinks = document.querySelectorAll('[data-link="redirect"]');
  redirectedLinks.forEach((link) => {
    let loadingProgress = 0;
    let loadedItems = 0;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const pageLink = this.getAttribute("href");
      loaderBlockPercents.textContent = "0";
      try {
        fetch(pageLink)
          .then((val) => {
            if (val.ok) {
              val.text().then((htmlResponse) => {
                const html = document.createElement("html");
                html.innerHTML = htmlResponse;
                gsap.to([header, mainContent], {
                  opacity: 0,
                  duration: 0.3,
                  ease: "power1.out",
                  onComplete: function () {
                    gsap.to([header, mainContent], {
                      display: "none",
                      duration: 0.05,
                      onStart: function () {
                        gsap.to(loaderBlock, {
                          display: "block",
                          duration: 0.05,
                          onComplete: function () {
                            gsap.to(loaderBlock, {
                              translateY: 0,
                              ease: "slow(0.1, 0.7, false)",
                              duration: 0.2,
                              onComplete: function () {
                                const imagesToLoad = html.querySelectorAll("main.content img");
                                const countImagesToLoad = imagesToLoad.length;
                                const percentForPerImage = 100 / countImagesToLoad;
                                if (imagesToLoad.length) {
                                  imagesToLoad.forEach((el) => {
                                    if (el) {
                                      let image = new Image();
                                      image.src = el.src;
                                      image.onload = () => {
                                        loadingProgress += percentForPerImage;
                                        loadedItems++;
                                        if (loadingProgress === 100 || loadedItems === countImagesToLoad) {
                                          loaderBlockPercents.textContent = Math.round(loadingProgress);
                                          location.href = pageLink;
                                        } else {
                                          loaderBlockPercents.textContent = Math.round(loadingProgress);
                                        }
                                      };
                                      image.onerror = () => {
                                        throw new Error("Something went wrong");
                                      };
                                    } else {
                                      throw new Error("Unexpected element");
                                    }
                                  });
                                } else {
                                  location.href = pageLink;
                                }
                              },
                            });
                          },
                        });
                      },
                    });
                  },
                });
              });
            } else {
              location.href = pageLink;
            }
          })
          .catch(() => {
            location.href = pageLink;
          });
      } catch (error) {
        location.href = pageLink;
      }
    });
  });

  // Mobile menu opening
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
            body.classList.remove("blocked-scroll");
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
          duration: 0.2,
          ease: "power2.out",
          onComplete: function () {
            header.classList.add("header--opened");
            mainContent.style.display = "none";
            body.classList.add("blocked-scroll");
            gsap.to(headerMenu, {
              display: "flex",
              ease: "power1.in",
              opacity: 1,
              duration: 0.2,
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
          body.classList.remove("blocked-scroll");
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
            duration: 0.3,
            display: "none",
            ease: "power1.inOut",
            onStart: function () {
              cardImg.style.pointerEvents = "none";
              gsap.to(cardArrow, {
                translateX: "0",
                duration: 0.6,
                ease: "power1.inOut",
                onStart: function () {
                  cardLine.style.width = "0";
                },
              });
            },
          });
          isAnimationStared = false;
        } else {
          cardImgBlock.style.display = "block";
          gsap.to(cardImgBlock, {
            top: `${yCord}px`,
            left: `${xCord}px`,
            duration: 0.05,
            onComplete: function () {
              cardImg.style.pointerEvents = "all";
              gsap.to(cardImgBlock, {
                opacity: 1,
                duration: 0.1,
                ease: "power1.inOut",
                onStart: function () {
                  if (!isAnimationStared) {
                    gsap.to(cardArrow, {
                      translateX: `-${window.innerWidth >= 1201 ? window.innerWidth - 100 : window.innerWidth <= 600 ? 0 : window.innerWidth - 60}px`,
                      duration: 0.6,
                      ease: "power1.inOut",
                      onStart: function () {
                        cardLine.style.width = "100vw";
                      },
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
          duration: 0.3,
          display: "none",
          ease: "power1.inOut",
          onStart: function () {
            cardImg.style.pointerEvents = "none";
            gsap.to(cardArrow, {
              translateX: "0",
              duration: 0.6,
              ease: "power1.inOut",
              onStart: function () {
                cardLine.style.width = "0";
              },
            });
          },
        });
        isAnimationStared = false;
      });
    });
  }

  const cardPromoSlider = document.querySelector("[data-slider='card-promo'] .swiper");

  if (cardPromoSlider) {
    const mainImgs = Array.from(document.querySelectorAll('[data-card-promo="img"]'));
    const progressBar = document.querySelector(".card-promo__slider-progress-bar");
    new Swiper(cardPromoSlider, {
      slidesPerView: "auto",
      preventClicks: false,
      modules: [Navigation, Pagination, Grid],
      navigation: {
        nextEl: '[data-slider="card-promo-next"]',
        prevEl: '[data-slider="card-promo-prev"]',
      },
      pagination: {
        el: '[data-slider="card-promo-pagination"]',
        clickable: true,
      },
      breakpoints: {
        769: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          grid: {
            rows: 2,
            fill: "row",
          },
        },
      },
      on: {
        slideChange: function () {
          if (window.innerWidth <= 768) {
            progressBar.style.transform = `scaleX(${this.progress ? this.progress : 0.1})`;
          }
        },
        afterInit: function (swiper) {
          swiper.slides.forEach((slide, index) => {
            slide.addEventListener("click", () => {
              if (!mainImgs[index].classList.contains("is-active")) {
                mainImgs.forEach((img) => {
                  if (img.classList.contains("is-active")) {
                    gsap.to(img, {
                      opacity: 0,
                      display: "none",
                      duration: 0.3,
                      onComplete: function () {
                        img.classList.remove("is-active");
                        gsap.to(mainImgs[index], {
                          opacity: 1,
                          display: "block",
                          duration: 0.3,
                          onComplete: function () {
                            mainImgs[index].classList.add("is-active");
                          },
                        });
                      },
                    });
                  }
                });
              }
            });
          });
        },
      },
    });
  }

  const callbackModal = document.querySelector('[data-modal="callback"]');
  const orderModal = document.querySelector('[data-modal="order"]');
  const openModalBtns = [...Array.from(document.querySelectorAll('[data-modal="open-callback"]')), ...Array.from(document.querySelectorAll('[data-modal="open-order"]'))];

  if ((callbackModal || orderModal) && openModalBtns.length) {
    const modals = [callbackModal, orderModal];
    modals.forEach((modal) => {
      if (modal) {
        modal.addEventListener("click", (event) => {
          if (event.target && event.target.dataset.modal === "close-btn") {
            gsap.to(modal, {
              opacity: 0,
              duration: 0.4,
              ease: "power3.out",
              onComplete: function () {
                modal.style.display = "none";
                body.classList.remove("blocked-scroll");
                gsap.to([mainContent, header], {
                  display: "block",
                  ease: "power1.in",
                  opacity: 1,
                  duration: 0.6,
                });
              },
            });
          }
        });
      }
    });

    openModalBtns.forEach((btn) => {
      const modalType = btn.getAttribute("data-modal").slice(5);
      btn.addEventListener("click", function () {
        if (modalType === "callback") {
          const modalTitle = callbackModal.querySelector(".modal__title");
          modalTitle.textContent = btn.querySelector("span").textContent;
          gsap.to([mainContent, header], {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: function () {
              mainContent.style.display = "none";
              header.style.display = "none";
              body.classList.add("blocked-scroll");
              gsap.to(callbackModal, {
                display: "flex",
                ease: "power1.in",
                opacity: 1,
                duration: 0.3,
              });
            },
          });
        } else if (modalType === "order") {
          const modalTitle = orderModal.querySelector(".modal__title");
          const goodTitle = document.querySelector(".card-promo__title").textContent;
          modalTitle.textContent = goodTitle;
          gsap.to([mainContent, header], {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: function () {
              mainContent.style.display = "none";
              header.style.display = "none";
              body.classList.add("blocked-scroll");
              gsap.to(orderModal, {
                display: "flex",
                ease: "power1.in",
                opacity: 1,
                duration: 0.3,
              });
            },
          });
        }
      });
    });
  }
});
