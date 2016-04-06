# MiniReel Player 2.0

* *[v2.8.3-rc1]*
  * [FEATURE]: Click-tracking added to desktop-card buttons that hide/show a container and desktop-card/mobile-card sponsor name
  * [FIX]: More specific class added to the title in desktop-card and mobile-card so that Domino doesn't apply rules to the less-specific class.
  * [FEATURE]: Portrait/landscape sponsor logos supported in Light player
  * [FIX]: Share and Vimeo icon size fixed in IE for desktop-card
  * Support sending RC placement IDs to Moat

## v2.8.2 (April 4, 2016)
* *[v2.8.2-rc1]*
  * [FIX]: Fix for an issue where the Facebook player would disrupt focus on the page it was embedded in
* *[/v2.8.2-rc1]*

## v2.8.1 (April 1, 2016)
* *[v2.8.1-rc1]*
  * [FIX]: Fix for an issue that caused JS VPAID vast videos
    not to playback inline on iPhones
* *[/v2.8.1-rc1]*

## v2.8.0 (March 28, 2016)
* *[v2.8.0-rc3]*
  * [FIX]: Fix for an issue that caused YouTube videos not to load
  * [FIX]: Fix for an issue that caused HTML5 vast videos not to playback inline on iPhones
* *[/v2.8.0-rc3]*

* *[v2.8.0-rc2]*
  * [FIX]: Remove unnecessary unloading of Facebook player when playback ends
* *[/v2.8.0-rc2]*

* *[v2.8.0-rc1]*
  * Re-Enable Moat tracking for Vimeo videos
  * [FEATURE]: Added support for Facebook video cards
  * [FEATURE]: Landscape and portrait logos supported in desktop-card and mobile-card
  * [FIX]: Checkbox behind video is now hidden
* *[/v2.8.0-rc1]*

## v2.7.0 (March 11, 2016)
* *[v2.7.0-rc1]*
  * [FEATURE]: Add support for changing the autoplaying behavior of
    videos with the `autoplay` parameter
  * [FIX]: Disable Moat tracking for Vimeo videos as it is breaking
    analytics
* *[/v2.7.0-rc1]*

## v2.6.5 (March 9, 2016)
* *[v2.6.5-rc2]*
  * [FIX]: Border added around card.
* *[/v2.6.5-rc2]*

* *[v2.6.5-rc1]*
  * [FIX]: Ballot choice buttons have the right colors on hover, share modal optimized for smallest ad unit sizes, Button isn't jumping to top on hover
  * [REFACTOR]: Desktop-card redesigned to support Domino
* *[/v2.6.5-rc1]*

## v2.6.4 (March 7, 2016)
* *[v2.6.4-rc1]*
  * Updates to VPAID implementation to appease Genesis Media
* *[/v2.6.4-rc1]*

## v2.6.3 (March 7, 2016)
* *[v2.6.3-rc1]*
  * [FIX]: Fix for an issue that caused IAS JS VPAID to break
* *[/v2.6.3-rc1]*

## v2.6.2 (March 7, 2016)
* *[v2.6.2-rc1]*
  * [FIX]: Fix for an issue that caused old VPAID cards to break
* *[/v2.6.2-rc1]*

## v2.6.1 (March 3, 2016)
* *[v2.6.1-rc2]*
  * [FIX]: Make sure VAST cards don't autoplay in selfie
* *[/v2.6.1-rc2]*

* *[v2.6.1-rc1]*
  * [FIX]: Call to action button in mobile player landscape no longer in the lower right corner.Fix for user accidentally clicking CTA when looking for close button.
  * [REFACTOR]: Add VASTPlayer that can play VPAID and non-VPAID
    creatives
  * [FIX]: Fix for an issue that caused the mobile-card player to look
    broken if a VAST video was used
  * [FIX]: Make sure that VAST videos can always be resumed with a play
    button
* *[/v2.6.1-rc1]*

## v2.6.0 (February 25, 2016)
* *[v2.6.0-rc2]*
  * [FIX]: Fixed broken font in mobile-card
  * Add click tracking attribute to mobile, desktop and light player
* *[/v2.6.0-rc2]*

* *[v2.6.0-rc1]*
  * Added hidden link to track bot clicks
  * [FIX]: Fix for an issue that broke Slideshow Bob
  * [FIX]: Fix for an issue that broke voting
  * [FEATURE]: Add new single-card mobile player (`mobile-card`)
* *[/v2.6.0-rc1]*

