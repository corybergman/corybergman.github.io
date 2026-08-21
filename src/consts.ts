// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Cory Bergman';
export const SITE_DESCRIPTION =
	'Cory Bergman, co-founder and chief product officer of Factal, writes about the confluence of AI, global security and journalism.';

// Canonical URL for a blog post. Posts migrated from the old Tumblr blog keep
// their original `/post/<tumblrId>/<slug>/` path so search-indexed links don't
// break; native posts live at `/blog/<slug>/`.
export function postUrl(post: {
	id: string;
	data: { tumblrId?: string };
}): string {
	return post.data.tumblrId
		? `/post/${post.data.tumblrId}/${post.id}/`
		: `/blog/${post.id}/`;
}

// URL-safe slug for a tag chip, e.g. "breaking news" → "breaking-news".
// Used for both the /tags/<slug>/ routes and the links on tag chips, so they
// must stay in sync — always build tag links with this helper.
export function tagSlug(tag: string): string {
	return tag
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Social / nav links.
export const SOCIAL = {
	x: 'https://x.com/corybe',
	bluesky: 'https://bsky.app/profile/corybe.com',
	threads: 'https://www.threads.com/@corybe',
	linkedin: 'https://www.linkedin.com/in/corybergman/',
	github: 'https://github.com/corybergman',
	email: 'mailto:blog+corybergman@gmail.com',
};
