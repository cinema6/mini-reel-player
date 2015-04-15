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

        describe('getResults(election, ballotItem)', function() {
            let success, failure;
            let electionData;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()').and.callFake(error => console.error(error));

                electionData = {
                    id: 'e-38fb0b1af9b047',
                    ballot: {
                        'rc-22119a8cf9f755': [ 0.5, 0.5 ],
                        'rc-4770a2d7f85ce0': [ 0, 1 ],
                        'rc-e489d1c6359fb3': [ 0, 0 ],
                        'rc-e2947c9bec017e': [ 0, 0 ],
                        'rc-99b87ea709d7ac': [ 0, 0, 0 ],
                        'rc-2c8875ab60d386': null
                    }
                };

                fetcher.expect('GET', `${environment.apiRoot}/api/public/election/${electionData.id}`)
                    .respond(200, electionData);

                election.getResults(electionData.id, 'rc-4770a2d7f85ce0').then(success, failure);

                fetcher.flush().then(() => {}).then(() => {}).then(() => {}).then(() => {}).then(done, done);
            });

            it('should fulfill with the results of the election', function() {
                expect(success).toHaveBeenCalledWith([0, 1]);
            });

            describe('if the ballot has no votes', function() {
                beforeEach(function(done) {
                    election.constructor();
                    success.calls.reset();
                    failure.calls.reset();

                    fetcher.expect('GET', `${environment.apiRoot}/api/public/election/${electionData.id}`)
                        .respond(200, electionData);

                    election.getResults(electionData.id, 'rc-99b87ea709d7ac').then(success, failure);

                    fetcher.flush().then(() => {}).then(() => {}).then(() => {}).then(() => {}).then(done, done);
                });

                it('should evenly split the results', function() {
                    expect(success).toHaveBeenCalledWith([1/3, 1/3, 1/3]);
                });
            });

            describe('if an election was previously fetched', function() {
                beforeEach(function(done) {
                    success.calls.reset();
                    failure.calls.reset();

                    election.getResults(electionData.id, 'rc-e489d1c6359fb3').then(success, failure).then(done, done);
                });

                it('should return the results from a cache', function() {
                    expect(success).toHaveBeenCalledWith([0.5, 0.5]);
                });
            });

            describe('if an election was not previously fetched', function() {
                beforeEach(function(done) {
                    success.calls.reset();
                    failure.calls.reset();
                    electionData.id = 'el-1ae3f259982fff';

                    spyOn(fetcher, 'get').and.callThrough();
                    fetcher.expect('GET', `${environment.apiRoot}/api/public/election/${electionData.id}`)
                        .respond(200, electionData);

                    election.getResults(electionData.id, 'rc-e2947c9bec017e').then(success, failure).then(done, done);

                    fetcher.flush();
                });

                it('should make a new request', function() {
                    expect(fetcher.get).toHaveBeenCalled();
                });
            });
        });
    });
});
