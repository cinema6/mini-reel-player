import MoatApi from '../../../src/services/moat.js';
import codeLoader from '../../../src/services/code_loader.js';
//import RunnerPromise from '../../../lib/RunnerPromise.js';
//import environment from '../../../src/environment.js';

fdescribe('moat', function() {
    let api, container, ids;
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

    describe('constructor', function() {
        it('sets up the tracker',function(){
            expect(global._moatApi100000000).not.toBeDefined();
            api = new MoatApi(container,ids,30,'http://somewhere.com');
            expect(api._private_.events).toEqual([]);
            expect(api._private_.tracker).toBeDefined();
            expect(api._private_.tracker.adData.ids).toBe(ids);
            expect(api._private_.tracker.adData.duration).toEqual(30);
            expect(api._private_.tracker.adData.url).toEqual('http://somewhere.com');
            expect(api._private_.name).toEqual('_moatApi100000000');
            expect(api._private_.src).toEqual('http://js.moatads.com/cinema6748895486244/moatvideo.js#_moatApi100000000');
            expect(global._moatApi100000000).toBeDefined();
            expect(codeLoader.configure).not.toHaveBeenCalled();
            expect(codeLoader.load).not.toHaveBeenCalled();
        });

        it('initiates the loading of the moat library with valid container',function(){
            container.childNodes = [];
            api = new MoatApi(container,ids,30,'http://somewhere.com');
            expect(codeLoader.configure).toHaveBeenCalled();
            expect(codeLoader.load).toHaveBeenCalledWith(
                '_moatApi100000000',container,'insertBefore',null
            );
        });

    });

    describe('properties', function(){
        beforeEach(function(){
            api = new MoatApi(container,ids,30,'http://somewhere.com');
        });

        it('name',function(){
            expect(api.name).toEqual('_moatApi100000000');
            expect(function(){
                api.name = 'howard';
            }).toThrow();
        });

    });

    describe('dispatchEvent', function(){
        beforeEach(function(){
            api = new MoatApi(container,ids,30,'http://somewhere.com');
        });

        it('proxies calls to the tracker.dispatchEvent',function(){
            spyOn(api._private_.tracker,'dispatchEvent');
            api.dispatchEvent(1,2,3);
            expect(api._private_.tracker.dispatchEvent).toHaveBeenCalledWith(1,2,3);
        });

        it('caches events before the moat lib is fully loaded',function(){

        });

    });

});
