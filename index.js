const axios = require('axios').default;

let cache = {};

class SteamRepAPI {
	constructor({ timeout = 5000, cache_time = 1800000, cache_results = true, debug = false } = {}) {
		this.timeout = timeout;
		this.cache_time = cache_time;
		this.cache_results = cache_results;
		this.debug = debug;
	}

	getReputation(steamid64) {
		return new Promise(async (resolve, reject) => {
			// Check if we have a cache of the requested user
			if (cache[steamid64]) {
				this._debugLog({ data: `${steamid64} was cached.` });
				return resolve(cache[steamid64]);
			}

			// No cache. Request new information
			// Set the blueprint for our response
			let profile_reputation = { banned: false, warning: false, reports: 0, trusted: false, tags: [] };
			const steamrep_response = await this._get(`https://steamrep.com/api/beta4/reputation/${steamid64}?json=1&tagdetails=1&extended=1`);

			// Error check the response
			if (steamrep_response.status !== 200) return reject(this._newResponseError('Unexpected HTTP status code', steamrep_response.status));

			this._debugLog({ data: steamrep_response.data.steamrep, title: 'SteamRep response' });
			this._debugLog({ data: steamrep_response.data.steamrep.reputation.tags.tag, title: 'SteamRep Tags focus' });

			// Formatting
			// Going though the response's tags gets all of the information we need.
			// SteamRep formats them in a very strange way, so we can convert it to a more sane format for our uses.

			// First we check to see if there are multiple tags.
			// If there are multiple tags, SteamRep API returns an Array of tags.
			if (Array.isArray(steamrep_response?.data?.steamrep?.reputation?.tags?.tag)) {
				for (let tag of steamrep_response?.data?.steamrep?.reputation?.tags?.tag) {
					let user_tag = _stripTag(tag);
					_addTag(user_tag);
				}
			}

			// If there is only one tag, SteamRep API returns an object containing only the one tag
			else if (typeof steamrep_response?.data?.steamrep?.reputation?.tags?.tag === 'object') {
				let user_tag = _stripTag(steamrep_response?.data?.steamrep?.reputation?.tags?.tag);
				_addTag(user_tag);
			}

			// Set the unconfirmed reports value
			profile_reputation.reports = steamrep_response.data.steamrep.stats.unconfirmedreports.reportcount;

			this._debugLog({ data: profile_reputation, title: 'Data to send out' });

			if (this.cache_results) {
				cache[steamid64] = profile_reputation;
				setTimeout(() => {
					delete cache[steamid64];
				}, this.cache_time);
			}

			return resolve(profile_reputation);

			// Reformat a tag to then append to our profile_reputation "tags" array.
			// HELP WANTED: Any labels not explicitly listed here are not known and will return an unexpected value.
			// Identification along with proof of tag usage (A Steam user with that SteamRep tag) is greatly appreciated!
			function _stripTag(tag) {
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

				if (enums.label[tag.name] === 'SteamRep Caution') profile_reputation.warning = true;

				return {
					label: enums.label[tag.name] || tag.name,
					issued_date: tag.date,
					issued_timestamp: tag.timestamp,
					type: enums.category[tag.category], // This SHOULD ALWAYS be a known value inside of enums.
				};
			}

			// Set profile_reputation values based on tag category, and then add the tag to the array.
			function _addTag(tag) {
				if (tag.type === 'bad') profile_reputation.banned = true;
				if (tag.type === 'good') profile_reputation.trusted = true;
				profile_reputation.tags.push(tag);
			}
		});
	}
	/**
	 *
	 * @param {string} message The specific error message to return to the request
	 * @param {String} error The error code
	 * @returns
	 */
	_newResponseError(message, error = '1') {
		return {
			error: error,
			error_message: message,
		};
	}

	/**
	 * A quick little debug logger. :3
	 * @param {Object} [options]
	 * @param {String} [options.data] A message to send to the terminal.
	 * @param {String} [options.title] A header for the output. Disables 'type'.
	 * @param {String} [options.type=debg] The type of log to send.
	 * @returns
	 */
	_debugLog({ data, title, type = 'debg' } = {}) {
		if (!this.debug) return;

		if (title) {
			console.log(`-- ${title} -------------------------------------`);
			console.log(data);
			console.log(`\n\n`);
		} else {
			try {
				log[type](data);
			} catch {
				console.log(data);
			}
		}
	}

	/**
	 * Create a GET request to a specified URL
	 * @param {String} url The URL to submit a GET request to
	 */
	_get(url) {
		return new Promise((resolve) => {
			axios
				.get(url, { timeout: this.timeout })
				.then(resolve)
				.catch((reason) => {
					this._debugLog({ data: 'HTTP request failure' });
					this._debugLog({ data: reason, title: 'Full log' });

					if (reason.response) {
						this._debugLog({ data: reason.response, title: 'Response' });
						return resolve({ error: reason.response.status, error_message: reason.message });
					}
					return resolve({ error: '1', error_message: 'HTTP request failure' });
				});
		});
	}

	enums = {
		community_privacy: {
			0: 'Invalid',
			1: 'Private',
			2: 'Friends Only',
			3: 'Public',

			Public: 3,
			'Friends Only': 2,
			Private: 1,
			Invalid: 0,
		},
		online_state: {
			0: 'Offline',
			1: 'Online',
			2: 'Busy',
			3: 'Away',
			4: 'Snooze',
			5: 'Looking To Trade',
			6: 'Looking To Play',
			7: 'Invisible',
			8: 'Max', // WTF is a max?

			Max: 8,
			Invisible: 7,
			// Looking to Play and Looking to Trade can't be used anymore by Steam Users?
			'Looking To Play': 6,
			'Looking To Trade': 5,
			Snooze: 4,
			Away: 3,
			Busy: 2,
			Online: 1,
			Offline: 0,
		},
	};
}

module.exports = SteamRepAPI;
