import imageLoader from '../../../src/services/image_loader.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';

describe('imageLoader', function() {
    beforeEach(function() {
        imageLoader.constructor();
    });

    afterAll(function() {
        imageLoader.constructor();
    });

    it('should exist', function() {
        expect(imageLoader).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('load(...srcs)', function() {
            let src1, src2, src3;
            let images;
            let result;
            let success, failure;

            beforeEach(function() {
                src1 = 'image1.jpg';
                src2 = 'image2.png';
                src3 = 'image3.gif';

                images = [];

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(global, 'Image').and.callFake(() => {
                    return images[images.push({
                        src: null,
                        onload: null,
                        onerror: null
                    }) - 1];
                });

                result = imageLoader.load(src1, src2, src3);
            });

            it('should return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            it('should load each specified image', function() {
                expect(images.length).toBe(3);
                expect(images[0].src).toBe(src1);
                expect(images[1].src).toBe(src2);
                expect(images[2].src).toBe(src3);
            });

            describe('when all the images load', function() {
                beforeEach(function(done) {
                    result.then(success, failure).then(done, done);
                    images.forEach(image => image.onload());
                });

                it('should fulfill the promise with all the images', function() {
                    expect(success).toHaveBeenCalledWith(images);
                });
            });

            describe('if an image fails to load', function() {
                beforeEach(function(done) {
                    result.then(success, failure).then(done, done);

                    images[0].onload();
                    images[1].onerror();
                    images[2].onload();
                });

                it('should reject with the failed image in an array', function() {
                    expect(failure).toHaveBeenCalledWith([images[1]]);
                });
            });
        });
    });
});
