const CATEGORY_ENDPOINT = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=categories|extracts&exintro&explaintext&redirects&cllimit=max&clshow=!hidden&titles='
const LINKS_ENDPOINT = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&redirects&format=json&prop=links&pllimit=max&titles='

export interface WikiItem {
  exists: boolean;
  categories: Array<string>;
  isAmbiguous: boolean;
  links: Array<string>;
  title: string;
  originalTitle: string;
  extract: string;
}

/**
 * Returns true if given string matches being disambiguous and therefore is 'clear'
 * @param givenString the given string to check
 */
const checkAmbiguity = (givenString: string) => {
  return givenString === 'Category:Disambiguation pages';
}

/**
 * Removes the string 'Category:' from the given string
 * @param category a string that represents a category
 */
const trimCategory = (category: string) => {
  if (category.match('^\\b(Category:)+')) {
    return category.slice(9);
  }
  return category;
}

export const WikipediaAPI = {
  getItemInfo: (title: string): Promise<WikiItem> => {
    return new Promise((resolve, reject) => {
      fetch(CATEGORY_ENDPOINT + title).then(data => data.json()).then((data) => {
        const pageKey = Object.keys(data.query.pages)[0];
        const exists = pageKey !== '-1';
        const pageData = data.query.pages[pageKey];
        resolve({
          title: exists ? pageData.title : '',
          originalTitle: title,
          exists: exists,
          links: [],
          extract: exists ? pageData.extract : '',
          categories: exists ? pageData.categories.map((item: any) => trimCategory(item.title)) : [],
          isAmbiguous: exists ? checkAmbiguity(pageData.categories[0].title) : false
        })
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getAmbiguousLinks: (title: string): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
      fetch(LINKS_ENDPOINT + title).then(data => data.json()).then((data) => {
        const pageKey = Object.keys(data.query.pages)[0];
        if (pageKey === '-1') {
          reject(new Error('Not Found'));
          return;
        }
        const pageData = data.query.pages[pageKey];
        resolve(pageData.links.map((linkObj: any) => linkObj.title));
      })
    });
  }
}
