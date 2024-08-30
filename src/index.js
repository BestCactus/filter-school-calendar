const ics = require('ics');
import ical from 'ical';
import { Hono } from 'hono';

const app = new Hono();

const filterCalendar = async (query) => {
	// Fetch calendar from school website
	const resp = await fetch('https://classis.cgnr.cz/calendar/982ed8baf0bb7d245220884c43b8378c&noCache');
	console.log('STATUS:', resp.status);
	if (!resp.ok) {
		throw new Error('Error fetching calendar', resp.status);
	}
	//parse data
	const data = await resp.text();
	const importedCalendar = ical.parseICS(data);

	const currDate = new Date();
	let englishRegex;
	let germanRegex;
	if (query.aj) {
		if (query.aj[0] == 1) {
			englishRegex = /1.?aj1/i;
		} else if (query.aj[0] == 2) {
			englishRegex = /1.?aj2/i;
		} else if (query.aj[0] == 3) {
			englishRegex = /1.?aj3/i;
		}
	}
	if (query.nj) {
		if (query.nj[0] == 1) {
			germanRegex = /1.?nj1/i;
		} else if (query.nj[0] == 2) {
			germanRegex = /1.?nj2/i;
		} else if (query.nj[0] == 3) {
			germanRegex = /1.?nj3/i;
		}
	}
	const mainRegex = /[1-4].?[bd(?:mr|zsv|fymed)]|[2-4].?[abd(?:mr|zsv|fymed)]|sbor|maturit|sch(?:u|ů|ú)zk/i;
	// /1.?a[^j]/i;

	//output calendar array
	const validEventsArr = [];

	for (let event in importedCalendar) {
		const eventObj = importedCalendar[event];
		//Error handling
		if (eventObj.type !== 'VEVENT') {
			continue;
		}
		//check only this year events
		if (eventObj.start.getFullYear() !== currDate.getFullYear()) {
			continue;
		}

		const outputObj = {
			start: [eventObj.start.getFullYear(), eventObj.start.getMonth() + 1, eventObj.start.getDate()],
			end: [eventObj.end.getFullYear(), eventObj.end.getMonth() + 1, eventObj.end.getDate()],
			title: eventObj.description,
			status: eventObj.status,
			uid: eventObj.uid,
		};

		//testing all regexes
		if (mainRegex) {
			if (!mainRegex.test(eventObj.description.replace(' ', ''))) {
				validEventsArr.push(outputObj);
				continue;
			}
		}
		if (germanRegex) {
			if (germanRegex.test(eventObj.description.replace(' ', ''))) {
				validEventsArr.push(outputObj);
				continue;
			}
		}
		if (englishRegex) {
			if (englishRegex.test(eventObj.description.replace(' ', ''))) {
				validEventsArr.push(outputObj);
				continue;
			}
		}
	}
	console.log('number of events: ', validEventsArr.length);
	const { error, value } = ics.createEvents(validEventsArr);
	const outputCalendar = value;
	if (error) {
		console.error('ERROR: ', error);
		return;
	}
	return outputCalendar;
};

const test = () => {
	const html = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Test page</title>
		<style>
			body {
				background-color: black;
				color: white;
			}
		</style>
	</head>
	<body>
		<h1>Test page</h1>
		<script>
			console.log('works');
		</script>
	</body>
</html>

`;
	return html;
};

app.get('/', async (c) => {
	const ajGroup = c.req.query('aj');
	const njGroup = c.req.query('nj');
	if (ajGroup || njGroup) {
		return c.text(await filterCalendar(c.req.queries()));
	}
	return c.html(test());
});

app.get('/spolecne', async (c) => {
	return c.text(await filterCalendar(c.req.queries()));
});

export default app;
