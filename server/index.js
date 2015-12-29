'use strict';

var resolvePath = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var Player = require('cwrx/bin/player');
var BrowserInfo = require('cwrx/lib/browserInfo');
var grunt = require('grunt');
var inspect = require('util').inspect;
var basename = require('path').basename;
var request = require('request-promise');
var parseURL = require('url').parse;
var formatURL = require('url').format;
var mime = require('mime');

function extend(/*...objects*/) {
    var objects = Array.prototype.slice.call(arguments);

    return objects.reduce(function(result, object) {
        return Object.keys(object).reduce(function(result, key) {
            result[key] = object[key];
            return result;
        }, result);
    }, {});
}

module.exports = function(httpMock) {
    var cliOptions = {
        campaign: grunt.config.get('server.campId'),
        experience: grunt.config.get('server.exp')
    };

    function serveStatic(req) {
        // jshint validthis:true
        var path = resolvePath(__dirname, req.pathname.replace(/^\//, ''));

        this.setHeaders({
            'Content-Type': mime.lookup(path)
        });

        try {
            this.respond(200, readFileSync(path));
        } catch(e) {
            this.respond(404, 'NOT FOUND');
        }
    }

    httpMock.whenGET('/api/experience/**', function(req) {
        var id = basename(req.pathname);
        var url = parseURL(req.url, true);

        if (/^e-/.test(id)) {
            this.respond(200, request.get({
                uri: formatURL({
                    protocol: 'http:',
                    hostname: 'staging.cinema6.com',
                    pathname: '/api/public/content/experience/' + id
                }),
                qs: url.query
            }));
        } else {
            this.respond(200, require('./experiences.json')[id]);
        }
    });

    httpMock.whenGET('/', function(req) {
        var type = grunt.config.get('server.mode');

        this.setHeaders({
            Location: formatURL({
                pathname: '/' + type,
                query: req.query
            })
        }).respond(303);
    });

    httpMock.whenGET('/**', function(req) {
        var filename = basename(req.pathname);
        var host = req.headers.host;
        var player = new Player({
            api: {
                root: 'http://' + host + '/',
                player: {
                    endpoint: './.build/index.html'
                },
                branding: {
                    endpoint: 'mothership/collateral/branding/',
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
                    }
                },
                card: {
                    endpoint: 'api/card/',
                    cacheTTLs: {
                        fresh: 0,
                        max: 0
                    }
                }
            },
            adtech: {
                server: 'adserver.adtechus.com',
                network: '5491.1',
                request: {
                    maxSockets: 250,
                    timeout: 3000
                }
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
            validTypes: grunt.config.get('package.builds')
        });

        if (player.config.validTypes.indexOf(filename) > -1) {
            this.setHeaders({
                'Content-Type': 'text/html; charset=UTF-8'
            });

            this.respond(200, player.get(extend(cliOptions, req.query, {
                preview: true,
                type: filename,
                desktop: new BrowserInfo(req.headers['user-agent']).isDesktop
            })).catch(function(error) {
                return inspect(error);
            }));
        } else {
            serveStatic.apply(this, arguments);
        }
    });

    httpMock.whenGET('/.build/**', serveStatic);
};
