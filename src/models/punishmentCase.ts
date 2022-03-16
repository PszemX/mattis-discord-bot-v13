export const caseModel = (punishment: any) => {
	return {
		id: '', // 1, 2, 3...
		type: '', // warn, ban, mute...
		removed: '', // true, false
		length: '', // timestamp
		reason: '', // Badwords
		user: '', // userId
		admin: '', // adminId
		timestamp: Date.now(),
		endtime: '', // timestamp + length
	};
};
