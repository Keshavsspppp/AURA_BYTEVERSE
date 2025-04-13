export const spotifyConfig = {
  clientId: '1b8c7e62416943839097abed18b55991',
  redirectUri: window.location.origin + '/callback',
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming'
  ]
};