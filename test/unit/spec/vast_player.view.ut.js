import VASTPlayer from '../../../src/players/VASTPlayer.js';
import media from '../../../src/services/media.js';
import iab from '../../../src/services/iab.js';
import {EventEmitter} from 'events';
import {
    defer
} from '../../../lib/utils.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import browser from '../../../src/services/browser.js';
import Runner from '../../../lib/Runner.js';

function wait(time) {
    return function(value) {
        return new Promise(fulfill => setTimeout(() => fulfill(value), time));
    };
}

describe('<vast-player>', function() {
    let vastObject, vastDeferred;

    let player;
    let video;

    var VAST = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '',
        '<VAST version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="oxml.xsd">',
        '    <Ad id="a73834">',
        '        <InLine>',
        '            <AdSystem version="1.0">Adap.tv</AdSystem>',
        '',
        '            <AdTitle><![CDATA[Adaptv Ad]]></AdTitle>',
        '',
        '            <Error><![CDATA[http://log.adap.tv/log?event=error&lastBid=&errNo=&pricingInfo=&nF=&adSourceTime=&adSourceId=73833&bidId=&afppId=73834&exSId=57916&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m1-58&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=86007638]]></Error>',
        '',
        '            <Impression><![CDATA[http://qlog.adap.tv/log?3a=adSuccess&51=ZX4madbHHCc_&50=ZX4madbHHCc_&72=&8=&d=&b=-2&53=&2c=&6c=&6d=&28=qUsI3M4M68M_&a8=1zwJCAUlQOU_&25=16242&4b=73834%2C73833&b6=b80ab42f50468aa847de612acf6511c6c3a4ffeae13904174c8e5c16f15d4b72&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Impression>',
        '',
        '            <Impression><![CDATA[http://conversions.adap.tv/conversion/wc?adSourceId=73833&bidId=&afppId=73834&creativeId=16242&exSId=57916&key=alexorlovstestpublisher&a.pvt=0&a.rid=&eov=86007638]]></Impression>',
        '',
        '            <Creatives>',
        '                <Creative>',
        '                    <Linear>',
        '                        <Duration><![CDATA[00:00:15]]></Duration>',
        '',
        '                        <TrackingEvents>',
        '                            <Tracking event="start"><![CDATA[http://log.adap.tv/log?3a=progressDisplay0&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
        '',
        '                            <Tracking event="firstQuartile"><![CDATA[http://log.adap.tv/log?3a=progressDisplay25&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
        '',
        '                            <Tracking event="midpoint"><![CDATA[http://log.adap.tv/log?3a=progressDisplay50&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
        '',
        '                            <Tracking event="thirdQuartile"><![CDATA[http://log.adap.tv/log?3a=progressDisplay75&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
        '',
        '                            <Tracking event="complete"><![CDATA[http://log.adap.tv/log?3a=progressDisplay100&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
        '                        </TrackingEvents>',
        '',
        '                        <VideoClicks>',
        '                            <ClickThrough><![CDATA[http://qlog.adap.tv/log?3a=click&d3=&72=&25=16242&6c=&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1&rUrl=http%3A%2F%2Fwww.adap.tv%2F]]></ClickThrough>',
        '',
        '                            <ClickTracking><![CDATA[http://conversions.adap.tv/conversion/wc?adSourceId=73833&bidId=&afppId=73834&creativeId=16242&exSId=57916&key=alexorlovstestpublisher&a.pvt=0&a.rid=&eov=86007638&a.click=true]]></ClickTracking>',
        '                        </VideoClicks>',
        '',
        '                        <MediaFiles>',
        '                            <MediaFile delivery="progressive" width="320" height="240" bitrate="256" type="video/mp4"><![CDATA[http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_640x360_16-9-040512100356192-12398_9-071813123000638-11481.MP4]]></MediaFile>',
        '                        </MediaFiles>',
        '                        <MediaFiles>',
        '                            <MediaFile delivery="progressive" width="480" height="360" bitrate="4000" type="video/x-flv"><![CDATA[http://cdn.adap.tv/integration_test/Vincent-081110124715584-13503_1-122011141453375-82609.flv]]></MediaFile>',
        '                        </MediaFiles>',
        '                    </Linear>',
        '                </Creative>',
        '                <Creative>',
        '                    <CompanionAds>',
        '                        <Companion width="300" height="250">',
        '                            <IFrameResource>',
        '                                <![CDATA[',
        '                                //ads.adap.tv/c/companion?cck=cck&creativeId=110497&melaveId=42657&key=tribal360llc&adSourceId=208567&bidId=&afppId=159224&exSId=639284&cb=9874983758324475&pageUrl=http%3A%2F%2Fcinema6.com&eov=eov',
        '                                ]]>',
        '                            </IFrameResource>',
        '                            <TrackingEvents></TrackingEvents>',
        '                        </Companion>',
        '                    </CompanionAds>',
        '                </Creative>',
        '            </Creatives>',
        '',
        '            <Extensions>',
        '                <Extension type="OneSource creative">',
        '                    <CreativeId><![CDATA[16242]]></CreativeId>',
        '                </Extension>',
        '',
        '                <Extension type="revenue" currency="USD"><![CDATA[ZP05nQqNNzkDnlnN9D9Qjg==]]></Extension>',
        '            </Extensions>',
        '        </InLine>',
        '    </Ad>',
        '</VAST>'
    ].join('').replace(/>\s+</g, '><');

    function Video() {
        EventEmitter.call(this);
        for (var method in EventEmitter.prototype) {
            this[method] = EventEmitter.prototype[method];
        }

        this.play = jasmine.createSpy('Runner.run(() => player.play());');
        this.pause = jasmine.createSpy('player.pause()');
        this.load = jasmine.createSpy('Runner.run(() => player.load());');
        this.webkitExitFullscreen = jasmine.createSpy('player.webkitExitFullscreen()');
        this.currentTime = 0;
        this.ended = false;
        this.duration = NaN;
        this.volume = 0;
        this.paused = true;
        this.muted = false;
        this.src = null;
        this.readyState = 0;

        /* constants */
        this.HAVE_NOTHING = 0;
        this.HAVE_METADATA = 1;
        this.HAVE_CURRENT_DATA = 2;
        this.HAVE_FUTURE_DATA = 3;
        this.HAVE_ENOUGH_DATA = 4;

        this.addEventListener = this.on;
        this.removeEventListener = this.removeListener;

        return this;
    }

    beforeEach(function() {
        spyOn(media, 'bestVideoFormat').and.returnValue('video/mp4');
        spyOn(global, 'open');

        vastDeferred = defer(RunnerPromise);
        vastObject = new iab.__private__.VAST((new DOMParser()).parseFromString(VAST, 'text/xml'));
        spyOn(iab, 'getVAST').and.returnValue(vastDeferred.promise);

        spyOn(vastObject, 'firePixels');
        spyOn(vastObject, 'getVideoSrc').and.callThrough();

        player = new VASTPlayer();
        spyOn(player, 'emit').and.callThrough();
        spyOn(player, 'play').and.callThrough();

        const createElement = document.createElement;
        spyOn(document, 'createElement').and.callFake(type => {
            switch (type.toLowerCase()) {
            case 'video':
                return (video = Video.call(createElement.call(document, 'span')));
            default:
                return createElement.apply(document, arguments);
            }
        });
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('player events', function() {
        beforeEach(function(done) {
            Runner.run(() => player.load());
            vastDeferred.fulfill(vastObject);
            Promise.resolve(vastDeferred.promise.then(wait(5))).then(done, done);
        });

        describe('error', function() {
            var spy;

            beforeEach(function() {
                spy = jasmine.createSpy('spy()');

                player.on('error', spy);

                video.error = {
                    code: 3
                };
                video.emit('error');
            });

            it('should emit the error event', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should set the error property', function() {
                expect(player.error).toEqual(new Error(
                    'HTML5 Video Error: ' + video.error.code
                ));
            });
        });

        describe('companionsReady', function() {
            var spy;
            let vast;

            beforeEach(function() {
                player = new VASTPlayer();

                vast = {
                    getVideoSrc: jasmine.createSpy('vast.getVideoSrc()').and.returnValue(''),
                    getCompanion: jasmine.createSpy('vast.getCompanion()').and.returnValue({})
                };

                vastDeferred = defer(RunnerPromise);
                iab.getVAST.and.returnValue(vastDeferred.promise);
                player.src = 'companion-test-tag.tag';

                spy = jasmine.createSpy('spy()').and.callFake(() => Runner.schedule('render', null, () => expect(player.getCompanions()).toEqual([vast.getCompanion()])));
                player.on('companionsReady', spy);
            });

            describe('if the vast object has companions', function() {
                beforeEach(function(done) {
                    Runner.run(() => player.load());
                    vastDeferred.fulfill(vast);
                    vastDeferred.promise.then(wait(5)).then(done, done);
                });

                it('should emit the event', function() {
                    expect(spy).toHaveBeenCalled();
                });

                it('should only emit the event once', function() {
                    Runner.run(() => player.play());
                    expect(spy.calls.count()).toBe(1);
                });
            });

            describe('if the vast object has no companions', function() {
                beforeEach(function(done) {
                    vast.getCompanion.and.returnValue(null);

                    Runner.run(() => player.load());
                    vastDeferred.fulfill(vast);
                    vastDeferred.promise.then(wait(5)).then(done, done);
                });

                it('should not emit the event', function() {
                    expect(spy).not.toHaveBeenCalled();
                });
            });
        });

        describe('ready', function() {
            it('should emit loadedmetadata is currentTime and duration is defined', function() {
                player.on('loadedmetadata', () => Runner.schedule('render', null, () => {}));
                video.emit('loadedmetadata');
                expect(player.emit).toHaveBeenCalledWith('loadedmetadata');
            });

            describe('autoplay attribute', function() {
                let testDeferred;

                beforeEach(function() {
                    testDeferred = defer(RunnerPromise);

                    player.play.calls.reset();
                    spyOn(browser, 'test').and.returnValue(testDeferred.promise);
                });

                describe('if autoplay is true', function() {
                    beforeEach(function() {
                        player.autoplay = true;

                        player.didInsertElement();
                    });

                    it('should test for the autoplay feature', function() {
                        expect(browser.test).toHaveBeenCalledWith('autoplay');
                    });

                    describe('if the device can autoplay', function() {
                        beforeEach(function(done) {
                            testDeferred.promise.then(done, done);
                            testDeferred.fulfill(true);
                        });

                        it('should play the video', function() {
                            expect(player.play).toHaveBeenCalled();
                        });
                    });

                    describe('if the device can\'t autoplay', function() {
                        beforeEach(function(done) {
                            testDeferred.promise.then(done, done);
                            testDeferred.fulfill(false);
                        });

                        it('should not play the video', function() {
                            expect(player.play).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('if autoplay is false', function() {
                    beforeEach(function() {
                        player.autoplay = false;

                        player.didInsertElement();
                    });

                    it('should not test for the autoplay feature', function() {
                        expect(browser.test).not.toHaveBeenCalledWith('autoplay');
                    });

                    it('should not play the video', function() {
                        expect(video.play).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('play', function() {
            beforeEach(function() {
                player.on('play', () => Runner.schedule('render', null, () => {}));
                video.emit('play');
            });

            it('should emit play on the player', function() {
                expect(player.emit).toHaveBeenCalledWith('play');
            });

            it('should only fire pixels once', function() {
                expect(vastObject.firePixels).toHaveBeenCalledWith('impression');
                expect(vastObject.firePixels).toHaveBeenCalledWith('playing');
                expect(vastObject.firePixels).toHaveBeenCalledWith('start');
                expect(vastObject.firePixels).toHaveBeenCalledWith('creativeView');
                expect(vastObject.firePixels).toHaveBeenCalledWith('loaded');
                expect(vastObject.firePixels.calls.count()).toBe(5);
                video.emit('play');
                video.emit('play');
                expect(vastObject.firePixels.calls.count()).toBe(5);
            });
        });

        describe('pause', function() {
            beforeEach(function() {
                player.on('pause', () => Runner.schedule('render', null, () => {}));
                video.emit('pause');
            });

            it('should emit pause on the player', function() {
                expect(player.emit).toHaveBeenCalledWith('pause');
            });

            it('should always fire the pause pixel', function() {
                expect(vastObject.firePixels).toHaveBeenCalledWith('pause');

                vastObject.firePixels.calls.reset();
                video.emit('pause');
                expect(vastObject.firePixels).toHaveBeenCalledWith('pause');
            });
        });

        describe('ended', function() {
            beforeEach(function() {
                player.on('ended', () => Runner.schedule('render', null, () => {}));
                video.emit('ended');
            });

            it('should emit ended on the player', function() {
                expect(player.emit).toHaveBeenCalledWith('ended');
            });
        });

        describe('firstQuartile', function() {
            beforeEach(function() {
                player.emit('firstQuartile');
            });

            it('should fire the firstQuartile pixel', function() {
                expect(vastObject.firePixels).toHaveBeenCalledWith('firstQuartile');
            });
        });

        describe('midpoint', function() {
            beforeEach(function() {
                player.emit('midpoint');
            });

            it('should fire the midpoint pixel', function() {
                expect(vastObject.firePixels).toHaveBeenCalledWith('midpoint');
            });
        });

        describe('thirdQuartile', function() {
            beforeEach(function() {
                player.emit('thirdQuartile');
            });

            it('should fire the midpoint pixel', function() {
                expect(vastObject.firePixels).toHaveBeenCalledWith('thirdQuartile');
            });
        });

        describe('complete', function() {
            beforeEach(function() {
                player.emit('complete');
            });

            it('should fire the midpoint pixel', function() {
                expect(vastObject.firePixels).toHaveBeenCalledWith('complete');
            });
        });

        describe('timeupdate', function() {
            it('should emit timeupdate on the player', function() {
                player.on('timeupdate', () => Runner.schedule('render', null, () => {}));
                video.emit('timeupdate');
                expect(player.emit).toHaveBeenCalledWith('timeupdate');
            });
        });
    });

    describe('player', function() {
        describe('properties', function() {
            describe('tag', function() {
                it('should be "div"', function() {
                    expect(player.tag).toBe('div');
                });
            });

            describe('autoplay', function() {
                it('should be false', function() {
                    expect(player.autoplay).toBe(false);
                });
            });

            describe('disableClickthrough', function() {
                it('should be false', function() {
                    expect(player.disableClickthrough).toBe(false);
                });
            });

            describe('controls', function() {
                it('should be true', function() {
                    expect(player.controls).toBe(true);
                });
            });

            describe('src', function() {
                describe('getting', function() {
                    it('should return the ad tag it was set to', function() {
                        expect(player.src).toBeNull();

                        player.src = 'http://www.ad.tag.com';
                        expect(player.src).toBe('http://www.ad.tag.com');

                        player.src = 'http://www.ad.tag.org';
                        expect(player.src).toBe('http://www.ad.tag.org');
                    });
                });

                describe('setting', function() {
                    beforeEach(function(done) {
                        Runner.run(() => player.play());
                        video.emit('loadedmetadata');

                        vastDeferred.fulfill(vastObject);
                        vastDeferred.promise.then(wait(5)).then(() => {
                            vastObject.firePixels.calls.reset();

                            player.src = 'newadtag.com';
                        }).then(done, done);
                    });

                    it('should reset the player state', function() {
                        video.emit('play');
                        expect(vastObject.firePixels).toHaveBeenCalledWith('playing');
                    });
                });
            });

            describe('error', function() {
                describe('getting', function() {
                    it('should be null', function() {
                        expect(player.error).toBeNull();
                    });
                });

                describe('setting', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            player.error = new Error();
                        }).toThrow();
                    });
                });
            });

            describe('currentTime', function() {
                describe('before the player is loaded', function() {
                    it('should be 0', function() {
                        expect(player.currentTime).toBe(0);
                    });
                });

                describe('after the player is loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('getting the property should return the currentTime', function() {
                        video.currentTime = 3;
                        expect(player.currentTime).toBe(3);
                    });

                    it('setting the prop should set the currTime on the player', function() {
                        player.currentTime = 5;
                        expect(player.currentTime).toBe(5);
                        expect(video.currentTime).toBe(5);
                    });
                });
            });

            describe('ended', function() {
                describe('before the player is loaded', function() {
                    it('should be false', function() {
                        expect(player.ended).toBe(false);
                    });
                });

                describe('after the player is loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should return the ended prop of the player', function() {
                        video.ended = true;
                        expect(player.ended).toBe(true);
                    });
                });

                it('should throw an error when setting', function() {
                    expect(function() {
                        player.ended = true;
                    }).toThrow();
                });
            });

            describe('duration', function() {
                describe('before the player is loaded', function() {
                    it('should be 0', function() {
                        expect(player.duration).toBe(0);
                    });
                });

                describe('after the player is loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should return the player duration', function() {
                        video.duration = 30;
                        expect(player.duration).toBe(30);
                    });
                });

                it('should throw an error when setting', function() {
                    expect(function() {
                        player.duration = 40;
                    }).toThrow();
                });
            });

            describe('volume', function() {
                describe('before the player is loaded', function() {
                    it('should be 0', function() {
                        expect(player.volume).toBe(0);
                    });
                });

                describe('after the player is loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should return the player volume', function() {
                        video.volume = 0.5;
                        expect(player.volume).toEqual(0.5);
                    });
                });

                it('should throw an error when setting', function() {
                    expect(function() {
                        player.volume = 0.7;
                    }).toThrow();
                });
            });

            describe('paused', function() {
                describe('before the player is loaded', function() {
                    it('should be true', function() {
                        expect(player.paused).toBe(true);
                    });
                });

                describe('after the player is loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should return the paused prop of player', function() {
                        video.paused = false;
                        expect(player.paused).toBe(false);
                    });
                });

                it('should throw an error when setting', function() {
                    expect(function() {
                        player.paused = true;
                    }).toThrow();
                });
            });

            describe('muted', function() {
                describe('before the player is loaded', function() {
                    it('should be true', function() {
                        expect(player.muted).toBe(false);
                    });
                });

                describe('after the player is loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should return the muted prop of player', function() {
                        video.muted = false;
                        expect(player.muted).toBe(false);
                    });
                });

                it('should throw an error when setting', function() {
                    expect(function() {
                        player.muted = true;
                    }).toThrow();
                });
            });


            describe('seeking', function() {
                describe('before the player is loaded', function() {
                    it('should be false', function() {
                        expect(player.seeking).toBe(false);
                    });
                });

                describe('after the player is loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should return the paused prop of player', function() {
                        video.seeking = true;
                        expect(player.seeking).toBe(true);
                    });
                });

                it('should throw an error when setting', function() {
                    expect(function() {
                        player.seeking = false;
                    }).toThrow();
                });
            });

            describe('readyState', function() {
                describe('before the video is created', function() {
                    it('should be 0', function() {
                        expect(player.readyState).toBe(0);
                    });
                });

                describe('after the video is created', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should be the video\'s readyState', function() {
                        expect(player.readyState).toBe(video.readyState);

                        video.readyState = 1;
                        expect(player.readyState).toBe(video.readyState);
                    });
                });
            });
        });

        describe('methods', function() {
            describe('play', function() {
                var vast;
                let attemptPlay;

                beforeEach(function(done) {
                    player.src = 'adtag.org';

                    attemptPlay = jasmine.createSpy('attemptPlay()');
                    player.on('attemptPlay', attemptPlay);

                    vast = vastObject;

                    Runner.run(() => player.load());

                    vastDeferred.fulfill(vast);
                    vastDeferred.promise.then(wait(5)).then(() => {
                        iab.getVAST.calls.reset();
                        spyOn(video, 'addEventListener').and.callThrough();

                        Runner.run(() => player.play());
                        vastDeferred.promise.then(wait(5)).then(done, done);
                    });
                });

                it('should play the video', function() {
                    expect(video.play).toHaveBeenCalled();
                });

                it('should emit "attemptPlay"', function() {
                    expect(attemptPlay).toHaveBeenCalled();
                });

                it('should not fetch any VAST', function() {
                    expect(iab.getVAST).not.toHaveBeenCalled();
                });

                it('should not add more event listeners', function() {
                    expect(video.addEventListener).not.toHaveBeenCalled();
                });

                describe('if the video has not been loaded yet', function() {
                    beforeEach(function(done) {
                        vastDeferred = defer(RunnerPromise);
                        iab.getVAST.and.returnValue(vastDeferred.promise);

                        video.play.calls.reset();
                        attemptPlay.calls.reset();

                        player.src = 'new.adtag.org';
                        Runner.run(() => player.play());
                        Promise.resolve(wait(5)).then(done, done);
                    });

                    it('should not play the video', function() {
                        expect(video.play).not.toHaveBeenCalled();
                    });

                    it('should emit "attemptPlay"', function() {
                        expect(attemptPlay).toHaveBeenCalled();
                    });

                    it('should fetch the new VAST', function() {
                        expect(iab.getVAST).toHaveBeenCalledWith(player.src);
                    });

                    describe('when the vast is fetched', function() {
                        beforeEach(function(done) {
                            vast.getVideoSrc.and.returnValue('http://videos.com/my-vid.mp4');

                            vastDeferred.fulfill(vast);
                            vastDeferred.promise.then(wait(5)).then(done, done);
                        });

                        it('should set the player src', function() {
                            expect(video.src).toBe(vast.getVideoSrc());
                        });

                        it('should play the video', function() {
                            expect(video.play).toHaveBeenCalled();
                        });

                        describe('if called again', function() {
                            beforeEach(function(done) {
                                video.play.calls.reset();

                                Runner.run(() => player.play());
                                vastDeferred.promise.then(wait(5)).then(done, done);
                            });

                            it('should play the video again', function() {
                                expect(video.play).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('if the vast fails to load', function() {
                        beforeEach(function(done) {
                            vastDeferred.reject(vast);
                            vastDeferred.promise.then(done, done);
                        });

                        it('should not play the video', function() {
                            expect(video.play).not.toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('pause', function() {
                beforeEach(function() {
                    Runner.run(() => player.play());

                    player.pause();
                });

                it('should call pause on the video object', function() {
                    expect(video.pause).toHaveBeenCalled();
                });

                describe('if the video has not yet been created', function() {
                    beforeEach(function() {
                        player = new VASTPlayer();
                    });

                    it('should do nothing', function() {
                        expect(function() {
                            player.pause();
                        }).not.toThrow();
                    });
                });
            });

            describe('load', function() {
                var errorSpy;

                beforeEach(function(done) {
                    errorSpy = jasmine.createSpy('error()');
                    vastDeferred = defer(RunnerPromise);
                    iab.getVAST.and.returnValue(vastDeferred.promise);

                    player.on('error', errorSpy);

                    Runner.run(() => player.create());
                    spyOn(player.element, 'appendChild');

                    player.src = 'http://i-am-an-adtag.com';
                    Runner.run(() => player.poster = 'my-poster.jpg');
                    Runner.run(() => player.load());
                    wait(5)().then(done, done);
                });

                it('should create a video and append it to its element', function() {
                    expect(document.createElement).toHaveBeenCalledWith('video');
                    expect(player.element.appendChild).toHaveBeenCalledWith(video);
                    expect(video.controls).toBe(player.controls);
                    expect(video.poster).toBe(player.poster);
                    expect(video.getAttribute('webkit-playsinline')).toBe('');
                });

                it('should load the video', function() {
                    expect(video.load).toHaveBeenCalled();
                });

                it('should request the VAST', function() {
                    expect(iab.getVAST).toHaveBeenCalledWith(player.src);
                });

                describe('if there is no poster', function() {
                    beforeEach(function() {
                        player = new VASTPlayer();
                        player.src = 'http://i-am-an-adtag.com';

                        Runner.run(() => player.load());
                    });

                    it('should not set the video\'s poster', function() {
                        expect('poster' in video).toBe(false);
                    });
                });

                describe('if called again', function() {
                    beforeEach(function() {
                        document.createElement.calls.reset();
                        player.element.appendChild.calls.reset();
                        spyOn(player, 'create').and.callThrough();

                        Runner.run(() => player.load());
                    });

                    it('should not create the view again', function() {
                        expect(player.create).not.toHaveBeenCalled();
                    });

                    it('should not create another video', function() {
                        expect(document.createElement).not.toHaveBeenCalledWith('video');
                        expect(player.element.appendChild).not.toHaveBeenCalled();
                    });
                });

                describe('when the vast is loaded', function() {
                    var vast;

                    beforeEach(function(done) {
                        vast = vastObject;

                        vastDeferred.fulfill(vast);
                        vastDeferred.promise.then(wait(5)).then(done, done);
                    });

                    it('should set the src', function() {
                        expect(video.src).toBe(vast.getVideoSrc());
                    });
                });

                describe('if the vast has no video for the browser', function() {
                    beforeEach(function(done) {
                        vastObject.getVideoSrc.and.returnValue(null);

                        vastDeferred.fulfill(vastObject);
                        vastDeferred.promise.then(wait(5)).then(done, done);
                    });

                    it('should emit the error event', function() {
                        expect(errorSpy).toHaveBeenCalled();
                    });
                });

                describe('if the vast fails to load', function() {
                    beforeEach(function(done) {
                        vastDeferred.reject('I FAILED YOU MASTER.');
                        vastDeferred.promise.then(null, wait(5)).then(done, done);
                    });

                    it('should emit the error event', function() {
                        expect(errorSpy).toHaveBeenCalled();
                    });

                    it('should set the error property', function() {
                        expect(player.error).toEqual(new Error(
                            'VAST request failed: ' + JSON.stringify('I FAILED YOU MASTER.')
                        ));
                    });
                });
            });

            describe('getCompanions', function() {
                var companions;

                describe('if there is no VAST', function() {
                    beforeEach(function() {
                        companions = player.getCompanions();
                    });

                    it('should be null', function() {
                        expect(companions).toBeNull();
                    });
                });

                describe('if there is VAST', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    describe('if the VAST has companions', function() {
                        beforeEach(function(done) {
                            vastDeferred.fulfill(vastObject);
                            vastDeferred.promise.then(wait(5)).then(() => companions = player.getCompanions()).then(done, done);
                        });

                        it('should be the companion in an array', function() {
                            expect(companions).toEqual([vastObject.getCompanion()]);
                        });
                    });

                    describe('if the VAST has no companion', function() {
                        beforeEach(function(done) {
                            spyOn(vastObject, 'getCompanion').and.returnValue(null);

                            vastDeferred.fulfill(vastObject);
                            vastDeferred.promise.then(() => companions = player.getCompanions()).then(done, done);
                        });

                        it('should be null', function() {
                            expect(companions).toBeNull();
                        });
                    });
                });
            });

            describe('unload()', function() {
                let originalVideo;

                beforeEach(function(done) {
                    Runner.run(() => player.load());
                    originalVideo = video;
                    spyOn(player.element, 'removeChild');
                    vastDeferred.fulfill(vastObject);

                    setTimeout(() => {
                        player.unload();
                        done();
                    }, 10);
                });

                describe('before the player was created', function() {
                    beforeEach(function() {
                        player = new VASTPlayer();
                    });

                    it('should do nothing', function() {
                        expect(function() {
                            player.unload();
                        }).not.toThrow();
                    });
                });

                it('should remove the video', function() {
                    expect(player.element.removeChild).toHaveBeenCalledWith(video);
                });

                it('should cause getCompanions() to return null again', function() {
                    expect(player.getCompanions()).toBeNull();
                });

                describe('when the player is loaded again', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should create a new video when the player is loaded', function() {
                        expect(video).not.toBe(originalVideo);
                    });
                });
            });

            describe('reload', function() {
                beforeEach(function() {
                    spyOn(player, 'load');
                    spyOn(player, 'unload');

                    player.reload();
                });

                it('should unload() and load() the player', function() {
                    expect(player.unload).toHaveBeenCalled();
                    expect(player.load).toHaveBeenCalled();
                });
            });

            describe('minimize()', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    player.minimize();
                });

                it('should exit fullscreen mode', function() {
                    expect(video.webkitExitFullscreen).toHaveBeenCalled();
                });

                describe('before the video is created', function() {
                    beforeEach(function() {
                        player = new VASTPlayer();
                    });

                    it('should do nothing', function() {
                        expect(function() {
                            player.minimize();
                        }).not.toThrow();
                    });
                });
            });
        });
    });

    describe('click()', function() {
        beforeEach(function(done) {
            Runner.run(() => player.load());
            vastDeferred.fulfill(vastObject);
            vastDeferred.promise.then(wait(5)).then(done, done);

            player.controls = false;
            video.paused = false;
        });

        it('should pause the player if video is playing and open a new window and fire click pixel', function() {
            player.click();

            expect(video.pause).toHaveBeenCalled();
            expect(global.open).toHaveBeenCalled();
            expect(vastObject.firePixels).toHaveBeenCalledWith('videoClickTracking');
        });

        it('should play the video if it is currently paused', function() {
            video.paused = true;

            player.click();
            expect(video.play).toHaveBeenCalled();
        });

        it('should do nothing if click through url is not defined', function() {
            vastObject.clickThrough = [];

            player.click();
            expect(global.open).not.toHaveBeenCalled();
        });

        describe('if controls are present', function() {
            beforeEach(function() {
                player.controls = true;
                video.paused = false;
                player.click();
            });

            it('should not open the clickThrough link', function() {
                expect(global.open).not.toHaveBeenCalled();
            });
        });

        describe('if the video.disableClickthrough is true', function() {
            beforeEach(function() {
                player.disableClickthrough = true;
                video.paused = false;

                player.click();
            });

            it('should not open the clickThrough link', function() {
                expect(global.open).not.toHaveBeenCalled();
            });
        });
    });
});
