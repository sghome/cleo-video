import { preloadImages, getTranslationDistance } from './utils';
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const DOM = {
    sections: {
        columns: document.querySelector('.section--columns'),
        showcase: document.querySelector('.section--showcase'),
    },
    columns: document.querySelectorAll('.section--columns > .columns'),
    columnWraps: document.querySelectorAll('.section--columns .column-wrap'),
    itemsWrappers: document.querySelectorAll('.section--columns .column-wrap .column'),
    items: document.querySelectorAll('.section--columns .column__item'),
    images: document.querySelectorAll('.section--columns .column__item-img'),
};

// Lenis smooth scrolling
let lenis;

// Initialize Lenis smooth scrolling
const initSmoothScrolling = () => {
	lenis = new Lenis({
		lerp: 0.2,
		smooth: true,
	});
	const scrollFn = (time) => {
		lenis.raf(time);
		requestAnimationFrame(scrollFn);
	};
	requestAnimationFrame(scrollFn);
};

// GSAP Scroll Triggers
const scroll = () => {
    gsap.timeline({
        scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: true
        }
    })
    .addLabel('start', 0)
    .to(DOM.sections.columns, {
        ease: 'none',
        startAt: {scale: .7},
        scale: 1,
    }, 'start')
    .to(DOM.images, {
        ease: 'none',
        scale: 1.4,
    }, 'start')

    .set(DOM.itemsWrappers, {perspective: 1000}, 'start')
    .to(DOM.items, {
        scrollTrigger: {
            trigger: DOM.sections.showcase,
            start: 0,
            end: 'top top',
            scrub: true
        },
        ease: 'none',
        startAt: {
            rotationX: () => gsap.utils.random(20,30),
            x: (pos, target) => {
                return getTranslationDistance(target)['x'];
            },
            y: (pos, target) => {
                return getTranslationDistance(target)['y'];
            },
            filter: 'blur(6px)'
        },
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        filter: 'blur(0px)'
    }, 'start')
};

// Preload images
preloadImages('.column__item-img').then(() => {
    document.body.classList.remove('loading');
    // Lenis (smooth scrolling)
    initSmoothScrolling();
    // GSAP Scroll Triggers
    scroll();
});