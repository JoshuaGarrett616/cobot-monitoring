import * as firebase from 'firebase';

const config = {
	apiKey: "AIzaSyD_43QqTCGDIjDJ68SWj3iXB4lYfK6Xvig",
	authDomain: "cobot-monitoring.firebaseapp.com",
	databaseURL: "https://cobot-monitoring.firebaseio.com",
	projectId: "cobot-monitoring"
};
firebase.initializeApp(config);

export default firebase;