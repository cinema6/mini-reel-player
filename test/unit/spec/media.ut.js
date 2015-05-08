import media from '../../../src/services/media.js';

describe('media', function() {
    beforeEach(function() {
        media.constructor();
    });

    afterAll(function() {
        media.constructor();
    });

    it('should exist', function() {
        expect(media).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('bestVideoFormat(types)', function() {
            let result;
            let formats;
            let createElement;

            beforeEach(function() {
                formats = ['video/3gp', 'video/webm', 'video/mp4', 'video/ogg'];
                createElement = document.createElement;
            });

            describe('if the browser does not support HTML5 video', function() {
                beforeEach(function() {
                    spyOn(document, 'createElement').and.callFake(type => {
                        switch (type.toLowerCase()) {
                        case 'video':
                            return {};
                        default:
                            return createElement.apply(document, arguments);
                        }
                    });
                    media.constructor();

                    result = media.bestVideoFormat(formats);
                });

                it('should return null', function() {
                    expect(result).toBeNull();
                });
            });

            describe('if the browser supports HTML5 video', function() {
                let canPlayType;
                let video;

                beforeEach(function() {
                    canPlayType = jasmine.createSpy('video.canPlayType()').and.returnValue('');

                    class Video {
                        constructor() {
                            this.canPlayType = canPlayType;
                        }
                    }

                    spyOn(document, 'createElement').and.callFake(type => {
                        switch (type.toLowerCase()) {
                        case 'video':
                            return (video = new Video());
                        default:
                            return createElement.apply(document, arguments);
                        }
                    });

                    canPlayType.and.callFake(type => {
                        switch (type) {
                        case 'video/mp4':
                            return 'probably';
                        case 'video/webm':
                        case 'video/ogg':
                            return 'maybe';
                        default:
                            return '';
                        }
                    });

                    media.constructor();

                    result = media.bestVideoFormat(formats);
                });

                it('should return the format it can probably play', function() {
                    expect(result).toBe('video/mp4');
                });

                describe('if the browser can\'t probably play any of the formats', function() {
                    beforeEach(function() {
                        canPlayType.and.callFake(type => {
                            switch (type) {
                            case 'video/webm':
                            case 'video/ogg':
                                return 'maybe';
                            default:
                                return '';
                            }
                        });

                        result = media.bestVideoFormat(formats);
                    });

                    it('should return the type it can maybe play', function() {
                        expect(result).toBe('video/webm');
                    });
                });

                describe('if the browser can\'t play anything', function() {
                    beforeEach(function() {
                        canPlayType.and.returnValue('');

                        result = media.bestVideoFormat(formats);
                    });

                    it('should return null', function() {
                        expect(result).toBeNull();
                    });
                });

                describe('if the browser can probably play a few types', function() {
                    beforeEach(function() {
                        canPlayType.and.callFake(type => {
                            switch (type) {
                            case 'video/mp4':
                            case 'video/webm':
                                return 'probably';
                            case 'video/ogg':
                                return 'maybe';
                            default:
                                return '';
                            }
                        });

                        result = media.bestVideoFormat(formats);
                    });

                    it('should prefer the mp4', function() {
                        expect(result).toBe('video/mp4');
                    });
                });
            });
        });

        describe('loadMedia(media)', function() {
            let video;

            beforeEach(function() {
                global.c6.html5Videos = [
                    document.createElement('video'),
                    document.createElement('video'),
                    document.createElement('video')
                ];

                video = document.createElement('video');

                media.loadMedia(video);
            });

            afterEach(function() {
                global.c6.html5Videos = [];
            });

            it('should add the media to the c6.html5Videos array', function() {
                expect(global.c6.html5Videos.indexOf(video)).toBe(3);
            });
        });

        describe('unloadMedia(media)', function() {
            let video;

            beforeEach(function() {
                global.c6.html5Videos = [
                    document.createElement('video'),
                    document.createElement('video'),
                    document.createElement('video')
                ];

                video = global.c6.html5Videos[1];

                media.unloadMedia(video);
            });

            afterEach(function() {
                global.c6.html5Videos = [];
            });

            it('should remove the media from the c6.html5Videos array', function() {
                expect(global.c6.html5Videos.indexOf(video)).toBe(-1);
            });
        });
    });
});
