describe('mock Logger', function() {
    import Logger from '../../../../../lib/mocks/Logger.js';
    let logger;

    beforeEach(function() {
        logger = new Logger();
    });

    it('should be a logger', function() {
        expect(logger).toEqual(jasmine.any(Object));
    });

    describe('static', function() {
        describe('methods:', function() {
            describe('create()', function() {
                beforeEach(function() {
                    logger = Logger.create();
                });

                it('should return a logger', function() {
                    expect(logger).toEqual(jasmine.any(Logger));
                });

                it('should return the same instance every time', function() {
                    expect(Logger.create()).toBe(logger);
                });
            });
        });
    });

    describe('instance', function() {
        describe('methods:', function() {
            ['log', 'info', 'warn', 'error'].forEach(method => {
                describe(`${method}()`, function() {
                    beforeEach(function() {
                        spyOn(console, method);

                        logger[method]();
                    });

                    it('should do nothing', function() {
                        expect(console[method]).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
