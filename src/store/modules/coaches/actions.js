export default {
	async registerCoach(context, data) {
		const userId = context.rootGetters.userId;
		const coachData = {
			id: userId,
			firstName: data.first,
			lastName: data.last,
			description: data.desc,
			hourlyRate: data.rate,
			areas: data.areas,
		};

		const authUrl = `auth=${context.rootGetters.token}`;
		const response = await fetch(`https://vue-coachs-app-default-rtdb.firebaseio.com/coaches/${userId}/.json?${authUrl}`, {
			method: "PUT",
			body: JSON.stringify(coachData),
		});

		const responseData = await response.json();
		if (!response.ok) {
			const error = new Error(responseData.message || "Failed to send a coach!");
			throw error;
		}

		context.commit("registerCoach", { ...coachData, id: userId });
	},
	async loadCoaches(context, payload) {
		if (!payload.forceRefresh && !context.getters.shouldUpdate) {
			return;
		}

		const response = await fetch(`https://vue-coachs-app-default-rtdb.firebaseio.com/coaches.json`);

		const responseData = await response.json();
		if (!response.ok) {
			const error = new Error(responseData.message || "Failed to fetch!");
			throw error;
		}

		const coaches = [];

		for (const key in responseData) {
			const coachParsed = {
				id: key,
				firstName: responseData[key].firstName,
				lastName: responseData[key].lastName,
				description: responseData[key].description,
				hourlyRate: responseData[key].hourlyRate,
				areas: responseData[key].areas,
			};
			coaches.push(coachParsed);
		}

		context.commit("setCoaches", coaches);
		context.commit("setFetchTimestamp");
	},
};
