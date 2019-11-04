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
 * A Wikipedia class that has the following main functions
 *  - Get information on a specfic item
 *  - Get categories relating to a specific item
 *  - Cache items for faster loads
 */
export class Wikipedia {
  // Items that have their categories stored 
  private storedItems: { [id: string]: string[] } = {};

  // Items that have already been searched and resolved
  private completedItems: { [id: string]: WikiItem } = {};

  /**
   * Obtains information about a given item and returns it as a WikiItem
   * @param item - item to search up
   */
  getInfo(item: string): Promise<WikiItem> {
    return new Promise((resolve, reject) => {
      // If item has already been found, resolve it
      if (this.completedItems.hasOwnProperty(item.toLowerCase())) {
        resolve(this.completedItems[item.toLowerCase()]);
        return;
      }

      // Fetch data from Wikipedia about the item
      fetch(CATEGORY_ENDPOINT + item).then(data => data.json()).then(async res => {
        const pageKey = Object.keys(res.query.pages)[0];
        const isValid = pageKey !== '-1';

        if (!isValid) {
          resolve(this.getMissingWikiItem(item));
          return;
        }

        const filteredRes = res.query.pages[pageKey];
        const isAmbiguous = isValid ? this.checkAmbiguity(filteredRes.categories[0].title) : false;
        let categories = filteredRes.categories.map((item: any) => item.title)

        // Search the categories again for more categories
        if (categories.length > 0 && isValid && !isAmbiguous) {
          await this.getCategories(categories).then((deepCategories: string[]) => {
            categories.push(...deepCategories);
          });
        }

        // Save the item and resolve it
        this.completedItems[item.toLowerCase()] = {
          title: filteredRes.title,
          originalTitle: item,
          exists: isValid,
          links: [],
          extract: isValid ? filteredRes.extract : '',
          categories: this.cleanCategories(categories),
          isAmbiguous: isAmbiguous
        };
        resolve(this.completedItems[item.toLowerCase()]);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Returns categories of categories
   * @param categories - list of categories to search
   */
  getCategories(categories: string[]): Promise<string[]> {
    const output: string[] = [];
    const reducedCategories: string[] = [];

    // Checks if item has already been searched and adds it
    categories.forEach(category => {
      if (this.storedItems.hasOwnProperty(category)) {
        output.push(...this.storedItems[category]);
      } else {
        reducedCategories.push(category);
      }
    });
    const categoryLinks = this.createStringURL(reducedCategories);

    return new Promise((resolve, reject) => {
      if (categories.length <= 0) {
        resolve([]);
        return;
      }
      fetch(CATEGORY_ENDPOINT + categoryLinks).then(res => res.json()).then((res) => {
        let pages = res.query.pages;
        // Go through each page and store the categories into class object 'storedItems'
        for (const pageId in pages) {
          if (pages.hasOwnProperty(pageId)) {
            const page = pages[pageId];
            const parsedId = Number.parseInt(pageId);
            // Checks if page is valid
            if (!Number.isNaN(parsedId) && parsedId > 0) {
              // Checks if data has already been stored
              if (!this.storedItems.hasOwnProperty(page.title)) {
                if (page.categories) {
                  this.storedItems[page.title] = page.categories.map((x: any) => x.title);
                  output.push(...page.categories.map((x: any) => x.title));
                } else {
                  output.push(page.title);
                }
              }
            }
          }
        }
        resolve(output);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Returns all ambiguous links relating to the item   
   * @param item - the item to find ambiguous links for
   */
  getAmbiguousLinks(item: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fetch(LINKS_ENDPOINT + item).then(data => data.json()).then((data) => {
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

  /**
   * Returns a missing WikiItem
   * @param title - the title of the error item
   */
  private getMissingWikiItem(title: string): WikiItem {
    return {
      title,
      originalTitle: title,
      exists: false,
      links: [],
      extract: '',
      categories: [],
      isAmbiguous: false
    }
  }

  /**
    * Concatenates the array of strings inputted into a viable string to be appended onto an URL
    * @param {Array<string>} items an array of strings to be concatenated
    * @return {string} a string generated by the concatenation of the input  
  */   
  private createStringURL(items: Array<string>): string {
    let listOfItems = "";
    let duplicateMap: { [id: string]: boolean } = {};
    items.forEach(anItem => {
      if (!duplicateMap.hasOwnProperty(anItem)) {
        listOfItems += anItem.replace(new RegExp(/ /g), "_") + "|";
      }
      duplicateMap[anItem] = true;
    });
    return listOfItems.slice(0, -1);
  }

  /**
   * Returns true if given string matches being disambiguous and therefore is 'clear'
   * @param givenString the given string to check
   */
  private checkAmbiguity(givenString: string): boolean {
    return givenString === 'Category:Disambiguation pages';
  }

  /**
   * Removes the string 'Category:' from the given string
   * @param category a string that represents a category
   */
  private trimCategory(category: string): string {
    if (category.match('^\\b(Category:)+')) {
      return category.slice(9);
    }
    return category;
  }

  /**
   * Removes duplicates and removes Category prefix
   * @param items - list of items to be cleaned
   */
  private cleanCategories(items: string[]): string[] {
    const map: { [id: string]: boolean } = {};
    const output: string[] = [];
    items.forEach(item => {
      if (!map.hasOwnProperty(item)) {
        map[item] = true;
        output.push(this.trimCategory(item));
      }
    });
    return output;
  }
}
