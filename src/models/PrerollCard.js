import AdUnitCard from './AdUnitCard.js';

export default class PrerollCard extends AdUnitCard {
    constructor(card, experience, profile, minireel) {
        super({
            params: {},
            collateral: {},
            data: {
                skip: minireel.adConfig.video.skip,
                vast: (() => {
                    switch (minireel.adConfig.video.waterfall) {
                    case 'cinema6':
                        return 'http://ads.adaptv.advertising.com//a/h/DCQzzI0K2rv1k0TZythPvTfWml' +
                            'P8j6NQnxBMIgFJa80=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
                    case 'publisher':
                        return 'http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2ey+WPd' +
                            'agwFmdz7a2uK_A_c=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
                    case 'cinema6-publisher':
                        return 'http://ads.adaptv.advertising.com/a/h/DCQzzI0K2rv1k0TZythPvadnVgR' +
                            'zoU_Z7L5Y91qDAWYoGast41+eSw==?cb={cachebreaker}&pageUrl={pageUrl}&eo' +
                            'v=eov';
                    case 'publisher-cinema6':
                        return 'http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2fCQPSb' +
                            'U6FwIZz5J5C0Fsw29iCueyXx8iw==?cb={cachebreaker}&pageUrl={pageUrl}&eo' +
                            'v=eov';
                    }
                }()),
                vpaid: (() => {
                    switch (minireel.adConfig.video.waterfall) {
                    case 'cinema6':
                        return 'http://u-ads.adap.tv/a/h/DCQzzI0K2rv1k0TZythPvYyD60pQS_90o8grI6Qm' +
                            '2PI=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
                    case 'publisher':
                        return 'http://u-ads.adap.tv/a/h/DCQzzI0K2runZ1YEc6FP2T65tHqs_Nwo9+XmsX4p' +
                            'nb4=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
                    case 'cinema6-publisher':
                        return 'http://u-ads.adap.tv/a/h/DCQzzI0K2rv1k0TZythPvadnVgRzoU_ZPrm0eqz8' +
                            '3CjfbcCg1uJO3w==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
                    case 'publisher-cinema6':
                        return 'http://u-ads.adap.tv/a/h/DCQzzI0K2runZ1YEc6FP2fCQPSbU6FwIdK4EW3jl' +
                            'LzbnPQftO7fDdA==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
                    }
                }())
            }
        }, experience, profile);
    }

    deactivate() {
        this.reset();
        return super();
    }

    abort() {
        super();
        this.emit('canAdvance');
    }
}
