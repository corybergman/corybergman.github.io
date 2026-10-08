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
		event: 'Technology and AI in corporate security: Opportunities and challenges',
		url: 'https://www.clarityfactory.com/events/technology-ai-corporate-security-webinar',
		venue: 'Clarity Factory webinar',
		date: 'Oct 14, 2026',
		description:
			'In recent years, the use of technology and AI by corporate security teams has increased significantly. As the 2026 CSO Survey shows, a majority of CSOs say the tech share of their budget will continue to grow and use of AI has increased across all areas.',
	},
	{
		event: 'Security at the Frontier: How Security Leaders at Frontier Labs Leverage AI',
		venue: 'OSAC Annual Briefing',
		date: 'Nov 18, 2026',
		description:
			"The security teams at the companies building frontier AI are the first to face a question coming for all of us: what happens to the security function when the tools can do a growing share of the work? This panel brings together corporate security leaders at the top AI labs for a candid look at which decisions still demand human judgment, how to evolve the team as tasks get automated and what they'd build if they designed a security shop from scratch today.",
	},
	{
		event: 'Global Security Briefing',
		url: 'https://www.factal.com/promo/globalsecuritybriefing/',
		date: 'every two weeks',
		description: `I make routine appearances in the Global Security Briefing, a webinar co-hosted by Factal and Emergent Risk International. The "GSB" began in the first days of COVID, and has since grown into the largest virtual event of its kind in the industry. Factal editors and ERI analysts dissect the biggest geopolitical events of the day, and I typically speak about AI. Make sure you <a href="https://www.factal.com/promo/globalsecuritybriefing/">register to attend</a> (it's free).`,
	},
];
