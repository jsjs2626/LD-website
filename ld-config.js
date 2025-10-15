//import LDClient from 'launchdarkly-js-client-sdk';

const context = {
    kind: 'user',
    key: 'context-key-123abc'
  };
  const client = LDClient.initialize('68f00301acf74e09a6ccb56c', context);
  
  client.on('initialized', function () {
    // Tracking your memberId lets us know you are connected.
    client.track('68f00301acf74e09a6ccb56b');
    console.log('SDK successfully initialized!');
  });