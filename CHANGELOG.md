# MiniReel Player 2.0

## v0.22.0 (August 12, 2015)
* *[v0.22.0-rc2]*
  * [FIX]: Fix for an issue that caused mobile Instagram videos to continue playing
    after the user has moved on to another card
  * [FIX]: Fix for an issue that caused Instagram cards to be displayed improperly
    on the recap card
  * [DEV]: Fix a unit test that was failing occasionally
* *[/v0.22.0-rc2]*

* *[v0.22.0-rc1]*
  * [FEATURE]: Added support for Instagram image and video cards
* *[/v0.22.0-rc1]*

## v0.21.7 (August 11, 2015)
* *[v0.21.7-rc1]*
  * [FIX]: Hide "Close" button in mobile player when running through
    solo player
  * [FIX]: Preload cards that are interrupted by preroll advertising
  * [FIX]: Stop preroll from being able to interrupt the closing of a
    MiniReel
* *[/v0.21.7-rc1]*

## v0.21.6 (August 11, 2015)
* *[v0.21.6-rc1]*
  * [FIX]: Fix for an issue that caused videos to continue player after
    the user closes the player via the MRAID close button
* *[/v0.21.6-rc1]*

## v0.21.5 (August 10, 2015)
* *[v0.21.5-rc1]*
  * [FIX]: Fix for an issue that caused GA tracking not to work in MRAID
* *[/v0.21.5-rc1]*

## v0.21.4 (August 10, 2015)
* *[v0.21.4-rc1]*
  * [FIX]: Fix for an issue that caused TubeMogul's VPAID player to
    never autoadvance/break the skip timer
  * Stop re-loading VPAID units when they end
* *[/v0.21.4-rc1]*

## v0.21.3 (August 7, 2015)
* *[v0.21.3-rc1]*
  * Updated VPAID swf
  * Attempt to send "Played" GA event when the user closes the page the
    player is running on
* *[/v0.21.3-rc1]*

