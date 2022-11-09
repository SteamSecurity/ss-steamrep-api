// The following SteamID64s are provided as examples.
// Please do not find and contact the accounts associated with any of the following SteamID64s.
const steamrep = new (require('./index'))({ debug: true });

async function runTest() {
	console.log(await steamrep.getReputation('76561198152288723')); // Multi banned example (Some is out of scope)
	console.log(await steamrep.getReputation('76561198152288723')); // Cache test
}

runTest();
