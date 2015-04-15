import Post from '../../../src/models/Post.js';
import Ballot from '../../../src/models/Ballot.js';
import election from '../../../src/services/election.js';

describe('Post', function() {
    let post;
    let card;
    let experience;

    beforeEach(function() {
        card = {
            links: {
                Website: 'http://www.cinema6.com'
            },
            data: {}
        };

        experience = {
            data: {}
        };

        spyOn(election, 'getResults').and.returnValue(new Promise(() => {}));

        post = new Post(card, experience);
    });

    describe('properties:', function() {
        describe('ballot', function() {
            describe('website', function() {
                it('should be the card\'s website', function() {
                    expect(post.website).toBe(card.links.Website);
                });
            });

            it('should be null', function() {
                expect(post.ballot).toBeNull();
            });

            describe('if the card has a ballot', function() {
                beforeEach(function() {
                    card.ballot = {
                        choices: []
                    };

                    post = new Post(card, experience);
                });

                it('should be a ballot', function() {
                    expect(post.ballot).toEqual(jasmine.any(Ballot));
                });
            });
        });
    });
});
