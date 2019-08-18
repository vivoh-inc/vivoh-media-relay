module.exports.getAddress = (url) => {
  const index = url.indexOf('s=') + 2;
  if (index) {
    return url.substr(index);
  }
  return undefined;
};

module.exports.convertPathToAddress = (path) => {
  const [protocol, ip, port] = path.split('__');
  if (protocol && ip && port) {
    const convertedIp = ip.replace(/_/g, '.');
    return `${protocol}://${convertedIp}:${port}`;
  }
  return undefined;
};
