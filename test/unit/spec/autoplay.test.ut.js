import browser from '../../../src/services/browser.js';
import { createKey } from 'private-parts';
import environment from '../../../src/environment.js';

const _ = createKey();

describe('autoplay test', function() {
    let realAudio, audio;
    let spy;
    let ticks;
    let promise;

    function flushTicks() {
        let fn;

        while (fn = ticks.shift()) {
            fn();
        }
    }

    /* global beforeAll, afterAll */
    beforeAll(function() {
        environment.constructor();

        realAudio = global.Audio;

        global.Audio = class Audio {
            constructor() {
                _(this).listeners = [];

                this.src = null;

                /* jshint ignore:start */
                this.addEventListener = jasmine.createSpy('audio.addEventListener()')
                    .and.callFake((...args) => {
                        _(this).listeners.push(args);
                    });
                /* jshint ignore:end */

                this.play = jasmine.createSpy('play()');

                audio = this;
            }

            trigger(event, data = {}) {
                _(this).listeners.filter(args =>  args[0] === event)
                    .forEach(args => args[1](data));
            }
        };
        Audio.prototype.canPlayType = jasmine.createSpy('Audio.prototype.canPlayType()').and.returnValue('maybe');

        require('../../../src/tests.js');
    });

    afterAll(function() {
        environment.constructor();

        global.Audio = realAudio;
    });

    beforeEach(function() {
        spy = jasmine.createSpy('spy()');
        ticks = [];

        environment.params.context = 'standalone';

        spyOn(process, 'nextTick').and.callFake(fn => ticks.push(fn));
        spyOn(global, 'setTimeout').and.callThrough();

        promise = browser.test('autoplay', true).then(spy);
    });

    describe('if the context is "mraid"', function() {
        beforeEach(function(done) {
            spy.calls.reset();
            audio = null;

            environment.params.context = 'mraid';

            browser.test('autoplay', true).then(spy).then(done, done.fail);
        });

        it('should not create an Audio() element', function() {
            expect(audio).not.toEqual(jasmine.any(Audio));
        });

        it('should fulfill with true', function() {
            expect(spy).toHaveBeenCalledWith(true);
        });
    });

    it('should create a new Audio() element', function() {
        expect(audio).toEqual(jasmine.any(Audio));
    });

    it('should listen for the "play" event', function() {
        expect(audio.addEventListener).toHaveBeenCalledWith('play', jasmine.any(Function), false);
    });

    it('should set the src to a base64 OGG', function() {
        expect(audio.src).toBe('data:audio/ogg;base64,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pZTSQQghhFJK6SCEEEIppXQQQgihlFIKAAAqcAAACLBRZHOCkaBCQ1YCAHkAAIAxSjknJaVGKcYgpBRboxRjEFJqrWIMQkqtxVgxBiGl1mLsIKTUWoy1dhBSai3GWkNKrcVYa84hpdZirDXX1FqMtebce2otxlpzzrkAANwFBwCwAxtFNicYCSo0ZCUAkAcAQCCkFGOMOYeUYowx55xDSjHGmHPOKcYYc8455xRjjDnnnHOMMeecc845xphzzjnnnHPOOeegg5A555xz0EHonHPOOQghdM455xyEEAoAACpwAAAIsFFkc4KRoEJDVgIA4QAAgDGUUkoppZRSSqijlFJKKaWUUgIhpZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoplVJKKaWUUkoppZRSSimlACDfCgcA/wcbZ1hJOiscDS40ZCUAEA4AABjDGISMOSclpYYxCKV0TkpJJTWMQSilcxJSSimD0FpqpaTSUkoZhJRiCyGVlFoKpbRWaymptZRSKCnFGktKqaXWMuckpJJaS622mDkHpaTWWmqtxRBCSrG11lJrsXVSUkmttdZabS2klFprLcbWYmwlpZZaa6nF1lpMqbUWW0stxtZiS63F2GKLMcYaCwDgbnAAgEiwcYaVpLPC0eBCQ1YCACEBAAQySjnnnIMQQgghUoox56CDEEIIIURKMeacgxBCCCGEjDHnIIQQQgihlJAx5hyEEEIIIYRSOucghFBKCaWUUkrnHIQQQgillFJKCSGEEEIopZRSSikhhBBKKaWUUkopJYQQQiillFJKKaWEEEIopZRSSimllBBCKKWUUkoppZQSQgihlFJKKaWUUkIIpZRSSimllFJKKCGEUkoppZRSSgkllFJKKaWUUkopIZRSSimllFJKKaUAAIADBwCAACPoJKPKImw04cIDEAAAAAIAAkwAgQGCglEIAoQRCAAAAAAACAD4AABICoCIiGjmDA4QEhQWGBocHiAiJAAAAAAAAAAAAAAAAARPZ2dTAATABgAAAAAAAKmGROcCAAAA0A533QgBAQEBBhNAOAAAAACGCfc1AACGCo8G0GhUzAT8zMb5NYwwAusHggp3G+SBnAUqZlSHaLCUAJBGiXGUz2iP2nGylXV8FznqOOZD1Oj9lyL3qPto3j+7Om3Lb3YfWcjEWhvjtGuJO4YJ12vGihzD30f3RxotUn89Uj9D9delzX/1Ud+DOo4m6clN795ESTZSKKgxIwSTmwYUgAa8GtcE');
    });

    it('should see if the browser can play an OGG', function() {
        expect(audio.canPlayType).toHaveBeenCalledWith('audio/ogg');
    });

    describe('if the browser can\'t play an OGG', function() {
        beforeEach(function() {
            Audio.prototype.canPlayType.and.returnValue('');

            browser.test('autoplay', true);
        });

        it('should set the src to a base64 MP3', function() {
            expect(audio.src).toBe('data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
        });
    });

    it('should play the audio in the next tick', function() {
        expect(audio.play).not.toHaveBeenCalled();
        flushTicks();
        expect(audio.play).toHaveBeenCalled();
    });

    it('should wait 500ms', function() {
        expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 500);
    });

    describe('if the audio never plays', function() {
        beforeEach(function(done) {
            promise.then(done, done);
        });

        it('should be false', function() {
            expect(spy).toHaveBeenCalledWith(false);
        });
    });

    describe('if the audio plays', function() {
        beforeEach(function(done) {
            setTimeout(() => audio.trigger('play'), 400);
            promise.then(done, done);
        });

        it('should be true', function() {
            expect(spy).toHaveBeenCalledWith(true);
        });
    });
});
