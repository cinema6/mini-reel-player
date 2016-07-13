import makeSocialLinks from '../fns/make_social_links.js';
import makeShareLinks from '../fns/make_share_links.js';
import normalizeLinks from '../fns/normalize_links.js';
import {
    find
} from '../../lib/utils.js';

function SponsoredCard(data) {
    this.sponsored = data.sponsored;
    this.campaign = data.campaign;
    this.action = { };
    this.links = { };
    this.socialLinks = [ ];
    this.ad = false;
    if(data.sponsored) {
        this.sponsor = data.params.sponsor;
        if(data.links.Action) {
            this.action = data.params.action || {};
        }
        this.logo = data.collateral.logo;
        this.links = normalizeLinks(data.links);
        this.socialLinks = makeSocialLinks(this.links);
        this.shareLinks = makeShareLinks(
            data.shareLinks,
            (
                (data.data.thumbs && (data.data.thumbs.large || data.data.thumbs.small)) ||
                (data.thumbs && (data.thumbs.large || data.thumbs.small))
            ),
            data.title
        );
        this.ad = !!data.params.ad;
    }
}

SponsoredCard.prototype.clickthrough = function clickthrough(linkName, context, coordinates) {
    const link = this.links[linkName];

    if (link) {
        this.emit('clickthrough', {
            link,
            context,
            coordinates,
            type: linkName
        });
    }
};

SponsoredCard.prototype.share = function share(type, context, coordinates) {
    const link = find(this.shareLinks, link => link.type === type);

    if (link) {
        this.emit('share', { link, type, context, coordinates });
    }
};

export default SponsoredCard;
