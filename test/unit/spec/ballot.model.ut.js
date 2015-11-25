import Ballot from '../../../src/models/Ballot.js';
import election from '../../../src/services/election.js';
import { EventEmitter } from 'events';

describe('Ballot', function() {
    let ballot;
    let card;
    let experience;

    beforeEach(function() {
        card = {
            id: 'rc-8375bd9b76fb72',
            ballot: {
                election: 'el-58ad9e1f49b147',
                prompt: 'Do you drink too much?',
                choices: [
                    'Of Course Not',
                    'There\'s No Such Thing'
                ]
            }
        };

        experience = {
            data: {
                election: 'el-ccfaac9a423060'
            }
        };

        ballot = new Ballot(card, experience);
    });

    it('should exist', function() {
        expect(ballot).toEqual(jasmine.any(EventEmitter));
    });

    describe('properties:', function() {
        describe('id', function() {
            it('should be the card id', function() {
                expect(ballot.id).toBe(card.id);
            });
        });

        describe('election', function() {
            it('should be the ballot\'s election', function() {
                expect(ballot.election).toBe(card.ballot.election);
            });

            describe('if there is no election on the card', function() {
                beforeEach(function() {
                    card.ballot.election = null;
                    ballot = new Ballot(card, experience);
                });

                it('should be the experience\'s election', function() {
                    expect(ballot.election).toBe(experience.data.election);
                });
            });
        });

        describe('prompt', function() {
            it('should be the prompt', function() {
                expect(ballot.prompt).toBe(card.ballot.prompt);
            });
        });

        describe('choices', function() {
            it('should be a copy of the choices', function() {
                expect(ballot.choices).toEqual(card.ballot.choices);
                expect(ballot.choices).not.toBe(card.ballot.choices);
            });
        });

        describe('choice', function() {
            it('should be null', function() {
                expect(ballot.choice).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        describe('cast(index)', function() {
            beforeEach(function() {
                spyOn(election, 'vote');
                ballot.cast(1);
            });

            it('should set the choice property', function() {
                expect(ballot.choice).toBe(1);
            });

            it('should send the vote to the election service', function() {
                expect(election.vote).toHaveBeenCalledWith(ballot.election, ballot.id, 1);
            });

            describe('if the index is -1', function() {
                beforeEach(function() {
                    election.vote.calls.reset();

                    ballot.cast(-1);
                });

                it('should set the choice property', function() {
                    expect(ballot.choice).toBe(-1);
                });

                it('should not send the vote to the election service', function() {
                    expect(election.vote).not.toHaveBeenCalled();
                });
            });
        });
    });
});
