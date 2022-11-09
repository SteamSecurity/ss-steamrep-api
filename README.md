<div align="center">
  <img src="https://gitlab.com/steamsecurity/SS-SteamRep-API/-/raw/master/images/steamrep-logo.png" width="750"><br>
  <b>A community made API Wrapper</b>
</div>
<br>
<div align="center">
  <img src="https://img.shields.io/npm/dt/ss-steamrep-api?style=for-the-badge">
  <img src="https://img.shields.io/gitlab/contributors/steamsecurity/ss-steamrep-api?style=for-the-badge">
  <img src="https://img.shields.io/gitlab/issues/open-raw/steamsecurity/ss-steamrep-api?style=for-the-badge">
</div>
<br>

# About

SS-SteamRep-API is a basic wrapper for the SteamRep API used and maintained by [SteamSecurity.org](https://steamsecurity.org).
Please see [Limitations](#limitations) for further details.

### Installation

`npm i SS-SteamRep-API`

# Basic usage

```js
// There are two ways to include this module in your project
// The first way is on a single line
const SteamRep = new (require('ss-steamrep-api'))();

// Alternatively you can do it like this.
const _steamrep = require('ss-steamrep-api');
const SteamRep = new _steamrep();

// If you would like to change the default options, you can supply them in an Object like this:
// const SteamRep = new (require('ss-steamrep-api'))({ timeout: 2500, cache: false });

// Get the SteamRep reputation of any steam user by SteamID64
await steamrep.getReputation('STEAMID64').then(console.log);
```

See test.js or test_min.js for more examples.

# Options

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

Any errors with the SteamRep api or this wrapper should reject a request with both an 'error' and 'error_message' value.

```js
{
	error: 'Status code. Often a direct HTTP status code, otherwise most likely "1"',
	error_message: 'A more specific error message',
}
```

# Limitations

SS-SteamRep-API does not return bans relating to Steam. This means that a user with a VAC ban or a Steam Trading ban will appear as if they are completely clean. Valve specific bans are outside of the scope of this package.
We will be producing and maintaining a Valve API wrapper for this information. This README file will be updated with a link to that repository once it is created and released.

# Disclaimer

This repository is not affiliated with SteamRep. This repository is provided as is. See the included LICENSE file for more information.
<br>In accordance with the requests from SteamRep staff, it is advised that you cache your results.<br>**This package will automatically cache your requests and responses for the recommended 30 minutes.**
For more information view the [SteamRep forum](https://forums.steamrep.com/threads/steamrep-web-api-beta4-legacy-public.114688/).
