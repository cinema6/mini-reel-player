'use strict';
var express = require('express');
var Player = require('cwrx/bin/player');
var resolvePath = require('path').resolve;
var createReadStream = require('fs').createReadStream;
var inspect = require('util').inspect;
var mime = require('mime');
var basename = require('path').basename;
var request = require('request');
var parseURL = require('url').parse;
var formatURL = require('url').format;
var pump = require('pump');
var stat = require('fs').stat;
var assign = require('lodash/object/assign');
var grunt = require('grunt');

var args = process.argv.slice(2);
var cliOptions = JSON.parse(args[1]);

var server = express().use(require('connect-livereload')());
var experiences = require('./experiences.json');
var player = new Player({
    api: {
        root: 'http://localhost:' + process.env.PORT + '/',
        player: {
            endpoint: './.build/index.html'
        },
        branding: {
            endpoint: 'mothership/collateral/dist/branding/',
            cacheTTLs: {
                fresh: 0,
                max: 0
            }
        },
        experience: {
            endpoint: 'api/experience/',
            validParams: [
                'campaign', 'branding', 'placementId',
                'container', 'wildCardPlacement',
                'pageUrl', 'hostApp', 'network'
            ],
            cacheTTLs: {
                fresh: 0,
                max: 0
            },
            default: 'e-00000000000000'
        },
        card: {
            endpoint: 'api/card/',
            cacheTTLs: {
                fresh: 0,
                max: 0
            }
        },
        placement: {
            cacheTTLs: {
                fresh: 0,
                max: 0
            }
        }
    },
    tracking: {
        pixel: '/pixel.gif'
    },
    app: {
        version: 'master',
        staticURL: 'static/',
        entry: require.resolve('../build/main.html'),
        config: require.resolve('./config.js')
    },
    cloudwatch: {
        namespace: 'C6/Player',
        region: 'us-east-1',
        sendInterval: 0, // 5 mins
        dimensions: [{ Name: 'Environment', Value: 'Player Development' }]
    },
    defaults: {
        origin: 'http://www.cinema6.com/',
        context: 'standalone',
        container: 'standalone',
        mobileType: 'mobile',
        standalone: true,
        interstitial: false,
        autoLaunch: true
    },
    validTypes: require('../package.json').builds
});

function extend(/*...objects*/) {
    var objects = Array.prototype.slice.call(arguments);

    return objects.reduce(function(result, object) {
        return Object.keys(object).reduce(function(result, key) {
            result[key] = object[key];
            return result;
        }, result);
    }, {});
}

function serveStatic(req, res) {
    var path = (function() {
        var STATIC_REGEX = /^\/static\/master\//;

        if (STATIC_REGEX.test(req.path)) {
            var directory = resolvePath(__dirname, '../build');

            return resolvePath(directory, req.path.replace(STATIC_REGEX, ''));
        }

        return resolvePath(__dirname, '.' + req.path);
    }());

    stat(path, function verifyExists(error) {
        if (error) {
            switch (error.code) {
            case 'ENOENT':
                return res.status(404).send('NOT FOUND');
            default:
                return res.status(500).send(inspect(error));
            }
        }

        res.set('Content-Type', mime.lookup(path));

        pump(createReadStream(path), res.status(200));
    });

}

(function() {
    var browserify = require('browserify');
    var watchify = require('watchify');
    var cache = {};

    function init(main, config) {
        var builder = browserify(assign(config.browserify.options || {}, {
            cache: {},
            packageCache: {},
            entries: [main]
        }));

        builder.plugin(watchify, config.watchify.options || {});

        (config.browserify.plugins || []).forEach(function(plugin) {
            builder.plugin.apply(builder, plugin);
        });

        (config.browserify.transforms || []).forEach(function(transform) {
            builder.transform.apply(builder, transform);
        });

        cache[main] = builder;

        return builder.bundle();
    }

    server.get(player.config.app.builder.watchify.endpoint, function watchify(req, res) {
        var query = req.query;
        var main = query.main;
        var config = JSON.parse(query.config);

        res.set('Content-Type', mime.lookup(main));

        if (main in cache) {
            return cache[main].bundle().pipe(res.status(200));
        }

        return init(main, config).pipe(res.status(200));
    });
}());

server.get('/api/experience/*', function getExperience(req, res) {
    var id = basename(req.path);
    var url = parseURL(req.url, true);

    if (/^e-/.test(id)) {
        pump(request.get({
            uri: formatURL({
                protocol: 'http:',
                hostname: 'platform-staging.reelcontent.com',
                pathname: '/api/public/content/experience/' + id
            }),
            qs: url.query
        }), res.status(200));
    } else {
        res.status(200).send(experiences[id]);
    }
});

server.get('/api/card/:id', function getExperience(req, res) {
    var url = parseURL(req.url, true);

    pump(request.get({
        uri: formatURL({
            protocol: 'http:',
            hostname: 'platform-staging.reelcontent.com',
            pathname: '/api/public/content/card/' + req.params.id
        }),
        qs: url.query
    }), res.status(200));
});

server.get('/', function redirect(req, res) {
    var type = args[0];

    res.redirect(303, formatURL({
        pathname: '/' + type,
        query: req.query
    }));
});

server.get('/*', function handleRoot(req, res, next) {
    var filename = basename(req.path);
    var host = req.get('Host');

    player.config.api.root = 'http://' + host + '/';

    if (player.config.validTypes.indexOf(filename) > -1) {
        player.resetCodeCache();

        res.set('Content-Type', 'text/html; charset=UTF-8');

        req.query = extend({
            preview: true,
            type: filename,
            debug: 3
        }, cliOptions, req.query);

        grunt.log.writeln(
            'Serving the ' + filename + ' player with params: ' +
                JSON.stringify(req.query, null, '    ')
        );

        player.middlewareify('get')(req, res, next);
    } else {
        serveStatic.apply(this, arguments);
    }
});

server.get('/static/master/*', serveStatic);

server.listen(process.env.PORT);
process.stdout.write('Started server.\n');
