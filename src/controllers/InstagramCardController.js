import CardController from './CardController.js';
import View from '../../lib/core/View.js';

export default class InstagramCardController extends CardController {
    constructor() {
        super(...arguments);
        this.isRendered = false;

        const doRender = () => {
            if(!this.isRendered) {
                this.renderInstagram();
            }
        };

        this.model.on('prepare', doRender);
        this.model.on('activate', doRender);
    }

    formatLikes(likes) {
        let n = parseInt(likes); // 77669
        let l = n.toString().length; // 5
        let i = Math.floor((l - 1) / 3); // 1
        let m = Math.pow(10, i * 3 - 1); // 100
        n = Math.round(n/m)*m; // 77700
        l = n.toString().length; // 5
        i = Math.floor((l - 1) / 3); // 1
        m = Math.pow(10, i * 3); // 1000
        const suffix = ['k', 'm', 'b'];
        if(i === 0) {
            return likes.toString();
        } else if(i > suffix.length) {
            return '>1t';
        } else {
            return (n / m) + suffix[i - 1];
        }
    }

    formatDate(date) {
        const age = Date.now() - date;
        const seconds = Math.floor(age / 1000);
        const minutes = Math.floor(age / 60 / 1000);
        const hours = Math.floor(age / 60 / 60 / 1000);
        const days = Math.floor(age / 24 / 60 / 60 / 1000);
        const weeks = Math.floor(age / 7 / 24 / 60 / 60 / 1000);
        const months = Math.floor(age / 30 / 24 / 60 / 60 / 1000);
        const years = Math.floor(age / 365 / 24 / 60 / 60 / 1000);
        if(years > 0) {
            return years + ' year' + ((years > 1)?'s':'');
        } else if(months > 0) {
            return months + ' month' + ((months > 1)?'s':'');
        } else if(weeks > 0) {
            return weeks + ' week' + ((weeks > 1)?'s':'');
        } else if(days > 0) {
            return days + ' day' + ((days > 1)?'s':'');
        } else if(hours > 0) {
            return hours + ' hour' + ((hours > 1)?'s':'');
        } else if(minutes > 0) {
            return minutes + ' minute' + ((minutes > 1)?'s':'');
        } else if(seconds > 0) {
            return seconds + ' second' + ((seconds > 1)?'s':'');
        } else {
            return 'just now';
        }
    }

    formatComments(comments) {
        let result = comments.toString();
        const regex = /(\d+)(\d{3})/;
        while (regex.test(result)) {
            result = result.replace(regex, '$1' + ',' + '$2');
        }
        return result;
    }

    renderInstagram() {
        this.isRendered = true;
        if (!this.view.captionOutlet) {
            this.view.create();
        }

        const captionView = document.createElement('span');
        const postTag = '<a href="https://instagram.com/$1/" target="_blank"' +
            'class="instag____postInfo__tag">@$1</a>';
        captionView.innerHTML = this.model.caption.replace(/@(\w+)/g, postTag);
        this.view.captionOutlet.append(new View(captionView));

        this.isRendered = true;
        this.view.update({
            userHref: this.model.user.href,
            userFollow: this.model.user.follow,
            userPicture: this.model.user.picture,
            userUsername: this.model.user.username,
            userFullname: this.model.user.fullname,
            userBio: this.model.user.bio,
            userWebsite: this.model.user.website,
            userPosts: this.model.user.posts,
            userFollowers: this.model.user.followers,
            userFollowing: this.model.user.following,
            mediaSrc: this.model.data.src,
            href: this.model.data.href,
            likes: this.formatLikes(this.model.likes),
            date: this.formatDate(this.model.date),
            comments: this.formatComments(this.model.comments)
        });
    }

    formatDate(date) {
        const age = Date.now() - date;
        const seconds = Math.floor(age / 1000);
        const minutes = Math.floor(age / 60 / 1000);
        const hours = Math.floor(age / 60 / 60 / 1000);
        const days = Math.floor(age / 24 / 60 / 60 / 1000);
        const weeks = Math.floor(age / 7 / 24 / 60 / 60 / 1000);
        const months = Math.floor(age / 30 / 24 / 60 / 60 / 1000);
        const years = Math.floor(age / 365 / 24 / 60 / 60 / 1000);
        if(years > 0) {
            return years + ' year' + ((years > 1)?'s':'');
        } else if(months > 0) {
            return months + ' month' + ((months > 1)?'s':'');
        } else if(weeks > 0) {
            return weeks + ' week' + ((weeks > 1)?'s':'');
        } else if(days > 0) {
            return days + ' day' + ((days > 1)?'s':'');
        } else if(hours > 0) {
            return hours + ' hour' + ((hours > 1)?'s':'');
        } else if(minutes > 0) {
            return minutes + ' minute' + ((minutes > 1)?'s':'');
        } else if(seconds > 0) {
            return seconds + ' second' + ((seconds > 1)?'s':'');
        } else {
            return 'just now';
        }
    }

    formatComments(comments) {
        let result = comments.toString();
        const regex = /(\d+)(\d{3})/;
        while (regex.test(result)) {
            result = result.replace(regex, '$1' + ',' + '$2');
        }
        return result;
    }

    renderInstagram() {
        if (!this.view.captionOutlet) {
            this.view.create();
        }

        const captionView = document.createElement('span');
        const postTag = '<a href="https://instagram.com/$1/" target="_blank"' +
            'class="instag____postInfo__tag">@$1</a>';
        captionView.innerHTML = this.model.caption.replace(/@(\w+)/g, postTag);
        this.view.captionOutlet.append(new View(captionView));

        this.isRendered = true;
        this.view.update({
            userHref: this.model.user.href,
            userFollow: this.model.user.follow,
            userPicture: this.model.user.picture,
            userUsername: this.model.user.username,
            userFullname: this.model.user.fullname,
            userBio: this.model.user.bio,
            userWebsite: this.model.user.website,
            userPosts: this.model.user.posts,
            userFollowers: this.model.user.followers,
            userFollowing: this.model.user.following,
            mediaSrc: this.model.data.src,
            href: this.model.data.href,
            likes: this.formatLikes(this.model.likes),
            date: this.formatDate(this.model.date),
            comments: this.formatComments(this.model.comments)
        });
    }
}
