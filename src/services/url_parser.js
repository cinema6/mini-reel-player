import {createKey} from 'private-parts';
const needsDoubleSet = (() => {
    const a = document.createElement('a');

    a.setAttribute('href', '/foo');

    return !a.protocol;
}());

const _ = createKey();

class URL {
    constructor(parser, url) {
        // In all browsers except for IE, setting the href property with a relative URL
        // will do both of these operations:
        // 1. Expand the url to an absolute path
        // 2. Fill in the href/protocol/host/search/etc. properties
        //
        // However, in IE, setting the href property will only perform the first step
        // unless the values of the second step are encoded in the URL. For this reason,
        // we set the href property a first time to get the absolute URL, then set it a
        // second time to fill in the previously-mentioned properties.
        if (needsDoubleSet) {
            parser.setAttribute('href', url);
            url = parser.href;
        }

        parser.setAttribute('href', url);

        this.href = parser.href;
        this.protocol = parser.protocol.replace(/:$/, '');
        this.host = parser.host;
        this.search = parser.search.replace(/^\?/, '');
        this.hash = parser.hash.replace(/^#/, '');
        this.hostname = parser.hostname;
        this.port = parser.port;
        this.pathname = ((parser.pathname.charAt(0) === '/') ? '' : '/') +
            parser.pathname;

        _(this).parser = parser;
    }

    sameOriginAs(url) {
        const parsed = new this.constructor(_(this).parser, url);

        return (this.protocol === parsed.protocol) &&
            (this.host === parsed.host);
    }
}

class UrlParser {
    constructor() {
        _(this).parser = document.createElement('a');
    }

    parse(url) {
        return new URL(_(this).parser, url);
    }
}

export default new UrlParser();
