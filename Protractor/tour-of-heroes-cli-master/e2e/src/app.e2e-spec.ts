"use strict"; // necessary for es6 output in node

import {
  browser,
  element,
  by,
  ElementFinder,
  ElementArrayFinder,
} from "protractor";
import { promise } from "selenium-webdriver";

const expectedH1 = "Tour of Heroes";
const expectedTitle = `${expectedH1}`;
const targetHero = { id: 15, name: "Magneta" };
const targetHeroDashboardIndex = 3;
const nameSuffix = "X";
const newHeroName = targetHero.name + nameSuffix;
const expectedHeroName = "Dr Strange";

class Hero {
  id: number;
  name: string;

  // Factory methods

  // Hero from string formatted as '<id> <name>'.
  static fromString(s: string): Hero {
    return {
      id: +s.substr(0, s.indexOf(" ")),
      name: s.substr(s.indexOf(" ") + 1),
    };
  }

  // Hero from hero list <li> element.
  static async fromLi(li: ElementFinder): Promise<Hero> {
    let stringsFromA = await li.all(by.css("a")).getText();
    let strings = stringsFromA[0].split(" ");
    return { id: +strings[0], name: strings[1] };
  }

  // Hero id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Hero> {
    // Get hero id from the first <div>
    let _id = await detail.all(by.css("div")).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css("h2")).getText();
    return {
      id: +_id.substr(_id.indexOf(" ") + 1),
      name: _name.substr(0, _name.lastIndexOf(" ")),
    };
  }
}

describe("Proyecto base", () => {
  beforeAll(() => browser.get(""));

  function getPageElts() {
    let navElts = element.all(by.css("app-root nav a"));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css("app-root app-dashboard")),
      topHeroes: element.all(by.css("app-root app-dashboard > div h4")),

      appHeroesHref: navElts.get(1),
      appHeroes: element(by.css("app-root app-heroes")),
      allHeroes: element.all(by.css("app-root app-heroes li")),
      selectedHeroSubview: element(
        by.css("app-root app-heroes > div:last-child")
      ),

      heroDetail: element(by.css("app-root app-hero-detail > div")),

      searchBox: element(by.css("#search-box")),
      searchResults: element.all(by.css(".search-result li")),
    };
  }

  describe("Initial page", () => {
    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
      expectHeading(1, expectedH1);
    });

    const expectedViewNames = ["Dashboard", "Heroes"];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) =>
        el.getText()
      );
      expect(viewNames).toEqual(expectedViewNames);
    });

    it("has dashboard as the active view", () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });
  });

  describe("CRUD Heroes", () => {
    it("Search heroes", () => {
      let { heroDetail } = getPageElts();
      browser.get("http://localhost:4200/detail/12").then(() => {
        let heroName = heroDetail.element(by.tagName("h2"));

        heroName
          .getText()
          .then((text) => expect(text.split(" ")[0]).toBe("NARCO"));
      });
    });

    it("Delete heroes", () => {
      browser.get("http://localhost:4200/heroes").then(() => {
        let { allHeroes } = getPageElts();
        let heroEl = allHeroes.first();
        heroEl
          .element(by.css("a"))
          .getText()
          .then((text) => {
            let hero = Hero.fromString(text);

            heroEl
              .element(by.css(".delete"))
              .click()
              .then(() => {
                allHeroes.each((el) => {
                  el.element(by.css("a"))
                    .getText()
                    .then((text) => {
                      let temp = Hero.fromString(text);

                      expect(
                        hero.id === temp.id && hero.name === temp.name
                      ).toBeFalsy();
                    });
                });
              });
          });
      });
    });

    it("Edit heroes", () => {
      let { heroDetail, allHeroes } = getPageElts();

      allHeroes
        .first()
        .element(by.css("a"))
        .getText()
        .then((text) => {
          let selectedHero = Hero.fromString(text);

          allHeroes
            .first()
            .click()
            .then(() => {
              heroDetail
                .element(by.css("input"))
                .clear()
                .then(() =>
                  heroDetail.element(by.css("input")).sendKeys(expectedHeroName)
                );
              heroDetail
                .all(by.css("button"))
                .last()
                .click()
                .then(() => {
                  allHeroes.each((el) => {
                    el.element(by.css("a"))
                      .getText()
                      .then((text) => {
                        let hero = Hero.fromString(text);

                        if (hero.id === selectedHero.id) {
                          expect(hero.name).toBe(expectedHeroName);
                        }
                      });
                  });
                });
            });
        });
    });
  });

  describe("Navigation", () => {
    it("To hero from dashboard", () => {
      browser.get("http://localhost:4200/dashboard").then(() => {
        let { appDashboard, heroDetail } = getPageElts();
        let topElement = appDashboard.all(by.css("div")).first();
        let link = topElement.all(by.css("a")).first();

        topElement
          .all(by.css("div > h4"))
          .first()
          .getText()
          .then((name) => {
            link.click().then(() => {
              let heroName = heroDetail.element(by.tagName("h2"));

              heroName
                .getText()
                .then((text) =>
                  expect(text.split(" ")[0]).toBe(name.toUpperCase())
                );
            });
          });
      });
    });

    it("To hero from hero list", () => {
      browser.get("http://localhost:4200/heroes").then(() => {
        let { allHeroes, heroDetail } = getPageElts();

        allHeroes
          .first()
          .element(by.css("a"))
          .getText()
          .then((text) => {
            let selectedHero = Hero.fromString(text);

            allHeroes
              .first()
              .click()
              .then(() => {
                heroDetail
                  .all(by.css("div"))
                  .first()
                  .getText()
                  .then((heroId) => {
                    let idNumber = +heroId.split(" ")[1];

                    expect(selectedHero.id === idNumber).toBeTruthy();
                  });
              });
          });
      });
    });

    it("To hero from search bar", () => {
      browser.get("http://localhost:4200/dashboard").then(() => {
        let { searchBox, searchResults, heroDetail } = getPageElts();

        searchBox.sendKeys("Magneta").then(() => {
          searchResults
            .first()
            .click()
            .then(() => {
              let heroName = heroDetail.element(by.tagName("h2"));

              heroName
                .getText()
                .then((text) => expect(text.split(" ")[0]).toBe("MAGNETA"));
            });
        });
      });
    });
  });
});

function addToHeroName(text: string): promise.Promise<void> {
  let input = element(by.css("input"));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
  let hTag = `h${hLevel}`;
  let hText = element(by.css(hTag)).getText();
  expect(hText).toEqual(expectedText, hTag);
}

function getHeroAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText("li span.badge", id.toString()));
  return spanForId.element(by.xpath(".."));
}

function getHeroLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText("li span.badge", id.toString()));
  return spanForId.element(by.xpath("../.."));
}

async function toHeroArray(allHeroes: ElementArrayFinder): Promise<Hero[]> {
  let promisedHeroes = await allHeroes.map(Hero.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>>Promise.all(promisedHeroes);
}