## v0.21.2 (August 5, 2015)
* *[v0.21.2-rc1]*
  * Added new "Played" video event ([#183](https://github.com/cinema6/mini-reel-player/issues/183))
  * [FIX]: Fixed text overlap bug of long titles in single card MiniReels ([#187](https://github.com/cinema6/mini-reel-player/issues/187))
* *[/v0.21.2-rc1]*

## v0.21.1 (August 4, 2015)
* *[v0.21.1-rc2]*
  * [FIX]: Fixed bug where ballot wasn't hidden for next video in mobile.
* *[/v0.21.1-rc2]*

* *[v0.21.1-rc1]*
  * [DEV]: Greatly improve the time it takes to start ```grunt
    server```.
  * Modularize CSS for every player view except for swipe player.
  * Stop including query params when completing pageUrl macro
  * Hide the close button if the MiniReel is not skippable and it is
    running as an interstitial
  * [DEV]: Allow a subset of tests to be run with ```grunt tdd``` via
    the ```--only``` option.
* *[/v0.21.1-rc1]*

## v0.21.0 (July 30, 2015)
* *[v0.21.0-rc1]*
  * [FEATURE]: Added support for Vine video cards
  * [DEV]: Fix issue where tests would run multiple times/not "pick up"
    file changes when running ```grunt tdd```.
* *[/v0.21.0-rc1]*

## v0.20.0 (July 29, 2015)
* *[v0.20.0-rc1]*
  * [FIX]: Remove prev/next buttons that hover over the video in a
    single-video lightbox MiniReel
  * [FEATURE]: Allow video preloading to be disabled via MiniReel
    configuration
  * [FIX]: Fix for an issue that caused the solo-ads player to render
    <iframe> players correctly
  * [FEATURE]: Add fade-in animations for all video players after load
  * [FIX]: Fix for an issue that caused Vimeo, Rumble, Dailymotion and
    display ads not to work when the player is delivered via MRAID
* *[/v0.20.0-rc1]*

## v0.19.0 (July 16, 2015)
* *[v0.19.0-rc2]*
  * [FIX]: Fix for an issue which caused the source link to be displayed for a web image in the
    mobile player.
* *[/v0.19.0-rc2]*

* *[v0.19.0-rc1]*
  * [FEATURE]: Added support for image cards created from any web image url
  * Change the Image source links to point to the page of the image
  * Always show Image source links on mobile
  * [FEATURE]: Add support for single-video MiniReels to the light and
    lightbox players
* *[/v0.19.0-rc1]*

## v0.18.0 (July 13, 2015)
* *[v0.18.0-rc1]*
  * Stop sending dimensions to GA that we don't use
  * Send origin of all parent iframes (when possible) to GA
* *[/v0.18.0-rc1]*

## v0.17.0 (July 8, 2015)
* *[v0.17.0-rc4]*
  * [FEATURE]: Added support for webpage cards in the embedded player
* *[/v0.17.0-rc4]*

* *[v0.17.0-rc3]*
  * [FIX]: Fix for an issue where the embedded player would try to display an article card.
* *[/v0.17.0-rc3]*

* *[v0.17.0-rc2]*
  * [FIX]: Fix for an issue that caused an image card not to be rendered
* *[/v0.17.0-rc2]*

* *[v0.17.0-rc1]*
  * [FEATURE]: Added support for webpage cards
  * [FEATURE]: Added support for GettyImages image cards
  * [FEATURE]: Added support for Flickr image cards
  * [DEV]: Add YUIDoc documentation for the core MRPCL classes
* *[/v0.17.0-rc1]*

## v0.16.1 (July 2, 2015)
* *[v0.16.1-rc2]*
  * [FIX]: Allow the first mobile embed video to be autoplayed if the
    MiniReel is closed and reopened
* *[/v0.16.1-rc2]*

* *[v0.16.1-rc1]*
  * [FIX]: Allow MiniReel to be closed even if the current card is not
    skippable
  * Skip timer will be appear again after the MiniReel is closed
  * [FIX]: Fix for an issue that caused embedded MiniReels not to
    autoplay on mobile
* *[/v0.16.1-rc1]*

## v0.16.0 (June 24, 2015)
* *[v0.16.0-rc2]*
  * [FIX]: Fix for an issue that caused unnecessary data to get into the
    data warehouse
* *[/v0.16.0-rc2]*

* *[v0.16.0-rc1]*
  * [FIX]: Fix for an issue that caused videos to continue to play
    after the lightbox player was closed
  * [FEATURE]: Add basic support for A/B testing
* *[/v0.16.0-rc1]*

## v0.15.1 (June 25, 2015)
* *[v0.15.1-rc1]*
  * [FIX]: Fix for issues that caused the IAS VPAID player to not work
* *[/v0.15.1-rc1]*

## v0.15.0 (June 3, 2015)
* *[v0.15.0-rc3]*
  * [FIX]: Fix for an issue that caused the skip timer on preroll to
    only appear the first time preroll is shown
  * [FIX]: Fix for an issue that made it impossible to dismiss a preroll
    card if it appeared before the last card
  * [FIX]: Fix for an issue that caused the cards in the MiniReel to
    sometimes not move when swiped
  * [FIX]: Enable the close button on a non-standalone MiniReel
* *[/v0.15.0-rc3]*

* *[v0.15.0-rc2]*
  * [FIX]: Fix for an issue that caused the swipe player not to enter
    fullscreen mode when embedded
* *[/v0.15.0-rc2]*

* *[v0.15.0-rc1]*
  * [FEATURE]: Add new mobile player with swipe gestures
* *[/v0.15.0-rc1]*

## v0.14.2 (June 2, 2015)
* *[v0.14.2-rc1]*
  * [FIX]: Fix for an issue that caused social meda links to not appear
    on sponsored cards/MiniReels
* *[/v0.14.2-rc1]*

## v0.14.1 (June 1, 2015)
* *[v0.14.1-rc1]*
  * Stop sending complete event to JumpRamp for sponsored videos
* *[/v0.14.1-rc1]*

## v0.14.0 (May 28, 2015)
* *[v0.14.0-rc2]*
  * [FIX]: Fix an issue that caused the skip timer in the thumbnail
    navigation widget to stay visible if a preroll card was skipped
    without being shown
* *[/v0.14.0-rc2]*

* *[v0.14.0-rc1]*
  * [FIX]: Try to improve autoplay attempt => success rate for iframe
    players
  * Send new messages to JumpRamp when videos are completed
  * [FEATURE]: Add new full-page player with no playlist on the side
* *[/v0.14.0-rc1]*

## v0.13.0 (May 15, 2015)
* *[v0.13.0-rc3]*
  * [FIX]: Fix for an issue that caused the YouTube player controls to
    always appear (even if set not to)
* *[/v0.13.0-rc3]*

* *[v0.13.0-rc2]*
  * [FIX]: Fix for an issue that caused ballots not to appear when a
    YouTube video ends
  * [FIX]: Fix for an issue that caused YouTube videos with a start time
    to enter an inifite loop of the first second of video
  * [FIX]: Fix for an issue that could cause YouTube videos that must be
    watched in their entirety to never auto-advance
  * [FIX]: Fix for an issue that caused the skip timer to display "Skip
    in {{remaining}}" before counting down
* *[/v0.13.0-rc2]*

* *[v0.13.0-rc1]*
  * [FIX]: Fix for an issues that caused VAST videos not to autoplay on
    mobile when they should
  * [FEATURE]: Emit player events via window.postMessage()
* *[/v0.13.0-rc1]*

## v0.12.3 (May 14, 2015)
* *[v0.12.3-rc1]*
  * [FIX]: Fix for an issue that caused the player not to load in IE <
    10
* *[/v0.12.3-rc1]*

## v0.12.2 (May 13, 2015)
* *[v0.12.2-rc1]*
  * [FIX]: Fix for an issue that caused text to appear squished on a
    sponsored card if there was no call to action
* *[/v0.12.2-rc1]*

## v0.12.1 (May 13, 2015)
* *[v0.12.1-rc1]*
  * [FIX]: Updated Full Player template tiny windows code to expand min-height
    requirements from 400px to 500px tall
* *[/v0.12.1-rc1]*

## v0.12.0 (May 13, 2015)
* *[v0.12.0-rc1]*
  * [FIX]: Created Full Player template styles for better rendering inside tiny windows (smaller than 400px tall)
* *[/v0.12.0-rc1]*

## v0.11.0 (May 8, 2015)
* *[v0.11.0-rc2]*
  * [FIX]: Fix for an issue that could cause tracking pixels to be fired
    without cachebusting
  * [FEATURE]: Add support for firing tracking pixels when the MiniReel
    is launched
* *[/v0.11.0-rc2]*

* *[v0.11.0-rc1]*
  * [FEATURE]: Add support for MiniReel studio preview modal
  * [FEATURE]: Add support for autoplaying VAST videos in the first card
    slot on mobile
  * [FIX]: Fix for an issue where the mobile player header bar printed
    "1 of x" instead of "Ad"
  * [FIX]: Fix for an issue that caused the VPAID player to never load
* *[/v0.11.0-rc1]*

## v0.10.0 (May 5, 2015)
* *[v0.10.0-rc2]*
  * [FIX]: Remove unnecessary UI elements from mobile player when
    showing a single-video MiniReel
* *[/v0.10.0-rc2]*

* *[v0.10.0-rc1]*
  * [FIX]: For mobile landscape player, fixed a bug where the ad countdown timer would render on top of the close button
  * [HACK]: Hack in support for an auto-generated sponsored card
    slideshow
* *[/v0.10.0-rc1]*

## v0.9.0 (April 30, 2015)
* *[v0.9.0-rc3]*
  * [FEATURE]: Support inline playback for YouTube videos when the
    player is in a UIWebView
  * [FEATURE]: Support inline playback for Dailymotion videos when
    the player is in a UIWebView
  * [FIX]: Fix for an issue that could cause ADTECH ad tags not to load
    on the Android Browser
* *[/v0.9.0-rc3]*

* *[v0.9.0-rc2]*
  * Make mysterious VAST XHR failures errors include the URL trying to
    be loaded
* *[/v0.9.0-rc2]*

* *[v0.9.0-rc1]*
  * [FEATURE]: Add support for single-video MiniReel player
  * [FEATURE]: Add support for single-video with display ad MiniReel
    player
  * [FIX]: For an issue that caused VAST error messages not to be sent
    to GA
  * [FEATURE]: Add support for VPAID ad units
  * Skip preroll ads if they take more than three seconds to start
    playing
* *[/v0.9.0-rc1]*

## v0.8.0 (April 28, 2015)
* *[v0.8.0-rc1]*
  * [FEATURE]: Add support for VAST preroll advertising
  * [FEATURE]: Add support for display ad cards
  * [FEATURE]: Add support for branding (custom styles)
  * [FIX]: Fix for an issue that caused GA AutoPlayAttempts to be
    under-reported
* *[/v0.8.0-rc1]*

## v0.7.1 (April 24, 2015)
* *[v0.7.1-rc1]*
  * [FIX]: Fix for an issue that caused VAST videos to playback on iOS
    in fullscreen mode when running in a web view (like Jun)
* *[/v0.7.1-rc1]*

## v0.7.0 (April 21, 2015)
* *[v0.7.0-rc1]*
  * [FEATURE]: Add support for questionnaires on non-sponsored cards
  * [FEATURE]: Add support for Dailymotion videos
  * [FEATURE]: Added GA timer to report the time it takes to bootstrap
    the player's JavaScript
  * [FEATURE]: Added support for AOL and Yahoo! videos
  * [DEV]: Fix broken source maps in production/staging
  * [FEATURE]: Add support for Rumble.com videos
  * [FIX]: Fix for an issue that could cause a MiniReel viewing session
    to count as a bounce even if the minViewTime of a sponsored card in
    that MiniReel was reached
* *[/v0.7.0-rc1]*

## v0.6.0 (April 14, 2015)
* *[v0.6.0-rc1]*
  * [FEATURE]: Add additional error reporting
  * [PERFORMANCE]: Add features to MiniReel Player Core Library that
    help prevent doing unnecessary DOM updates
  * Reorganized code surrounding the display ad and post modules
  * [FEATURE]: Added GA timer to report the time it takes to bootstrap
    the player
* *[/v0.6.0-rc1]*

## v0.5.0 (April 10, 2015)
* *[v0.5.0-rc2]*
  * [FIX]: Fix for an issue that only caused autoadvance to work in the
    mobile player
* *[/v0.5.0-rc2]*

* *[v0.5.0-rc1]*
  * [FEATURE]: Add support for sponsored MiniReels
  * [FEATURE]: Add support for lightbox-playlist player
  * [FIX]: Add support for muting of videos and reporting to Moat.
  * [FEATURE]: Add support for lightbox player
  * [FEATURE]: Add support for light player
* *[/v0.5.0-rc1]*

## v0.4.1 (April 6, 2015)
* *[v0.4.1-rc1]*
  * [FIX]: Fix for an issue that caused the player not to load in
    Internet Explorer
* *[/v0.4.1-rc1]*

## v0.4.0 (April 2, 2015)
* *[v0.4.0-rc2]*
  * [FIX]: Full player: Fix for an issue that caused cards without
    descriptions not to appear
  * [FIX]: Fix for an issue that could cause a video to never start
    autoplaying
* *[/v0.4.0-rc2]*

* *[v0.4.0-rc1]*
  * [FEATURE]: Add standalone player
* *[/v0.4.0-rc1]*

## v0.3.0 (March 31, 2015)
* *[v0.3.0-rc1]*
  * [FEATURE]: JumpRamp handler
* *[/v0.3.0-rc1]*

## v0.2.1 (March 30, 2015)
* *[v0.2.1-rc2]*
  * [FIX]: Fix for an issue that caused quartile events not to be sent
    to Google Analytics on YouTube videos without a custom end time
* *[/v0.2.1-rc2]*

* *[v0.2.1-rc1]*
  * [FIX]: Fix for an issue that could cause play timeout errors to be
    sent to Google Analytics on a device that can't autoplay
  * [FIX]: Fix improper Quartile event names sent to Google Analytics
* *[/v0.2.1-rc1]*

## v0.2.0 (March 25, 2015)
* *[v0.2.0-rc5]*
  * [FEATURE]: Add support for video start/end times
  * [FIX]: Fix for an issue that caused the VimeoPlayer to crash when
    its end time was reached
* *[/v0.2.0-rc5]*

* *[v0.2.0-rc4]*
  * [FIX]: Fix for an issue that caused YouTube videos set to autoplay
    to load during animations
  * [DEV]: Add ability to see and debug uncompressed ES2015 code in
    production
* *[v0.2.0-rc4]*

* *[v0.2.0-rc3]*
  * [FIX]: Fix for an issue that caused an advertiser's name not to be
    sent to Moat
* *[v0.2.0-rc3]*

* *[v0.2.0-rc2]*
  * [FIX]: Fix for an issue that could cause a video not to be visible
  * [PERFORMANCE]: Allow Chrome to download and parse the player's code
    at the same time
* *[/v0.2.0-rc2]*

* *[v0.2.0-rc1]*
  * [FEATURE]: Added support for text cards
  * [FEATURE]: Added support for VAST videos
  * [FEATURE]: Added support for displaying sponsor branding on a
    sponsored card
  * [FEATURE]: Added support for firing billing pixels to ADTECH
  * [FEATURE]: Added support for Google Analytics tracking
  * [FEATURE]: Added support for showing display ads after a sponsored
    card
  * [FEATURE]: Added support for vimeo videos
  * [FEATURE]: Added support for the post-video module (watch again,
    visit sponsor site, vote)
  * [FEATURE]: Added ability for disabling MiniReel navigation until
    after a countdown
* *[/v0.2.0-rc1]*

## v0.1.0 (March 2, 2015)
* *[v0.1.0-rc1]*
  * [FEATURE]: Added ability to navigate between cards
  * [FEATURE]: Added support for video cards
  * [FEATURE]: Added support for YouTube videos
  * [FEATURE]: Added ability to auto-advance after a video completes
* *[/v0.1.0-rc1]*
