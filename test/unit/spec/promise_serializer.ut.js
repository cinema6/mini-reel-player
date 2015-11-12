import PromiseSerializer from '../../../src/utils/PromiseSerializer.js';
import {defer} from '../../../lib/utils.js';

describe('PromiseSerializer', function() {
    let serializer;
    
    function wait() {
        const deferred = defer(Promise);
        setTimeout(deferred.fulfill, 1);
        return deferred.promise;
    }

    beforeEach(function() {
        serializer = new PromiseSerializer(Promise);
    });
    
    it('should exist', function() {
        expect(serializer).toEqual(jasmine.any(PromiseSerializer));
    });
    
    it('should initially be resolved', function() {
        expect(serializer.__private__.pending._state).toBe(1);
    });

    it('should be able to serialize promises', function(done) {
        const deferred = defer(Promise);
        const task1 = deferred.promise;
        const task2 = Promise.resolve();
        const taskSpy1 = jasmine.createSpy('taskSpy1');
        const taskSpy2 = jasmine.createSpy('taskSpy2');
        serializer.call(() => {
            taskSpy1();
            return task1;
        });
        serializer.call(() => {
            taskSpy2();
            return task2;
        });
        wait().then(() => {
            expect(taskSpy1).toHaveBeenCalled();
            expect(taskSpy2).not.toHaveBeenCalled();
            deferred.fulfill();
            return wait();
        }).then(() => {
            expect(taskSpy1).toHaveBeenCalled();
            expect(taskSpy2).toHaveBeenCalled();
            done();
        });
    });
    
    it('should not reject everything forever if there is an error', function(done) {
        const deferred = defer(Promise);
        const task1 = deferred.promise;
        const task2 = Promise.resolve();
        const taskSpy1 = jasmine.createSpy('taskSpy1');
        const taskSpy2 = jasmine.createSpy('taskSpy2');
        serializer.call(() => {
            taskSpy1();
            return task1;
        });
        serializer.call(() => {
            taskSpy2();
            return task2;
        });
        wait().then(() => {
            expect(taskSpy1).toHaveBeenCalled();
            expect(taskSpy2).not.toHaveBeenCalled();
            deferred.reject();
            return wait();
        }).then(() => {
            expect(taskSpy1).toHaveBeenCalled();
            expect(taskSpy2).toHaveBeenCalled();
            done();
        });
    });
});
