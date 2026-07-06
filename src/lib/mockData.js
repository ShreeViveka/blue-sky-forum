export let mockMagazines = [{ id: 1, title: 'Virtuoso Digest: Fantasy', year: 2026, month: 'June', cover_pdf: '#', magazine_pdf: '#' }];
export let mockWords = [{ id: 1, word: 'Serendipity', meaning: 'The occurrence and development of events by chance in a happy or beneficial way.', example: 'A fortunate stroke of serendipity.', pdf_file: '#' }];
export let mockContributors = [
  { id: 1, name: 'John Doe', year: '3rd Year', department: 'Computer Science' },
  { id: 2, name: 'Jane Smith', year: '2nd Year', department: 'English' },
];

export const addMagazine = (d) => { mockMagazines = [...mockMagazines, { id: Date.now(), ...d }]; };
export const addWord = (d) => { mockWords = [...mockWords, { id: Date.now(), ...d }]; };
export const addContributor = (d) => { mockContributors = [...mockContributors, { id: Date.now(), ...d }]; };
export const deleteMagazine = (id) => { mockMagazines = mockMagazines.filter(m => m.id !== id); };
export const deleteWord = (id) => { mockWords = mockWords.filter(w => w.id !== id); };
export const deleteContributor = (id) => { mockContributors = mockContributors.filter(c => c.id !== id); };