import injectHtml from '../../../src/fns/inject_html.js';

describe('injectHtml(html, element)', function() {
    let exampleDiv;

    beforeEach(function() {
        exampleDiv = document.createElement('div');
    });

    it('should inject html without script tags into an element', function() {
        injectHtml('<h1>some html</h1>', exampleDiv);
        expect(exampleDiv.innerHTML).toBe('<h1>some html</h1>');
    });

    it('should inject html with script tags into an element', function() {
        injectHtml('<script src="http://somewhere">innerHTML</script>', exampleDiv);
        expect(exampleDiv.innerHTML).toBe('<script src="http://somewhere">innerHTML</script>');
    });

});
