import VideoCard from './VideoCard.js';

export default class PrerollCard extends VideoCard {
    constructor(card, experience, minireel) {
        super({
            params: {},
            collateral: {},
            data: {
                skip: minireel.adConfig.video.skip
            }
        }, experience);

        this.data.videoid = (() => {
            switch (minireel.adConfig.video.waterfall) {
            case 'cinema6':
                return 'http://ads.adaptv.advertising.com//a/h/DCQzzI0K2rv1k0TZythPvTfWmlP8j6NQnx' +
                    'BMIgFJa80=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
            case 'publisher':
                return 'http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2ey+WPdagwFmdz7' +
                    'a2uK_A_c=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
            case 'cinema6-publisher':
                return 'http://ads.adaptv.advertising.com/a/h/DCQzzI0K2rv1k0TZythPvadnVgRzoU_Z7L5' +
                    'Y91qDAWYoGast41+eSw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
            case 'publisher-cinema6':
                return 'http://ads.adaptv.advertising.com/a/h/DCQzzI0K2runZ1YEc6FP2fCQPSbU6FwIZz5' +
                    'J5C0Fsw29iCueyXx8iw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov';
            }
        }());
    }
}
