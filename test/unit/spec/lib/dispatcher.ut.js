import dispatcher from '../../../../lib/dispatcher.js';
import {EventEmitter} from 'events';

describe('dispatcher', function() {
    beforeEach(function() {
        spyOn(dispatcher, 'setMaxListeners').and.callThrough();

        dispatcher.constructor();
        dispatcher.removeAllListeners();
    });

    it('should exist', function() {
        expect(dispatcher).toEqual(jasmine.any(EventEmitter));
    });

    it('should allow 100 listeners', function() {
        expect(dispatcher.setMaxListeners).toHaveBeenCalledWith(100);
    });
});
