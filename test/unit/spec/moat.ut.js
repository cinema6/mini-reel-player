import MoatApi from '../../../src/services/moat.js';
import codeLoader from '../../../src/services/code_loader.js';
//import RunnerPromise from '../../../lib/RunnerPromise.js';
//import environment from '../../../src/environment.js';

fdescribe('moat', function() {
    describe('constructor', function() {
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

        it('sets up the tracker',function(){
            expect(global._moatApi100000000).not.toBeDefined();
            api = new MoatApi(container,ids,30,'http://somewhere.com');
            expect(api._private_.events).toEqual([]);
            expect(api._private_.tracker).toBeDefined();
            expect(api._private_.tracker.adData.ids).toBe(ids);
            expect(api._private_.tracker.adData.duration).toEqual(30);
            expect(api._private_.tracker.adData.url).toEqual('http://somewhere.com');
            expect(api._private_.name).toEqual('_moatApi100000000');
            expect(global._moatApi100000000).toBeDefined();
        });

        it('initiates the loading of the moat library',function(){


        });

    });

});
