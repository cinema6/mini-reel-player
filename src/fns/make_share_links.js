import normalizeLinks from './normalize_links.js';
import {
    map,
    filter
} from '../../lib/utils.js';

const SOCIAL_LINKS = ['facebook', 'pinterest', 'twitter'];

export default function makeShareLinks(links, thumbUrl, title = '') {
    if(!links) { return []; }

    const normalizedLinks = normalizeLinks(links);

    return map(
        filter(
            Object.keys(normalizedLinks),
            key => SOCIAL_LINKS.indexOf(key) > -1 && (key !== 'pinterest' || thumbUrl)
        ),
        type => {
            const entry = normalizedLinks[type];

            const label = ((() => {
                switch (type) {
                case 'facebook':
                    return 'Share';
                case 'twitter':
                    return 'Tweet';
                case 'pinterest':
                    return 'Pin it';
                }
            })());
            const href  = (((uri, image, description) => {
                switch (type) {
                case 'facebook':
                    return `https://www.facebook.com/sharer/sharer.php?u=${uri}`;
                case 'twitter':
                    return `https://twitter.com/intent/tweet?url=${uri}`;
                case 'pinterest':
                    return `https://pinterest.com/pin/create/button/` +
                        `?url=${uri}&media=${image}&description=${description}`;
                }
            }).apply(null, map([entry.uri, thumbUrl, title], encodeURIComponent)));

            return { type, label, href, tracking: entry.tracking };
        }
    );
}
