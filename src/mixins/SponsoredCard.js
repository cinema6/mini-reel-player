import makeSocialLinks from '../fns/make_social_links.js';

function SponsoredCard(data) {
    this.sponsored = data.sponsored;
    this.campaign = null;
    this.sponsor = null;
    this.action = {};
    this.logo = null;
    this.links = {};
    this.socialLinks = null;
    this.ad = null;
    if(data.sponsored) {
        this.campaign = data.campaign;
        this.sponsor = data.params.sponsor;
        if(data.links.Action) {
            this.action = data.params.action || {};
        }
        this.logo = data.collateral.logo;
        this.links = data.links || {};
        this.socialLinks = makeSocialLinks(data.links);
        this.ad = !!data.params.ad;
    }
}
export default SponsoredCard;
