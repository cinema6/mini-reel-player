import resource from '../../../src/services/resource.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';

describe('resource', function() {
    beforeEach(function() {
        resource.constructor();
    });

    afterAll(function(done) {
        resource.constructor();
        Promise.resolve().then(done);
    });

    it('should exist', function() {
        expect(resource).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('get(src)', function() {
            let json, text;
            let success, failure;
            let result;

            beforeEach(function() {
                json = document.createElement('script');
                json.setAttribute('type', 'application/json');
                json.setAttribute('data-src', 'json-resource');
                json.innerText = JSON.stringify({ hello: 'world', foo: 'bar' });

                text = document.createElement('script');
                text.setAttribute('type', 'text/plain');
                text.setAttribute('data-src', 'text-resource');
                text.innerText = JSON.stringify({ hey: 'there' });

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                document.head.appendChild(json);
                document.head.appendChild(text);
            });

            afterEach(function() {
                document.head.removeChild(json);
                document.head.removeChild(text);
            });

            describe('if called with a non-existent src', function() {
                beforeEach(function(done) {
                    result = resource.get('some-thing');
                    result.then(success, failure).then(done);
                });

                it('should return a rejected RunnerPromise', function() {
                    expect(result).toEqual(jasmine.any(RunnerPromise));
                    expect(failure).toHaveBeenCalledWith(new Error('Could not find resource [some-thing].'));
                });
            });

            describe('if called with the src of a JSON resource', function() {
                beforeEach(function(done) {
                    result = resource.get('json-resource');
                    result.then(success, failure).then(done);
                });

                it('should return a RunnerPromise that fulfills with the parsed JSON', function() {
                    expect(result).toEqual(jasmine.any(RunnerPromise));
                    expect(success).toHaveBeenCalledWith(JSON.parse(json.innerText));
                });
            });

            describe('if called with the src of a text resource', function() {
                beforeEach(function(done) {
                    result = resource.get('text-resource');
                    result.then(success, failure).then(done);
                });

                it('should return a RunnerPromise that fulfills with the text', function() {
                    expect(result).toEqual(jasmine.any(RunnerPromise));
                    expect(success).toHaveBeenCalledWith(text.innerText);
                });
            });

            it('should cache promises', function() {
                expect(resource.get('json-resource')).toBe(resource.get('json-resource'));
                expect(resource.get('text-resource')).toBe(resource.get('text-resource'));
                expect(resource.get('json-resource')).not.toBe(resource.get('text-resource'));
            });
        });
    });
});
