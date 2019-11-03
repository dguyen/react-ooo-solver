import { WikiItem } from "./WikipediaAPI";

interface Relation {
  overlapTitles: Array<string>;
  excludedTitle: string;
  overlapCategories: string[];
}

interface Intersection {
  intersect: Array<WikiItem>;
  exclusion: string;
}

export class SolverAPI {

  oddOneOut(items: Array<WikiItem>): void {
    this.verifyItems(items);
    const relations: Array<Relation> = [];
    const intersections = this.getIntersections(items);

    let currMax = 0;
    // let maxIndex = 0;
    let currMaxStuff = null;

    for (let i = 0; i < intersections.length; i++) {
      const tmp = this.getAllCategories(intersections[i].intersect);
      if (tmp.overlapCategories.length > 0 && tmp.overlapCategories.length > currMax) {
        currMax = tmp.overlapCategories.length;
        currMaxStuff = intersections[i];
      }
      relations.push(tmp);
      console.log(relations);
    }

    console.log(currMax);
    console.log(currMaxStuff);
  }

  private getIntersections(items: Array<WikiItem>): Array<Intersection> {
    const output: Array<Intersection> = [];
    for (let i = 0; i < items.length; i++) {
      let itemsCopy = items.slice();
      itemsCopy.splice(i, 1);

      output.push({
        exclusion: items[i].title,
        intersect: itemsCopy,
      });
    }
    return output;
  }

  private getAllCategories(items: Array<WikiItem>): Relation {
    let arrayOfItems = items.slice();
    let tmpHolder: Relation = {
      overlapTitles: [items[0].title],
      excludedTitle: '',
      overlapCategories: items[0].categories
    }

    for (let i = 1; i < arrayOfItems.length; i++) {
      tmpHolder.overlapTitles.push(arrayOfItems[i].title);
      tmpHolder.overlapCategories = tmpHolder.overlapCategories.filter(x => arrayOfItems[i].categories.includes(x));
    }
    return tmpHolder;
  }

  verifyItems(items: Array<WikiItem>): void {
    if (items.length <= 2) {
      throw new Error('Invalid parameter length');
    }
    items.forEach(item => {
      if (!item.exists || item.isAmbiguous) {
        throw new Error('Items not ready');
      }
    });
  }

}
