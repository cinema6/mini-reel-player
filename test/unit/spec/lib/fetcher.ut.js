describe('fetcher', function() {
    import fetcher from '../../../../lib/fetcher.js';
    import {RunnerPromise} from '../../../../lib/Runner.js';
    import global from '../../../../lib/global.js';
    import {extend} from '../../../../lib/utils.js';

    it('should exist', function() {
        expect(fetcher).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('fetch(url, config)', function() {
            let result, fetchPromise,
                fulfill, reject,
                url, options;

            beforeEach(function() {
                fetchPromise = new Promise((_fulfill, _reject) => {
                    fulfill = _fulfill;
                    reject = _reject;
                });

                spyOn(global, 'fetch').and.returnValue(fetchPromise);

                url = 'http://portal.cinema6.com/api/auth/status';
                options = {
                    method: 'GET'
                };

                result = fetcher.fetch(url, options);
            });

            it('should call window.fetch() with the provided params', function() {
                expect(global.fetch).toHaveBeenCalledWith(url, options);
            });

            it('should return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            [200, 203, 204, 304, 600, 605].forEach(status => {
                describe(`if the response is ${status}`, function() {
                    let done, response;

                    beforeEach(function(_done) {
                        done = jasmine.createSpy('done()').and.callFake(_done);
                        response = {
                            status: status
                        };

                        result.then(done);

                        fulfill(response);
                    });

                    it('should resolve to the response', function() {
                        expect(done).toHaveBeenCalledWith(response);
                    });
                });
            });

            [400, 404, 403, 500, 504].forEach(status => {
                describe(`if the response is ${status}`, function() {
                    let done, response;

                    beforeEach(function(_done) {
                        done = jasmine.createSpy('done()').and.callFake(_done);
                        response = {
                            status: status
                        };

                        result.catch(done);

                        fulfill(response);
                    });

                    it('should reject with the response', function() {
                        expect(done).toHaveBeenCalledWith(response);
                    });
                });
            });
        });

        ['get', 'put', 'post', 'delete'].forEach(method => {
            describe(`${method}(url, config)`, function() {
                let promise, result;
                let url, options;

                beforeEach(function() {
                    promise = new RunnerPromise(function() {});
                    spyOn(fetcher, 'fetch').and.returnValue(promise);

                    url = 'http://portal.cinema6.com/api/content/status';
                    options = {
                        body: { foo: 'I am some json', bar: [] }
                    };

                    result = fetcher[method](url, options);
                });

                it('should call fetch() with the correct options', function() {
                    expect(fetcher.fetch).toHaveBeenCalledWith(url, {
                        method: method.toUpperCase(),
                        body: JSON.stringify(options.body)
                    });
                });

                it('should return the promise', function() {
                    expect(result).toBe(promise);
                });

                describe('if called without a body', function() {
                    beforeEach(function() {
                        options = {
                            headers: { 'Content-Accept': 'gzip' }
                        };

                        result = fetcher[method](url, options);
                    });

                    it('should call fetch() with the correct options', function() {
                        expect(fetcher.fetch).toHaveBeenCalledWith(url, extend(options, {
                            method: method.toUpperCase(),
                            body: undefined
                        }));
                    });
                });

                describe('if called without options', function() {
                    beforeEach(function() {
                        result = fetcher[method](url);
                    });

                    it('should call fetch() with just the default options', function() {
                        expect(fetcher.fetch).toHaveBeenCalledWith(url, {
                            method: method.toUpperCase(),
                            body: undefined
                        });
                    });
                });
            });
        });
    });
});
