import codeLoader from '../../../src/services/code_loader.js';
import moatApi from '../../../src/services/moat.js';
import { MoatApiTracker } from '../../../src/services/moat.js';

describe('moat',function(){
    let container, ids;
    beforeEach(function(){
        container = { };
        ids = {
            'level1'    : '_ADVERTISER_',
            'level2'    : '_LINE_ITEM_',
            'level3'    : '_CREATIVE_',
            'slicer1'   : '_SITE_',
            'slicer2'   : '_PLACEMENT'
        };
        spyOn(Math,'random').and.returnValue(1);
        spyOn(codeLoader,'configure');
        spyOn(codeLoader,'load');
    });
    describe('MoatApiTracker', function() {
        let tracker;
        describe('constructor', function() {
            it('sets up the tracker',function(){
                expect(global._moatApi100000000).not.toBeDefined();
                tracker = new MoatApiTracker(container,ids,30);
                expect(tracker._private_.events).toEqual([]);
                expect(tracker._private_.dispatched).toEqual({});
                expect(tracker._private_.tracker).toBeDefined();
                expect(tracker._private_.tracker.adData.ids).toBe(ids);
                expect(tracker._private_.tracker.adData.duration).toEqual(30);
                expect(tracker._private_.name).toEqual('_moatApi100000000');
                expect(tracker._private_.src).toEqual('http://js.moatads.com/cinema6748895486244/moatvideo.js#_moatApi100000000');
                expect(global._moatApi100000000).toBeDefined();
                expect(codeLoader.configure).not.toHaveBeenCalled();
                expect(codeLoader.load).not.toHaveBeenCalled();
            });

            it('initiates the loading of the moat library with valid container',function(){
                container.childNodes = [];
                tracker = new MoatApiTracker(container,ids,30);
                expect(codeLoader.configure).toHaveBeenCalled();
                expect(codeLoader.load).toHaveBeenCalledWith(
                    '_moatApi100000000',container,'insertBefore',null
                );
            });

        });

        describe('properties', function(){
            beforeEach(function(){
                tracker = new MoatApiTracker(container,ids,30);
            });

            it('name',function(){
                expect(tracker.name).toEqual('_moatApi100000000');
                expect(function(){
                    tracker.name = 'howard';
                }).toThrow();
            });

        });
       
        describe('dispatchEvent', function(){
            let evt, tracker;
            beforeEach(function(){
                evt = {
                    type : 'AdVideoFirstQuartile',
                    adVolume : 0.5
                };

                tracker = new MoatApiTracker(container,ids,30);
            });

            it('proxies calls to the tracker.dispatchEvent',function(){
                spyOn(tracker._private_.tracker,'dispatchEvent');
                tracker.dispatchEvent(evt);
                expect(tracker._private_.tracker.dispatchEvent).toHaveBeenCalledWith(evt);
            });

            it('caches events before the moat lib is fully loaded',function(){
                tracker.dispatchEvent(evt);
                expect(tracker._private_.events[0]).toBe(evt);
            });

            it('sends cached events on first send',function(){
                let evt2 = {
                    type : 'AdVideoSecondQuartile',
                    adVolume: 0.5
                };
                tracker.dispatchEvent(evt);
                tracker._private_.tracker.sendEvent = jasmine.createSpy('sendEvent');
                tracker.dispatchEvent(evt2);
                expect(tracker._private_.tracker.sendEvent)
                    .toHaveBeenCalledWith([evt,evt2]);
            });

            it('only cahes a dispatched event once',function(){
                tracker.dispatchEvent(evt);
                tracker.dispatchEvent(evt);
                expect(tracker._private_.events[0]).toBe(evt);
                expect(tracker._private_.events.length).toEqual(1);
            });

            it('only sends a dispatched event once',function(){
                tracker._private_.tracker.sendEvent = jasmine.createSpy('sendEvent');
                tracker.dispatchEvent(evt);
                tracker.dispatchEvent(evt);
                expect(tracker._private_.tracker.sendEvent.calls.count()).toEqual(1);
            });
        });
    });

    describe('moatApi',function(){
        beforeEach(function(){
            container.childNodes = [];
            moatApi.constructor();
        });
        describe('constructor', function() {
            it('sets up the tracker',function(){
                expect(moatApi._private_.trackers).toEqual({});
            });
        });

        describe('initTracker',function(){
            it('does nothing if a tracker already exists for clientId',function(){
                let obj = {};
                moatApi._private_.trackers.abc = obj;
                moatApi.initTracker('abc',container,ids,30);
                expect(moatApi._private_.trackers.abc).toBe(obj);
                expect(codeLoader.configure).not.toHaveBeenCalled();
                expect(codeLoader.load).not.toHaveBeenCalled();
            });

            it('initializes a new tracker instance if it does not have clientid',function(){
                moatApi.initTracker('abc',container,ids,30);
                expect(moatApi._private_.trackers.abc.name).toEqual('_moatApi100000000');
                expect(codeLoader.configure).toHaveBeenCalled();
                expect(codeLoader.load).toHaveBeenCalled();
            });
        });

        describe('dispatchEvent',function(){
            let evt1, evt2 ;
            beforeEach(function(){
                evt1 = {
                    type : 'AdVideoFirstQuartile',
                    adVolume : 0.5
                };
                evt2 = {
                    type : 'AdVideoSecondQuartile',
                    adVolume : 0.5
                };
            });

            it('passes the dispatchEvent call to the tracker if clientId exists',function(){
                moatApi.initTracker('abc',container,ids,30);
                spyOn(moatApi._private_.trackers.abc,'dispatchEvent'); 
                moatApi.dispatchEvent('abc',evt1);
                expect(moatApi._private_.trackers.abc.dispatchEvent)
                    .toHaveBeenCalledWith(evt1); 
            });

            it('caches the dispatchEvent call if clientid does not exist', function(){
                moatApi.dispatchEvent('abc',evt1);
                moatApi.dispatchEvent('abc',evt2);
                expect(moatApi._private_.pending.abc[0]).toBe(evt1); 
                expect(moatApi._private_.pending.abc[1]).toBe(evt2); 
            });

            it('sends cached dispatchEvent calls after tracker is created', function(){
                moatApi.dispatchEvent('abc',evt1);
                moatApi.dispatchEvent('abc',evt2);
                spyOn(moatApi,'dispatchEvent');
                expect(moatApi.dispatchEvent).not.toHaveBeenCalled();
                moatApi.initTracker('abc',container,ids,30);
                expect(moatApi.dispatchEvent).toHaveBeenCalledWith('abc',evt1);
                expect(moatApi.dispatchEvent).toHaveBeenCalledWith('abc',evt2);
            });

        });
    });
});
