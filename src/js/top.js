import Tweenmax from 'gsap';
import debounce from 'lodash.debounce';

export default function top() {
  const domE = document.documentElement;
  const domB = document.body;
  let target01;
  let target02;
  let target03;
  let target04;
  const baseFireTop = 200;

  class Motion {
    constructor(elem, fireTop = baseFireTop) {
      this.targetElem = elem;
      this.fireTop = fireTop;
      this.targetElem.style.visibility = 'hidden';
      Tweenmax.set(this.targetElem, {
        y: this.fireTop + 300
      });
      this.isShow = false;
    }

    scroll() {
      const scrollTop = domE.scrollTop || domB.scrollTop;
      if (scrollTop > this.fireTop && this.isShow === false) {
        this.isShow = true;
        this.targetElem.style.visibility = 'visible';
        Tweenmax.to(this.targetElem, 0.6, {
          y: 0
        });
      }
    }
  }

  const removeCover = elem => {
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  };

  const hideSpinner = () => {
    const spinnerCover = document.querySelector('.js-spinner-wrapper');
    Tweenmax.set(spinnerCover, {
      opacity: 0,
      onComplete: removeCover(spinnerCover)
    });
  };

  const coverFitting = () => {
    const cover = document.querySelector('.js-cover');
    const coverHeight = window.innerHeight;
    const coverwidth = window.innerWidth;
    cover.style.height = `${coverHeight}px`;
    cover.style.width = `${coverwidth}px`;
  };

  const setPosition = () => {
    const title = document.querySelector('.js-title');
    const intro = document.querySelector('.js-intro');
    const coverHeight = window.innerHeight;
    const titleHeight = title.clientHeight;
    let introTop;

    const titleTop = (coverHeight / 2) - (titleHeight / 2);
    title.style.top = `${titleTop}px`;

    if (coverHeight <= 800) {
      introTop = (coverHeight / 2) - (titleHeight / 4);
    } else {
      introTop = (coverHeight / 2) + (titleHeight / 2);
    }
    intro.style.top = `${introTop}px`;
  };

  const titleShowAnimation = () => {
    const title = document.querySelector('.js-title');
    Tweenmax.set(title, {
      opacity: 0,
      y: -100
    });

    setTimeout(() => {
      Tweenmax.to(title, 1.5, {
        opacity: 1,
        y: 0
      });
    }, 200);
  };

  const introShow = () => {
    const intro = document.querySelector('.js-intro');
    Tweenmax.set(intro, {
      opacity: 0,
      y: -20
    });
    setTimeout(() => {
      Tweenmax.to(intro, 1.5, {
        opacity: 1,
        y: 0,
        repeat: -1,
        repeatDelay: 2
      });
    }, 2000);
  };

  document.addEventListener('DOMContentLoaded', () => {
    coverFitting();
    hideSpinner();
    setPosition();
    titleShowAnimation();
    introShow();

    const elem01 = document.querySelector('.js-motion-01');
    target01 = new Motion(elem01, baseFireTop);
    const elem02 = document.querySelector('.js-motion-02');
    target02 = new Motion(elem02, baseFireTop + 200);
    const elem03 = document.querySelector('.js-motion-03');
    target03 = new Motion(elem03, baseFireTop + 400);
    const elem04 = document.querySelector('.js-motion-04');
    target04 = new Motion(elem04, baseFireTop + 550);
  });

  document.addEventListener('scroll', () => {
    target01.scroll();
    target02.scroll();
    target03.scroll();
    target04.scroll();
  });

  window.addEventListener('resize', debounce(coverFitting, 200));
}
