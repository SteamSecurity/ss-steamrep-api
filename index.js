const axios = require('axios').default;

// -- Debug -------------
const debug = false;

let SteamRepAPI = {
	timeout: 5000,
	cache_results: true,
	cache_time: 1800000, // Default time is 30 minutes as recommended by SteamRep Staff.
	cache: {},
};

// --- Module Exports --------------------------------------
SteamRepAPI.getReputation = function (steamid64) {
	return new Promise(async (resolve) => {
		// Cache -------------------------------------------
		// First, check to see if we have their information cached.
		if (SteamRepAPI.cache_results && SteamRepAPI.cache[steamid64]) {
			debuglog(SteamRepAPI.cache[steamid64], 'Cached information');
			return resolve(SteamRepAPI.cache[steamid64]);
		}

		// Get new request ---------------------------------
		// Nothing in our cache :(. Time to send a new request!
		let profile_reputation = { banned: false, warning: false, reports: 0, trusted: false, tags: [] }; // Our response object. This is what we will be changing with the values we get from SteamRep.
		const steamrep_response = await get(steamid64); // Our HTTP request. We do not want to alter this value once we get it!

		if (steamrep_response.error)
			return resolve({ error: steamrep_response.error, error_message: steamrep_response.error_message });
		if (steamrep_response.status !== 200)
			return resolve({ error: steamrep_response.status, error_message: 'Unexpected HTTP status code' });

		debuglog(steamrep_response, 'SteamRep response');
		debuglog(steamrep_response.response.reputation.tags.tag, 'SteamRep Tags focus');

		// Formatting --------------------------------------
		// Going though the response's tags gets all of the information we need.
		// SteamRep formats them in a very strange way, so we can convert it to a more sane format for our uses.

		// First we check to see if there are multiple tags.
		// If their are multiple tags, SteamRep API returns an Array of tags.
		if (Array.isArray(steamrep_response?.response?.reputation?.tags?.tag)) {
			for (tag of steamrep_response?.response?.reputation?.tags?.tag) {
				let user_tag = stripTag(tag);
				addTag(user_tag);
			}
		}

		// If there is only one tag, SteamRep API returns an object containing only the one tag
		else if (typeof steamrep_response?.response?.reputation?.tags?.tag === 'object') {
			let user_tag = stripTag(steamrep_response?.response?.reputation?.tags?.tag);
			addTag(user_tag);
		}

		// Set the unconfirmed reports value
		profile_reputation.reports = steamrep_response.response.stats.unconfirmedreports.reportcount;

		debuglog(profile_reputation, 'Data to send out');

		if (SteamRepAPI.cache_results) {
			SteamRepAPI.cache[steamid64] = profile_reputation;
			setTimeout(() => {
				delete SteamRepAPI.cache[steamid64];
			}, SteamRepAPI.cache_time);
		}

		resolve(profile_reputation);

		// Set profile_reputation values based on tag category, and then add the tag to the array.
		function addTag(tag) {
			if (tag.type === 'bad') profile_reputation.banned = true;
			if (tag.type === 'good') profile_reputation.trusted = true;
			profile_reputation.tags.push(tag);
		}
	});
};

// --- Helper Functions ------------------------------------
function get(steamid64) {
	return new Promise((resolve) => {
		axios
			.get(`https://steamrep.com/api/beta4/reputation/${steamid64}?json=1&tagdetails=1&extended=1`, {
				timeout: SteamRepAPI.timeout,
			})
			.then((response) => {
				let status = response.status;
				let res = response.data.steamrep;

				resolve({ status: status, response: res });
			})
			.catch((reason) => resolve({ error: '0', error_message: reason.message }));
	});
}

// Reformat a tag to then append to our profile_reputation "tags" array.
// HELP WANTED: Any labels not explicitly listed here are not known and will return an unexpected value.
// Identification along with proof of tag usage (A Steam user with that SteamRep tag) is greatly appreciated!
function stripTag(tag) {
	let enums = {
		label: {
			'BPTF SCAMMER': 'Backpack.TF Scammer',
			'SR ADMIN': 'SteamRep Admin',
			'REDDIT ADMIN': 'Reddit Admin', // Reddit moment for sure
			'SR DONATOR': 'SteamRep Donator',
			'SR CAUTION': 'SteamRep Caution',
			'SR SCAMMER': 'SteamRep Scammer',
			'SKIAL SCAMMER': 'Skial Scammer',
			'FoG SCAMMER': 'Fortress of Gamers Scammer',
			'R-D2TRADE SCAMMER': 'r/Dota2Trade banned',
		},
		category: {
			evil: 'bad',
			trusted: 'good',
			warning: 'warning', // Usually reserved for SR CAUTION tags
			misc: 'misc',
		},
	};

	return {
		label: enums.label[tag.name] || tag.name,
		issued_date: tag.date,
		issued_timestamp: tag.timestamp,
		type: enums.category[tag.category], // This SHOULD ALWAYS be a known value inside of enums.
	};
}

// Our fun little debug logger function. Be nice to him! :3c
function debuglog(data, title) {
	if (!debug) return;

	if (title) console.log(`-- ${title} -------------------------------------`);
	console.log(data);
	if (title) console.log(`\n\n`);
}

module.exports = SteamRepAPI;
