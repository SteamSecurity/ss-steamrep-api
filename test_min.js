// The following SteamID64s are provided as examples.
// Please do not find and contact the accounts associated with any of the following SteamID64s.
const steamrep = require('./index');

steamrep.timeout = 5000;
steamrep.cache_time = 5000;

async function runTest() {
	await steamrep.getReputation('76561198152288723'); // Multi banned example (Some is out of scope)

	setTimeout(async () => {
		console.log(steamrep.cache);
	}, 6000);
}

runTest();
