import VideoCard from './VideoCard.js';

export default class InstagramVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramVideo';
        this.title = data.caption;
        this.data.href = data.href;
        this.data.src = data.data.src;
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
