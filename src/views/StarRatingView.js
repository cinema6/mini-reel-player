import ListView from './ListView.js';
import {
    map
} from '../../lib/utils.js';

export default class StarRatingView extends ListView {
    constructor() {
        super(...arguments);

        this.tag = 'ul';
        this.template = `<li>
            <i class="fa-icon"
                data-class="full:icon-star empty:icon-star-empty half:icon-star-half-alt">
            </i>
        </li>`;
    }

    update(rating) {
        return super.update(map(new Array(5), (na, index) => ({
            id: index,
            full: index < (rating - 0.5),
            half: (index + 0.5) === rating,
            empty: index >= rating
        })));
    }
}