## v2.5.0 (February 19, 2016)
* *[v2.5.0-rc1]*
  * Add support for generic ui interaction tracking event
  * Add support for tracking which UI elements are clicked
  * Add support for tracking screen and player dimensions
* *[/v2.5.0-rc1]*

## v2.4.11 (February 12, 2016)
* *[v2.4.11-rc2]*
  * [FIX]: Fix for an issue that broke landscape rendering in the mobile
    player
* *[/v2.4.11-rc2]*

* *[v2.4.11-rc1]*
  * [DESIGN]: Vimeo brand color updated in sprites.
  * [FIX]: Fixed website logo and sponsor link position issue on mobile player for landscape orientation in safari
  * [FIX]: Fix for an issue that caused the VPAID "AdVideoStart" event
    to be sent more than once
* *[/v2.4.11-rc1]*

## v2.4.10 (February 10, 2016)
* *[v2.4.10-rc1]*
  * [FIX]: Fix for an issue where the video player sometimes would not scale properly and show a scrollbar
* *[/v2.4.10-rc1]*

* *[v2.4.10-rc2]*
  * [FIX]: Fix for an issue where the video player would not scale properly and show a scrollbar
* *[/v2.4.10-rc2]*

## v2.4.9 (February 9, 2016)
* *[v2.4.9-rc1]*
  * [FIX]: Fix for an issue that caused social media links not to
    appear.
* *[/v2.4.9-rc1]*

