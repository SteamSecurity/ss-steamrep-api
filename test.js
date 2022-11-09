// The following SteamID64s are provided as examples.
// Please do not find and contact the accounts associated with any of the following SteamID64s.
const steamrep = new (require('./index'))({ debug: true });

async function runTest() {
	await steamrep.getReputation('76561198179000678').then(console.log); // BackpackTF banned example
	await steamrep.getReputation('76561197971691194').then(console.log); // Trusted example
	await steamrep.getReputation('76561198345168615').then(console.log); // Warning example
	await steamrep.getReputation('76561198203462284').then(console.log); // Unconfirmed example
	await steamrep.getReputation('76561198847222378').then(console.log); // Vacbanned example (This is out of scope)
	await steamrep.getReputation('76561198152288723').then(console.log); // Multi banned example (Some is out of scope)
}

runTest();
