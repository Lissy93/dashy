import nlp from 'compromise';

export function parseQuery(query) {
  const doc = nlp(query);
  const parsedQuery = {
    action: doc.verbs().out('array'),
    subject: doc.nouns().out('array'),
    adjectives: doc.adjectives().out('array'),
  };
  return parsedQuery;
}

export function connectToSearch(parsedQuery, searchFunction) {
  const { action, subject } = parsedQuery;
  if (action.includes('search') && subject.length > 0) {
    const query = subject.join(' ');
    searchFunction(query);
  }
}
