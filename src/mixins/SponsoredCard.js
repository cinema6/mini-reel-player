import makeSocialLinks from '../fns/make_social_links.js';

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
        this.links = data.links || {};
        this.socialLinks = makeSocialLinks(data.links);
        this.shareLinks = data.shareLinks || {};
        this.ad = !!data.params.ad;
    }
}
export default SponsoredCard;
