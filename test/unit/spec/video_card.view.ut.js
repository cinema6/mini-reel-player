import CardView from '../../../src/views/CardView.js';
import VideoCardView from '../../../src/views/VideoCardView.js';
import View from '../../../lib/core/View.js';
import LinksListView from '../../../src/views/LinksListView.js';
import {
    extend
} from '../../../lib/utils.js';
import Runner from '../../../lib/Runner.js';

describe('VideoCardView', function() {
    let videoCardView;

    beforeEach(function() {
        videoCardView = new VideoCardView();
    });

    it('should be a CardView', function() {
        expect(videoCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('moduleOutlets', function() {
            it('should be an empty object', function() {
                expect(videoCardView.moduleOutlets).toEqual({});
            });

            describe('after the view is created', function() {
                beforeEach(function() {
                    videoCardView.displayAdOutlet = new View();
                    videoCardView.postOutlet = new View();
                    Runner.run(() => videoCardView.create());
                });

                it('should be a reference to each module\'s outlet by name', function() {
                    expect(videoCardView.moduleOutlets).toEqual({
                        displayAd: videoCardView.displayAdOutlet,
                        post: videoCardView.postOutlet
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                videoCardView.links = new LinksListView();

                spyOn(CardView.prototype, 'update');
                spyOn(videoCardView.links, 'update');

                data = {
                    source: 'Vimeo',
                    href: 'http://www.vimeo.com/video/12547853',
                    sponsor: 'Netflix',
                    links: [
                        {
                            type: 'youtube',
                            label: 'YouTube',
                            href: 'yt.com'
                        },
                        {
                            type: 'twitter',
                            label: 'Twitter',
                            href: 'twitter.com/389fe'
                        },
                        {
                            type: 'vimeo',
                            label: 'Vimeo',
                            href: 'vim.com/389dh3'
                        },
                        {
                            type: 'facebook',
                            label: 'Facebook',
                            href: 'fb.com'
                        },
                        {
                            type: 'pinterest',
                            label: 'Pinterest',
                            href: 'pin.com/iufne4'
                        }
                    ],
                    website: {
                        label: 'Website',
                        logo: 'netlix.jpg',
                        href: 'http://www.netflix.com',
                        text: 'Netflix'
                    },
                    action: {
                        label: 'Action',
                        text: 'Check it Out!',
                        href: 'http://www.buy-now.com/',
                        isButton: true,
                        isText: false
                    }
                };

                videoCardView.update(data);
            });

            describe('when called with initial data', function() {
                beforeEach(function() {
                    data = {
                        title: 'foo',
                        note: 'my note',
                        thumbs: {}
                    };

                    videoCardView.update(data);
                });

                it('should call super()', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(data);
                });
            });

            it('should call super', function() {
                expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining(extend(data, {
                    links: jasmine.any(Array)
                })));
            });

            describe('if the card has no sponsorship info', function() {
                beforeEach(function() {
                    CardView.prototype.update.calls.reset();

                    data.website.logo = undefined;
                    data.links.length = 0;
                    data.sponsor = undefined;

                    videoCardView.update(data);
                });

                it('should send data with isSponsored: false and hasSponsoredCopy: false', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        isSponsored: false,
                        hasSponsoredCopy: false
                    }));
                });
            });

            describe('if the card has a logo', function() {
                beforeEach(function() {
                    CardView.prototype.update.calls.reset();

                    data.website.logo = 'my-logo.jpg';
                    data.links.length = 0;
                    data.sponsor = undefined;

                    videoCardView.update(data);
                });

                it('should send data with isSponsored: true and hasSponsoredCopy: false', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        isSponsored: true,
                        hasSponsoredCopy: false
                    }));
                });
            });

            describe('if the card has links', function() {
                beforeEach(function() {
                    CardView.prototype.update.calls.reset();

                    data.website.logo = undefined;
                    data.links.length = 1;
                    data.sponsor = undefined;

                    videoCardView.update(data);
                });

                it('should send data with isSponsored: true and hasSponsoredCopy: true', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        isSponsored: true,
                        hasSponsoredCopy: true
                    }));
                });
            });

            describe('if the card has a sponsor', function() {
                beforeEach(function() {
                    CardView.prototype.update.calls.reset();

                    data.website.logo = undefined;
                    data.links.length = 0;
                    data.sponsor = 'Diageo';

                    videoCardView.update(data);
                });

                it('should send data with isSponsored: true and hasSponsoredCopy: true', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        isSponsored: true,
                        hasSponsoredCopy: true
                    }));
                });
            });

            describe('if the card has links', function() {
                beforeEach(function() {
                    CardView.prototype.update.calls.reset();

                    delete data.website.href;
                    data.links.length = 1;

                    videoCardView.update(data);
                });

                it('should send data with hasLinks: true', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        hasLinks: true
                    }));
                });
            });

            describe('if the card has a website', function() {
                beforeEach(function() {
                    CardView.prototype.update.calls.reset();

                    data.website.href = 'mysite.com';
                    data.links.length = 0;

                    videoCardView.update(data);
                });

                it('should send data with hasLinks: true', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        hasLinks: true
                    }));
                });
            });

            describe('if the card has no website or links', function() {
                beforeEach(function() {
                    CardView.prototype.update.calls.reset();

                    delete data.website.href;
                    data.links.length = 0;

                    videoCardView.update(data);
                });

                it('should send data with hasLinks: false', function() {
                    expect(CardView.prototype.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        hasLinks: false
                    }));
                });
            });
        });
    });
});
