import RunnerPromise from '../../../../../lib/RunnerPromise.js';
import mockFetcher from '../../../../../lib/mocks/fetcher.js';
import fetcher from '../../../../../.tmp/lib-real/fetcher.js';
import global from '../../../../../lib/global.js';

describe('mock fetcher', function() {
    beforeEach(function() {
        mockFetcher.constructor();
    });

    it('should inherit from the real fetcher', function() {
        expect(mockFetcher).toEqual(jasmine.any(fetcher.constructor));
    });

    describe('methods:', function() {
        describe('fetch(url, options)', function() {
            let result;

            beforeEach(function() {
                spyOn(global, 'fetch');

                mockFetcher.expect('GET', 'my-url.com').respond(200, '<span>Foo</span');

                result = mockFetcher.fetch('my-url.com', {});
            });

            it('should not actually fetch anything', function() {
                expect(global.fetch).not.toHaveBeenCalled();
            });

            it('should still return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            describe('if an expectation has no response', function() {
                beforeEach(function() {
                    mockFetcher.expect('GET', 'get/me.json');
                });

                it('should throw an error', function() {
                    expect(function() {
                        mockFetcher.get('get/me.json');
                    }).toThrow(new Error('No response defined for GET [get/me.json].'));
                });
            });
        });

        describe('expect(method, url, data)', function() {
            describe('if called before a call to fetch()', function() {
                beforeEach(function() {
                    mockFetcher.expect('GET', 'url.com').respond(304, {});
                    mockFetcher.expect('POST', 'hello.com', {
                        foo: 'bar'
                    }).respond(204, {});
                });

                it('should allow the call to fetch() to be made', function() {
                    expect(function() {
                        mockFetcher.get('url.com');
                    }).not.toThrow();
                    expect(function() {
                        mockFetcher.post('hello.com', {
                            body: { foo: 'bar' }
                        });
                    }).not.toThrow();
                });
            });

            describe('if not called before a call to fetch()', function() {
                it('should cause fetch() to throw an error', function() {
                    expect(function() {
                        mockFetcher.get('url.com');
                    }).toThrow(new Error('Unexpected GET [url.com].'));
                    expect(function() {
                        mockFetcher.post('hello.com', {
                            body: { foo: 'bar' }
                        });
                    }).toThrow(new Error('Unexpected POST [hello.com].'));
                });
            });

            describe('if different data was expected', function() {
                beforeEach(function() {
                    mockFetcher.expect('PUT', '/api/put', {
                        food: 'burger'
                    });
                });

                it('should throw an error', function() {
                    const expected = JSON.stringify({ food: 'burger' });
                    const got = JSON.stringify({ foo: 'burger' });

                    expect(function() {
                        mockFetcher.put('/api/put', { body: { foo: 'burger' } });
                    }).toThrow(new Error(`Expected PUT [/api/put] with different data. EXPECTED: ${expected}; GOT: ${got};`));
                });
            });
        });

        describe('flush()', function() {
            describe('when expect() was called but fetch() wasn\'t', function() {
                beforeEach(function() {
                    mockFetcher.expect('GET', 'get/me.json').respond(200, {});
                    mockFetcher.expect('POST', 'post/me.json', {});

                    mockFetcher.get('get/me.json');
                });

                it('should throw an error', function() {
                    expect(function() {
                        mockFetcher.flush();
                    }).toThrow(new Error('Expected POST [post/me.json].'));
                });
            });

            describe('if an expectation has a response', function() {
                let getSuccess, putFailure;

                beforeEach(function(done) {
                    getSuccess = jasmine.createSpy('getSuccess()');
                    putFailure = jasmine.createSpy('putFailure()');

                    mockFetcher.expect('GET', 'get/me.json')
                        .respond(200, { message: 'It worked!' });
                    mockFetcher.expect('PUT', 'put/me.html', { payload: 'gimme' })
                        .respond(500, '<p>Hello!</p>');

                    mockFetcher.get('get/me.json').then(getSuccess);
                    mockFetcher.put('put/me.html', { body: { payload: 'gimme' } }).catch(putFailure);

                    const proto = global.Response.prototype;
                    spyOn(global, 'Response').and.callThrough();
                    global.Response.prototype = proto;

                    spyOn(mockFetcher, 'constructor').and.callThrough();

                    mockFetcher.flush().then(done);
                });

                it('should resolve the promises returned by fetch()', function() {
                    expect(getSuccess).toHaveBeenCalledWith(jasmine.any(Object));
                    expect(putFailure).toHaveBeenCalledWith(jasmine.any(Object));
                });

                it('should reset the state of the Fetcher', function() {
                    expect(mockFetcher.constructor).toHaveBeenCalled();
                });

                describe('the object it resolves to', function() {
                    let getResponse, putResponse;

                    beforeEach(function() {
                        getResponse = getSuccess.calls.mostRecent().args[0];
                        putResponse = putFailure.calls.mostRecent().args[0];
                    });

                    it('should be a Response', function() {
                        expect(global.Response).toHaveBeenCalledWith(JSON.stringify({ message: 'It worked!' }), {
                            status: 200,
                            statusText: 'OK',
                            headers: jasmine.any(global.Headers),
                            url: 'get/me.json'
                        });
                        expect(getResponse).toEqual(jasmine.any(global.Response));

                        expect(putResponse).toEqual(jasmine.any(global.Response));
                        expect(global.Response).toHaveBeenCalledWith('<p>Hello!</p>', {
                            status: 500,
                            statusText: 'ERROR',
                            headers: jasmine.any(global.Headers),
                            url: 'put/me.html'
                        });
                    });
                });
            });
        });
    });
});
