import {
    map,
    filter
} from '../../lib/utils.js';

const SOCIAL_LINKS = ['facebook', 'pinterest', 'twitter'];

export default function makeShareLinks(links, thumbUrl, title) {
    if(!links) { return []; }
    return map(
        filter(
            Object.keys(links),
            key => SOCIAL_LINKS.indexOf(key) > -1
        ),
        key => {
            var href, label;
            const url = encodeURIComponent(links[key]);
            const media = encodeURIComponent(thumbUrl);
            const desc = encodeURIComponent(title);
            switch(key) {
            case 'facebook':
                label = 'Share';
                href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                label = 'Tweet';
                href = `https://twitter.com/intent/tweet?url=${url}`;
                break;
            case 'pinterest':
                label = 'Pin it';
                href = `https://pinterest.com/pin/create/button/?url=${url}&media=${media}
                    &description=${desc}`;
                break;
            }
            return {
                type: key,
                label: label,
                href: href
            };
        }
    );
}
