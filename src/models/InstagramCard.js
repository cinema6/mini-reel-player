import Card from './Card.js';

export default class InstagramCard extends Card {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramImage';
        this.href = data.href;
        this.tags = data.tags;
        this.timeCreated = new Date(data.timeCreated);
        this.caption = data.caption;
        this.user = {
            username: data.user.username,
            picture: data.user.picture,
            fullname: data.user.fullname
        };
        this.comments = {
            count: data.comments.count,
            data: data.comments.data.map(function(comment) {
                return {
                    id: comment.id,
                    timeCreated: new Date(comment.timeCreated),
                    text: comment.text,
                    user: {
                        username: comment.user.username,
                        picture: comment.user.picture,
                        fullname: comment.user.fullname
                    }
                };
            })
        };
        this.likes = {
            count: data.likes.count,
            data: data.likes.data.map(function(like) {
                return {
                    id:like.id,
                    username: like.username,
                    picture: like.picture,
                    fullname: like.fullname
                };
            })
        };
        this.data = {
            type: data.data.type,
            src: data.data.src
        };
    }
}
