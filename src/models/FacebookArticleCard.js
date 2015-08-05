import ArticleCard from './ArticleCard.js';

export default class FacebookArticleCard extends ArticleCard {
    constructor(data) {
        super(...arguments);

        this.type = 'facebookArticle';
        this.data.source = data.source;
        this.data.href = data.href;
    }
}
