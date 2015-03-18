export default class DisplayAd {
    constructor(card, experience) {
        const defaultPlacement = parseInt(experience.data.placementId, 10);
        const placement = parseInt(card.placementId, 10);

        this.placement = placement || defaultPlacement;
        this.isDefault = this.placement === defaultPlacement;
    }
}
