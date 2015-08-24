import CardController from './CardController.js';
import {createKey} from 'private-parts';

class Private {
    constructor(instance) {
        this.__public__ = instance;
    }

    doRender() {
        if(!this.__public__.isRendered) {
            this.__public__.renderInstagram();
        }
    }
}

const _ = createKey(instance => new Private(instance));

export default class InstagramCardController extends CardController {
    constructor() {
        super(...arguments);

        this.isRendered = false;

        /* InstagramImageCard (model) events. */
        this.model.on('prepare', () => this.prepare());
        this.model.on('activate', () => this.activate());
        this.model.on('deactivate', () => this.deactivate());

        if (global.__karma__) { this.__private__ = _(this); }
    }

    prepare() {
        _(this).doRender();
    }

    activate() {
        _(this).doRender();
    }

    deactivate() {
    }

    formatNumWithSuffix(likes) {
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

    formatNumWithCommas(comments) {
        let result = comments.toString();
        const regex = /(\d+)(\d{3})/;
        while (regex.test(result)) {
            result = result.replace(regex, '$1' + ',' + '$2');
        }
        return result;
    }

    renderInstagram() {
        const card = this.model,
              data = this.model.data;

        this.isRendered = true;

        if (!this.view.captionView) {
            this.view.create();
        }

        this.view.captionView.update({
            caption: data.caption
        });

        this.view.update({
            userHref: data.user.href,
            userFollow: data.user.follow,
            userPicture: data.user.picture,
            userUsername: data.user.username,
            userFullname: data.user.fullname,
            userBio: data.user.bio,
            userWebsite: data.user.website,
            userPosts: this.formatNumWithSuffix(data.user.posts),
            userFollowers: this.formatNumWithSuffix(data.user.followers),
            userFollowing: this.formatNumWithSuffix(data.user.following),
            mediaSrc: data.src,
            href: data.href,
            likes: this.formatNumWithSuffix(data.likes),
            date: this.formatDate(data.date),
            comments: this.formatNumWithCommas(data.comments),
            title: card.title,
            action: {
                label: card.action.label,
                href: card.links.Action,
                isButton: card.action.type === 'button',
                isText: card.action.type === 'text'
            },
            links: card.socialLinks,
            sponsored: card.sponsored,
            hideTitle: !card.title || card.hideTitle
        });
    }
}
