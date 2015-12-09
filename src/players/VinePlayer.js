import Runner from '../../lib/Runner.js';
import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import { createKey } from 'private-parts';
import { noop } from '../../lib/utils.js';

const _ = createKey();

export default class VinePlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);
        
        _(this).loadWithAudio = false;
        
        this.__api__.name = 'VinePlayer';
        this.__api__.loadPlayer = src => {
            const vineSrc = 'https://vine.co/v/' + src + '/embed/simple' +
                ((_(this).loadWithAudio)?'?audio=1':'');
            const embed = '<iframe src="' + vineSrc + '" ' +
                            'style="width:100%;height:100%" ' +
                            'frameborder="0">' +
                          '</iframe>';
            const scriptSrc = 'https://platform.vine.co/static/scripts/embed.js';

            const script = document.createElement('script');
            const div = document.createElement('div');
            script.setAttribute('src', scriptSrc);
            div.innerHTML = embed;
            div.appendChild(script);

            Runner.schedule('afterRender', this.element, 'appendChild', [div]);

            _(this).loadWithAudio = false;
            return RunnerPromise.resolve({});
        };
        this.__api__.methods = {
            play: () => {
                _(this).loadWithAudio = true;
                this.reload();
            },
            pause: () => {
                this.reload();
            },
            unload: () => {
                Runner.schedule('afterRender', null, () => {
                    this.element.innerHTML = '';
                });
            },
            buffer: noop
        };
        
        if (global.__karma__) { this.__private__ = _(this); }
    }
}
