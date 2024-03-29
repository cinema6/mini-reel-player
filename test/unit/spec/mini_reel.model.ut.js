import MiniReel from '../../../src/models/MiniReel.js';
import dispatcher from '../../../src/services/dispatcher.js';
import EmbedHandler from '../../../src/handlers/EmbedHandler.js';
import PixelHandler from '../../../src/handlers/PixelHandler.js';
import PostMessageHandler from '../../../src/handlers/PostMessageHandler.js';
import VPAIDHandler from '../../../src/handlers/VPAIDHandler.js';
import Mixable from '../../../lib/core/Mixable.js';
import SafelyGettable from '../../../src/mixins/SafelyGettable.js';
import { EventEmitter } from 'events';
import {
    defer
} from '../../../lib/utils.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import Card from '../../../src/models/Card.js';
import ImageCard from '../../../src/models/ImageCard.js';
import VideoCard from '../../../src/models/VideoCard.js';
import BrightcoveVideoCard from '../../../src/models/BrightcoveVideoCard.js';
import KalturaVideoCard from '../../../src/models/KalturaVideoCard.js';
import AdUnitCard from '../../../src/models/AdUnitCard.js';
import RecapCard from '../../../src/models/RecapCard.js';
import ShowcaseAppCard from '../../../src/models/ShowcaseAppCard';
import browser from '../../../src/services/browser.js';
import codeLoader from '../../../src/services/code_loader.js';
import environment from '../../../src/environment.js';
import normalizeLinks from '../../../src/fns/normalize_links.js';
import makeSocialLinks from '../../../src/fns/make_social_links.js';
import EmbedSession from '../../../src/utils/EmbedSession.js';
import resource from '../../../src/services/resource.js';

