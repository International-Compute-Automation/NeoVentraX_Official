import { industries, type Industry } from '../data/industries';
import { getPage, summarize, type Card } from './content';

/** Resolve an industry's role list into cards (reusing role write-ups from the old site where available). */
export function rolesOf(ind: Industry): Card[] {
  const cards: Card[] = [];
  for (const ref of ind.roles) {
    if ('title' in ref) {
      const html = `<p>${ref.text}</p>`;
      cards.push({ title: ref.title, html, summary: ref.text, location: 'Across USA' });
      continue;
    }
    const [slug, match] = ref.from;
    const all = getPage(slug)?.groups.flatMap((g) => g.cards) ?? [];
    const m = match.toLowerCase();
    const card =
      all.find((c) => c.title.toLowerCase() === m) ??
      all.find((c) => c.title.toLowerCase().startsWith(m)) ??
      all.find((c) => c.title.toLowerCase().includes(m));
    if (!card) throw new Error(`Role "${match}" not found on old page "${slug}" (src/data/industries.ts)`);
    // text-only role cards: consistent grid and lighter pages
    if (!cards.some((c) => c.title === card.title)) cards.push({ ...card, image: undefined, location: card.location ?? 'Across USA', summary: card.summary || summarize(card.html) });
  }
  return cards;
}

export { industries };
