import iab from '../../../src/services/iab.js';
import media from '../../../src/services/media.js';
import imageLoader from '../../../src/services/image_loader.js';
import fetcher from '../../../lib/fetcher.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import Runner from '../../../lib/Runner.js';
import { EventEmitter } from 'events';

function wait(time) {
    return function() {
        return new Promise(fulfill => setTimeout(fulfill, time));
    };
}

describe('iab', function() {
    var XML,
        wrapperXML,
        adTechXML;

    var _service;

    beforeEach(function() {
        XML = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '',
            '<VAST version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="oxml.xsd">',
            '    <Ad id="a73834">',
            '        <InLine>',
            '            <AdSystem version="1.0">Adap.tv</AdSystem>',
            '',
            '            <AdTitle><![CDATA[Adaptv Ad]]></AdTitle>',
            '',
            '            <Error><![CDATA[http://log.adap.tv/log?event=error&lastBid=&errNo=&pricingInfo=&nF=&adSourceTime=&adSourceId=73833&bidId=&afppId=73834&exSId=57916&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m1-58&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=86007638]]></Error>',
            '',
            '            <Impression><![CDATA[http://qlog.adap.tv/log?3a=adSuccess&51=ZX4madbHHCc_&50=ZX4madbHHCc_&72=&8=&d=&b=-2&53=&2c=&6c=&6d=&28=qUsI3M4M68M_&a8=1zwJCAUlQOU_&25=16242&4b=73834%2C73833&b6=b80ab42f50468aa847de612acf6511c6c3a4ffeae13904174c8e5c16f15d4b72&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Impression>',
            '',
            '            <Impression><![CDATA[http://conversions.adap.tv/conversion/wc?adSourceId=73833&bidId=&afppId=73834&creativeId=16242&exSId=57916&key=alexorlovstestpublisher&a.pvt=0&a.rid=&eov=86007638]]></Impression>',
            '',
            '            <Creatives>',
            '                <Creative>',
            '                    <Linear>',
            '                        <Duration><![CDATA[00:00:15]]></Duration>',
            '',
            '                        <TrackingEvents>',
            '                            <Tracking event="start"><![CDATA[http://log.adap.tv/log?3a=progressDisplay0&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="firstQuartile"><![CDATA[http://log.adap.tv/log?3a=progressDisplay25&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="midpoint"><![CDATA[http://log.adap.tv/log?3a=progressDisplay50&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="thirdQuartile"><![CDATA[http://log.adap.tv/log?3a=progressDisplay75&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="complete"><![CDATA[http://log.adap.tv/log?3a=progressDisplay100&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1]]></Tracking>',
            '                        </TrackingEvents>',
            '',
            '                        <VideoClicks>',
            '                            <ClickThrough><![CDATA[http://qlog.adap.tv/log?3a=click&d3=&72=&25=16242&6c=&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1&rUrl=http%3A%2F%2Fwww.adap.tv%2F]]></ClickThrough>',
            '',
            '                            <ClickTracking><![CDATA[http://conversions.adap.tv/conversion/wc?adSourceId=73833&bidId=&afppId=73834&creativeId=16242&exSId=57916&key=alexorlovstestpublisher&a.pvt=0&a.rid=&eov=86007638&a.click=true]]></ClickTracking>',
            '                        </VideoClicks>',
            '',
            '                        <MediaFiles>',
            '                            <MediaFile delivery="progressive" width="320" height="240" bitrate="256" type="video/mp4"><![CDATA[http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_320x240_16-9-040512100356192-12398_9-071813123000638-11481.MP4]]></MediaFile>',
            '                        </MediaFiles>',
            '                        <MediaFiles>',
            '                            <MediaFile delivery="progressive" width="640" height="360" bitrate="500" type="video/mp4"><![CDATA[http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_640x360_16-9-040512100356192-12398_9-071813123000638-11481.MP4]]></MediaFile>',
            '                        </MediaFiles>',
            '                        <MediaFiles>',
            '                            <MediaFile delivery="progressive" width="1280" height="720" bitrate="1000" type="video/mp4"><![CDATA[http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_1280x720_16-9-040512100356192-12398_9-071813123000638-11481.MP4]]></MediaFile>',
            '                        </MediaFiles>',
            '                        <MediaFiles>',
            '                            <MediaFile delivery="progressive" width="480" height="360" bitrate="4000" type="video/x-flv"><![CDATA[http://cdn.adap.tv/integration_test/Vincent-081110124715584-13503_1-122011141453375-82609.flv]]></MediaFile>',
            '                        </MediaFiles>',
            '                    </Linear>',
            '                </Creative>',
            '                <Creative>',
            '                    <CompanionAds>',
            '                        <Companion width="300" height="250">',
            '                            <IFrameResource>',
            '                                <![CDATA[',
            '                                //ads.adap.tv/c/companion?cck=cck&creativeId=110497&melaveId=42657&key=tribal360llc&adSourceId=208567&bidId=&afppId=159224&exSId=639284&cb=9874983758324475&pageUrl=http%3A%2F%2Fcinema6.com&eov=eov',
            '                                ]]>',
            '                            </IFrameResource>',
            '                            <TrackingEvents></TrackingEvents>',
            '                        </Companion>',
            '                    </CompanionAds>',
            '                </Creative>',
            '            </Creatives>',
            '',
            '            <Extensions>',
            '                <Extension type="OneSource creative">',
            '                    <CreativeId><![CDATA[16242]]></CreativeId>',
            '                </Extension>',
            '',
            '                <Extension type="revenue" currency="USD"><![CDATA[ZP05nQqNNzkDnlnN9D9Qjg==]]></Extension>',
            '            </Extensions>',
            '        </InLine>',
            '    </Ad>',
            '</VAST>'
        ].join('\n');

        wrapperXML = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '',
            '<VAST version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="oxml.xsd">',
            '    <Ad id="a115440">',
            '        <Wrapper>',
            '            <AdSystem version="1.0">Adap.tv</AdSystem>',
            '',
            '            <VASTAdTagURI><![CDATA[http://u-ads.adap.tv/a/h/CbyYsMcIh10+XoGWvwRuGArwmci9atPoj0IzNiHGphs=?cb=88104981&pageUrl=http%3A%2F%2Ftest.com&eov=eov]]></VASTAdTagURI>',
            '',
            '            <Error><![CDATA[http://log.adap.tv/log?event=error&lastBid=&errNo=&pricingInfo=&nF=&adSourceTime=&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Error>',
            '',
            '            <Impression><![CDATA[http://qlog.adap.tv/log?3a=adSuccess&51=ZX4madbHHCc_&50=ZX4madbHHCc_&72=&8=&d=&b=-2&53=&2c=&6c=&6d=&28=qUsI3M4M68M_&a8=1zwJCAUlQOU_&25=89442&4b=115440%2C115439&b6=5da0f2db55aa7275c4954f8230235ceb02161d4ad3641413fa66c548830c73bc&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1]]></Impression>',
            '',
            '            <Impression><![CDATA[http://conversions.adap.tv/conversion/wc?adSourceId=115439&bidId=&afppId=115440&creativeId=89442&exSId=113540&key=alexorlovstestpublisher&a.pvt=0&a.rid=&eov=14818764]]></Impression>',
            '',
            '            <Impression><![CDATA[http://www.imtestpixel.com/1]]></Impression>',
            '',
            '            <Impression><![CDATA[http://www.imtestpixel.com/2]]></Impression>',
            '',
            '            <Impression><![CDATA[http://www.imtestpixel.com/3]]></Impression>',
            '',
            '            <Impression><![CDATA[http://www.imtestpixel.com/4]]></Impression>',
            '',
            '            <Impression><![CDATA[http://www.imtestpixel.com/5]]></Impression>',
            '',
            '            <Creatives>',
            '                <Creative>',
            '                    <Linear>',
            '                        <TrackingEvents>',
            '                            <Tracking event="companionDisplay"><![CDATA[//log.adap.tv/log?event=companionDisplay&creativeId=89442&type=gif&compSize=&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="companionClick"><![CDATA[http://log.adap.tv/log?event=companionClick&creativeId=89442&rUrl=&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="loaded"><![CDATA[http://log.adap.tv/log?event=adLoaded&adSourceTime=&creativeId=89442&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="start"><![CDATA[http://log.adap.tv/log?3a=progressDisplay0&25=89442&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="stopped"><![CDATA[http://log.adap.tv/log?event=stopped&lastBid=&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="linearChange"><![CDATA[http://log.adap.tv/log?event=linearChange&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="expand"><![CDATA[http://log.adap.tv/log?event=expandedChange&creativeId=89442&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="firstQuartile"><![CDATA[http://log.adap.tv/log?3a=progressDisplay25&25=89442&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="midpoint"><![CDATA[http://log.adap.tv/log?3a=progressDisplay50&25=89442&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="thirdQuartile"><![CDATA[http://log.adap.tv/log?3a=progressDisplay75&25=89442&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="complete"><![CDATA[http://log.adap.tv/log?3a=progressDisplay100&25=89442&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1]]></Tracking>',
            '',
            '                            <Tracking event="acceptInvitation"><![CDATA[http://log.adap.tv/log?event=acceptInvitation&creativeId=89442&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="pause"><![CDATA[http://log.adap.tv/log?event=paused&creativeId=89442&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '',
            '                            <Tracking event="playing"><![CDATA[http://log.adap.tv/log?event=playing&creativeId=89442&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764]]></Tracking>',
            '                        </TrackingEvents>',
            '',
            '                        <AdParameters id="adaptv"><![CDATA[cd=%7B%22adTagUrl%22%3A%22http%3A%2F%2Fu-ads.adap.tv%2Fa%2Fh%2FCbyYsMcIh10%2BXoGWvwRuGArwmci9atPoj0IzNiHGphs%3D%3Fcb%3D88104981%26pageUrl%3Dhttp%253A%252F%252Ftest.com%26eov%3Deov%22%2C%22skipAdEnabled%22%3Afalse%2C%22countdownText%22%3A%22Ad+will+end+in+__SECONDS__+seconds%22%2C%22companionId%22%3A%22%22%7D]]></AdParameters>',
            '',
            '                        <VideoClicks>',
            '                            <ClickTracking><![CDATA[http://qlog.adap.tv/log?3a=click&d3=&72=&25=89442&6c=&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1]]></ClickTracking>',
            '',
            '                            <ClickTracking><![CDATA[http://conversions.adap.tv/conversion/wc?adSourceId=115439&bidId=&afppId=115440&creativeId=89442&exSId=113540&key=alexorlovstestpublisher&a.pvt=0&a.rid=&eov=14818764&a.click=true]]></ClickTracking>',
            '                        </VideoClicks>',
            '                    </Linear>',
            '                </Creative>',
            '            </Creatives>',
            '',
            '            <Extensions>',
            '                <Extension type="OneSource creative">',
            '                    <CreativeId><![CDATA[89442]]></CreativeId>',
            '                </Extension>',
            '',
            '                <Extension type="revenue" currency="USD"><![CDATA[ZP05nQqNNzkDnlnN9D9Qjg==]]></Extension>',
            '            </Extensions>',
            '        </Wrapper>',
            '    </Ad>',
            '</VAST>'
        ].join('\n');

        adTechXML = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '',
            '<VideoAdServingTemplate xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd">',
            '    <Ad id="6125296">',
            '        <InLine>',
            '            <AdSystem>ADTECH</AdSystem>',
            '            <AdTitle>ADTECH AD AdId=6125296, CreativeId=109194, AssetId=23963374</AdTitle>',
            '            <Impression>',
            '                <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_START;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '            </Impression>',
            '            <TrackingEvents>',
            '                <Tracking event="acceptInvitation">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_ACCEPTINVITATION;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="close">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_CLOSE;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="collapse">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_COLLAPSE;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="complete">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_END;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="creativeView">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_CREATIVEVIEW;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="expand">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_EXPAND;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="firstQuartile">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_25;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="fullscreen">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_FULLSCREEN;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="midpoint">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_MID;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="mute">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_MUTE;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="pause">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_PAUSE;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="replay">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_REPLAY;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="resume">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_RESUME;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="rewind">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_REWIND;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="skip">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_SKIP;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="stop">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_STOP;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="thirdQuartile">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_75;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '                <Tracking event="unmute">',
            '                    <URL id="Adtech"><![CDATA[http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_UNMUTE;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA]]></URL>',
            '                </Tracking>',
            '            </TrackingEvents>',
            '            <Video>',
            '                <Duration>00:02:29</Duration>',
            '                <AdParameters></AdParameters>',
            '                <VideoClicks>',
            '                    <ClickThrough><URL id="ADTECH"><![CDATA[http://adserver.adtechus.com/adlink/5473/3389416/0/3579/AdId=6125296;BnId=1;itime=813211182;nodecode=yes;link=]]></URL></ClickThrough>',
            '                </VideoClicks>',
            '                <MediaFiles>',
            '                    <MediaFile delivery="progressive" bitrate="849" width="1280" height="720" type="video/mp4">',
            '                        <URL><![CDATA[http://aka-cdn-ns.adtechus.com/apps/240/Ad6125296Tr36681V2Id0/Army_TourOps_Cruz_E1_v1_c6.mp4]]></URL>',
            '                    </MediaFile>',
            '                </MediaFiles>',
            '            </Video>',
            '        </InLine>',
            '    </Ad>',
            '</VideoAdServingTemplate>'
        ].join('\n');

        iab.constructor();

        _service = iab.__private__;
    });

    afterAll(function() {
        iab.constructor();
    });

    it('should exist', function() {
        expect(iab).toEqual(jasmine.any(Object));
    });

    describe('@public', function() {
        describe('methods', function() {
            describe('getVAST(key)', function() {
                var result,
                    vast;

                beforeEach(function() {
                    vast = {
                        duration: 30,
                        mediaFiles: []
                    };

                    spyOn(_service, 'getXML').and.callThrough();
                    spyOn(_service, 'VAST').and.returnValue(vast);
                });

                describe('if a wrapper is returned', function() {
                    beforeEach(function() {
                        spyOn(iab, 'getVAST').and.callThrough();

                        fetcher.expect('GET', 'http://u-ads.adap.tv/a/h/jSmRYUB6OAinZ1YEc6FP2ey+WPdagwFmCGZaBkvRjnc=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov')
                            .respond(200, wrapperXML);

                        result = iab.getVAST('http://u-ads.adap.tv/a/h/jSmRYUB6OAinZ1YEc6FP2ey+WPdagwFmCGZaBkvRjnc=?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                    });

                    it('should call itself with the new URI', function(done) {
                        var spy = jasmine.createSpy();
                        result.then(spy);

                        fetcher.flush().then(() => {
                            fetcher.expect('GET', 'http://u-ads.adap.tv/a/h/CbyYsMcIh10+XoGWvwRuGArwmci9atPoj0IzNiHGphs=?cb=88104981&pageUrl=http%3A%2F%2Ftest.com&eov=eov')
                                .respond(200, XML);
                        }).then(wait(100)).then(() => {
                            return fetcher.flush();
                        }).then(wait(100)).then(() => {
                            expect(_service.VAST.calls.count()).toBe(1);
                            expect(spy).toHaveBeenCalledWith(vast);
                        }).then(done, done);
                    });
                });

                describe('if a url is provided', function() {
                    beforeEach(function() {
                        fetcher.expect('GET', 'http://u-ads.adap.tv/a/h/jSmRYUB6OAinZ1YEc6FP2fCQPSbU6FwIZz5J5C0Fsw2tnkCzhk2yTw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov')
                            .respond(200, XML);

                        result = iab.getVAST('http://u-ads.adap.tv/a/h/jSmRYUB6OAinZ1YEc6FP2fCQPSbU6FwIZz5J5C0Fsw2tnkCzhk2yTw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov');
                    });

                    it('should make a request to the provided url', function(done) {
                        fetcher.flush().then(done, done);
                    });

                    it('should convert the response to an XML DOM', function(done) {
                        fetcher.flush().then(wait(100)).then(() => {
                            expect(_service.getXML).toHaveBeenCalledWith(XML);
                        }).then(done, done);
                    });

                    it('should return a RunnerPromise', function() {
                        expect(result).toEqual(jasmine.any(RunnerPromise));
                    });

                    describe('when the promise resolves', function() {
                        var promiseSpy;

                        beforeEach(function(done) {
                            promiseSpy = jasmine.createSpy();

                            result.then(promiseSpy).then(done, done);

                            fetcher.flush();
                        });

                        it('should resolve to a VAST object', function() {
                            expect(_service.VAST).toHaveBeenCalled();
                            expect(promiseSpy).toHaveBeenCalledWith(vast);
                        });
                    });
                });

                describe('if the response is invalid XML', function() {
                    let success, failure;

                    beforeEach(function(done) {
                        success = jasmine.createSpy('success()');
                        failure = jasmine.createSpy('failure()');

                        fetcher.expect('GET', 'http://u-ads.adap.tv/a/h/jSmRYUB6OAinZ1YEc6FP2fCQPSbU6FwIZz5J5C0Fsw2tnkCzhk2yTw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov')
                            .respond(200, `
                                <?xml version="1.0" encoding="UTF-8"?>

                                <VAST version="2.0">
                                    <Error>	</Error>

                                    <Extensions>
                                        <Extension type="adaptv_error">
                                            <Error code="2"><![CDATA[No ad could be found matching this request.]]></Error>
                                        </Extension>
                                    </Extensions>
                                </VAST>
                            `);

                        iab.getVAST('http://u-ads.adap.tv/a/h/jSmRYUB6OAinZ1YEc6FP2fCQPSbU6FwIZz5J5C0Fsw2tnkCzhk2yTw==?cb={cachebreaker}&pageUrl={pageUrl}&eov=eov').then(success, failure).then(done, done);
                        fetcher.flush();
                    });

                    it('should reject the promise', function() {
                        expect(failure).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('@private', function() {
        describe('contructors', function() {
            describe('VPAIDPlayer(tag)', function() {
                let player;
                let tag;

                beforeEach(function() {
                    tag = `http://u-ads.adap.tv/a/h/DCQzzI0K2rv1k0TZythPvYyD60pQS_90o8grI6Qm2PI=?cb={${Date.now()}}&pageUrl=${location.href}&eov=eov`;

                    player = new iab.VPAIDPlayer(tag);
                });

                it('should exist', function() {
                    expect(player).toEqual(jasmine.any(EventEmitter));
                });

                describe('when the ad is stopped', function() {
                    let container;
                    let AdVideoStart;

                    beforeEach(function(done) {
                        AdVideoStart = jasmine.createSpy('AdVideoStart()');

                        container = document.createElement('div');
                        player.load(container).then(() => {
                            spyOn(player, 'removeAllListeners').and.callThrough();
                            player.emit('AdStopped');
                            player.on('AdVideoStart', AdVideoStart);
                        }).then(done, done);

                        player.emit('onAdResponse');
                    });

                    it('should remove all the event listeners', function() {
                        expect(player.removeAllListeners).toHaveBeenCalled();
                    });

                    it('should stop proxying postMessage events to the player', function() {
                        const event = document.createEvent('CustomEvent');
                        event.initCustomEvent('message');
                        event.data = JSON.stringify({
                            __vpaid__: {
                                id: player.id,
                                type: 'AdVideoStart'
                            }
                        });
                        global.dispatchEvent(event);

                        expect(AdVideoStart).not.toHaveBeenCalled();
                    });

                    it('should remove the object from the container', function() {
                        expect(container.querySelector('object')).not.toEqual(jasmine.any(Element));
                    });
                });

                describe('properties:', function() {
                    describe('id', function() {
                        it('should be a generated id', function() {
                            expect(player.id).toMatch(/^vpaid-\d+$/);
                        });

                        it('should be incremented with each new player', function() {
                            const previousInt = parseInt(player.id.match(/\d+$/)[0], 10);
                            expect(new iab.VPAIDPlayer(tag).id).toBe(`vpaid-${previousInt + 1}`);
                        });
                    });

                    describe('tag', function() {
                        it('should be the provided tag', function() {
                            expect(player.tag).toBe(tag);
                        });
                    });

                    describe('adBanners', function() {
                        it('should be undefined', function() {
                            expect(player.adBanners).toBeUndefined();
                        });

                        describe('after the player is loaded', function() {
                            let container;
                            let object;

                            beforeEach(function(done) {
                                container = document.createElement('div');

                                player.load(container).then(() => setTimeout(done, 1));
                                object = container.querySelector('object');

                                player.emit('onAdResponse');
                            });

                            it('should be undefined', function() {
                                expect(player.adBanners).toBeUndefined();
                            });

                            describe('when the player emits "displayBanners"', function() {
                                beforeEach(function() {
                                    object.getDisplayBanners = jasmine.createSpy('object.getDisplayBanners()').and.returnValue([
                                        {
                                            width: 300,
                                            height: 250,
                                            sourceCode: '<p>Hello!</p>'
                                        },
                                        {
                                            width: 300,
                                            height: 100,
                                            sourceCode: '<p>Not me!</p>'
                                        },
                                        {
                                            width: 102,
                                            height: 250,
                                            sourceCode: '<p>Not me too!</p>'
                                        },
                                        {
                                            width: 300,
                                            height: 250,
                                            sourceCode: '<p>Pick me!</p>'
                                        }
                                    ]);
                                    player.emit('displayBanners');
                                });

                                it('should be an array of 300x250 display ads', function() {
                                    expect(player.adBanners).toEqual([
                                        {
                                            adType: 'html',
                                            width: 300,
                                            height: 250,
                                            fileURI: '<p>Hello!</p>'
                                        },
                                        {
                                            adType: 'html',
                                            width: 300,
                                            height: 250,
                                            fileURI: '<p>Pick me!</p>'
                                        }
                                    ]);
                                });

                                it('should return the same array instance every time', function() {
                                    expect(player.adBanners).toBe(player.adBanners);
                                });
                            });
                        });
                    });

                    describe('adVolume', function() {
                        it('should be undefined', function() {
                            expect(player.adVolume).toBeUndefined();
                        });

                        describe('after the player is loaded', function() {
                            let container;
                            let object;

                            beforeEach(function(done) {
                                container = document.createElement('div');

                                player.load(container).then(() => setTimeout(done, 1));
                                object = container.querySelector('object');

                                player.emit('onAdResponse');
                            });

                            it('should be undefined', function() {
                                expect(player.adVolume).toBeUndefined();
                            });

                            describe('when the player implements getAdProperties()', function() {
                                beforeEach(function() {
                                    object.getAdProperties = jasmine.createSpy('object.getAdProperties()').and.throwError(new Error('NOOO!!!'));
                                });

                                it('should be undefined', function() {
                                    expect(player.adVolume).toBeUndefined();
                                });

                                describe('when getAdProperties() stops throwing errors', function() {
                                    beforeEach(function() {
                                        object.getAdProperties.and.returnValue({
                                            adVolume: 0.64
                                        });
                                    });

                                    it('should be the object\'s adVolume', function() {
                                        expect(player.adVolume).toBe(0.64);
                                    });
                                });
                            });
                        });

                        describe('setting', function() {
                            it('should throw an error', function() {
                                expect(() => player.adVolume = 0.5).toThrow(new Error('Cannot set adVolume before the player has been loaded.'));
                            });

                            describe('after the player is loaded', function() {
                                let container;
                                let object;

                                beforeEach(function(done) {
                                    container = document.createElement('div');

                                    player.load(container).then(() => setTimeout(done, 1));
                                    object = container.querySelector('object');

                                    player.emit('onAdResponse');
                                });

                                it('should throw an error', function() {
                                    expect(() => player.adVolume = 0.5).toThrow(new Error('Cannot set adVolume before the player has been loaded.'));
                                });

                                describe('when the player implements setVolume()', function() {
                                    beforeEach(function() {
                                        object.setVolume = jasmine.createSpy('object.setVolume()');

                                        player.adVolume = 0.44;
                                    });

                                    it('should call setVolume() on the object', function() {
                                        expect(object.setVolume).toHaveBeenCalledWith(0.44);
                                    });
                                });
                            });
                        });
                    });

                    describe('adCurrentTime', function() {
                        it('should be undefined', function() {
                            expect(player.adCurrentTime).toBeUndefined();
                        });

                        describe('after the player is loaded', function() {
                            let container;
                            let object;

                            beforeEach(function(done) {
                                container = document.createElement('div');

                                player.load(container).then(() => setTimeout(done, 1));
                                object = container.querySelector('object');

                                player.emit('onAdResponse');
                            });

                            it('should be undefined', function() {
                                expect(player.adCurrentTime).toBeUndefined();
                            });

                            describe('when the player implements getAdProperties()', function() {
                                beforeEach(function() {
                                    object.getAdProperties = jasmine.createSpy('object.getAdProperties()').and.returnValue({
                                        adCurrentTime: 47
                                    });
                                });

                                it('should be the object\'s adVolume', function() {
                                    expect(player.adCurrentTime).toBe(47);
                                });
                            });
                        });
                    });

                    describe('adDuration', function() {
                        it('should be undefined', function() {
                            expect(player.adDuration).toBeUndefined();
                        });

                        describe('after the player is loaded', function() {
                            let container;
                            let object;

                            beforeEach(function(done) {
                                container = document.createElement('div');

                                player.load(container).then(() => setTimeout(done, 1));
                                object = container.querySelector('object');

                                player.emit('onAdResponse');
                            });

                            it('should be undefined', function() {
                                expect(player.adDuration).toBeUndefined();
                            });

                            describe('when the player implements getAdProperties()', function() {
                                beforeEach(function() {
                                    object.getAdProperties = jasmine.createSpy('object.getAdProperties()').and.returnValue({
                                        adDuration: 65
                                    });
                                });

                                it('should be the object\'s adVolume', function() {
                                    expect(player.adDuration).toBe(65);
                                });
                            });
                        });
                    });
                });

                describe('events:', function() {
                    ['onAdResponse', 'AdLoaded', 'AdStarted', 'AdVideoStart', 'AdPlaying', 'AdPaused', 'AdError', 'AdVideoComplete', 'onAllAdsCompleted'].forEach(event => {
                        describe(event, function() {
                            let spy;

                            beforeEach(function() {
                                spy = jasmine.createSpy(`${event}()`).and.callFake(() => Runner.schedule('render', null, () => {}));
                                player.on(event, spy);

                                const evt = document.createEvent('CustomEvent');
                                evt.initCustomEvent('message');
                                evt.data = JSON.stringify({
                                    __vpaid__: {
                                        id: player.id,
                                        type: event
                                    }
                                });

                                global.dispatchEvent(evt);
                            });

                            it('should emit the event on the player', function() {
                                expect(spy).toHaveBeenCalled();
                            });

                            describe('if intended for another player', function() {
                                beforeEach(function() {
                                    spy.calls.reset();

                                    const evt = document.createEvent('CustomEvent');
                                    evt.initCustomEvent('message');
                                    evt.data = JSON.stringify({
                                        __vpaid__: {
                                            id: player.id + '1',
                                            type: event
                                        }
                                    });

                                    global.dispatchEvent(evt);
                                });

                                it('should not emit the event on the player', function() {
                                    expect(spy).not.toHaveBeenCalled();
                                });
                            });
                        });
                    });

                    describe('if a non-vpaid message comes in', function() {
                        beforeEach(function() {
                            spyOn(player, 'emit').and.callThrough();

                            const evt = document.createEvent('CustomEvent');
                            evt.initCustomEvent('message');
                            evt.data = 'Hello world!';

                            global.dispatchEvent(evt);
                        });

                        it('should do nothing', function() {
                            expect(player.emit).not.toHaveBeenCalled();
                        });
                    });

                    describe('if a non-vpaid JSON message comes in', function() {
                        beforeEach(function() {
                            spyOn(player, 'emit').and.callThrough();

                            const evt = document.createEvent('CustomEvent');
                            evt.initCustomEvent('message');
                            evt.data = JSON.stringify({});

                            global.dispatchEvent(evt);
                        });

                        it('should do nothing', function() {
                            expect(player.emit).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('methods:', function() {
                    describe('load(container)', function() {
                        let container;
                        let result;
                        let success, failure;

                        beforeEach(function() {
                            container = document.createElement('div');

                            success = jasmine.createSpy('success()');
                            failure = jasmine.createSpy('failure()');

                            result = player.load(container);

                            result.then(success, failure);
                        });

                        it('should return a RunnerPromise', function() {
                            expect(result).toEqual(jasmine.any(RunnerPromise));
                        });

                        it('should put an object in the container', function() {
                            expect(container.querySelector('object')).toEqual(jasmine.any(Element));
                        });

                        it('should resolve the promise when "onAdResponse" is emitted for the player', function(done) {
                            Promise.resolve().then(() => {}).then(() => {
                                expect(success).not.toHaveBeenCalled();
                            }).then(() => {
                                const event = document.createEvent('CustomEvent');
                                event.initCustomEvent('message');
                                event.data = JSON.stringify({
                                    __vpaid__: {
                                        id: player.id,
                                        type: 'onAdResponse'
                                    }
                                });

                                global.dispatchEvent(event);
                            }).then(() => {}).then(() => {}).then(() => {
                                expect(success).toHaveBeenCalledWith(player);
                            }).then(done, done);
                        });

                        describe('the object\'s', function() {
                            let object;

                            beforeEach(function() {
                                object = container.querySelector('object');
                            });

                            describe('attributes', function() {
                                describe('type', function() {
                                    it('should be "application/x-shockwave-flash"', function() {
                                        expect(object.getAttribute('type')).toBe('application/x-shockwave-flash');
                                    });
                                });

                                describe('data', function() {
                                    it('should be "swf/vpaid.swf"', function() {
                                        expect(object.getAttribute('data')).toBe('swf/vpaid.swf');
                                    });
                                });

                                describe('id', function() {
                                    it('should be derived from the id', function() {
                                        expect(object.getAttribute('id')).toBe(`${player.id}-player`);
                                    });
                                });

                                describe('class', function() {
                                    it('should be "c6VPAIDPlayer"', function() {
                                        expect(object.getAttribute('class')).toBe('c6VPAIDPlayer');
                                    });
                                });
                            });

                            describe('params', function() {
                                function valueOf(name) {
                                    const param = object.querySelector(`param[name="${name}"]`);
                                    return param && param.getAttribute('value');
                                }

                                describe('movie', function() {
                                    it('should be the same as the object\'s data', function() {
                                        expect(valueOf('movie')).toBe(object.getAttribute('data'));
                                    });
                                });

                                describe('quality', function() {
                                    it('should be "high"', function() {
                                        expect(valueOf('quality')).toBe('high');
                                    });
                                });

                                describe('bgcolor', function() {
                                    it('should be "#000000"', function() {
                                        expect(valueOf('bgcolor')).toBe('#000000');
                                    });
                                });

                                describe('play', function() {
                                    it('should be "false"', function() {
                                        expect(valueOf('play')).toBe('false');
                                    });
                                });

                                describe('loop', function() {
                                    it('should be "false"', function() {
                                        expect(valueOf('loop')).toBe('false');
                                    });
                                });

                                describe('wmode', function() {
                                    it('should be "opaque"', function() {
                                        expect(valueOf('wmode')).toBe('opaque');
                                    });
                                });

                                describe('scale', function() {
                                    it('should be "noscale"', function() {
                                        expect(valueOf('scale')).toBe('noscale');
                                    });
                                });

                                describe('salign', function() {
                                    it('should be "lt"', function() {
                                        expect(valueOf('salign')).toBe('lt');
                                    });
                                });

                                describe('flashvars', function() {
                                    it('should contain the ad tag and player id', function() {
                                        expect(valueOf('flashvars')).toBe(`adXmlUrl=${encodeURIComponent(tag)}&playerId=${encodeURIComponent(player.id)}`);
                                    });
                                });

                                describe('allowScriptAccess', function() {
                                    it('should be "always"', function() {
                                        expect(valueOf('allowScriptAccess')).toBe('always');
                                    });
                                });

                                describe('allowFullscreen', function() {
                                    it('should be "true"', function() {
                                        expect(valueOf('allowFullscreen')).toBe('true');
                                    });
                                });
                            });
                        });
                    });

                    describe(null, function() {
                        let object;
                        let container;

                        beforeEach(function(done) {
                            container = document.createElement('div');
                            player.load(container).then(done);

                            object = container.querySelector('object');
                            player.emit('onAdResponse');
                        });

                        describe('initAd()', function() {
                            beforeEach(function() {
                                object.loadAd = jasmine.createSpy('object.loadAd()');

                                player.initAd();
                            });

                            it('should call loadAd() on the object', function() {
                                expect(object.loadAd).toHaveBeenCalled();
                            });
                        });

                        describe('startAd()', function() {
                            beforeEach(function() {
                                object.startAd = jasmine.createSpy('object.startAd()');

                                player.startAd();
                            });

                            it('should call startAd() on the object', function() {
                                expect(object.startAd).toHaveBeenCalled();
                            });
                        });

                        describe('stopAd()', function() {
                            beforeEach(function() {
                                object.stopAd = jasmine.createSpy('object.stopAd()');

                                player.stopAd();
                            });

                            it('should call stopAd() on the object', function() {
                                expect(object.stopAd).toHaveBeenCalled();
                            });
                        });

                        describe('pauseAd()', function() {
                            beforeEach(function() {
                                object.pauseAd = jasmine.createSpy('object.pauseAd()');

                                player.pauseAd();
                            });

                            it('should call pauseAd() on the object', function() {
                                expect(object.pauseAd).toHaveBeenCalled();
                            });
                        });

                        describe('resumeAd()', function() {
                            beforeEach(function() {
                                object.resumeAd = jasmine.createSpy('object.resumeAd()');

                                player.resumeAd();
                            });

                            it('should call resumeAd() on the object', function() {
                                expect(object.resumeAd).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

            describe('VAST', function() {
                var vast,
                    parser,
                    combinedVast,
                    adTechVast;

                beforeEach(function() {
                    parser = new global.DOMParser();
                    combinedVast = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?><container></container>', 'text/xml');
                    adTechVast = _service.getXML(adTechXML);

                    [wrapperXML, XML].forEach(function(xml) {
                        vast = _service.getXML(xml);
                        combinedVast.firstChild.appendChild(vast.querySelectorAll('VAST')[0]);
                    });

                    vast = new _service.VAST(combinedVast);
                    adTechVast = new _service.VAST(adTechVast);
                });

                describe('properties', function() {
                    it('should contain information about the video', function() {
                        expect(vast.video).toEqual({
                            duration: 15,
                            mediaFiles: [
                                {
                                    delivery: 'progressive',
                                    width: '320',
                                    height: '240',
                                    bitrate: '256',
                                    type: 'video/mp4',
                                    url: 'http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_320x240_16-9-040512100356192-12398_9-071813123000638-11481.MP4'
                                },
                                {
                                    delivery: 'progressive',
                                    width: '640',
                                    height: '360',
                                    bitrate: '500',
                                    type: 'video/mp4',
                                    url: 'http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_640x360_16-9-040512100356192-12398_9-071813123000638-11481.MP4'
                                },
                                {
                                    delivery: 'progressive',
                                    width: '1280',
                                    height: '720',
                                    bitrate: '1000',
                                    type: 'video/mp4',
                                    url: 'http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_1280x720_16-9-040512100356192-12398_9-071813123000638-11481.MP4'
                                },
                                {
                                    delivery: 'progressive',
                                    width: '480',
                                    height: '360',
                                    bitrate: '4000',
                                    type: 'video/x-flv',
                                    url: 'http://cdn.adap.tv/integration_test/Vincent-081110124715584-13503_1-122011141453375-82609.flv'
                                }
                            ],
                        });



                        vast.companions[0].fileURI = vast.companions[0].fileURI.replace(/\s/g, '');

                        expect(vast.companions).toEqual([
                            {
                                width: 300,
                                height: 250,
                                adType:'iframe',
                                fileURI: '//ads.adap.tv/c/companion?cck=cck&creativeId=110497&melaveId=42657&key=tribal360llc&adSourceId=208567&bidId=&afppId=159224&exSId=639284&cb=9874983758324475&pageUrl=http%3A%2F%2Fcinema6.com&eov=eov'
                            }
                        ]);

                        expect(vast.pixels.start[0]).toEqual('http://log.adap.tv/log?3a=progressDisplay0&25=89442&5=115439&14=&2=115440&37=113540&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m2-31&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=14818764&a.cv=1');
                        expect(vast.pixels.start[1]).toEqual('http://log.adap.tv/log?3a=progressDisplay0&25=16242&5=73833&14=&2=73834&37=57916&a=&65=preroll&6a=-2&6b=-2&4f=&3=-2&c=&55=true&5c=alexorlovstestpublisher&5b=&18=14168&2e=test.com&2f=&30=test.com&31=&32=1&90=&86=&83=&82=&af=&80=3922791298847480813&42=false&8f=&41=&21=&1b=&76=&77=402051622&67=&d6=&bf=0&74=ah&d5=1&d8=m1-58&ae=&8e=-1&d7=&c0=&c4=0&c5=0&92=&93=&91=ONLINE_VIDEO&45=23.31.224.169&b5=-1&33=86007638&a.cv=1');

                        expect(vast.pixels.errorPixel[0]).toEqual('http://log.adap.tv/log?event=error&lastBid=&errNo=&pricingInfo=&nF=&adSourceTime=&adSourceId=115439&bidId=&afppId=115440&exSId=113540&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m2-31&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=14818764');
                        expect(vast.pixels.errorPixel[1]).toEqual('http://log.adap.tv/log?event=error&lastBid=&errNo=&pricingInfo=&nF=&adSourceTime=&adSourceId=73833&bidId=&afppId=73834&exSId=57916&adSpotId=&pet=preroll&pod=-2&position=-2&marketplaceId=&adPlanId=-2&adaptag=&nap=true&key=alexorlovstestpublisher&buyerId=&campaignId=14168&pageUrl=test.com&adapDetD=&sellRepD=test.com&urlDetMeth=&targDSellRep=1&zid=&url=&id=&duration=&a.geostrings=&uid=3922791298847480813&htmlEnabled=false&width=&height=&context=&categories=&sessionId=&serverRev=402051622&playerRev=&a.rid=&a.cluster=0&rtype=ah&a.ssc=1&a.asn=m1-58&a.profile_id=&p.vw.viewable=-1&a.sdk=&a.sdkType=&a.appReq=0&a.sscCap=0&a.carrier_mcc=&a.carrier_mnc=&a.platformDevice=ONLINE_VIDEO&ipAddressOverride=23.31.224.169&p.vw.active=-1&eov=86007638');

                        expect(adTechVast.video).toEqual({
                            duration: 149,
                            mediaFiles: [
                                {
                                    delivery: 'progressive',
                                    width: '1280',
                                    height: '720',
                                    bitrate: '849',
                                    type: 'video/mp4',
                                    url: 'http://aka-cdn-ns.adtechus.com/apps/240/Ad6125296Tr36681V2Id0/Army_TourOps_Cruz_E1_v1_c6.mp4'
                                }
                            ],
                        });

                        expect(adTechVast.companions).toEqual([]);

                        expect(adTechVast.pixels.impression[0]).toEqual('http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_START;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA');
                        expect(adTechVast.pixels.complete[0]).toEqual('http://adserver.adtechus.com/rmevent/3/5473/3389416/0/0/AdId=6125296;CreativeId=109194;BnId=1;rmeventtype=VID_END;imptype=2;refsequenceid=2154990909;refseqid2=5J/HRAgAgFA');
                        expect(adTechVast.clickThrough[0]).toEqual('http://adserver.adtechus.com/adlink/5473/3389416/0/3579/AdId=6125296;BnId=1;itime=813211182;nodecode=yes;link=');
                    });
                });

                describe('methods', function() {
                    describe('getVideoSrc(type)', function() {
                        it('should get the url for the specified type', function() {
                            expect(vast.getVideoSrc('video/x-flv')).toBe('http://cdn.adap.tv/integration_test/Vincent-081110124715584-13503_1-122011141453375-82609.flv');
                            expect(vast.getVideoSrc('video/mp4')).toBe('http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_320x240_16-9-040512100356192-12398_9-071813123000638-11481.MP4');
                            expect(adTechVast.getVideoSrc('video/mp4')).toBe('http://aka-cdn-ns.adtechus.com/apps/240/Ad6125296Tr36681V2Id0/Army_TourOps_Cruz_E1_v1_c6.mp4');
                        });

                        it('should return null if the type is not found', function() {
                            expect(vast.getVideoSrc('video/webm')).toBeNull();
                            expect(adTechVast.getVideoSrc('video/webm')).toBeNull();
                        });

                        describe('if a type is not provided', function() {
                            var result, adTechResult;

                            beforeEach(function() {
                                spyOn(media, 'bestVideoFormat')
                                    .and.returnValue('video/mp4');

                                vast.video.mediaFiles.push({type: 'video/3gpp'});
                                adTechVast.video.mediaFiles.push({type: 'video/3gpp'});

                                result = vast.getVideoSrc();
                                adTechResult = adTechVast.getVideoSrc();
                            });

                            it('should check for the best video format, but only mp4 and webm format', function() {
                                expect(media.bestVideoFormat).toHaveBeenCalledWith(['video/mp4']);
                                expect(media.bestVideoFormat).not.toHaveBeenCalledWith(['video/x-flv']);
                                expect(media.bestVideoFormat).not.toHaveBeenCalledWith(['video/3gpp']);
                                expect(media.bestVideoFormat.calls.count()).toBe(2);
                            });

                            it('should return the video with lowest bitrate', function() {
                                result = vast.getVideoSrc();
                                expect(result).toBe('http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_320x240_16-9-040512100356192-12398_9-071813123000638-11481.MP4');
                            });

                            it('should use height if bitrate is undefined', function() {
                                vast.video.mediaFiles.forEach(function(mediaFile) {
                                    delete mediaFile.bitrate;
                                });
                                result = vast.getVideoSrc();
                                expect(result).toBe('http://cdn.adap.tv/alexorlovstestpublisher/Maze_15_QFCG-12375H_PreRoll_512k_320x240_16-9-040512100356192-12398_9-071813123000638-11481.MP4');
                            });

                            describe('if no best format is provided', function() {
                                beforeEach(function() {
                                    media.bestVideoFormat.and.returnValue(null);
                                    result = vast.getVideoSrc();
                                    adTechResult = adTechVast.getVideoSrc();
                                });

                                it('should return null', function() {
                                    expect(result).toBeNull();
                                    expect(adTechResult).toBeNull();
                                });
                            });
                        });
                    });

                    describe('getCompanion()', function() {
                        it('should return a companion object', function() {
                            var companion = vast.getCompanion();
                            companion.fileURI = companion.fileURI.replace(/\s/g, '');

                            expect(companion).toEqual({
                                width: 300,
                                height: 250,
                                adType:'iframe',
                                fileURI: '//ads.adap.tv/c/companion?cck=cck&creativeId=110497&melaveId=42657&key=tribal360llc&adSourceId=208567&bidId=&afppId=159224&exSId=639284&cb=9874983758324475&pageUrl=http%3A%2F%2Fcinema6.com&eov=eov'
                            });
                        });
                    });

                    describe('firePixels()', function() {
                        beforeEach(function() {
                            spyOn(imageLoader, 'load');
                        });
                        it('should call the c6ImagePreloader with an array of pixels', function() {
                            vast.firePixels('start');
                            expect(imageLoader.load.calls.count()).toBe(1);
                            expect(imageLoader.load).toHaveBeenCalledWith(...vast.pixels.start);

                            vast.firePixels('errorPixel');
                            expect(imageLoader.load).toHaveBeenCalledWith(...vast.pixels.errorPixel);

                            adTechVast.firePixels('complete');
                            expect(imageLoader.load).toHaveBeenCalledWith(...adTechVast.pixels.complete);

                            adTechVast.firePixels('impression');
                            expect(imageLoader.load).toHaveBeenCalledWith(...adTechVast.pixels.impression);
                        });
                    });
                });
            });
        });

        describe('methods', function() {
            describe('getSecondsFromTimestamp(timestamp)', function() {
                it('should convert a timestamp to seconds', function() {
                    var getSecs = _service.getSecondsFromTimestamp;

                    expect(getSecs('00:00:14')).toBe(14);
                    expect(getSecs('01:15:00')).toBe(4500);
                    expect(getSecs('00:01:30')).toBe(90);
                });
            });

            describe('getXML(string)', function() {
                var parser,
                    xmlDOM;

                beforeEach(function() {
                    xmlDOM = {};
                    parser = {
                        parseFromString: jasmine.createSpy('parser.parseFromString()')
                            .and.returnValue(xmlDOM)
                    };

                    spyOn(global, 'DOMParser').and.callFake(function() {
                        return parser;
                    });
                });

                it('should convert the string to an XML DOM object', function() {
                    var result = _service.getXML(XML);

                    expect(parser.parseFromString).toHaveBeenCalledWith(XML.replace(/\n/g, '').replace(/>\s+</g, '><'), 'text/xml');
                    expect(result).toBe(xmlDOM);
                });
            });
        });
    });
});
