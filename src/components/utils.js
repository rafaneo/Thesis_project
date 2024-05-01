export const GetIpfsUrlFromPinata = pinataUrl => {
  var IPFSUrl = pinataUrl.split('/');
  const lastIndex = IPFSUrl.length;
  console.log('lastIndex', lastIndex);
  IPFSUrl = 'https://ipfs.io/ipfs/' + IPFSUrl[lastIndex - 1];
  console.log('IPFSUrl_new', IPFSUrl);
  return IPFSUrl;
};
