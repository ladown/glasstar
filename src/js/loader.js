"use strict";

import Scrollbar from "smooth-scrollbar";
import gsap from "gsap";

import "../scss/loader.scss";

window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('[data-header="block"]');
  const mainContent = document.querySelector("main.content");

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
        Scrollbar.init(mainContent);
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
                                  console.warn("There are no pictures to load on the next page");
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
              throw new Error(`There is a following error occurred: ${val.statusText}`);
            }
          })
          .catch((reason) => {
            throw new Error(reason);
          });
        // .finally(() => {
        //   location.href = pageLink;
        // });
      } catch (error) {
        throw new Error(`There is a following error occurred: ${error}`);
      }
    });
  });
});
