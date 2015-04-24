import MiniReel from '../../../src/models/MiniReel.js';
import dispatcher from '../../../src/services/dispatcher.js';
import ADTECHHandler from '../../../src/handlers/ADTECHHandler.js';
import GoogleAnalyticsHandler from '../../../src/handlers/GoogleAnalyticsHandler.js';
import MoatHandler from '../../../src/handlers/MoatHandler.js';
import JumpRampHandler from '../../../src/handlers/JumpRampHandler.js';
import {EventEmitter} from 'events';
import cinema6 from '../../../src/services/cinema6.js';
import adtech from '../../../src/services/adtech.js';
import {
    defer
} from '../../../lib/utils.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import TextCard from '../../../src/models/TextCard.js';
import VideoCard from '../../../src/models/VideoCard.js';
import AdUnitCard from '../../../src/models/AdUnitCard.js';
import EmbeddedVideoCard from '../../../src/models/EmbeddedVideoCard.js';
import DisplayAdCard from '../../../src/models/DisplayAdCard.js';
import RecapCard from '../../../src/models/RecapCard.js';
import PrerollCard from '../../../src/models/PrerollCard.js';
import election from '../../../src/services/election.js';

describe('MiniReel', function() {
    let experience;
    let minireel;
    let session;
    let appDataDeferred;
    let sessionDeferred;

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
                "type": "youtube",
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

        session = new EventEmitter();
        session.ping = jasmine.createSpy('session.ping()');

        appDataDeferred = defer(RunnerPromise);
        sessionDeferred = defer(RunnerPromise);

        spyOn(cinema6, 'getAppData').and.returnValue(appDataDeferred.promise);
        spyOn(cinema6, 'getSession').and.returnValue(sessionDeferred.promise);

        spyOn(dispatcher, 'addClient');
        spyOn(dispatcher, 'addSource');

        spyOn(election, 'getResults').and.returnValue(new RunnerPromise(() => {}));

        minireel = new MiniReel();

        sessionDeferred.fulfill(session);

        sessionDeferred.promise.then(done);
    });

    it('should be an event emitter', function() {
        expect(minireel).toEqual(jasmine.any(EventEmitter));
    });

    it('should add the ADTECHHandler to the dispatcher', function() {
        expect(dispatcher.addClient).toHaveBeenCalledWith(ADTECHHandler);
    });

    it('should add itself as a source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('navigation', minireel,
            ['move','close','error']);
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

        describe('deck', function() {
            it('should be an empty array', function() {
                expect(minireel.deck).toEqual([]);
            });
        });

        describe('prerollCard', function() {
            it('should be null', function() {
                expect(minireel.prerollCard).toBeNull();
            });
        });

        describe('length', function() {
            it('should be 0', function() {
                expect(minireel.length).toBe(0);
            });
        });

        describe('adConfig', function() {
            it('should be null', function() {
                expect(minireel.adConfig).toBeNull();
            });
        });
    });

    describe('events:', function() {
        describe('launch', function() {
            beforeEach(function(done) {
                minireel.emit('launch');
                sessionDeferred.promise.then(done);
            });

            it('should ping the session with the "open" event', function() {
                expect(session.ping).toHaveBeenCalledWith('open');
            });
        });

        describe('close', function() {
            beforeEach(function(done) {
                minireel.emit('close');
                sessionDeferred.promise.then(done);
            });

            it('should ping the session with the "close" event', function() {
                expect(session.ping).toHaveBeenCalledWith('close');
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
                beforeEach(function(done) {
                    minireel.on('init', done);
                    spyOn(minireel, 'didMove').and.callThrough();

                    appDataDeferred.fulfill({ experience: experience });
                });

                it('should set the currentIndex and currentCard and emit "move"', function() {
                    minireel.moveToIndex(0);
                    expect(minireel.currentIndex).toBe(0);
                    expect(minireel.currentCard).toBe(minireel.deck[0]);
                    expect(minireel.didMove.calls.count()).toBe(1);

                    minireel.moveToIndex(3);
                    expect(minireel.currentIndex).toBe(3);
                    expect(minireel.currentCard).toBe(minireel.deck[3]);
                    expect(minireel.didMove.calls.count()).toBe(2);
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

                        minireel.moveToIndex(0);
                        minireel.on('becameUnskippable', becameUnskippable);

                        minireel.currentCard.emit('becameUnskippable');
                    });

                    it('should emit "becameUnskippable"', function() {
                        expect(becameUnskippable).toHaveBeenCalled();
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

                        minireel.currentCard.emit('becameSkippable');
                    });

                    it('should emit "becameSkippable"', function() {
                        expect(becameSkippable).toHaveBeenCalled();
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
                        minireel.didMove.calls.reset();

                        minireel.moveToIndex(2);
                    });

                    it('should not emit "move" again', function() {
                        expect(minireel.didMove).not.toHaveBeenCalled();
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
                            minireel.moveToIndex(20);
                        }).toThrow(new RangeError('Cannot move past the last index.'));
                    });
                });

                describe('when it comes to preroll advertising', function() {
                    beforeEach(function() {
                        spyOn(minireel.prerollCard, 'prepare');
                        spyOn(minireel.prerollCard, 'activate');

                        minireel.didMove.calls.reset();
                    });

                    describe('if the firstPlacement is -1', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.firstPlacement = -1;

                            minireel.deck.forEach((card, index) => minireel.moveToIndex(index));
                        });

                        it('should never prepare() or activate() the prerollCard', function() {
                            expect(minireel.prerollCard.prepare).not.toHaveBeenCalled();
                            expect(minireel.prerollCard.activate).not.toHaveBeenCalled();
                        });
                    });

                    describe('if the firstPlacement is above 1', function() {
                        beforeEach(function() {
                            minireel.adConfig.video.firstPlacement = 3;
                        });

                        it('should call prepare() on the card after the minireel has been navigated that number of times', function() {
                            minireel.moveToIndex(3);
                            minireel.moveToIndex(5);
                            expect(minireel.prerollCard.prepare).not.toHaveBeenCalled();
                            expect(minireel.currentIndex).toBe(5);
                            expect(minireel.currentCard).toBe(minireel.deck[5]);

                            minireel.moveToIndex(1);
                            expect(minireel.prerollCard.prepare).toHaveBeenCalled();
                            expect(minireel.didMove.calls.count()).toBe(3);
                            expect(minireel.currentCard).toBe(minireel.deck[1]);
                            expect(minireel.currentIndex).toBe(1);
                        });

                        it('should call activate() on the card when the minireel has been navigated that number of times + 1', function() {
                            minireel.moveToIndex(0);
                            minireel.moveToIndex(1);
                            minireel.moveToIndex(3);
                            expect(minireel.prerollCard.activate).not.toHaveBeenCalled();
                            expect(minireel.didMove.calls.count()).toBe(3);
                            expect(minireel.currentCard).toBe(minireel.deck[3]);
                            expect(minireel.currentIndex).toBe(3);

                            minireel.moveToIndex(6);
                            expect(minireel.prerollCard.activate).toHaveBeenCalled();
                            expect(minireel.didMove.calls.count()).toBe(4);
                            expect(minireel.currentCard).toBe(minireel.prerollCard);
                            expect(minireel.currentIndex).toBe(null);
                        });

                        describe('after the first preroll video has been shown', function() {
                            beforeEach(function() {
                                minireel.moveToIndex(0);
                                minireel.moveToIndex(1);
                                minireel.moveToIndex(2);

                                minireel.deck.forEach(card => spyOn(card, 'prepare'));
                                minireel.moveToIndex(8);
                                expect(minireel.prerollCard.activate).toHaveBeenCalled();

                                minireel.prerollCard.activate.calls.reset();
                                minireel.prerollCard.prepare.calls.reset();
                            });

                            it('should not preload any normal cards', function() {
                                minireel.deck.forEach(card => expect(card.prepare).not.toHaveBeenCalled());
                            });

                            describe('calling next()', function() {
                                beforeEach(function() {
                                    spyOn(minireel, 'moveToIndex').and.callThrough();

                                    minireel.next();
                                });

                                it('should cause the MiniReel to proceed past the preroll card to the card the user was trying to navigate to', function() {
                                    expect(minireel.moveToIndex).toHaveBeenCalledWith(8);
                                });
                            });

                            describe('calling previous()', function() {
                                beforeEach(function() {
                                    spyOn(minireel, 'moveToIndex').and.callThrough();

                                    minireel.previous();
                                });

                                it('should cause the MiniReel to proceed past the preroll card to the card the user was on before', function() {
                                    expect(minireel.moveToIndex).toHaveBeenCalledWith(2);
                                });
                            });

                            describe('if the frequency is 0', function() {
                                beforeEach(function() {
                                    minireel.adConfig.video.frequency = 0;

                                    minireel.deck.forEach((card, index) => minireel.moveToIndex(index));
                                });

                                it('should not prepare or show any more preroll', function() {
                                    expect(minireel.prerollCard.activate).not.toHaveBeenCalled();
                                    expect(minireel.prerollCard.prepare).not.toHaveBeenCalled();
                                });
                            });

                            describe('if the frequency is greater than 0', function() {
                                beforeEach(function() {
                                    minireel.adConfig.video.frequency = 2;

                                    minireel.prerollCard.prepare.calls.reset();
                                    minireel.prerollCard.activate.calls.reset();
                                });

                                it('should use the frequency as an interval to prepare() and activate() the prerollCard', function() {
                                    minireel.moveToIndex(4);
                                    expect(minireel.prerollCard.prepare).not.toHaveBeenCalled();
                                    expect(minireel.prerollCard.activate).not.toHaveBeenCalled();

                                    minireel.moveToIndex(6);
                                    expect(minireel.prerollCard.prepare).toHaveBeenCalled();
                                    expect(minireel.prerollCard.activate).not.toHaveBeenCalled();
                                    minireel.prerollCard.prepare.calls.reset();

                                    minireel.moveToIndex(8);
                                    expect(minireel.prerollCard.prepare).not.toHaveBeenCalled();
                                    expect(minireel.prerollCard.activate).toHaveBeenCalled();

                                    minireel.prerollCard.prepare.calls.reset();
                                    minireel.prerollCard.activate.calls.reset();

                                    minireel.moveToIndex(2);
                                    expect(minireel.prerollCard.prepare).not.toHaveBeenCalled();
                                    expect(minireel.prerollCard.activate).not.toHaveBeenCalled();

                                    minireel.moveToIndex(7);
                                    expect(minireel.prerollCard.prepare).toHaveBeenCalled();
                                    expect(minireel.prerollCard.activate).not.toHaveBeenCalled();
                                    minireel.prerollCard.prepare.calls.reset();

                                    minireel.moveToIndex(11);
                                    expect(minireel.prerollCard.prepare).not.toHaveBeenCalled();
                                    expect(minireel.prerollCard.activate).toHaveBeenCalled();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('moveTo(card)', function() {
            beforeEach(function(done) {
                spyOn(minireel, 'moveToIndex').and.callThrough();
                minireel.on('init', done);

                appDataDeferred.fulfill({ experience: experience });
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

                appDataDeferred.fulfill({ experience: experience });
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

                appDataDeferred.fulfill({ experience: experience });
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

    describe('hooks:', function() {
        describe('didMove()', function() {
            let spy;

            beforeEach(function(done) {
                spy = jasmine.createSpy('spy()');
                minireel.on('init', () => {
                    minireel.deck.forEach(card => {
                        spyOn(card, 'activate').and.callThrough();
                        spyOn(card, 'deactivate').and.callThrough();
                        spyOn(card, 'prepare').and.callThrough();
                    });
                    spyOn(minireel.prerollCard, 'deactivate').and.callThrough();

                    minireel.currentCard = minireel.deck[2];
                    minireel.currentIndex = 2;
                    minireel.didMove();

                    done();
                });
                minireel.on('move', spy);

                appDataDeferred.fulfill({ experience: experience });
            });

            it('should emit the "move" event', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should call prepare() on the card after the currentCard', function() {
                expect(minireel.deck[0].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[1].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[2].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[3].prepare).toHaveBeenCalled();
                expect(minireel.deck[4].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[5].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[6].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[7].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[8].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[9].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[10].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[11].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[12].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[13].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[14].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[15].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[16].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[17].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[18].prepare).not.toHaveBeenCalled();
                expect(minireel.deck[19].prepare).not.toHaveBeenCalled();
            });

            describe('when moving to the last card', function() {
                beforeEach(function() {
                    minireel.currentIndex = 19;
                    minireel.currentCard = minireel.deck[19];
                });

                it('should not throw any errors', function() {
                    minireel.didMove();
                });
            });

            it('should call activate() on the active card and deactivate() on the non-active card', function() {
                expect(minireel.deck[0].deactivate).toHaveBeenCalled();
                expect(minireel.deck[0].activate).not.toHaveBeenCalled();

                expect(minireel.deck[1].deactivate).toHaveBeenCalled();
                expect(minireel.deck[1].activate).not.toHaveBeenCalled();

                expect(minireel.deck[2].activate).toHaveBeenCalled();
                expect(minireel.deck[2].deactivate).not.toHaveBeenCalled();

                expect(minireel.deck[3].deactivate).toHaveBeenCalled();
                expect(minireel.deck[3].activate).not.toHaveBeenCalled();

                expect(minireel.deck[4].deactivate).toHaveBeenCalled();
                expect(minireel.deck[4].activate).not.toHaveBeenCalled();

                expect(minireel.deck[5].deactivate).toHaveBeenCalled();
                expect(minireel.deck[5].activate).not.toHaveBeenCalled();

                expect(minireel.deck[6].deactivate).toHaveBeenCalled();
                expect(minireel.deck[6].activate).not.toHaveBeenCalled();

                expect(minireel.deck[7].deactivate).toHaveBeenCalled();
                expect(minireel.deck[7].activate).not.toHaveBeenCalled();

                expect(minireel.deck[8].deactivate).toHaveBeenCalled();
                expect(minireel.deck[8].activate).not.toHaveBeenCalled();

                expect(minireel.deck[9].deactivate).toHaveBeenCalled();
                expect(minireel.deck[9].activate).not.toHaveBeenCalled();

                expect(minireel.deck[10].deactivate).toHaveBeenCalled();
                expect(minireel.deck[10].activate).not.toHaveBeenCalled();

                expect(minireel.deck[11].deactivate).toHaveBeenCalled();
                expect(minireel.deck[11].activate).not.toHaveBeenCalled();

                expect(minireel.deck[12].deactivate).toHaveBeenCalled();
                expect(minireel.deck[12].activate).not.toHaveBeenCalled();

                expect(minireel.deck[13].deactivate).toHaveBeenCalled();
                expect(minireel.deck[13].activate).not.toHaveBeenCalled();

                expect(minireel.deck[14].deactivate).toHaveBeenCalled();
                expect(minireel.deck[14].activate).not.toHaveBeenCalled();

                expect(minireel.deck[15].deactivate).toHaveBeenCalled();
                expect(minireel.deck[15].activate).not.toHaveBeenCalled();

                expect(minireel.deck[16].deactivate).toHaveBeenCalled();
                expect(minireel.deck[16].activate).not.toHaveBeenCalled();

                expect(minireel.deck[17].deactivate).toHaveBeenCalled();
                expect(minireel.deck[17].activate).not.toHaveBeenCalled();

                expect(minireel.deck[18].deactivate).toHaveBeenCalled();
                expect(minireel.deck[18].activate).not.toHaveBeenCalled();

                expect(minireel.deck[19].deactivate).toHaveBeenCalled();
                expect(minireel.deck[19].activate).not.toHaveBeenCalled();
            });

            it('should call deactivate() on the prerollCard', function() {
                expect(minireel.prerollCard.deactivate).toHaveBeenCalled();
            });
        });
    });

    describe('when the session pings "show"', function() {
        beforeEach(function() {
            spyOn(minireel, 'moveToIndex');
            session.emit('show');
        });

        it('should start the minireel', function() {
            expect(minireel.moveToIndex).toHaveBeenCalledWith(0);
        });
    });

    describe('when the session pings "initAnalytics" with container != jumpramp', function() {
        let config;

        beforeEach(function() {
            config = { data: 'foo' };

            session.emit('initAnalytics', config);
        });

        it('should add the GoogleAnalytics and Moat Handlers', function() {
            expect(dispatcher.addClient).toHaveBeenCalledWith(GoogleAnalyticsHandler, minireel, config);
            expect(dispatcher.addClient).toHaveBeenCalledWith(MoatHandler, config);
            
            expect(dispatcher.addClient).not.toHaveBeenCalledWith(JumpRampHandler );
        });
    });

    describe('when the session pings "initAnalytics" with container == jumpramp', function() {
        let config;

        beforeEach(function() {
            config = { data: 'foo', container : 'jumpramp' };

            session.emit('initAnalytics', config);
        });

        it('should add the GoogleAnalytics, Moat and JumpRamp Handlers', function() {
            expect(dispatcher.addClient).toHaveBeenCalledWith(GoogleAnalyticsHandler, minireel, config);
            expect(dispatcher.addClient).toHaveBeenCalledWith(MoatHandler, config);
            
            expect(dispatcher.addClient).toHaveBeenCalledWith(JumpRampHandler );
        });
    });

    describe('when the appData is available', function() {
        let done;

        beforeEach(function(_done) {
            done = jasmine.createSpy('done()').and.callFake(_done);
            spyOn(adtech, 'setDefaults');

            minireel.on('init', done);

            appDataDeferred.fulfill({
                experience: experience,
                standalone: true
            });
        });

        it('should emit the "init" event', function() {
            expect(done).toHaveBeenCalled();
        });

        it('should copy the standalone property', function() {
            expect(minireel.standalone).toBe(true);
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

        it('should set the splash', function() {
            expect(minireel.splash).toBe(experience.data.collateral.splash);
        });

        it('should copy the adConfig', function() {
            expect(minireel.adConfig).toBe(experience.data.adConfig);
        });

        it('should copy the sponsor', function() {
            expect(minireel.sponsor).toBe(experience.data.params.sponsor);
        });

        it('should copy the logo', function() {
            expect(minireel.logo).toBe(experience.data.collateral.logo);
        });

        it('should copy the minireel\'s links', function() {
            expect(minireel.links).toBe(experience.data.links);
        });

        it('should generate an array of socialLinks from the links', function() {
            expect(minireel.socialLinks).toEqual([
                {
                    type: 'facebook',
                    label: 'Facebook',
                    href: experience.data.links.Facebook
                },
                {
                    type: 'twitter',
                    label: 'Twitter',
                    href: experience.data.links.Twitter
                },
                {
                    type: 'youtube',
                    label: 'YouTube',
                    href: experience.data.links.YouTube
                },
                {
                    type: 'vimeo',
                    label: 'Vimeo',
                    href: experience.data.links.Vimeo
                },
                {
                    type: 'pinterest',
                    label: 'Pinterest',
                    href: experience.data.links.Pinterest
                }
            ]);
        });

        describe('if something goes wrong', function() {
            let error;

            beforeEach(function(done) {
                error = jasmine.createSpy('error()');

                appDataDeferred = defer(RunnerPromise);
                cinema6.getAppData.and.returnValue(appDataDeferred.promise);

                minireel = new MiniReel();
                minireel.on('error', error);

                delete experience.data;

                appDataDeferred.fulfill({ experience, standalone: false });
                appDataDeferred.promise.then(() => {}).then(done);
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

        describe('if the experience has no adConfig', function() {
            beforeEach(function(done) {
                delete experience.data.adConfig;
                minireel = new MiniReel();
                minireel.on('init', done);
            });

            it('should create a default adConfig', function() {
                expect(minireel.adConfig).toEqual({
                    video: {
                        firstPlacement: 1,
                        frequency: 3,
                        waterfall: 'cinema6',
                        skip: 6
                    },
                    display: {
                        waterfall: 'cinema6'
                    }
                });
            });
        });

        it('should fill the deck with the cards', function() {
            expect(minireel.deck).toEqual([
                jasmine.any(TextCard),
                jasmine.any(AdUnitCard),
                jasmine.any(EmbeddedVideoCard),
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
                jasmine.any(VideoCard),
                jasmine.any(DisplayAdCard),
                jasmine.any(RecapCard)
            ]);
        });

        it('should make prerollCard a PrerollCard', function() {
            expect(minireel.prerollCard).toEqual(jasmine.any(PrerollCard));
        });

        it('should pass the minireel\'s autoplay and autoadvance properites to the video cards', function() {
            minireel.deck.filter(card => card instanceof VideoCard)
                .forEach(card => {
                    expect(card.data.autoplay).toBe(experience.data.autoplay);
                    expect(card.data.autoadvance).toBe(experience.data.autoadvance);
                });
        });

        it('should pass the minireel\'s splash property to the text cards', function() {
            minireel.deck.filter(card => card instanceof TextCard)
                .forEach(card => expect(card.thumbs).toEqual({
                    small: minireel.splash,
                    large: minireel.splash
                }));
        });

        it('should give the recap card a reference to itself', function() {
            expect(minireel.deck[minireel.deck.length - 1].data).toBe(minireel);
        });

        it('should set the length', function() {
            expect(minireel.length).toBe(20);
        });

        it('should set the adtech defaults', function() {
            expect(adtech.setDefaults).toHaveBeenCalledWith({
                network: experience.data.adServer.network,
                server: experience.data.adServer.server,
                kv: { mode: 'default' }
            });
        });

        describe('if the experience has a display waterfall configured', function() {
            beforeEach(function(done) {
                adtech.setDefaults.calls.reset();
                experience.data.adConfig.display.waterfall = 'cinema6';
                minireel = new MiniReel();
                minireel.on('init', done);
            });

            it('should set the kv.mode to the waterfall', function() {
                expect(adtech.setDefaults).toHaveBeenCalledWith(jasmine.objectContaining({
                    kv: { mode: 'cinema6' }
                }));
            });
        });
    });
});
