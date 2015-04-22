import media from './media.js';
import imageLoader from './image_loader.js';
import fetcher from '../../lib/fetcher.js';
import RunnerPromise from '../../lib/RunnerPromise.js';
import {
    forEach,
    map,
    reduce,
    defer
} from '../../lib/utils.js';
import {createKey} from 'private-parts';

function getNodeValue(node) {
    return node.firstChild.nodeValue || node.firstChild.firstChild.nodeValue;
}

const _ = createKey({
    getXML(string) {
        const parser = new DOMParser();

        return parser.parseFromString(
            string.replace(/\n/g, '').replace(/>\s+</g, '><'),
            'text/xml'
        );
    },

    getSecondsFromTimestamp(timestamp) {
        const timeArray = timestamp.split(':').reverse();

        return reduce(timeArray, (total, time, index) => {
            return total + (parseInt(time, 10) * Math.pow(60, index));
        }, 0);
    }
});

class VAST {
    constructor(xml) {
        function $(selector) {
            return xml.querySelectorAll(selector);
        }

        this.video = {
            duration: _(this).getSecondsFromTimestamp(
                ($('Linear Duration')[0] || $('Video Duration')[0]).childNodes[0].nodeValue
            ),
            mediaFiles: map($('MediaFiles MediaFile'), mediaFile => {
                return reduce(mediaFile.attributes, (result, attribute) => {
                    result[attribute.name] = attribute.value;
                    return result;
                }, { url: getNodeValue(mediaFile) });
            })
        };

        this.companions = map($('CompanionAds Companion'), companion => {
            // this assumes that there's only one adType in each <Companion>
            // it also assumes a specific xml structure
            // might want to do a query for each adType instead

            const companionNode = companion.firstChild;
            const adType = (function(tagName) {
                switch (tagName) {
                case 'IFrameResource':
                    return 'iframe';
                case 'StaticResource':
                    return 'image';
                case 'HTMLResource':
                    return 'html';
                }
            }(companionNode.tagName));

            return ['width', 'height'].reduce(function(result, prop) {
                result[prop] = parseInt(companion.getAttribute(prop), 10);
                return result;
            },{
                adType : adType,
                fileURI : getNodeValue(companionNode)
            });
        });

        this.clickThrough = map($('VideoClicks ClickThrough'), getNodeValue);

        this.pixels = {
            // this does not include non-linear tracking
            errorPixel: map($('Error'), getNodeValue),
            impression: map($('Impression'), getNodeValue),
            creativeView: [],
            start: [],
            firstQuartile: [],
            midpoint: [],
            thirdQuartile: [],
            complete: [],
            mute: [],
            unmute: [],
            pause: [],
            rewind: [],
            resume: [],
            fullscreen: [],
            expand: [],
            collapse: [],
            acceptInvitation: [],
            close: [],
            videoClickThrough: [],
            videoClickTracking: map($('VideoClicks ClickTracking'), getNodeValue),
            videoCustomClick: map($('VideoClicks CustomClick'), getNodeValue),
            companionCreativeView: map($('Companion Tracking'), getNodeValue),
            playing: [],
            companionDisplay: [],
            companionClick: [],
            loaded: [],
            stopped: [],
            linearChange: []
        };

        forEach(($('Linear Tracking')[0] ? $('Linear Tracking') : $('Tracking')), tracking => {
            const eventName = tracking.getAttribute('event');

            (this.pixels[eventName] || []).push(getNodeValue(tracking));
        });
    }

    getVideoSrc(_type) {
        let bestVideo;
        const type = _type || media.bestVideoFormat(
            this.video.mediaFiles
                .filter(function(mediaFile) {
                    return (/mp4|webm/).test(mediaFile.type);
                })
                .map(function(mediaFile) {
                    return mediaFile.type;
                })
        );

        this.video.mediaFiles
            .filter(function(mediaFile) {
                return mediaFile.type === type;
            })
            .forEach(function(mediaFile) {
                bestVideo = bestVideo || mediaFile;
                const isSmaller = parseInt(mediaFile.bitrate || mediaFile.height, 10) <
                    parseInt(bestVideo.bitrate || bestVideo.height, 10);

                bestVideo = isSmaller ? mediaFile : bestVideo;
            });

        return bestVideo ? bestVideo.url : null;
    }

    getCompanion() {
        // this just returns the first one
        // probably want to have some logic here
        // maybe we want to pass in a size?
        return this.companions.length ? this.companions[0] : null;
    }

    firePixels(event) {
        imageLoader.load(...this.pixels[event]);
    }
}

class IAB {
    constructor() {
        _(this).VAST = VAST;

        if (!!global.__karma__) { this.__private__ = _(this); }
    }

    getVAST(url) {
        // make an xml container for all the vast responses, including wrappers
        const parser = new DOMParser();
        const combinedVast = parser.parseFromString(
            '<?xml version="1.0" encoding="UTF-8"?><container></container>',
            'text/xml'
        );
        const vastDeferred = defer(RunnerPromise);

        const fetchVAST = (url => {
            const recurse = (vast => {
                const uriNodes = vast.querySelectorAll('VASTAdTagURI');

                // append the VAST node to the xml container
                combinedVast.firstChild.appendChild(
                    vast.querySelectorAll('VAST')[0] ||
                        vast.querySelectorAll('VideoAdServingTemplate')[0]
                );

                if (uriNodes.length > 0) {
                    return fetchVAST(uriNodes[0].firstChild.nodeValue);
                }

                if(!combinedVast.querySelectorAll('MediaFiles').length) {
                    return RunnerPromise.reject('No video ad!');
                }

                // after we've recursed through all the wrappers return
                // the xml container with all the vast data
                return combinedVast;

            });

            return fetcher.get(url)
                .then(response => response.text())
                .then(_(this).getXML)
                .then(recurse);
        });


        const createVast = (vast => {
            const {VAST} = _(this);

            vastDeferred.fulfill(new VAST(vast));
        });

        fetchVAST(url).then(createVast).catch(error => vastDeferred.reject(error));

        return vastDeferred.promise;
    }
}

export default new IAB();
