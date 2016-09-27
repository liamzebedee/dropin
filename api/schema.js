// Subject = 21231
// Session = Spring, Autumn, Summer
// Class = Workshop, Tutorial, etc.

class Session {

}

class Class {
	constructor(data) {
		// Relations
		this.sessionId = "82121_AUT_U_1_S";
		this.subjectId = "12312";

		// Attributes
		this.building = "";
		this.classType = "";
		this.day = 0;
		this.durationInMins = 180;
		this.endTime = new Date;
		this.level = "";
		this.location = "";
		this.room = "";
		this.startHour = 0;
		this.startMin = 0;
		this.weeksOn = [
			[ new Date, new Date ],
			[ new Date, new Date ],
		];
	}
}