chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.initiator !== 'https://www.filmweb.pl') {
      return
    }
    const responseHeaders = details.responseHeaders?.filter(
      (header) =>
        header.name.toLowerCase() !== 'access-control-allow-origin' &&
        header.name.toLowerCase() !== 'access-control-allow-methods',
    )
    responseHeaders?.push({
      name: 'Access-Control-Allow-Origin',
      value: details.initiator,
    })
    responseHeaders?.push({
      name: 'Access-Control-Allow-Methods',
      value: 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
    })
    responseHeaders?.push({
      name: 'Access-Control-Allow-Headers',
      value: 'content-type',
    })
    return { responseHeaders }
  },
  { urls: ['*://apis.justwatch.com/*'] },
  ['blocking', 'responseHeaders', 'extraHeaders'],
)
