export default class API {
	static searchSubjectsByText(query) {
		console.log(`Searching for subjects sounding like ${query}`)
		return [];
	}

	static searchNearbyClasses(building, currentTime) {
		console.log(`Searching for subjects near ${building} around ${currentTime}`)
		return [];
	}
}