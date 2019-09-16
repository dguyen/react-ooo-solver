const CATEGORY_ENDPOINT = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=categories&redirects&cllimit=max&clshow=!hidden&titles="
const LINKS_ENDPOINT = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles="

export interface WikiItem {
  categories: Array<string>;
  isAmbiguous: boolean;
  title: string;
}

/**
 * Concatenates a list of strings into a valid query for WikipediaAPI
 * @param items a list of strings that will be concatenated together
 */
const createStringURL = (items: Array<string>) => {
  let listOfItems = ""
  items.forEach(anItem => {
    listOfItems += anItem.replace(" ", "_") + "|"
  });
  return listOfItems.slice(0, -1);
}

/**
 * Returns true if given string matches being disambiguous and therefore is 'clear'
 * @param givenString the given string to check
 */
const checkAmbiguity = (givenString: string) => {
  return givenString === 'Category:Disambiguation pages';
}

export default {
  getCategories: (title: string): Promise<WikiItem> => {
    return new Promise((resolve, reject) => {
      fetch(CATEGORY_ENDPOINT + title).then((data) => data.json()).then((data) => {
        const pageKey = Object.keys(data.query.pages)[0];
        if (pageKey === '-1') {
          reject('Not found');
          return;
        }
        const pageData = data.query.pages[pageKey];
        resolve({
          title: pageData.title,
          categories: pageData.categories.map((item: any) => item.title),
          isAmbiguous: checkAmbiguity(pageData.categories[0].title)
        })
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
