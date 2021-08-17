const ICAL = require('ical.js');

function parse(data, callback) {
	var component = new window.ICAL.Component(ICAL.parse(data));
	const vevents = component.getAllSubcomponents('vevent')
		.map((e) => new window.ICAL.Event(e))
		.filter((e) => e.summary != "Committee Meeting")
		.filter((e) => e.summary.includes("Committee") == false)
		.filter((e) => {
			const time = new window.ICAL.Time(e.startDate);
			const dt = new Date(time.toString());
			const currentTime = new Date();
			return dt >= currentTime;
		})

	callback(vevents);
}

// https://stackoverflow.com/questions/11591854/format-date-to-mm-dd-yyyy-in-javascript
function getFormattedDate(date) {
	var year = date.getFullYear();

	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;

	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;

	return month + '/' + day + '/' + year;
}

// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function getFormattedTime(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function get_pack_events(raw_data, callback) {
	try {
		load_data(function(raw_data){
			parse(raw_data, function(vevents) {
				const events = vevents
					.map((event) => {
						const time = new ICAL.Time(event.startDate);
						const dt = new Date(time.toString());
						const d = getFormattedDate(dt);
						const t = getFormattedTime(dt);
						return {
							"summary": event.summary,
							"location": event.location,
							"date": d,
							"time": t
						}
					});
				callback(events);
			});
		});

	} catch (err) {
		console.error(err)
	}
}
