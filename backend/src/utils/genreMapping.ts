const genreKeywords: { pattern: RegExp; genre: string }[] = [
  { pattern: /\b(romance|love|heart|wedding|passion|desire)\b/i, genre: 'Romance' },
  { pattern: /\b(mystery|crime|detective|thriller|suspense|murder|noir)\b/i, genre: 'Mystery & Thriller' },
  { pattern: /\b(sci.?fi|science fiction|space|futur|cyber|dystopia)\b/i, genre: 'Science Fiction' },
  { pattern: /\b(fantasy|quest|magic|dragon|sword|sorcer|myth)\b/i, genre: 'Fantasy' },
  { pattern: /\b(horror|dark|haunt|ghost|vampire|zombie|supernatural)\b/i, genre: 'Horror' },
  { pattern: /\b(history|historical|medieval|ancient|war|battle)\b/i, genre: 'Historical Fiction' },
  { pattern: /\b(child|young|juvenile|teen|middle grade|picture|babies|preschool)\b/i, genre: "Children's" },
  { pattern: /\b(classic|literature|literary)\b/i, genre: 'Classics' },
  { pattern: /\b(bio|biography|memoir|autobiography)\b/i, genre: 'Biography' },
  { pattern: /\b(religion|spiritual|faith|bible|christian|theology|inspiration)\b/i, genre: 'Religion & Spirituality' },
  { pattern: /\b(educ|academic|school|college|university|textbook|reference)\b/i, genre: 'Education' },
  { pattern: /\b(tech|computer|programming|software|internet|digital|data|science|engineering)\b/i, genre: 'Technology' },
  { pattern: /\b(health|medical|wellness|fitness|nutrition|medicine|diet)\b/i, genre: 'Health & Wellness' },
  { pattern: /\b(travel|adventure|explor|journey)\b/i, genre: 'Travel' },
  { pattern: /\b(art|photo|design|music|film|cinema|drama|poetry)\b/i, genre: 'Art & Entertainment' },
  { pattern: /\b(cook|food|recipe|kitchen|baking|culinary)\b/i, genre: 'Cooking & Food' },
  { pattern: /\b(sport|game|outdoor|fitness|recreation)\b/i, genre: 'Sports & Recreation' },
  { pattern: /\b(business|finance|economy|invest|market|management|leadership)\b/i, genre: 'Business' },
  { pattern: /\b(self.?help|motivation|psychology|personal|growth|success)\b/i, genre: 'Self-Help' },
  { pattern: /\b(comic|graphic novel|manga|cartoon)\b/i, genre: 'Comics & Graphic Novels' },
  { pattern: /\b(nature|environment|ecology|garden|animal|wildlife)\b/i, genre: 'Nature & Science' },
  { pattern: /\b(philosophy|thought|ethics|logic|wisdom)\b/i, genre: 'Philosophy' },
];

const majorPublisherGenre: Record<string, string> = {
  'harlequin': 'Romance',
  'silhouette': 'Romance',
  'avon': 'Romance',
  'dell': 'Romance',
  'jove': 'Romance',
  'penguin': 'General Fiction',
  'viking': 'General Fiction',
  'knopf': 'General Fiction',
  'penguin classics': 'Classics',
  'random house': 'General Fiction',
  'harpercollins': 'General Fiction',
  'simon & schuster': 'General Fiction',
  'st. martin\'s': 'Mystery & Thriller',
  'ballantine': 'General Fiction',
  'bantam': 'General Fiction',
  'doubleday': 'General Fiction',
  'berkley': 'Romance',
  'signet': 'General Fiction',
  'tor': 'Science Fiction',
  'orbit': 'Science Fiction',
  'del rey': 'Science Fiction',
  'baen': 'Science Fiction',
  'scholastic': "Children's",
  'harpertrophy': "Children's",
  'yearling': "Children's",
  'puffin': "Children's",
  'dover': 'Classics',
  'oxford university press': 'Education',
  'cambridge university press': 'Education',
  'wiley': 'Technology',
  'mcgraw-hill': 'Education',
  "o'reilly": 'Technology',
  'springer': 'Technology',
  'mit press': 'Technology',
};

export function mapPublisherToGenre(publisher: string): string {
  if (!publisher) return 'Other';

  const lower = publisher.toLowerCase().trim();

  for (const [key, genre] of Object.entries(majorPublisherGenre)) {
    if (lower.includes(key)) return genre;
  }

  for (const { pattern, genre } of genreKeywords) {
    if (pattern.test(lower)) return genre;
  }

  return 'General Fiction';
}

export const GENRE_LIST = [
  'Romance',
  'Mystery & Thriller',
  'Science Fiction',
  'Fantasy',
  'Horror',
  'Historical Fiction',
  "Children's",
  'Classics',
  'Biography',
  'Religion & Spirituality',
  'Education',
  'Technology',
  'Health & Wellness',
  'Travel',
  'Art & Entertainment',
  'Cooking & Food',
  'Sports & Recreation',
  'Business',
  'Self-Help',
  'Comics & Graphic Novels',
  'Nature & Science',
  'Philosophy',
  'General Fiction',
  'Other',
];
