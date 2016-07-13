import LinkItemView from './LinkItemView.js';

export default class CarouselItemView extends LinkItemView {
    click(event) {
        event.preventDefault();

        return super.click(...arguments);
    }
}
