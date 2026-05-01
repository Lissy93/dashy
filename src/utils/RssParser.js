/**
 * Minimal RSS 2.0 / Atom 1.0 parser using the browser's native DOMParser.
 * Returns `{ title, link, description, image, author, items }` in a shape
 * compatible with `sanitizeRssMeta` and `sanitizeRssItem`.
 */

const childByName = (el, name) => (
  el ? Array.from(el.children).find((c) => c.localName === name) : null
);

const childrenByName = (el, name) => (
  el ? Array.from(el.children).filter((c) => c.localName === name) : []
);

const childText = (el, name) => childByName(el, name)?.textContent?.trim() || '';

const atomLink = (el) => {
  const links = childrenByName(el, 'link');
  const alt = links.find((l) => l.getAttribute('rel') === 'alternate') || links[0];
  return alt?.getAttribute('href') || '';
};

const parseAtomItem = (el) => {
  const author = childByName(el, 'author');
  const thumb = childByName(el, 'thumbnail') || childByName(el, 'content');
  return {
    title: childText(el, 'title'),
    link: atomLink(el),
    description: childText(el, 'content') || childText(el, 'summary'),
    pubDate: childText(el, 'published') || childText(el, 'updated'),
    author: author ? childText(author, 'name') : '',
    thumbnail: thumb?.getAttribute('url') || '',
  };
};

const parseRssItem = (el) => {
  const enclosure = childByName(el, 'enclosure');
  const thumb = childByName(el, 'thumbnail');
  return {
    title: childText(el, 'title'),
    link: childText(el, 'link'),
    description: childText(el, 'encoded') || childText(el, 'description'),
    pubDate: childText(el, 'pubDate'),
    author: childText(el, 'creator') || childText(el, 'author'),
    thumbnail: thumb?.getAttribute('url') || enclosure?.getAttribute('url') || '',
  };
};

export const parseRssFeed = (xml) => {
  if (!xml || typeof xml !== 'string') throw new Error('Empty feed response');

  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid feed XML');

  const root = doc.documentElement;
  const isAtom = root.localName === 'feed';
  const channel = isAtom ? root : childByName(root, 'channel');
  if (!channel) throw new Error('Unrecognized feed format');

  const meta = isAtom
    ? {
      title: childText(channel, 'title'),
      link: atomLink(channel),
      description: childText(channel, 'subtitle'),
      image: childText(channel, 'logo') || childText(channel, 'icon'),
      author: (() => {
        const a = childByName(channel, 'author');
        return a ? childText(a, 'name') : '';
      })(),
    }
    : {
      title: childText(channel, 'title'),
      link: childText(channel, 'link'),
      description: childText(channel, 'description'),
      image: (() => {
        const img = childByName(channel, 'image');
        return img ? childText(img, 'url') : '';
      })(),
      author: childText(channel, 'managingEditor') || childText(channel, 'author'),
    };

  const itemEls = childrenByName(channel, isAtom ? 'entry' : 'item');
  const items = itemEls.map(isAtom ? parseAtomItem : parseRssItem);

  return { ...meta, items };
};
