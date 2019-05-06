module.exports.usage = () => {
  console.log(
      `
Usage:

vivoh-media-relay

OPTIONAL:

-p port of local web server ... eg "8888"
-i IP address to bind to.
-d temporary directory for TS files
-v use VLC as segmenter (default)
-f use Ffmpeg as segmenter
`
  );
};

