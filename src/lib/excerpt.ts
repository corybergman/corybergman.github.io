// Feed excerpt = the opening of a post's own text (not the frontmatter
// description). Skips leading images and their italic captions (e.g. photo
// credits) so the teaser starts on real prose, then strips light Markdown and
// collapses whitespace. The feed CSS clamps the result to three lines.
export function excerptFrom(body: string): string {
	const prose = body
		.split('\n')
		.filter((line) => {
			const l = line.trim();
			if (l === '') return false;
			if (/^!\[[^\]]*\]\([^)]*\)$/.test(l)) return false; // standalone image
			if (/^\*[^*].*\*$/.test(l)) return false; // italic caption / photo credit
			return true;
		})
		.join(' ');
	return prose
		.replace(/^#{1,6}\s+/gm, '') // heading markers
		.replace(/^>\s?/gm, '') // blockquote markers
		.replace(/[*_`]/g, '') // emphasis / code ticks
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images -> text
		.replace(/<[^>]+>/g, ' ') // strip raw HTML tags (keep their text)
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 400);
}
