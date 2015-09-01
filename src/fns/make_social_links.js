import {
    map,
    filter
} from '../../lib/utils.js';

const SOCIAL_LINKS = ['Facebook', 'Pinterest', 'Twitter', 'YouTube', 'Vimeo', 'Instagram'];

export default function makeSocialLinks(links) {
    return map(
        filter(
            Object.keys(links),
            label => SOCIAL_LINKS.indexOf(label) > -1
        ),
        label => ({ type: label.toLowerCase(), label, href: links[label] })
    );
}
