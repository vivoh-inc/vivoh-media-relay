

module.exports.getAddress= (req) => {
  if ( !req || Object.keys(req).length == 0 ) {
    return undefined;
  }

  const address = req.query.s;

  if (!address) {
    // retrieve from the path.

  }

  return address;
};

module.exports.getAppAndStreamFromAddress = (address) => {
  if (!address) {
    return undefined;
  }

  // If there is a parameter at the end (like ?pkt_size=1316),
  // strip all that off.
  let stripped = address;
  let parameterPointer = -1;
  if ( -1 !== ( parameterPointer = address.indexOf( '?') ) ) {
    stripped = address.substring(0, parameterPointer);
  }

  const tuple = stripped.split( ':' );

  if ( tuple.length != 3 ) {
    return undefined;
  } else {
    // convert to underscores, etc.
    const app = tuple[0];

    const ip = tuple[1];
    const port = tuple[2];

    const convertedIp = ip.replace(/\./g, '_').replace('//', '');
    const stream = `${convertedIp}__${port}`;

    return {app, stream};
  }
};
