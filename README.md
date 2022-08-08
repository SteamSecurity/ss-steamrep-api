# About

SS-SteamRep-API is a basic wrapper for the SteamRep API used and maintained by SteamSecurity.org.
Please see [Limitations](#limitations) for further details.

### Installation

`npm i SS-SteamRep-API`

### Basic usage

```js
let steamrep = require('ss-steamrep-api');

// Optionally set a timeout to the SteamRep API request.
steamrep.timeout = 5000; // ms to wait for a response

async function getAccountReputation() {
	await steamrep.getReputation('insert-valid-STEAMID64-here').then(console.log);
}

getAccountReputation();
```

See test.js or test_min.js for more examples.

## Properties

- ### timeout
  Time to wait in milliseconds before canceling the request and returning with an error.

## Methods

- ### getReputation(steamid64)

  - steamid64: A valid steamid64 for any account.

    This returns a promise formatted as such:

    ```js
    {
        banned: Boolean,  // Whether or not the user is banned from SteamRep or it's affiliates
        warning: Boolean, // Whether or not the user has warnings from SteamRep or it's affiliates
        trusted: Boolean, // Whether or not the user is trusted by SteamRep or it's affiliates
        reports: Number,  // A number representing unconfirmed reports on SteamRep
        tags: Array       // Tags returned to use from SteamRep, formatted in a more sane way.
    }
    ```

## Limitations

SS-SteamRep-API does not return bans relating to Steam. This means that a user with a VAC ban or a Steam Trading ban will appear as if they are completely clean. Valve specific bans are outside of the scope of this package.
We will be producing and maintaining a Valve API wrapper for this information. This README file will be updated with a link to that repository once it is created and released.
