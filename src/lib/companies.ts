/**
 * The companies Cory founded or helped build.
 *
 * Shared by the /projects index (logo, name and date only) and the per-company
 * pages at /projects/<slug>/ (which add the description). Keeping one array
 * means the two views can't drift apart.
 *
 * `slug` is explicit rather than derived from the title — these URLs are
 * permanent, and auto-slugging "Breaking News (NBC News)" would be ugly.
 * `url` is the company's own site, shown on its page; the name on the index
 * links to the page here, not outward.
 */
import type { ImageMetadata } from 'astro';
import factalLogo from '../assets/factal.png';
import breakingNewsLogo from '../assets/breaking-news.png';
import myBallardLogo from '../assets/my-ballard.png';
import lostRemoteLogo from '../assets/lost-remote.png';

export interface Company {
	slug: string;
	title: string;
	url?: string;
	date?: string;
	/** One paragraph of HTML; inline links are styled by the page. */
	description?: string;
	logo?: ImageMetadata;
}

export const companies: Company[] = [

	{
		slug: 'factal',
		title: 'Factal',
		url: 'https://www.factal.com',
		date: '2018–present',
		logo: factalLogo,
		description: `<p>Factal is a verified risk intelligence platform for global security, risk and supply chain teams. A hybrid of advanced AI and experienced journalists, Factal enables organizations to quickly anticipate and respond to critical events that pose a risk to their people, operations and reputation.</p>
<p>As the name suggests, Factal puts a premium on getting the facts right in real time. While news organizations tell stories and social media commands attention, Factal focuses on the operational details organizations need to make decisions in the moment. For example, as a wildfire approaches a hotel where employees are staying in Greece, do they need to evacuate now?</p>
<p>Operational certainty has become harder as the internet fills with AI-generated content, misinformation and noise. That makes verification more important than ever. At Factal, verification isn't a feature layered onto the product; it's built into the architecture of the platform and the ethos of how we work. From the AI tooling, <a href="https://www.factal.com/code/">journalism standards</a> and Factal chat network, the platform is designed to help people act with confidence in high pressure situations. That same verified foundation can also plug into the tools, dashboards and AI agents organizations already use, grounding their decisions in Factal's data rather than the open web.</p>
<p>Factal sprang from the ashes of Breaking News, a popular consumer service inside NBC News. Co-founded by Ben Tesch, Charlie Tillinghast and me, Factal launched in October 2018. It grew steadily, and today its members include many of the largest companies in the world. I'm particularly proud that we provide Factal free to more than 300 humanitarian and disaster relief organizations, including the largest Red Cross teams around the world.</p>`,
	},
	{
		slug: 'breaking-news',
		title: 'Breaking News (NBC News)',
		date: '2010–2016',
		logo: breakingNewsLogo,
		description: `Breaking News began as an experiment inside MSNBC Interactive, the joint venture of Microsoft and NBC. Co-founded by Ben Tesch, Tom Brew and me, we began with the Twitter account @breakingnews, which <a href="https://www.theguardian.com/technology/2009/dec/01/twitter-bno-msnbc">MSNBC took over</a> in an agreement with its creator, Michael van Poppel. We then added the domain, BreakingNews.com, and launched a mobile app. The idea was simple: provide the fastest, accurate breaking news available, linking the best original sources – even if they were NBC's competitors. In 2012, NBC took over full control of MSNBC Interactive, and the network embraced the experiment. Over the next few years, we launched a series of groundbreaking mobile features including <a href="https://www.tumblr.com/breakingblog/88568000254/introducing-proximity-alerts-and-much-more-in-the?source=share">proximity alerts</a>, <a href="https://www.tumblr.com/breakingblog/74299826263/news-organizations-everywhere-are-going-bieber?source=share">muting</a> and <a href="https://medium.com/@breakingnews/reinventing-news-tips-as-social-media-signals-1b343f1160b9">nearby tips</a> (which won a <a href="https://awards.journalists.org/entries/nearby-tipping/">national journalism award</a> and helped us break some of the world's largest stories). The app exploded in popularity, outpacing NBC News' own mobile active user growth, but revenue remained a challenge. When the new NBC News president decided to focus on video, Breaking News got the boot. We <a href="https://medium.com/@breakingnews/breaking-news-is-shutting-down-49104e9df789">published our last update</a> on Dec. 31, 2016.`,
	},
	{
		slug: 'my-ballard',
		title: 'My Ballard',
		url: 'https://www.myballard.com',
		date: '2007–present',
		logo: myBallardLogo,
		description: `I co-founded My Ballard with my wife Kate when we moved to the Seattle neighborhood of Ballard. It began as a part-time blog where we published anonymously as the "Geeky Swedes." As the neighborhood grew in size and popularity, so did My Ballard, becoming one of the largest hyperlocal sites in the country. It became the anchor of a <a href="https://www.myballard.com/2009/08/26/my-ballard-seattle-times-form-partnership/">larger network</a> of neighborhood sites we called Next Door Media, and My Ballard and its cousin PhinneyWood won national journalism awards. But as a labor of love, it was difficult to maintain with our day jobs. So in 2020, Kate and I stepped aside and <a href="https://www.myballard.com/2020/09/29/beginning-of-a-new-era-for-my-ballard-and-how-you-can-help/">sold My Ballard</a> to its editor, Meghan Walker, for a dollar. We're extremely happy to see the site live on as a valuable community resource.`,
	},
	{
		slug: 'lost-remote',
		title: 'Lost Remote',
		url: 'http://www.lostremote.com',
		date: '1997–2024',
		logo: lostRemoteLogo,
		description: `I launched Lost Remote as a newsletter in 1997, and it grew into one of the first blogs on the web. Focused on how technology was changing TV, Lost Remote covered the industry's collision with the internet. Then with the rise of social media, it narrowed its coverage to social TV. Lost Remote was highly influential among media executives, and Mediabistro <a href="https://www.adweek.com/lostremote/lost-remote-acquired-by-mediabistro-team/">acquired Lost Remote</a> in 2012. Two years later, Adweek bought Mediabistro, and Lost Remote continued publishing until 2024. Much of the archive still lives on at <a href="https://www.adweek.com/lostremote/?category=">Adweek.com</a>, with earlier snapshots preserved on the <a href="https://web.archive.org/web/20260000000000*/lostremote.com">Wayback Machine</a>.`,
	},
];

/** Canonical path for a company page. Always build links with this. */
export function companyUrl(company: Pick<Company, 'slug'>): string {
	return `/projects/${company.slug}/`;
}

/**
 * A description with its markup stripped. Used for the teaser on /projects,
 * where the visible length is set by a CSS line clamp rather than a character
 * count — inline links are dropped so they don't compete with "Read more".
 */
export function companyPlainText(company: Company): string {
	if (!company.description) return '';
	return company.description
		// A space, not an empty string: descriptions are multi-paragraph, and
		// stripping `</p><p>` bare would run the last word into the first.
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Plain-text opening of a description, capped, for meta descriptions. */
export function companySummary(company: Company, max = 200): string {
	const text = companyPlainText(company);
	if (text.length <= max) return text;
	return `${text.slice(0, text.lastIndexOf(' ', max))}\u2026`;
}
