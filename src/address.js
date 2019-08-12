module.exports.convertPathToAddress = (path) => {
  const [protocol, ip, port] = path.split('__');
  if (protocol && ip && port) {
    const convertedIp = ip.replace(/_/g, '.');
    return `${protocol}://${convertedIp}:${port}`;
  }
  return undefined;
};
