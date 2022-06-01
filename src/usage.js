module.exports.usage = () => {
  console.log(
      `
Usage:

vivoh-media-relay

OPTIONAL:

-p port of local web server ... eg "8888"
-i IP address to bind to.
-e use HTTPS (self generated certs, or provide your own)
`
  );
};

