// Upcoming speaking engagements. Shared by the Speaking page (full entries with
// descriptions) and the home page's speaking card (title, venue and date only),
// so an event added here shows up in both places. Keep them in date order, with
// the recurring Global Security Briefing last.
// Each engagement: { event, url?, venue?, date?, description? } — description may contain HTML.
export const engagements: Array<{
	event: string;
	url?: string;
	venue?: string;
	date?: string;
	description?: string;
}> = [
	{
		event: 'Global Security Briefing',
		url: 'https://www.factal.com/promo/globalsecuritybriefing/',
		date: 'every two weeks',
		description: `I make routine appearances in the Global Security Briefing, a webinar co-hosted by Factal and Emergent Risk International. The "GSB" began in the first days of COVID, and has since grown into the largest virtual event of its kind in the industry. Factal editors and ERI analysts dissect the biggest geopolitical events of the day, and I typically speak about AI. Make sure you <a href="https://www.factal.com/promo/globalsecuritybriefing/">register to attend</a> (it's free).`,
	},
];
