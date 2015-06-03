import {
    forEach
} from '../../lib/utils.js';

function forEachNode(node, iterator) {
    iterator(node);
    forEach(node.childNodes, child => forEachNode(child, iterator));
}

export default function injectHtml(html, element) {
    element.innerHTML = html;
    // If a script is inserted as part of an innerHTML it never downloads or executes its
    // playload. To make that happen, we look for scripts in the DOM and replace them with ones
    // created by calls to document.createElement().
    forEachNode(element, node => {
        if (node.tagName !== 'SCRIPT') { return; }

        const script = document.createElement('script');
        forEach(node.attributes, attribute => {
            script.setAttribute(attribute.name, attribute.value);
        });
        script.innerHTML = node.innerHTML;
        node.parentNode.replaceChild(script, node);
    });
}
