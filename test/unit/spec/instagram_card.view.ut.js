describe('InstagramCardView', function() {
    import InstagramCardView from '../../../src/views/InstagramCardView.js';
    import CardView from '../../../src/views/CardView.js';
    import InstagramCaptionView from '../../../src/views/InstagramCaptionView.js';
    import LinksListView from '../../../src/views/LinksListView.js';
    import View from '../../../lib/core/View.js';
    import TemplateView from '../../../lib/core/TemplateView.js';
    import Runner from '../../../lib/Runner.js';
    let cardView;

    beforeEach(function() {
        cardView = new InstagramCardView();
        let element = document.createElement('div');
        element.innerHTML = '<div></div>';
        cardView.element = element;
    });

    it('should be a CardView', function() {
        expect(cardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('instantiates', function() {
            it('should be caption and list view', function() {
                expect(cardView.instantiates).toEqual({
                    InstagramCaptionView,
                    LinksListView
                });
            });
        });
    });

    describe('methods', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                cardView.links = new TemplateView();
                cardView.linksSmall = new TemplateView();
                spyOn(CardView.prototype, 'update');
                spyOn(cardView.links, 'update');
                spyOn(cardView.linksSmall, 'update');
                data = { sponsored: true };
                Runner.run(() => {
                    cardView.update(data);
                });
            });

            it('should call super', function() {
                expect(CardView.prototype.update).toHaveBeenCalled();
            });

            describe('if sponsored', function() {
                beforeEach(function() {
                    data = {
                        sponsored: true,
                        links: [
                            {
                                type: 'facebook',
                                label: 'Facebook',
                                href: 'www.facebook-link.com'
                            }
                        ]
                    };
                    Runner.run(() => {
                        cardView.update(data);
                    });
                });

                it('should add the sponsored class', function() {
                    const view = new View(cardView.element.firstElementChild);
                    expect(view.classes).toContain('instag____card__group--sponsored');
                });

                it('should update the links view', function() {
                    expect(cardView.links.update).toHaveBeenCalledWith([
                        {
                            type: 'facebook',
                            label: 'Facebook',
                            href: 'www.facebook-link.com'
                        }
                    ]);
                });

                it('should update the small links view', function() {
                    expect(cardView.linksSmall.update).toHaveBeenCalledWith([
                        {
                            type: 'facebook',
                            label: 'Facebook',
                            href: 'www.facebook-link.com'
                        }
                    ]);
                });
            });

            describe('if not sponsored', function() {
                beforeEach(function() {
                    data = { sponsored: false };
                    Runner.run(() => {
                        cardView.update(data);
                    });
                });

                it('should remove the sponsored class', function() {
                    const view = new View(cardView.element.firstElementChild);
                    expect(view.classes).not.toContain('instag____card__group--sponsored');
                });
            });
        });
    });
});
