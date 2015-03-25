const c6 = global.c6 || {};
const $location = (() => {
    try {
        return global.parent.location;
    } catch (e) {
        return global.location;
    }
}());

class Environment {
    constructor() {
        this.debug = !!c6.kDebug;
        this.secure = $location.protocol === 'https:';
        this.apiRoot = c6.kEnvUrlRoot || '//portal.cinema6.com';
        this.protocol = ($location.protocol === 'javascript:' ?  'http:' : $location.protocol);
        this.hostname = $location.hostname;
    }
}

export default new Environment();
