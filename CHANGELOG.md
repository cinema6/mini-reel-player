# MiniReel Player 2.0

* *[v0.12.0-rc1]*
  * [FIX]: Created Full Player template styles for better rendering inside tiny windows (smaller than 400px tall)


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
