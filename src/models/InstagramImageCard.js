import ImageCard from './ImageCard.js';

export default class InstagramImageCard extends ImageCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramImage';
        this.title = data.caption;
        this.data.source = data.source;
        this.data.href = data.href;
        this.user = {
            href: data.user.href,
            picture: data.user.picture,
            username: data.user.username,
            fullname: data.user.fullname,
            bio: data.user.bio,
            website: data.user.website,
            posts: data.user.posts,
            followers: data.user.followers,
            following: data.user.following,
            follow: data.user.follow
        };
        this.likes = data.likes;
        this.date = new Date(parseInt(data.date) * 1000);
        this.caption = data.caption;
        this.comments = data.comments;
    }
}
