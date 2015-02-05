describe('Logger', function() {
    import Logger from '../../../../lib/Logger.js';
    let logger;

    beforeEach(function() {
        logger = new Logger('My Context');
    });

    it('should exist', function() {
        expect(logger).toEqual(jasmine.any(Object));
    });

    describe('static', function() {
        describe('methods', function() {
            describe('create()', function() {
                let result;

                beforeEach(function() {
                    spyOn(Logger.prototype, 'constructor').and.callThrough();

                    result = Logger.create('A Context');
                });

                it('should return a new logger instance', function() {
                    expect(result).toEqual(jasmine.any(Logger));
                });
            });
        });
    });

    describe('instance', function() {
        describe('methods', function() {
            ['log', 'info', 'error', 'warn'].forEach(method => {
                describe(`${method}()`, function() {
                    let object;

                    beforeEach(function() {
                        logger = Logger.create('My Context');

                        spyOn(console, method);
                        jasmine.clock().mockDate();

                        object = { name: 'Foo' };

                        logger[method]('This is a test.', object);
                    });

                    it(`should call console.${method}() with decorations`, function() {
                        expect(console[method]).toHaveBeenCalledWith(`${(new Date()).toISOString()} [${method}] {My Context}`, 'This is a test.', object);
                    });
                });
            });
        });
    });
});
