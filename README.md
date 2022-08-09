<div align="center">
  <img src="https://gitlab.com/ArmoredDragon/ss-steamrep-api/-/raw/master/images/steamrep-logo.png" width="750"><br>
  <b>An API Wrapper</b>
</div>
<br>
<div align="center">
  <img src="https://img.shields.io/npm/dt/ss-steamrep-api?style=for-the-badge">
  <img src="https://img.shields.io/gitlab/contributors/ss-steamrep-api?style=for-the-badge">
  <img src="https://img.shields.io/gitlab/issues/open-raw/ss-steamrep-api?style=for-the-badge">
</div>
<br>

# About

SS-SteamRep-API is a basic wrapper for the SteamRep API used and maintained by SteamSecurity.org.
Please see [Limitations](#limitations) for further details.

### Installation

`npm i SS-SteamRep-API`

# Basic usage

```js
let steamrep = require('ss-steamrep-api');

// Optionally set a timeout to the SteamRep API request.
steamrep.timeout = 5000; // ms to wait for a response. Default is '5000'

// Optionally set request cache.
steamrep.cache_results = true; // Should results be cached? Default is 'true'.

// Optionally set a cache time to save requests to prevent spamming of SteamRep servers.
steamrep.cache_time = 1800000; // ms to save a cached response.  Default is '1800000' (30 minutes)

async function getAccountReputation() {
	await steamrep.getReputation('insert-valid-STEAMID64-here').then(console.log);
}

getAccountReputation();
```

See test.js or test_min.js for more examples.

# Properties

- ### timeout

  Time to wait in milliseconds before canceling the request and returning with an error.

- ### cache_results

  A Boolean dictating whether or not automatic caching happens. Typically you do not want to change from the default value 'true', however if you are using your own cache solution, you may want to disable this.

- ### cache_time

  Time to save a cached response in milliseconds. This is set to the lowest recommended value at 30 minutes.
  This is ignored if caching is disabled.

- ### cache
  This is an object containing the entire cache. This can be retrieved, changed, and then reapplied as needed.

# Methods

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

# Error Handling

Any errors with the SteamRep api or this wrapper should resolve the promise with both an 'error' and 'error_message' value.

```js
{
	error: 'Status code. Almost always a direct HTTP status code from a request',
	error_message: 'A more specific error message',
}
```

# Limitations

SS-SteamRep-API does not return bans relating to Steam. This means that a user with a VAC ban or a Steam Trading ban will appear as if they are completely clean. Valve specific bans are outside of the scope of this package.
We will be producing and maintaining a Valve API wrapper for this information. This README file will be updated with a link to that repository once it is created and released.

# Disclaimer

This repository is not affiliated with SteamRep. This repository is provided as is. See the included LICENSE file for more information.
In accordance with the requests from SteamRep staff, it is advised that you cache your results. This package will automatically cache your requests and responses for the recommended 30 minutes.
For more information view the SteamRep forum. [SteamRep forum](https://forums.steamrep.com/threads/steamrep-web-api-beta4-legacy-public.114688/)
