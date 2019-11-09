import { WikiItem } from "./WikipediaAPI";

interface Relation {
  overlapTitles: Array<string>;
  excludedTitle: string;
  overlapCategories: string[];
}

interface Intersection {
  intersect: Array<WikiItem>;
  exclusion: WikiItem;
}
/**
 * Interface describing the odd item out
 *   oddItem - the odd item out
 *   overlaps - the categories that excluded it
 *   groupedItems - the other items
 */
export interface OddOneOut {
  oddItem: WikiItem;
  overlaps: string[];
  groupedItems: WikiItem[];
}

export class SolverAPI {

  oddOneOut(items: Array<WikiItem>): OddOneOut | null {
    const error =  this.verifyItems(items);
    if (error) {
      throw error;
    }
    const relations: Array<Relation> = [];
    const intersections = this.getIntersections(items);

    let currMaxIndex = 0;
    let currMaxValue = null;

    for (let i = 0; i < intersections.length; i++) {
      const tmp = this.getAllCategories(intersections[i]);
      
      if (tmp.overlapCategories.length > 0 && tmp.overlapCategories.length > currMaxIndex) {
        currMaxIndex = tmp.overlapCategories.length;
        currMaxValue = {
          intersections: intersections[i],
          categories: tmp,
        }
      }
      relations.push(tmp);
    }
    
    if (!currMaxValue) {
      return null;
    }
  
    return {
      oddItem: currMaxValue.intersections.exclusion,
      overlaps: currMaxValue.categories.overlapCategories,
      groupedItems: currMaxValue.intersections.intersect,
    }
  }

  private getIntersections(items: Array<WikiItem>): Array<Intersection> {
    const output: Array<Intersection> = [];
    for (let i = 0; i < items.length; i++) {
      let itemsCopy = items.slice();
      itemsCopy.splice(i, 1);
      
      output.push({
        exclusion: items[i],
        intersect: itemsCopy,
      });
    }
    return output;
  }

  private getAllCategories(intersections: Intersection): Relation {
    let arrayOfItems = intersections.intersect.slice();
    let tmpHolder: Relation = {
      overlapTitles: [arrayOfItems[0].title],
      excludedTitle: intersections.exclusion.title,
      overlapCategories: arrayOfItems[0].categories
    }

    for (let i = 1; i < arrayOfItems.length; i++) {
      tmpHolder.overlapTitles.push(arrayOfItems[i].title);
      tmpHolder.overlapCategories = tmpHolder.overlapCategories.filter(x => arrayOfItems[i].categories.includes(x));
    }
    return tmpHolder;
  }

  /**
   * Verify the given items. Returns error if items invalid otherwise returns null
   * @param items - WikiItems to verify
   */
  verifyItems(items: Array<WikiItem>): Error | null {
    if (items.length <= 2) {
      return Error('Invalid parameter length');
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i] === undefined || !items[i].exists || items[i].isAmbiguous) {        
        return Error('Items not ready');
      }
    }
    return null;
  }

}
