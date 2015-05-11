import animator from '../../lib/animator.js';
import TimelineLite from 'gsap/src/uncompressed/TimelineLite.js';

let currentCard = null;
const cardState = {};
let showAnimation = null;

function makeCardState(shown) {
    return {
        shown: shown
    };
}

animator.on('card:show', function(card, done) {
    currentCard = card;
    const element = card.element;
    const cardgroup = element.getElementsByClassName('card__group');
    console.log(cardgroup);

    showAnimation = new TimelineLite().set(element, {
        display: '',
        opacity: 0
    }).to(element, 0.5, {
        opacity: 1
    }).to(cardgroup, 0.5, {
        opacity: 0.5
    }).call(function() {
        showAnimation = null;
    }).call(done);
});
animator.on('card:hide', function(card, done) {
    if (!cardState[card.id]) {
        cardState[card.id] = makeCardState(false);
        return new TimelineLite().set(card.element, { display: 'none' }).call(done);
    }

    setTimeout(function() {
        if (showAnimation) {
            showAnimation.set(card.element, {
                display: 'none'
            }).call(done);
        } else {
            return new TimelineLite().set(card.element, { display: 'none' }).call(done);
        }
    }, 0);
});