describe('MiniReel', function() {
    let experience;
    let profile;
    let minireel;
    let session;
    let appDataDeferred;
    let sessionDeferred;
    let initDeferred;
    let readyFn;
    let experienceDeferred;

    beforeEach(function(done) {
        experience = {
          /* jshint quotmark:double */
          "access": "public",
          "appUri": "rumble",
          "created": "2015-02-05T15:52:29.275Z",
          "data": {
            "title": "The 15 best movies of the decade (so far) that you can watch on Netflix right now",
            "mode": "lightbox",
            "autoplay": false,
            "autoadvance": false,
            "sponsored": true,
            "branding": "elitedaily",
            "adServer": {
              "network": "362.11",
              "server": "myadserver.ads.com"
            },
            "links": {
              "Website": "http://pando.com/2015/02/03/the-15-best-movies-of-the-decade-so-far-that-you-can-watch-on-netflix-right-now/",
              "Facebook": "https://www.facebook.com/pandodaily",
              "Twitter": "https://twitter.com/pandodaily",
              "YouTube": "https://www.youtube.com/user/PandoDaily",
              "Vimeo": "https://vimeo.com/tag:pandodaily",
              "Pinterest": "https://www.pinterest.com/daniellegeva/pandodaily-com/",
              "Vine": "vine.co"
            },
            "params": {
              "sponsor": "PandoDaily (by David Holmes)"
            },
            "campaign": {},
            "collateral": {
              "splash": "/collateral/experiences/e-42108b552a05ea/splash",
              "logo": "https://pbs.twimg.com/profile_images/1764819620/Pando_Twitter_Logo_400x400.jpg"
            },
            "splash": {
              "source": "specified",
              "ratio": "6-5",
              "theme": "img-only"
            },
            "adConfig": {
              "video": {
                "firstPlacement": -1,
                "frequency": 0,
                "waterfall": "cinema6",
                "skip": 6
              },
              "display": {}
            },
            "deck": [
              {
                "data": {},
                "id": "rc-4b3dc304c3573f",
                "type": "text",
                "title": "Check These Out!",
                "note": "This people play the trumpet like you've never heard before.",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                    "campaignId": null,
                     "advertiserId": null,
                     "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "hideSource": true,
                  "controls": false,
                  "autoadvance": false,
                  "skip": 40,
                  "vast": "//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord=[timestamp];dcmt=text/xml"
                },
                "id": "rc-c175fedab87e6f",
                "type": "adUnit",
                "title": "WATCH & LEARN",
                "note": "See how to make classic, seasonal and specialty cocktails from our expert bartenders. You’re just a shake, stir and pour away from the ultimate drink.",
                "modules": [
                  "displayAd",
                  "post"
                ],
                "ballot": {
                  "election": "el-58ad9e1f49b147",
                  "prompt": "Do you drink too much?",
                  "choices": [
                    "Of Course Not",
                    "There's No Such Thing"
                  ]
                },
                "thumbs": {
                  "small": "https://yt3.ggpht.com/-EFAfQiEuYSI/AAAAAAAAAAI/AAAAAAAAAAA/AsAgcOBSoTw/s100-c-k-no/photo.jpg",
                  "large": "https://yt3.ggpht.com/-EFAfQiEuYSI/AAAAAAAAAAI/AAAAAAAAAAA/AsAgcOBSoTw/s100-c-k-no/photo.jpg"
                },
                "placementId": "3245275",
                "templateUrl": null,
                "sponsored": true,
                "campaign": {
                  "campaignId": "",
                  "advertiserId": "DIAGEO USA",
                  "minViewTime": -1
                },
                "collateral": {
                  "logo": "http://i.imgur.com/YbBIFZv.png"
                },
                "links": {},
                "params": {
                  "action": null,
                  "sponsor": "thebar.com",
                  "ad": true
                }
              },
              {
                "data": {
                  "skip": true,
                  "service": "yahoo",
                  "videoid": "immigrant-tale-000000984",
                  "code": "<iframe width=\"100%\"\n    height=\"100%\"\n    scrolling=\"no\"\n    frameborder=\"0\"\n    src=\"https://screen.yahoo.com/immigrant-tale-000000984.html?format=embed\"\n    allowfullscreen=\"true\"\n    mozallowfullscreen=\"true\"\n    webkitallowfullscreen=\"true\"\n    allowtransparency=\"true\">\n</iframe>",
                  "href": "https://screen.yahoo.com/immigrant-tale-000000984.html",
                  "thumbs": {
                    "small": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png",
                    "large": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png"
                  }
                },
                "id": "rc-541cc592ddc110",
                "type": "embedded",
                "title": "Justin Timberlake is Funny",
                "note": "He's coming to America!",
                "source": "Yahoo! Screen",
                "modules": [],
                "thumbs": {
                  "small": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png",
                  "large": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png"
                },
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {},
                "type": "wildcard"
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "B5FcZrg_Nuo"
                },
                "id": "rc-68e8e50d9ffcfe",
                "type": "youtube",
                "title": "15. Tabloid",
                "note": "Errol Morris is the world’s greatest documentarian, and here he sinks his teeth into an irresistible tale of sex, kidnapping, and… Mormons. The story of the beautiful Joyce McKinney who kidnapped and allegedly raped a Mormon missionary is sensational enough. But the real scandal lies in the British tabloid wars between The Daily Mirror and The Daily Express which in a mad rush for readers stopped at nothing to unearth shady details about McKinney’s past and present. Anybody who believes journalism has fallen into the gutter thanks to the Internet should take note that this took place in 1977, when the Web was just a twinkle in Al Gore’s eye.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "xy2JQ0HqCuk"
                },
                "id": "rc-991add397b93ca",
                "type": "youtube",
                "title": "14. Killing Them Softly",
                "note": "Killing Them Softly has the dishonor of being one of only eight films to have received an “F” from Cinemascore audiences; these are the early viewers who watch movies before the rest of the world as part of market research. Maybe when audiences saw Brad Pitt on the movie poster pointing a shotgun they expected a sexy, sassy action romp like Pitt’s Ocean’s Eleven. Instead, they were subjected to a brutally violent and calculatedly abrasive mob drama that doubles as an allegory for the hopelessness of American politics and capitalism. But what Killing Them Softly lacks in cheap thrills, it makes up for with a sense of realism that telegraphs just how lonely and deflating it can be to “make it” in America — whether you’re a member of the corporate straight world or a hitman like Pitt’s character. The best you can hope for is the fleeting thrill of a score, the initial rush of a heroin injection, and the false promise that a man like Barack Obama can actually change the world for the better before the hangover kicks in.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "79aNkyz7bO8"
                },
                "id": "rc-1fd0876d8d482f",
                "type": "youtube",
                "title": "13. Prince Avalanche",
                "note": "There was a healthy amount of shock among seasoned filmgoers when it was revealed that David Gordon Green, who made his name directing quietly devastating independent dramas, was slated to direct the Seth Rogen buddy comedy Pineapple Express. That film happened to be the most accomplished and enjoyable Seth Rogen movie to date, but it bore little resemblance to Green’s earlier work. Prince Avalanche, however, which lacked the studio demands of a Rogen mega-comedy, is precisely what viewers would expect from a David Gordon Green buddy flick. Starring Paul Rudd, who never ages, and Emile Hirsch, who looks older and more like Jack Black every day, Prince Avalanche is a slow and somber meditation on growing up that’s also full of hysterical bad behavior and puerile jokes. It’s a rare and beautiful piece of filmmaking that isn’t afraid to mix high art with low brow humor.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "LQW9Ks0GZUQ"
                },
                "id": "rc-5c87766698368b",
                "type": "youtube",
                "title": "12. The Queen of Versailles",
                "note": "On first glance, The Queen of Versailles resembles one of those bad reality shows about housewives, giving viewers a glimpse into the lavish yet empty lifestyle of a wealthy Florida real estate mogul and his family. But when the Great Recession revealed the family’s prosperity to be little more than an illusion, the film becomes a powerful commentary on how greed giveth and taketh away. The family’s rise and fall mirrors that of America itself: While a baldly capitalistic love of money may have been the prime driver of America’s economic growth since the Reagan years, it also spun the country into a freefall after the complex, self-feeding banking apparatus that buttressed the housing boom fell apart on itself. The viewer has little sympathy for the family’s patriarch, who as a timeshare magnate was little more than a glorified conman. But his wife and children, although accustomed to obscene amounts of wealth, elicit genuine compassion, as they find themselves stuck owning the biggest house in America but struggling to pay for lunch.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "gJo1qrr_8Hc"
                },
                "id": "rc-566a6f5bf20758",
                "type": "youtube",
                "title": "11. Blue Ruin",
                "note": "Possibly the greatest crowdfunded film of all time, Jeremy Saulnier’s Blue Ruin is an unremittingly dark and cruelly suspenseful tale of revenge that saps whatever catharsis might come from avenging a loved one’s death, leaving it on the floor to rot with the growing number of bodies left in the protagonist’s wake. As Dwight Evans hunts down those responsible for his parents’ death, his biggest struggle is keeping sight of the line between innocent and guilty, good and evil. Despite the rather conventional plot and the Grand Guignol bloodbath that ensues, nothing in the movie rings false, as Saulnier brings a sobering dose of realism to classic revenge fantasies.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "HciZ_7frXmQ"
                },
                "id": "rc-0ae418ece6f49e",
                "type": "youtube",
                "title": "10. Snowpiercer",
                "note": "I’ve written before about my love for Snowpiercer, a dystopian science fiction tale about a trans-global train containing humanity’s last remaining survivors of a second ice age. Along with being one of the most unique, thrilling, and frankly hilarious action movies in recent years, Snowpiercer is also a trenchant commentary on poverty and class — the poorest citizens live in the back of the train and are forced to subside on energy bars made out of bugs. Bold and bloody, the film is a glorious reminder that popcorn entertainment can still be beautifully shot and thematically ambitious.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "yyu95eibsL8"
                },
                "id": "rc-0cead73a674b38",
                "type": "youtube",
                "title": "9. Compliance",
                "note": "One of the most deeply upsetting films of the new decade, Compliance probes the shocking depths of what ostensibly “good” people are capable of when pressured by assumed authority. Based on a true story — after watching the film, I sincerely hope the facts were exaggerated — Compliance begins when a man claiming to be a police officer (Pat Healy) calls a fast food restaurant chain and convinces the store manager that one of her employees has stolen a customer’s purse. Without giving away too much, this sets off a chain of events that results in the employee being detained by the manager and her creep of a fiancee, who put the young woman through a hellish psychological and physical ordeal, all at the behest of the mysterious caller. If you’re the type of person who hasn’t yet lost your faith in the innate goodness of human beings, maybe you should skip this title.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "bG7i37HDK7Y"
                },
                "id": "rc-f42979ceca932e",
                "type": "youtube",
                "title": "8. Bernie",
                "note": "Amid all the acclaim thrown at his more ambitious recent fare like Boyhood and Before Midnight, it’s easy to forget that Richard Linklater made this unassuming jewel of a film in 2011. Starring Jack Black as a mortician with a perpetual smile that’s just got to be hiding something, Bernie blurs the line between documentary and fiction in a way that arguably invents cinema’s first new genre in decades. At various intervals throughout this true crime retelling of the murder of an octogenarian millionaire (Shirley MacClaine), Linklater adds interviews with “townspeople” — some of whom are actors and some of whom are real members of the East Texas community where the killing took place. This folksy Greek chorus gives Bernie an air of verisimilitude as only great documentaries can, without sacrificing the sublime flows of fictional storytelling that Linklater has mastered over the years. Meanwhile, Black gives a career-best performance as a man who walks a precarious line between gentle kindness and possible sociopathy alongside Matthew McConaughey, whose winning supporting turn as an overzealous district attorney would mark the beginning of the actor’s late-career renaissance.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "5U9KmAlrEXU"
                },
                "id": "rc-87947733bcedbb",
                "type": "youtube",
                "title": "7. Upstream Color",
                "note": "No film in recent years arrived with more anticipation among fans of challenging, experimental science fiction than Upstream Color. Nine years earlier, its director Shane Carruth released the unforgettable — and, to many, incomprehensible — time travel film Primer. Shot for the price of a used car, Primer was a proudly intellectual film, operating at incredibly high philosophical and scientific levels, and Carruth expected his viewers to rise to the occasion. It was only after three viewings and hours spent on online message boards that I understood the complex mechanisms of the plot.\n\nUpstream Color, however, is less an exercise in problem-solving and more a surrealism art film. No amount of online research can explain the strange storyline, which concerns a parasite that causes bizarre physical and psychic symptoms. Instead the viewer is required to look inward to fill in the blanks of the film’s hallucinatory narrative. At turns disturbing and serene, the film’s stunning visuals alone make Upstream Color a trip worth taking.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "G2tTBVSqPAE"
                },
                "id": "rc-e5df36410f7142",
                "type": "rumble",
                "title": "6. Django Unchained",
                "note": "Django Unchained may not be remembered as Quentin Tarantino’s most important film. The director had already proven himself again and again as an adept craftsman of heartstopping, violent action set-pieces and hilarious, idiosyncratic dialogue, both of which are in ample supply here. But what sets Django apart from his other films — aside from maybe Inglourious Basterds which lacks Django’s near-flawless execution — is a strong emotional resonance to the storytelling. Yes, it culls some of that resonance by being set amidst the horrors of American slavery (which angered many commentators like Spike Lee, regardless of whether they saw the film). But by depicting this era in all its utter monstrousness, Tarantino earns the gravitas that history lends to Django‘s story of empowerment in the face of institutional evil.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "x-b2Y8ldxZk"
                },
                "id": "rc-d0cab3760d12f1",
                "type": "youtube",
                "title": "5. Frances Ha",
                "note": "With each new film, from his debut Squid and the Whale to his latest Frances Ha, Noah Baumbach’s movies have gradually become easier to stomach. That’s not because they’ve become more accessible or mainstream — it’s because he’s finally learned to treat characters with something other than contempt. Or maybe it’s because the lead in Frances Ha, despite all her flaws, is played by the absurdly lovable Greta Gerwig. She brings so much compassion to her broke and lonely Brooklyn protagonist that it’s difficult not to adore every frame she’s in — which is all of them. Baumbach’s depiction of Brooklyn is more “Broad City” than “Girls,” as he never adds undue gravitas to a story that is about little more than how much it sucks to find — and keep — someone you can spend the rest of your life with in this fucked-up town. A rare romantic comedy that feels something like real life, Frances Ha is a warm and inspiring paean to finding yourself amid the chaos of New York. And against all odds, it’s done without making the viewer loathe millennials.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "a0b90YppquE"
                },
                "id": "rc-7f9e24b49bec54",
                "type": "youtube",
                "title": "4. Exit Through the Gift Shop",
                "note": "From the Joaquin Phoenix essay I’m Still Here to the pop culture phenomenon Catfish, 2010 was a year filled with pseudo-documentaries that toyed with the audience’s trust in ways that were almost cruel. None was more compelling — and possibly devious — than Exit Through the Gift Shop. It follows a French man who calls himself Mr. Brainwash and who briefly became a sensation in the Los Angeles art scene after befriending the world famous street artist Banksy and putting on a massively popular gallery show.\n\nIn many ways, the film is a reaction from Banksy to the popularization and commercialization of street art — for example, Mr. Brainwash’s work is unfocused, unoriginal, and, considering it’s hosted in a giant warehouse-sized gallery, not exactly in the spirit of street art. Nevertheless, his show becomes a massive success anyway, attracting the attention of celebrities like Brad Pitt and making over $1 million from the opening. Many have questioned whether Banksy masterminded the entire scenario as a sort of “fuck-you” to the mainstream art world. (Banksy denies this). But even if the film is a set-up, the reaction from the press and fellow artists to Mr. Brainwash’s work is so fevered that it’s beyond what any prankster could have expected. A precursor to the brilliant Comedy Central show “Nathan For You,” Exit Through the Gift Shop is a hilarious and absurd examination of what happens when celebrity and art collide.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "SD5oMxbMcHM"
                },
                "id": "rc-76999dd49e9086",
                "type": "youtube",
                "title": "3. The Act of Killing",
                "note": "There are plenty of historical documentaries about genocide, but few are told by the perpetrators themselves. In The Act of Killing, director Joshua Oppenheimer asks two notorious death squad leaders in Indonesia to reenact their roles in the mass murder of over 500,000 suspected communists in 1965 and 1966. Like in Errol Morris’ Robert McNamara documentary The Fog of War (Morris co-produced The Act of Killing), the subjects are at first seemingly unrepentant in their recollections of these brutal acts. But by the end of the film, the self-proclaimed “gangster” Anwar Congo is overcome with self-disgust, literally gagging at the thought of the people he slaughtered. The Act of Killing offers an unforgettable perspective on one of the most horrific events of the 20th century, driving home just how quickly human beings can be convinced to turn on one another.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "otLDuy0ToFg"
                },
                "id": "rc-48c6339e32ad92",
                "type": "youtube",
                "title": "2. The Master",
                "note": "Paul Thomas Anderson is arguably the world’s greatest living director, but The Master is all about the performances by Joaquin Phoenix and Philip Seymour Hoffman. The centerpieces of the film are a series of long conversations between Phoenix’s psychologically-damaged, sexually-frustrated World War II veteran and Hoffman’s charismatic yet unhinged cult leader. The film offers no easy resolutions to its investigations into spirituality and human behavior. But it’s the questioning itself that matters, as Anderson and his performers paint a vivid portrait of post-war society that, as opposed to the Norman Rockwell-esque nostalgia that’s come to define this period of American wish fulfillment, is fraught with as much anxiety and uncertainty as any modern era.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                  "controls": true,
                  "skip": true,
                  "modestbranding": 0,
                  "rel": 0,
                  "videoid": "lR9ktdI4LFM"
                },
                "id": "rc-6a4b88a587963f",
                "type": "youtube",
                "title": "1. Holy Motors",
                "note": "No performance in the 2010’s is more impressive than Denis Lavant’s in Holy Motors. Over the course of nearly two hours, his character is taxied around Paris in an Uber from hell, donning different outfits and identities as disparate as an old beggar woman, a motion-capture actor in a CGI erotic film, and a grotesque leprechaun who spirits a model (Eva Mendes) away to an underground sewer lair. Through these bizarre personas, Lavant and the filmmaker Leos Carax probe the various ways our sexual and psychological identities are shaped and mutilated to meet the expectations of unseen forces. It’s a boldly experimental and often impenetrable film, but one that never fails to offer excitement and surprise in nearly every frame.",
                "source": "YouTube",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                "data": {
                    "src": "http://www.cinema6.com",
                    "thumbs": {
                        "small": "https://farm8.staticflickr.com/7646/16767833635_9459b8ee35_t.jpg",
                        "large": "https://farm8.staticflickr.com/7646/16767833635_9459b8ee35_m.jpg"
                    }
                },
                "id": "rc-cac446a3593e92",
                "type": "article",
                "title": "Article Card",
                "note": "This is an article card!",
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              },
              {
                  "data": {
                      "imageid": "12345",
                      "service": "flickr",
                      "width": "100",
                      "height": "100",
                      "href": "https://flic.kr/p/12345",
                      "thumbs": {
                          "small": "www.site.com/small.jpg",
                          "large": "www.large.com/large.jpg"
                      }
                  },
                  "id": "rc-4b3dc315c3573f",
                  "type": "image",
                  "title": "Check These Out!",
                  "note": "These people play the trumpet like you've never heard before.",
                  "modules": [],
                  "placementId": null,
                  "templateUrl": null,
                  "sponsored": false,
                  "campaign": {
                      "campaignId": null,
                       "advertiserId": null,
                       "minViewTime": null
                  },
                  "collateral": {},
                  "links": {},
                  "params": {}
              },
              {
                "data": {
                  "size": "300x250"
                },
                "id": "rc-984e8b8e4168d1",
                "type": "displayAd",
                "title": "How Goes It?",
                "note": null,
                "modules": [],
                "placementId": "12345678",
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {
                  "Website": "http://www.mysite.com",
                  "Twitter": "twitter.com/93rf443t",
                  "YouTube": "youtube.com/watch?v=84ry943"
                },
                "thumbs": {
                  "small": "http://www.apple.com/logo.png",
                  "large": "http://www.apple.com/logo.png"
                },
                "params": {
                  "sponsor": "My Sponsor"
                }
              },
              {
                  "data": {
                      "service": "brightcove",
                      "videoid": "4655415742001",
                      "accountid": "4652941506001",
                      "playerid": "71cf5be9-7515-44d8-bb99-29ddc6224ff8",
                      "href": "http://players.brightcove.net/4652941506001/71cf5be9-7515-44d8-bb99-29ddc6224ff8_default/index.html?videoId=4655415742001",
                      "thumbs": {
                          "small": "http://brightcove.vo.llnwd.net/e1/pd/96980657001/96980657001_207566970001_titmouse-still.jpg?pubId=4652941506001&videoId=4655415742001",
                          "large": "http://brightcove.vo.llnwd.net/e1/pd/96980657001/96980657001_207566970001_titmouse-still.jpg?pubId=4652941506001&videoId=4655415742001"
                      }
                  },
                  "id": "rc-5ac14f008cef",
                  "type": "brightcove",
                  "title": "Birdz, Beautifully Blue: Brought to you By Brightcove",
                  "note": null,
                  "source": "Brightcove",
                  "modules": [],
                  "thumbs": null,
                  "placementId": null,
                  "templateUrl": null,
                  "sponsored": false,
                  "campaign": {
                      "campaignId": null,
                      "advertiserId": null,
                      "minViewTime": null,
                      "countUrls": [],
                      "clickUrls": []
                  },
                  "collateral": {},
                  "links": {},
                  "shareLinks": {},
                  "params": {}
              },
              {
                  "data": {
                      "service": "kaltura",
                      "partnerid": "2054981",
                      "playerid": "32784031",
                      "videoid": "1_dsup2iqd",
                      "href": "",
                      "thumbs": {
                          "small": "https://lh4.googleusercontent.com/-7XOxnCrBu9k/AAAAAAAAAAI/AAAAAAAAAKI/yGNCVbp82gE/s0-c-k-no-ns/photo.jpg",
                          "large": "https://lh4.googleusercontent.com/-7XOxnCrBu9k/AAAAAAAAAAI/AAAAAAAAAKI/yGNCVbp82gE/s0-c-k-no-ns/photo.jpg"
                      }
                  },
                  "id": "rc-86afeb278139",
                  "type": "kaltura",
                  "title": "Kewltastic Kaltura",
                  "note": "Autodesk makes quality, well engineered, bug free software.",
                  "source": "Kaltura",
                  "modules": [],
                  "thumbs": null,
                  "placementId": null,
                  "templateUrl": null,
                  "sponsored": false,
                  "campaign": {
                      "campaignId": null,
                      "advertiserId": null,
                      "minViewTime": null,
                      "countUrls": [],
                      "clickUrls": []
                  },
                  "collateral": {},
                  "links": {},
                  "shareLinks": {},
                  "params": {}
              },
              {
                  "data": {
                      "autoplay": false,
                      "service": "facebook",
                      "videoid": "10153231379946729",
                      "href": "",
                      "thumbs": {
                          "small": "",
                          "large": ""
                      }
                  },
                  "id": "rc-27ead7ab22ab",
                  "type": "facebook",
                  "title": "Fantastic Facebook",
                  "note": "Sharing is Caring: A FB PSA",
                  "source": "Facebook",
                  "modules": [],
                  "thumbs": null,
                  "placementId": null,
                  "templateUrl": null,
                  "sponsored": false,
                  "campaign": {
                      "campaignId": null,
                      "advertiserId": null,
                      "minViewTime": null,
                      "countUrls": [],
                      "clickUrls": []
                  },
                  "collateral": {},
                  "links": {},
                  "shareLinks": {},
                  "params": {}
              },
              {
                "data": {},
                "id": "rc-60b247489263c5",
                "type": "recap",
                "title": "Recap of The 15 best movies of the decade (so far) that you can watch on Netflix right now",
                "note": null,
                "modules": [],
                "placementId": null,
                "templateUrl": null,
                "sponsored": false,
                "campaign": {
                  "campaignId": null,
                  "advertiserId": null,
                  "minViewTime": null
                },
                "collateral": {},
                "links": {},
                "params": {}
              }
            ]
          },
          "versionId": "ec7d727d",
          "title": "The 15 best movies of the decade (so far) that you can watch on Netflix right now",
          "id": "e-42108b552a05ea",
          "lastUpdated": "2015-02-05T16:23:03.604Z",
          "org": "o-a61cbc73256d22",
          "status": "active",
          "lastPublished": "2015-02-05T16:04:34.754Z",
          "type": "minireel",
          "user": "u-fde2d9fadd3ce0"
          /* jshint quotmark:single */
        };

        profile = { flash: false };
        spyOn(browser, 'getProfile').and.returnValue(RunnerPromise.resolve(profile));

        environment.constructor();
        environment.params = {
            container: 'jun',
            context: 'standalone'
        };
        environment.loader = 'c6embed';

        session = new EventEmitter();
        session.ping = jasmine.createSpy('session.ping()');

        appDataDeferred = defer(RunnerPromise);
        sessionDeferred = defer(RunnerPromise);

        spyOn(dispatcher, 'addClient');
        spyOn(dispatcher, 'addSource');

        experienceDeferred = defer(RunnerPromise);
        spyOn(resource, 'get').and.returnValue(experienceDeferred.promise);

        readyFn = jasmine.createSpy('ready()');
        initDeferred = defer(RunnerPromise);
        spyOn(EmbedSession.prototype, 'init').and.returnValue(initDeferred.promise);

        minireel = new MiniReel();

        process.nextTick(done);
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should be Mixable', function() {
        expect(minireel).toEqual(jasmine.any(Mixable));
    });

    it('should mixin EventEmitter', function() {
        expect(MiniReel.mixins).toContain(EventEmitter);
    });

    it('should mixin SafelyGettable', function() {
        expect(MiniReel.mixins).toContain(SafelyGettable);
    });

    it('should add the PixelHandler to the dispatcher', function() {
        expect(dispatcher.addClient).toHaveBeenCalledWith(PixelHandler);
    });

    it('should add the PostMessageHandler to the dispatcher', function() {
        expect(dispatcher.addClient).toHaveBeenCalledWith(PostMessageHandler, window.parent.postMessage);
    });

    it('should not add the VPAIDHandler', function() {
        expect(dispatcher.addClient).not.toHaveBeenCalledWith(VPAIDHandler);
    });

    it('should not add the EmbedHandler to the dispatcher', function() {
        expect(dispatcher.addClient).not.toHaveBeenCalledWith(EmbedHandler, minireel);
    });

    it('should add itself as a source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('navigation', minireel, ['launch','move','close','error','init']);
    });

    it('should get the experience', function() {
        expect(resource.get).toHaveBeenCalledWith('experience');
    });

    describe('properties:', function() {
        describe('id', function() {
            it('should be null', function() {
                expect(minireel.id).toBeNull();
            });
        });

        describe('standalone', function() {
            it('should be null', function() {
                expect(minireel.standalone).toBeNull();
            });
        });

        describe('interstitial', function() {
            it('should be null', function() {
                expect(minireel.interstitial).toBeNull();
            });
        });

        describe('embed', function() {
            it('should be an EmbedSession', function() {
                expect(minireel.embed).toEqual(jasmine.any(EmbedSession));
            });

            it('should be initialized', function() {
                expect(minireel.embed.init).toHaveBeenCalledWith();
            });
        });

        describe('title', function() {
            it('should be null', function() {
                expect(minireel.title).toBeNull();
            });
        });

        describe('branding', function() {
            it('should be null', function() {
                expect(minireel.branding).toBeNull();
            });
        });

        describe('campaign', function() {
            it('should be null', function() {
                expect(minireel.campaign).toBeNull();
            });
        });

        describe('splash', function() {
            it('should be null', function() {
                expect(minireel.splash).toBeNull();
            });
        });

        describe('sponsor', function() {
            it('should be null', function() {
                expect(minireel.sponsor).toBeNull();
            });
        });

        describe('logo', function() {
            it('should be null', function() {
                expect(minireel.sponsor).toBeNull();
            });
        });

        describe('links', function() {
            it('should be null', function() {
                expect(minireel.links).toBeNull();
            });
        });

        describe('socialLinks', function() {
            it('should be null', function() {
                expect(minireel.socialLinks).toBeNull();
            });
        });

        describe('currentCard', function() {
            it('should be null', function() {
                expect(minireel.currentCard).toBeNull();
            });
        });

        describe('currentIndex', function() {
            it('should be -1', function() {
                expect(minireel.currentIndex).toBe(-1);
            });
        });

        describe('skippable', function() {
            it('should be true', function() {
                expect(minireel.skippable).toBe(true);
            });
        });

        describe('closeable', function() {
            it('should be true', function() {
                expect(minireel.closeable).toBe(true);
            });
        });

        describe('deck', function() {
            it('should be an empty array', function() {
                expect(minireel.deck).toEqual([]);
            });
        });

        describe('length', function() {
            it('should be 0', function() {
                expect(minireel.length).toBe(0);
            });
        });
    });

    describe('methods:', function() {
        describe('moveToIndex(index)', function() {
            describe('if called before initialization', function() {
                it('should throw an error', function() {
                    expect(function() {
                        minireel.moveToIndex(1);
                    }).toThrow(new Error('Cannot move until the MiniReel has been initialized.'));
                });
            });

            describe('if called after initialization', function() {
                let move;

                beforeEach(function(done) {
                    move = jasmine.createSpy('move()');
                    minireel.on('move', move);

                    minireel.on('init', () => {
                        minireel.deck.forEach(card => {
                            spyOn(card, 'activate');
                            spyOn(card, 'deactivate');
                            spyOn(card, 'prepare');
                        });
                        done();
                    });

                    experienceDeferred.fulfill(experience);
                });

                it('should set the currentIndex and currentCard and emit "move"', function() {
                    minireel.moveToIndex(0);
                    expect(minireel.currentIndex).toBe(0);
                    expect(minireel.currentCard).toBe(minireel.deck[0]);
                    expect(minireel.deck[0].activate).toHaveBeenCalled();
                    expect(move.calls.count()).toBe(1);

                    minireel.deck[0].deactivate.and.callFake(() => {
                        expect(minireel.currentIndex).toBe(0);
                        expect(minireel.currentCard).toBe(minireel.deck[0]);
                    });
                    minireel.deck[3].activate.and.callFake(() => {
                        expect(minireel.currentIndex).toBe(3);
                        expect(minireel.currentCard).toBe(minireel.deck[3]);
                    });
                    minireel.moveToIndex(3);
                    expect(minireel.currentIndex).toBe(3);
                    expect(minireel.currentCard).toBe(minireel.deck[3]);
                    expect(minireel.deck[0].deactivate).toHaveBeenCalled();
                    expect(minireel.deck[3].activate).toHaveBeenCalled();
                    expect(move.calls.count()).toBe(2);
                });

                it('should call prepare() on the next card', function() {
                    minireel.moveToIndex(0);
                    expect(minireel.deck[1].prepare).toHaveBeenCalled();

                    minireel.moveToIndex(3);
                    expect(minireel.deck[4].prepare).toHaveBeenCalled();
                });

                describe('when moving to any index other than -1', function() {
                    let index;

                    beforeEach(function() {
                        index = 3;
                        minireel.deck.forEach(card => spyOn(card, 'cleanup'));

                        minireel.deck.forEach((card, index) => minireel.moveToIndex(index));
                    });

                    it('should not cleanup any of the cards', function() {
                        minireel.deck.forEach(card => expect(card.cleanup).not.toHaveBeenCalled());
                    });
                });

                describe('when moving to -1', function() {
                    beforeEach(function() {
                        minireel.moveToIndex(2);

                        minireel.deck.forEach(card => spyOn(card, 'cleanup').and.callFake(() => expect(minireel.deck[2].deactivate).toHaveBeenCalled()));
                        minireel.deck[0].prepare.and.callFake(() => minireel.deck.forEach(card => expect(card.cleanup).toHaveBeenCalled()));

                        minireel.moveToIndex(-1);
                    });

                    it('should cleanup all of the cards', function() {
                        minireel.deck.forEach(card => expect(card.cleanup).toHaveBeenCalled());
                    });
                });

                describe('if the minireel is not skippable', function() {
                    beforeEach(function() {
                        minireel.currentIndex = 2;
                        minireel.currentCard = minireel.deck[2];
                        minireel.skippable = false;

                        minireel.moveToIndex(3);
                    });

                    it('should do nothing', function() {
                        expect(minireel.currentIndex).not.toBe(3);
                        expect(minireel.deck[2].deactivate).not.toHaveBeenCalled();
                        expect(minireel.deck[3].activate).not.toHaveBeenCalled();
                        expect(move).not.toHaveBeenCalled();
                    });

                    describe('if the MiniReel is closing', function() {
                        beforeEach(function() {
                            spyOn(minireel.currentCard, 'abort');
                            minireel.moveToIndex(-1);
                        });

                        it('should abort() the currentCard', function() {
                            expect(minireel.deck[2].abort).toHaveBeenCalled();
                        });

                        it('should close the minireel', function() {
                            expect(minireel.currentIndex).toBe(-1);
                            expect(move).toHaveBeenCalled();
                        });
                    });
                });

                describe('when moving from no card', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        minireel.on('launch', spy);

                        minireel.moveToIndex(-1);
                        expect(spy).not.toHaveBeenCalled();
                        minireel.moveToIndex(2);
                    });

                    it('should emit the launch event', function() {
                        expect(spy).toHaveBeenCalled();
                        minireel.moveToIndex(4);
                        expect(spy.calls.count()).toBe(1);
                    });
                });

                describe('when moving to no card', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        minireel.on('close', spy);

                        minireel.moveToIndex(-1);
                        minireel.moveToIndex(3);
                        minireel.moveToIndex(4);
                        expect(spy).not.toHaveBeenCalled();

                        minireel.moveToIndex(-1);
                    });

                    it('should emit the close event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });

                describe('when the currentCard emits "becameUnskippable"', function() {
                    let becameUnskippable;

                    beforeEach(function() {
                        becameUnskippable = jasmine.createSpy('becameUnskippable()');

                        minireel.skippable = true;
                        minireel.moveToIndex(0);
                        minireel.on('becameUnskippable', becameUnskippable);

                        minireel.currentCard.emit('becameUnskippable');
                    });

                    it('should emit "becameUnskippable"', function() {
                        expect(becameUnskippable).toHaveBeenCalled();
                    });

                    it('should set skippable to false', function() {
                        expect(minireel.skippable).toBe(false);
                    });

                    describe('if the last card emits "becameUnskippable"', function() {
                        beforeEach(function() {
                            becameUnskippable.calls.reset();

                            minireel.moveToIndex(minireel.length - 1);
                            minireel.currentCard.emit('becameUnskippable');
                        });

                        it('should emit "becameUnskippable"', function() {
                            expect(becameUnskippable).toHaveBeenCalled();
                        });
                    });

                    describe('if a previous card emits "becameUnskippable"', function() {
                        beforeEach(function() {
                            becameUnskippable.calls.reset();
                            minireel.skippable = true;

                            minireel.moveToIndex(3);
                            minireel.deck[0].emit('becameUnskippable');
                        });

                        it('should not emit "becameUnskippable"', function() {
                            expect(becameUnskippable).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when the currentCard emits "becameSkippable"', function() {
                    let becameSkippable;

                    beforeEach(function() {
                        becameSkippable = jasmine.createSpy('becameSkippable()');

                        minireel.moveToIndex(0);
                        minireel.on('becameSkippable', becameSkippable);
                        minireel.skippable = false;

                        minireel.currentCard.emit('becameSkippable');
                    });

                    it('should emit "becameSkippable"', function() {
                        expect(becameSkippable).toHaveBeenCalled();
                    });

                    it('should set skippable to true', function() {
                        expect(minireel.skippable).toBe(true);
                    });

                    describe('if a previous card emits "becameSkippable"', function() {
                        beforeEach(function() {
                            becameSkippable.calls.reset();
                            minireel.moveTo(4);

                            minireel.deck[0].emit('becameSkippable');
                        });

                        it('should not emit "becameSkippable"', function() {
                            expect(becameSkippable).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when the currentCard emits "skippableProgress"', function() {
                    let skippableProgress;

                    beforeEach(function() {
                        skippableProgress = jasmine.createSpy('skippableProgress()');

                        minireel.moveToIndex(0);
                        minireel.on('skippableProgress', skippableProgress);

                        minireel.currentCard.emit('skippableProgress', 3);
                    });

                    it('should emit "skippableProgress"', function() {
                        expect(skippableProgress).toHaveBeenCalledWith(3);
                    });

                    describe('if a previous card emits "skippableProgress"', function() {
                        beforeEach(function() {
                            skippableProgress.calls.reset();
                            minireel.moveToIndex(5);

                            minireel.deck[0].emit('skippableProgress', 2);
                        });

                        it('should not emit "skippableProgress"', function() {
                            expect(skippableProgress).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when the currentCard emits "canAdvance"', function() {
                    beforeEach(function() {
                        spyOn(minireel, 'next').and.callThrough();

                        minireel.moveToIndex(0);
                        minireel.currentCard.emit('canAdvance');
                    });

                    it('should move to the next card', function() {
                        expect(minireel.next).toHaveBeenCalled();
                    });

                    describe('if a previous currentCard emits "canAdvance"', function() {
                        beforeEach(function() {
                            minireel.next.calls.reset();

                            minireel.moveToIndex(3);
                            minireel.deck[0].emit('canAdvance');
                        });

                        it('should not move to the next card', function() {
                            expect(minireel.next).not.toHaveBeenCalled();
                        });
                    });

                    describe('if the currentCard is null', function() {
                        it('should not throw any errors', function() {
                            expect(function() {
                                minireel.moveToIndex(-1);
                            }).not.toThrow();
                        });
                    });

                    describe('if moved to the same card', function() {
                        beforeEach(function() {
                            spyOn(minireel.currentCard, 'on').and.callThrough();

                            minireel.moveTo(minireel.currentCard);
                        });

                        it('should not add another event listener', function() {
                            expect(minireel.currentCard.on).not.toHaveBeenCalled();
                        });
                    });

                    describe('if moved to the last card', function() {
                        let lastCard;

                        beforeEach(function() {
                            lastCard = minireel.deck[minireel.deck.length - 1];

                            spyOn(lastCard, 'on').and.callThrough();
                            minireel.moveToIndex(minireel.deck.length - 1);
                        });

                        it('should not listen for the canAdvance event', function() {
                            expect(lastCard.on).not.toHaveBeenCalledWith('canAdvance', jasmine.any(Function));
                        });
                    });
                });

                describe('if already on a card', function() {
                    beforeEach(function() {
                        minireel.moveToIndex(2);
                        move.calls.reset();

                        minireel.moveToIndex(2);
                    });

                    it('should not emit "move" again', function() {
                        expect(move).not.toHaveBeenCalled();
                    });
                });

                describe('if called with a number less than -1', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            minireel.moveToIndex(-2);
                        }).toThrow(new RangeError('Cannot move below index -1.'));
                    });
                });

                describe('if called with a number greater than the last index', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            minireel.moveToIndex(22);
                        }).toThrow(new RangeError('Cannot move past the last index.'));
                    });
                });
            });
        });

        describe('moveTo(card)', function() {
            beforeEach(function(done) {
                spyOn(minireel, 'moveToIndex').and.callThrough();
                minireel.on('init', done);

                experienceDeferred.fulfill(experience);
            });

            it('should call moveToIndex() with the index of the provided card', function() {
                minireel.moveTo(minireel.deck[5]);
                expect(minireel.moveToIndex).toHaveBeenCalledWith(5);
                minireel.moveToIndex.calls.reset();

                minireel.moveTo(minireel.deck[7]);
                expect(minireel.moveToIndex).toHaveBeenCalledWith(7);
                minireel.moveToIndex.calls.reset();
            });
        });

        describe('next()', function() {
            beforeEach(function(done) {
                spyOn(minireel, 'moveToIndex').and.callThrough();
                minireel.on('init', done);

                experienceDeferred.fulfill(experience);
            });

            it('should call moveToIndex() with the next index', function() {
                minireel.next();
                expect(minireel.moveToIndex).toHaveBeenCalledWith(0);
                minireel.moveToIndex.calls.reset();

                minireel.next();
                expect(minireel.moveToIndex).toHaveBeenCalledWith(1);
                minireel.moveToIndex.calls.reset();
            });
        });

        describe('previous()', function() {
            beforeEach(function(done) {
                minireel.on('init', () => {
                    minireel.moveToIndex(5);

                    spyOn(minireel, 'moveToIndex').and.callThrough();
                    done();
                });

                experienceDeferred.fulfill(experience);
            });

            it('should call moveToIndex() with the previous index', function() {
                minireel.previous();
                expect(minireel.moveToIndex).toHaveBeenCalledWith(4);
                minireel.moveToIndex.calls.reset();

                minireel.previous();
                expect(minireel.moveToIndex).toHaveBeenCalledWith(3);
                minireel.moveToIndex.calls.reset();
            });
        });

        describe('close()', function() {
            beforeEach(function() {
                spyOn(minireel, 'moveToIndex');
                minireel.close();
            });

            it('should move to index -1', function() {
                expect(minireel.moveToIndex).toHaveBeenCalledWith(-1);
            });
        });
    });

    describe('when the minireel becomes unskippable', function() {
        var becameUncloseable;

        beforeEach(function() {
            becameUncloseable = jasmine.createSpy('becameUncloseable()');
            minireel.on('becameUncloseable', becameUncloseable);

            minireel.closeable = true;
        });

        describe('and it is an interstitial', function() {
            beforeEach(function() {
                minireel.interstitial = true;

                minireel.emit('becameUnskippable');
            });

            it('should emit "becameUncloseable"', function() {
                expect(becameUncloseable).toHaveBeenCalled();
            });

            it('should set closeable to false', function() {
                expect(minireel.closeable).toBe(false);
            });
        });

        describe('and it is not an interstitial', function() {
            beforeEach(function() {
                minireel.interstitial = false;

                minireel.emit('becameUnskippable');
            });

            it('should not emit "becameUncloseable"', function() {
                expect(becameUncloseable).not.toHaveBeenCalled();
            });

            it('should not set closeable to false', function() {
                expect(minireel.closeable).not.toBe(false);
            });
        });
    });

    describe('when the minireel becomes skippable', function() {
        var becameCloseable;

        beforeEach(function() {
            becameCloseable = jasmine.createSpy('becameCloseable()');
            minireel.on('becameCloseable', becameCloseable);
        });

        describe('and closeable was false', function() {
            beforeEach(function() {
                minireel.closeable = false;

                minireel.emit('becameSkippable');
            });

            it('should emit "becameCloseable"', function() {
                expect(becameCloseable).toHaveBeenCalled();
            });

            it('should set closeable to true', function() {
                expect(minireel.closeable).toBe(true);
            });
        });

        describe('and closeable was true', function() {
            beforeEach(function() {
                minireel.closeable = true;

                minireel.emit('becameSkippable');
            });

            it('should not emit "becameCloseable"', function() {
                expect(becameCloseable).not.toHaveBeenCalled();
            });

            it('should keep closeable as true', function() {
                expect(minireel.closeable).toBe(true);
            });
        });
    });

    describe('when the readyFn is available', function() {
        beforeEach(function(done) {
            initDeferred.fulfill(readyFn);
            setTimeout(done, 0);
        });

        it('should not be called', function() {
            expect(readyFn).not.toHaveBeenCalled();
        });
    });

    describe('when the experience is available', function() {
        let done;
        let mouseDeferred;

        beforeEach(function(_done) {
            done = jasmine.createSpy('done()').and.callFake(_done);

            mouseDeferred = defer(RunnerPromise);
            spyOn(browser, 'test').and.returnValue(mouseDeferred.promise);
            spyOn(codeLoader, 'loadStyles');

            minireel.on('init', () => process.nextTick(done));
            minireel.on('error', (error) => {
                console.error(error);
            });

            spyOn(Card.prototype, 'prepare');
            spyOn(minireel, 'moveToIndex');

            environment.params.standalone = false;
            environment.params.interstitial = true;
            environment.params.autoLaunch = false;

            experienceDeferred.fulfill(experience);
        });

        describe('via the embed appData', function() {
            let embedMiniReel;

            beforeEach(function(done) {
                delete minireel.moveToIndex;

                resource.get.and.returnValue(RunnerPromise.reject(new Error('Not found.')));
                spyOn(EmbedSession.prototype, 'getExperience').and.returnValue(RunnerPromise.resolve(experience));

                embedMiniReel = new MiniReel();
                embedMiniReel.once('init', done);
            });

            it('should bootstrap the MiniReel', function() {
                Object.keys(minireel).forEach(key => {
                    if (typeof minireel[key] !== 'object') {
                        expect(embedMiniReel[key]).toEqual(minireel[key]);
                    }
                });
            });
        });

        describe('and the readyFn is available', function() {
            beforeEach(function(done) {
                initDeferred.fulfill(readyFn);
                setTimeout(done, 0);
            });

            it('should be called', function() {
                expect(readyFn).toHaveBeenCalledWith();
            });
        });

        it('should emit the "init" event', function() {
            expect(done).toHaveBeenCalled();
        });

        it('should call prepare() on the first card', function() {
            expect(minireel.deck[0].prepare).toHaveBeenCalled();
        });

        it('should copy the standalone property', function() {
            expect(minireel.standalone).toBe(false);
        });

        it('should set the interstitial property', function() {
            expect(minireel.interstitial).toBe(true);
        });

        it('should copy the id', function() {
            expect(minireel.id).toBe(experience.id);
        });

        it('should copy the title', function() {
            expect(minireel.title).toBe(experience.data.title);
        });

        it('should copy the branding', function() {
            expect(minireel.branding).toBe(experience.data.branding);
        });

        it('should copy the campaign', function() {
            expect(minireel.campaign).toBe(experience.data.campaign);
        });

        it('should set the splash', function() {
            expect(minireel.splash).toBe(experience.data.collateral.splash);
        });

        it('should copy the sponsor', function() {
            expect(minireel.sponsor).toBe(experience.data.params.sponsor);
        });

        it('should copy the logo', function() {
            expect(minireel.logo).toBe(experience.data.collateral.logo);
        });

        it('should normalize the minireel\'s links', function() {
            expect(minireel.links).toEqual(normalizeLinks(experience.data.links));
        });

        it('should generate an array of socialLinks from the links', function() {
            expect(minireel.socialLinks).toEqual(makeSocialLinks(minireel.links));
        });

        it('should not launch the MiniReel', function() {
            expect(minireel.moveToIndex).not.toHaveBeenCalled();
        });

        describe('if autoLaunch is true', function() {
            beforeEach(function(done) {
                environment.params.autoLaunch = true;

                experienceDeferred.fulfill(experience);

                minireel = new MiniReel();
                spyOn(minireel, 'moveToIndex');
                minireel.once('init', () => process.nextTick(done));
            });

            it('should launch the MiniReel', function() {
                expect(minireel.moveToIndex).toHaveBeenCalledWith(0);
            });
        });

        describe('if standalone is true', function() {
            beforeEach(function(done) {
                environment.params.standalone = true;
                environment.params.interstitial = false;

                experienceDeferred.fulfill(experience);

                minireel = new MiniReel();
                minireel.once('init', () => process.nextTick(done));
            });

            it('should set closeable to false', function() {
                expect(minireel.closeable).toBe(false);
            });

            describe('and interstitial is true', function() {
                beforeEach(function(done) {
                    environment.params.standalone = true;
                    environment.params.interstitial = true;

                    experienceDeferred.fulfill(experience);

                    minireel = new MiniReel();
                    minireel.once('init', () => process.nextTick(done));
                });

                describe('and the MiniReel becomes unskippable', function() {
                    let becameUncloseable;

                    beforeEach(function() {
                        becameUncloseable = jasmine.createSpy('becameUncloseable()');

                        minireel.on('becameUncloseable', becameUncloseable);
                        minireel.emit('becameUnskippable');
                    });

                    it('should not emit "becameUncloseable"', function() {
                        expect(becameUncloseable).not.toHaveBeenCalled();
                    });

                    it('should leave closeable as false', function() {
                        expect(minireel.closeable).toBe(false);
                    });
                });

                describe('and the MiniReel becomes skippable', function() {
                    let becameCloseable;

                    beforeEach(function() {
                        becameCloseable = jasmine.createSpy('becameCloseable()');

                        minireel.on('becameCloseable', becameCloseable);
                        minireel.emit('becameSkippable');
                    });

                    it('should not emit "becameCloseable"', function() {
                        expect(becameCloseable).not.toHaveBeenCalled();
                    });

                    it('should leave closeable as false', function() {
                        expect(minireel.closeable).toBe(false);
                    });
                });
            });
        });

        describe('if standalone is false', function() {
            beforeEach(function(done) {
                experience.data.deck[1].data.skip = true;

                environment.params.standalone = false;
                environment.params.interstitial = true;

                experienceDeferred.fulfill(experience);

                minireel = new MiniReel();
                minireel.once('init', () => process.nextTick(done));
            });

            it('should set closeable to true', function() {
                expect(minireel.closeable).toBe(true);
            });
        });

        describe('if the minireel has no branding', function() {
            beforeEach(function(done) {
                delete experience.data.branding;
                codeLoader.loadStyles.calls.reset();
                browser.test.calls.reset();

                minireel = new MiniReel();
                minireel.on('init', done);
            });

            it('should not load styles', function() {
                expect(codeLoader.loadStyles).not.toHaveBeenCalled();
            });

            it('should not test for a mouse', function() {
                expect(browser.test).not.toHaveBeenCalled();
            });
        });

        describe('if something goes wrong', function() {
            let error;

            beforeEach(function(done) {
                error = jasmine.createSpy('error()');

                experienceDeferred = defer(RunnerPromise);
                resource.get.and.returnValue(experienceDeferred.promise);

                minireel = new MiniReel();
                minireel.on('error', error);

                delete experience.data;

                experienceDeferred.fulfill(experience);
                Promise.resolve(experienceDeferred.promise).then(() => {}).then(done);
            });

            it('should emit the "error" event', function() {
                expect(error).toHaveBeenCalledWith(jasmine.any(TypeError));
            });
        });

        describe('if the minireel is not sponsored', function() {
            beforeEach(function(done) {
                delete experience.data.params.sponsor;
                delete experience.data.collateral.logo;
                delete experience.data.links;

                minireel = new MiniReel();
                minireel.on('init', done);
            });

            it('should leave the sponsor as null', function() {
                expect(minireel.sponsor).toBeNull();
            });

            it('should leave the logo as null', function() {
                expect(minireel.logo).toBeNull();
            });

            it('should make the socialLinks an empty array', function() {
                expect(minireel.socialLinks).toEqual([]);
            });

            it('should make the links an object', function() {
                expect(minireel.links).toEqual({});
            });
        });

        describe('if the MiniReel contains a showcase-app card', function() {
            beforeEach(function(done) {
                experience.data.deck = [
                    {
                        id: 'rc-0GK91W05UgBDWMda',
                        campaign: {
                            minViewTime: 0
                        },
                        collateral: {
                            logo: null
                        },
                        data: {
                            duration: 30,
                            price: 'Free',
                            rating: 4.5,
                            slides: [
                                {
                                    type: 'image',
                                    uri: 'http://a3.mzstatic.com/us/r30/Purple4/v4/b5/75/10/b57510e1-6904-7fe3-cd5f-9efbeba57207/screen1136x1136.jpeg'
                                },
                                {
                                    type: 'image',
                                    uri: 'http://a2.mzstatic.com/us/r30/Purple4/v4/3a/a1/0b/3aa10b37-e36c-24f5-cc2f-db026ed540a4/screen1136x1136.jpeg'
                                },
                                {
                                    type: 'image',
                                    uri: 'http://a3.mzstatic.com/us/r30/Purple1/v4/35/a4/67/35a46788-596d-6290-41ab-063af173bd2f/screen1136x1136.jpeg'
                                },
                                {
                                    type: 'image',
                                    uri: 'http://a2.mzstatic.com/us/r30/Purple1/v4/e1/96/a9/e196a9d4-8ea1-79f7-c376-96e145bbe536/screen1136x1136.jpeg'
                                },
                                {
                                    type: 'image',
                                    uri: 'http://a3.mzstatic.com/us/r30/Purple1/v4/ee/f2/32/eef2325a-88f4-dd44-5791-23a05ff179b6/screen1136x1136.jpeg'
                                }
                            ]
                        },
                        links: {
                            Action: {
                                uri: 'https://itunes.apple.com/us/app/coachguitar-guitar-lessons/id405338085?mt=8&uo=4',
                                tracking: []
                            }
                        },
                        modules: [],
                        note: 'We show you how to play popular songs without music theory.',
                        params: {
                            action: {
                                type: 'button',
                                label: 'Download for Free'
                            }
                        },
                        shareLinks: {},
                        sponsored: true,
                        thumbs: {
                            small: 'http://is5.mzstatic.com/image/thumb/Purple20/v4/0f/31/75/0f31756b-91c4-edfb-2d2f-359da1717fd3/source/512x512bb.jpg',
                            large: 'http://is5.mzstatic.com/image/thumb/Purple20/v4/0f/31/75/0f31756b-91c4-edfb-2d2f-359da1717fd3/source/512x512bb.jpg'
                        },
                        title: 'CoachGuitar - Guitar Lessons for Beginners',
                        type: 'showcase-app'
                    }
                ];

                minireel = new MiniReel();
                minireel.once('init', done);
            });

            it('should instantiate a new ShowcaseAppCard', function() {
                expect(minireel.deck).toEqual([new ShowcaseAppCard(experience.data.deck[0])]);
            });
        });

        it('should fill the deck with the cards', function() {
            expect(minireel.deck).toEqual([
                jasmine.any(AdUnitCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(ImageCard),
                jasmine.any(BrightcoveVideoCard),
                jasmine.any(KalturaVideoCard),
                jasmine.any(VideoCard),
                jasmine.any(RecapCard)
            ]);
        });

        it('should pass the minireel\'s autoplay and autoadvance properites to the video cards', function() {
            minireel.deck.filter(card => card instanceof VideoCard && !(card instanceof AdUnitCard))
                .forEach(card => {
                    expect(card.data.autoplay).toBe(experience.data.autoplay);
                    expect(card.data.autoadvance).toBe(experience.data.autoadvance);
                });
        });

        it('should give the recap card a reference to itself', function() {
            expect(minireel.deck[minireel.deck.length - 1].data).toBe(minireel);
        });

        it('should set the length', function() {
            expect(minireel.length).toBe(20);
        });
    });

    describe('if the context is vpaid', function() {
        beforeEach(function() {
            environment.params.context = 'vpaid';
            dispatcher.addClient.calls.reset();

            minireel = new MiniReel();
        });

        it('should add the VPAIDHandler to the dispatcher', function() {
            expect(dispatcher.addClient).toHaveBeenCalledWith(VPAIDHandler, minireel.embed);
        });
    });

    ['mraid', 'vpaid', 'embed'].forEach(function(context) {
        describe(`if the context is ${context}`, function() {
            beforeEach(function() {
                environment.params.context = context;
                dispatcher.addClient.calls.reset();

                minireel = new MiniReel();
            });

            it('should add the EmbedHandler to the dispatcher', function() {
                expect(dispatcher.addClient).toHaveBeenCalledWith(EmbedHandler, minireel);
            });
        });
    });

    describe('if the minireel is instantiated with a whitelist of card types', function() {
        beforeEach(function(done) {
            minireel = new MiniReel(['video']);
            minireel.once('init', done);

            experienceDeferred.fulfill(experience);
        });

        it('should create a deck with only the cards of those types', function() {
            expect(minireel.deck).toEqual([
                jasmine.any(AdUnitCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(VideoCard),
                jasmine.any(BrightcoveVideoCard),
                jasmine.any(KalturaVideoCard),
                jasmine.any(VideoCard)
            ]);
        });
    });
});
