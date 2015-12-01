import ApplicationView from '../../../src/views/ApplicationView.js';
import View from '../../../lib/core/View.js';

describe('ApplicationView', function() {
    let applicationView;

    beforeEach(function() {
        applicationView = new ApplicationView();
    });

    it('should exist', function() {
        expect(applicationView).toEqual(jasmine.any(View));
    });
});