## v2.4.8 (February 9, 2016)
* *[v2.4.8-rc1]*
  * [DESIGN]: Desktop-Card now supports 960x540 for preview page. All aspects of card design tweaked for all supported ad sizes.
  * [FIX]: Instance where logo does not load used to hide part of social media links. Links now display properly without logo.
  * Add support for creative optimization via [domino.css](https://github.com/cinema6/domino.css)
  * [FIX]: Fix for an issue that caused certain VPAID players not to be
    able to resume a paused VAST sponsored card
* *[/v2.4.8-rc1]*

## v2.4.7 (January 27, 2016)
* *[v2.4.7-rc1]*
  * [DESIGN]: Social media buttons for Desktop-Card changed to icon font with label. Width of video and social media bar changed to preserve aspect ratio of video.
  * [REFACTOR]: Remove legacy pixel-tracking code
  * [FIX]: Fix for an issue where launch/load pixels could be fired
    multiple times for a single session
* *[/v2.4.7-rc1]*

## v2.4.6 (January 26, 2016)
* *[v2.4.6-rc2]*
  * [FIX]: Improve the reliability of the task that verifies when the
    player has been deployed
* *[/v2.4.6-rc2]*

* *[v2.4.6-rc1]*
  * Support defining all tracking pixels on cards instead of experiences
* *[/v2.4.6-rc1]*

## v2.4.5 (January 20, 2016)
* *[v2.4.5-rc1]*
  * [DEV]: Use new player service for dev server
  * [PERFORMANCE]: Trim unsued code out dynamically based on the
    experience/card being presented
* *[/v2.4.5-rc1]*

## v2.4.4 (January 12, 2016)
* *[v2.4.4-rc1]*
  * Make it possible for the VPAID loader to know when a video starts
    playing
* *[/v2.4.4-rc1]*

## v2.4.3 (January 11, 2016)
* *[v2.4.3-rc1]*
  * [FIX]: Fix for an issue that allowed some Kaltura videos to autoplay when told not to
  * The VPAID "AdClickThru" event is only fired once per link type
  * Added support for the VPAID "AdRemainingTimeChange" event (for
    backwards-compatibility with VPAID 1.x.)
* *[/v2.4.3-rc1]*

## v2.4.2 (January 7, 2016)
* *[v2.4.2-rc2]*
  * [FIX]: Fix for an issue that caused the player not to load if a VAST
    video was used
* *[/v2.4.2-rc2]*

* *[v2.4.2-rc1]*
  * More preparations for building the player dynamically at runtime
* *[/v2.4.2-rc1]*

## v2.4.1 (January 5, 2016)
* *[v2.4.1-rc3]*
  * [FIX]: Fix for an issue that broke the player in IE
* *[/v2.4.1-rc3]*

* *[v2.4.1-rc2]*
  * [FIX]: Fix for an issue that caused deployments to fail
* *[/v2.4.1-rc2]*

* *[v2.4.1-rc1]*
  * [REFACTOR]: Clean-up the code the player uses to get its
    configuration options
  * [REFACTOR]: Clean-up the CSS Instagram code for full-np and lightbox. Overrides for global instagram styles are now in the instagram-card.css file in respective player css folder instead of [player-name]__global.css
  * [FIX]: Fix for an issue that caused the player to fetch images that
    do not exist
  * [FIX]: Media queries for desktop-card cleaned up and supports all necessary ad unit sizes.
* *[/v2.4.1-rc1]*

## v2.4.0 (December 23, 2015)
* *[v2.4.0-rc3]*
  * [FIX]: CSS styles for desktop-card CTA reverted to v2.3.4 with some minor adjustments
* *[/v2.4.0-rc3]*

* *[v2.4.0-rc2]*
  * [FIX]: Fix for an issue that would prevent some Kaltura videos from loading
* *[/v2.4.0-rc2]*

* *[v2.4.0-rc1]*
  * [FEATURE]: Add support for Kaltura videos
  * [FIX]: Media queries for desktop-card ad unit sizes smoother
  * [DEV]: Use different source-minifying tool
* *[/v2.4.0-rc1]*

## v2.3.4 (December 22, 2015)
* *[v2.3.4-rc1]*
  * [FIX]: Fix for an issue that caused social sharing windows not to
    open
* *[/v2.3.4-rc1]*

## v2.3.3 (December 22, 2015)
* *[v2.3.3-rc2]*
  * [FIX]: Fix for an issue that prevented Instagram videos from playing in an MRAID environment
* *[/v2.3.3-rc2]*

* *[v2.3.3-rc1]*
  * [FIX]: Ensure Instagram videos play inline in mobile apps
  * [FIX]: Ensure Brightcove videos play inline in mobile apps
  * [PERFORMANCE]: Always autoplay videos on desktop devices (based on
    user-agent)
* *[/v2.3.3-rc1]*

## v2.3.2 (December 18, 2015)
* *[v2.3.2-rc1]*
  * [DESIGN]: Added support for 750x426 player, updated icon sizes, CTA and border
  * [FIX]: Fix for an issue that made video controls always appear on
    YouTube players
* *[/v2.3.2-rc1]*

## v2.3.1 (December 18, 2015)
* *[v2.3.1-rc1]*
  * [FIX]: Fix for an issue that caused prebuffering to break video
    playback/event reporting
* *[/v2.3.1-rc1]*

## v2.3.0 (December 17, 2015)
* *[v2.3.0-rc1]*
  * Only play Wistia videos in standard definition when on mobile
  * Add support for purely numerical skip timer values (`0` for
    immediately skippable, `-1` for the entire duration of the video)
  * Always sync the skip countdown with the video duration
  * [FIX]: Fix for an issue that could cause a user to be stuck on a
    card with a countdown if the video never starts playing
* *[/v2.3.0-rc1]*

## v2.2.0 (December 15, 2015)
* *[v2.2.0-rc3]*
  * [FIX]: Design - fixed missing css issue for desktop-card player
* *[/v2.2.0-rc3]*

* *[v2.2.0-rc2]*
  * [FIX]: Fix for an issue that caused players embeded via c6embed to
    break
* *[/v2.2.0-rc2]*

* *[v2.2.0-rc1]*
  * [FEATURE]: Add support for Brightcove videos
  * [FEATURE]: Add support for tracking a video buffering
  * [FEATURE]: Add support for tracking a delay with every event type
  * [REFACTOR]: Clean up the code used to communicate outside of the
    player `<iframe>`.
  * Only fire tracking pixels a single time
* *[/v2.2.0-rc1]*

## v2.1.3 (December 9, 2015)
* *[v2.1.3-rc2]*
  * [FIX]: Make sure errors don't occur when a YouTube video plays,
    pauses or ends
* *[/v2.1.3-rc2]*

* *[v2.1.3-rc1]*
  * [PERFORMANCE]: Add hacks to force `<iframe>` players to buffer by
    setting `prebuffer` to `true`
* *[/v2.1.3-rc1]*

## v2.1.2 (December 7, 2015)
* *[v2.1.2-rc1]*
  * [PERFORMANCE]: Allow videos to be preloaded when running as an MRAID
    unit
* *[/v2.1.2-rc1]*

## v2.1.1 (December 4, 2015)
* *[v2.1.1-rc1]*
  * [FIX]: Small tweak made in an attempt to improve the play rate of
    YouTube videos delivered via MRAID
* *[/v2.1.1-rc1]*

## v2.1.0 (December 3, 2015)
* *[v2.1.0-rc2]*
  * [FIX]: Fix for an issue that caused campfire video play pixels not
    to be fired in an MRAID context
* *[/v2.1.0-rc2]*

* *[v2.1.0-rc1]*
  * [FEATURE]: Add support for video cards with a video URL
  * [DEPRECATION]: Remove unused styles for deprecated players and features
* *[/v2.1.0-rc1]*

## v2.0.0 (December 1, 2015)
* *[v2.0.0-rc3]*
  * [FIX]: Restore IE 10 compatibility
* *[/v2.0.0-rc3]*

* *[v2.0.0-rc2]*
  * [FIX]: Fix for an issue that caused some icons not to render when
    the player service is used
  * [FIX]: Fix for an issue that caused social link tracking pixels to
    be fired twice
* *[/v2.0.0-rc2]*

* *[v2.0.0-rc1]*
  * Update the HtmlVideo player to be consistent with the behavior of newer players
  * Update the Wistia player to be consistent with the behavior of newer players
  * Update the Vzaar player to be consistent with the behavior of newer players
  * Update the Vine player to be consistent with the behavior of newer players
  * [FIX]: Fixed bug where bg of social media links container appears when there are no social links.
  * [FIX]: Fixed buggy spacing in single mobile player around share and social links. Adjusted spacing around CTA and description.
  * [FEATURE]: Design for single sponsored desktop-card updated for 430x251, 800x450, 800x600 and 900x500. Social and share icons are now SVGs.
  * [FIX]: Fix for an issue that caused certain icons not to render in
    Firefox or IE
  * [FIX]: Fix for an issue that caused social links not to render on IE
  * [DEV]: Update [Babel](http://babeljs.io/) to v6.x.x.
  * [DEPRECATION]: Remove the lightbox with playlist player
  * [DEPRECATION]: Remove the full-page with playlist player
  * [DEPRECATION]: Remove the full-page, single-card with display ads
    player
  * [DEPRECATION]: Remove the mobile swiping player
  * [DEPRECATION]: Remove support for display ads
  * [DEPRECATION]: Remove support for ballots where the results are
    shown to the user
  * [DEPRECATION]: Remove support for preroll (in-between card)
    advertising
  * [DEPRECATION]: Remove support for text-only cards
  * [DEPRECATION]: Remove support for website (article) cards
  * [DEPRECATION]: Remove support for videos from rumble.com
  * [DEPRECATION]: Remove support for videos from AOL On
  * [DEPRECATION]: Remove support for videos from Yahoo! Screen
  * [FEATURE]: Support tracking share link clicks
* *[/v2.0.0-rc1]*

## v1.5.0 (November 20, 2015)
* *[v1.5.0-rc2]*
  * [FIX]: Fixed the css to show border on customer logo in mobile and light player
* *[/v1.5.0-rc2]*

* *[v1.5.0-rc1]*
  * [FEATURE]: Design for single mobile card updated. Tile branding rearranged and social media icons isolated.
  * [FIX]: Fixed the css to show border on customer logo in lightbox player
* *[/v1.5.0-rc1]*

## v1.4.0 (November 19, 2015)
* *[v1.4.0-rc3]*
  * [FIX]: Fix for an issue where some JWPlayer videos would fail to load
* *[/v1.4.0-rc3]*

* *[v1.4.0-rc2]*
  * [FIX]: Fix for an issue where the host page is not visible
    underneath a lightbox player.
  * [FIX]: Fix for an issue where a black box was visible at the top of
    the desktop card player if in standalone mode.
* *[/v1.4.0-rc2]*

* *[v1.4.0-rc1]*
  * [FEATURE]: Added support for Vidyard video cards
  * [FIX]: Fix for an issue where rapidly switching away from a loading JWPlayer would not pause it
  * [FEATURE]: Add support for lightboxes without close buttons
  * Added support for new card resizing logic (based on copy character
    count.)
  * [FIX]: Remove whitespace from sponsored video card
    (light/desktop-card) if there is no call-to-action.
* *[/v1.4.0-rc1]*

## v1.3.0 (November 12, 2015)
* *[v1.3.0-rc3]*
  * [FIX]: Fix for an issue that caused the JWPlayer not to load in non-autoplaying cards
  * [FIX]: Fix for an issue that caused fixed width JWPlayers to be cut off or appear too small
* *[/v1.3.0-rc3]*

* *[v1.3.0-rc2]*
  * [FIX]: Fix for an issue that caused the JWPlayer not to load in a
    single-card player
  * [FIX]: Fix for an issue that caused the JWPlayer to be cut off or
    appear too small
* *[/v1.3.0-rc2]*

* *[v1.3.0-rc1]*
  * [FEATURE]: Added support for JWPlayer video cards
* *[/v1.3.0-rc1]*

## v1.2.3 (November 11, 2015)
* *[v1.2.3-rc1]*
  * [FIX]: CSS positioning bug fix for ads with less content on desktop-card
  * [FIX]: Updated CTA width for single card mobile portrait layout to optimize
    preview on selfie and smaller mobile screens
* *[/v1.2.3-rc1]*

## v1.2.2 (November 5, 2015)
* *[v1.2.2-rc1]*
  * [FIX]: CSS Transition caused animation on description area of desktop-card
  	to malfunction on hover in Safari browser only
  * [FIX]: Fix for an issue that caused YouTube video metadata not to be
    loaded
* *[/v1.2.2-rc1]*

## v1.2.1 (November 2, 2015)
* *[v1.2.1-rc1]*
  * [FIX]: Loading a player service URL directly into the browser no
    longer causes a "Close" button to appear
  * [FIX]: Fix for an issue where the close button appeared when it
    should not in the desktop player (if the video had no skip control)
  * [FIX]: Fix for an issue that caused the player to render incorrectly
    on mobile if loaded via the player service
* *[/v1.2.1-rc1]*

## v1.2.0 (October 29, 2015)
* *[v1.2.0-rc2]*
  * Support MRAID over https
* *[/v1.2.0-rc2]*

* *[v1.2.0-rc1]*
  * [FEATURE]: Added new `desktop-card` player for use in VPAID, with Q1
    media, etc.
* *[/v1.2.0-rc1]*

## v1.1.1 (October 29, 2015)
* *[v1.1.1-rc1]*
  * [PERFORMACE]: Only load branding stylesheets if the player was not
    loaded by the player service
  * [FIX]: Fixed the css issue causing the line break on sponsored links in light player
  * [DEPRECATION]: Remove some useless google analytics metrics
* *[/v1.1.1-rc1]*

## v1.1.0 (October 26, 2015)
* *[v1.1.0-rc1]*
  * [FEATURE]: Add support for VPAID 2.0
* *[/v1.1.0-rc1]*

## v1.0.0 (October 14, 2015)
* *[v1.0.0-rc2]*
  * [PERFORMANCE]: Replace GSAP animation library with moti.js CSS
    animation library
* *[/v1.0.0-rc2]*

* *[v1.0.0-rc1]*
  * Add support for bootstrapping via the player service
  * Add support for sending performance timings when firing tracking
    pixels
  * **Note**: `v2.40.0` of [cinema6/c6embed](https://github.com/cinema6/c6embed) must be deployed first
* *[/v1.0.0-rc1]*

## v0.28.0 (September 29, 2015)
* *[v0.28.0-rc1]*
  * [FEATURE]: Added support for Wistia video cards
* *[/v0.28.0-rc1]*

## v0.27.1 (September 25, 2015)
* *[v0.27.1-rc3]*
  * [FIX]: Fix for an issue which caused a YouTube player to get into an unplayable state on mobile.
  * [FIX]: Fix for an issue which caused the post-video action buttons to be displayed incorrectly.
* *[/v0.27.1-rc3]*

* *[v0.27.1-rc2]*
  * [FIX]: Hiding the single card close button when share modal is open to avoid showing 2 close buttons
  * [FIX]: Hiding the single card close button for ballot modal
* *[/v0.27.1-rc2]*

* *[v0.27.1-rc1]*
  * [FIX]: Fixed the share button rendering issue on mac
  * [FIX]: Made close button smaller for mobile single card
  * [FIX]: Fixed the padding issue on title for single card with close button
* *[/v0.27.1-rc1]*

## v0.27.0 (September 21, 2015)
* *[v0.27.0-rc1]*
  * [FIX]: Fix for an issue that caused card load pixels not to be
    fired
  * [FEATURE]: Fire new pixels to Cinema6 when a card is viewed
  * [FEATURE]: Add ability to specify how long it took for a video to
    start playing when firing pixels to Cinema6
  * Renamed some pixel names to make it more clear when they are being
    fired
* *[/v0.27.0-rc1]*

## v0.26.1 (September 18, 2015)
* *[v0.26.1-rc1]*
  * [FIX]: Fixed styles to hide sponsored text on full video only card in lightbox
  * [FIX]: Fixed issue with Instagram icon on all web players
  * [FIX]: Updated close button styles to look like mraid standard (round button without label)
* *[/v0.26.1-rc1]*

## v0.26.0 (September 16, 2015)
* *[v0.26.0-rc1]*
  * [FEATURE]: Added support for Vzaar video cards
  * [FEATURE]: Added support for full width video only single card
  * Add support for firing billing pixels to Cinema6 servers
* *[/v0.26.0-rc1]*

## v0.25.0 (September 10, 2015)
* *[v0.25.0-rc3]*
  * [FIX]: Fix for an issue causing modal share buttons on mobile devices to not work
* *[/v0.25.0-rc3]*

* *[v0.25.0-rc2]*
  * [FIX]: Corrected issue with social share buttons displaying incorrectly
  * [FIX]: Fix for an issue with the close button on the share modal displaying incorrectly on mobile devices
* *[/v0.25.0-rc2]*

* *[v0.25.0-rc1]*
  * [FIX]: Fixed survey modal positioning bug
  * [FEATURE]: Added social sharing to Facebook, Twitter, or Pinterest from sponsored cards.
  * [FEATURE]: Support notifying third parties when a video ends
* *[/v0.25.0-rc1]*

## v0.24.0 (August 31, 2015)
* *[v0.24.0-rc4]*
  * [FIX]: Fixed sponsor card iOS scroll issue
  * [DEV]: Fix an issue with the dev server
* *[/v0.24.0-rc4]*

* *[v0.24.0-rc3]*
  * [FIX]: Fixed sponsor card android scroll issue
* *[/v0.24.0-rc3]*

* *[v0.24.0-rc2]*
  * [DEV]: Added the ability to load an experience from staging
  * [FIX]: Fixed sponsor link and logo display issue
  * [FIX]: Fixed video thumbnail background color issue
* *[/v0.24.0-rc2]*

* *[v0.24.0-rc1]*
  * [FEATURE]: Added the ability to include an Instagram link on sponsored cards.
  * [FEATURE]: Improved design of mobile player in landscape orientation
* *[/v0.24.0-rc1]*

## v0.23.2 (August 28, 2015)
* *[v0.23.2-rc1]*
  * [FIX]: Fix for an issue that caused social media icons in the embedded player to render incorrectly
* *[/v0.23.2-rc1]*

## v0.23.1 (August 28, 2015)
* *[v0.23.1-rc1]*
  * [FIX]: Fix for an issue that caused players with title-less cards and playlists (full, lightbox-playlist) to crash
* *[/v0.23.1-rc1]*

## v0.23.0 (August 24, 2015)
* *[v0.23.0-rc3]*
  * [FIX]: Make the recap card truncate extremely long card titles
  * [FIX]: Fix for an issue that caused an Instagram username to sometimes be displayed incorrectly in the full player.
* *[/v0.23.0-rc3]*

* *[v0.23.0-rc2]*
  * [FIX]: Fixes for Instagram cards based on how they are now saved in the studio.
* *[/v0.23.0-rc2]*

* *[v0.23.0-rc1]*
  * [FEATURE]: Use our own design for mobile Instagram cards rather than Instagram's
  * [FEATURE]: Added support for sponsored Instagram image and video cards
* *[/v0.23.0-rc1]*

## v0.22.0 (August 12, 2015)
* *[v0.22.0-rc4]*
  * [FIX]: Make the playlist truncate extremely long card titles
  * [FIX]: Fix for an issue that was preventing some Instagram usernames from being correctly formatted
  * [FIX]: Fix for an issue that caused images in the player not to
    appear
* *[/v0.22.0-rc4]*

* *[v0.22.0-rc3]*
  * [FIX]: Fix for an issue that prevented skipping to an Instagram card with autoplay
  * [FIX]: Fix for an issue that was preventing the Instagram logo from displaying correctly
  * [FIX]: Fix for an issue that caused some Instagram usernames in a card's
    caption to not be properly recognized.
  * [FIX]: Fix for an issue that caused mobile instagram cards to never
    render
* *[/v0.22.0-rc3]*

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

## v0.21.8 (August 17, 2015)
* *[v0.21.8-rc1]*
  * [FIX]: Improve compatibility with TubeMogul
* *[/v0.21.8-rc1]*

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
