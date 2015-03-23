import election from '../../../src/services/election.js';
import fetcher from '../../../lib/fetcher.js';
import environment from '../../../src/environment.js';

describe('election', function() {
    beforeEach(function() {
        election.constructor();
    });

    afterAll(function() {
        election.constructor();
        fetcher.constructor();
    });

    it('should exist', function() {
        expect(election).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('vote(election, ballotItem, choice)', function() {
            let success, failure;

            beforeEach(function(done) {
                success = jasmine.createSpy('vote() success');
                failure = jasmine.createSpy('vote() failure');

                fetcher.expect('POST', `${environment.apiRoot}/api/public/vote`, {
                    election: 'e-123-override',
                    ballotItem: 'rc-22119a8cf9f755',
                    vote: 1
                }).respond(200, 'OK');

                election.vote('e-123-override', 'rc-22119a8cf9f755', 1).then(success, failure);

                fetcher.flush().then(done, done);
            });

            it('should resolve with "true"', function() {
                expect(success).toHaveBeenCalledWith(true);
            });
        });
    });
});
