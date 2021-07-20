"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs-extra");

const vins = [
  
];

////////////////////////////////////////////////////////////////////////

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 12 });
    const page = await browser.newPage();
    // page.on("console", (consoleObj) => console.log(consoleObj.text()));

    await page.goto("https://app.traderev.com/#!/activity", {
      waitUntil: "networkidle0",
    });

    await page.type(".ng-pristine", "");
    await page.click("button.primary");
    await page.waitForNavigation();

    await page.waitForSelector("#okta-signin-password");
    await page.focus("#okta-signin-password");
    await page.type("#okta-signin-password", ")");
    await page.click("#okta-signin-submit");

    await page.waitForSelector(".user-item");
    const user = await page.$(".user-item:nth-child(1)");
    user.click();

    await fs.writeFile("oop.csv", "oop\n");

    for (let i = 0; i < vins.length; i++) {
      await page.waitForSelector("input.csu-vin-search__input");
      await page.focus("input.csu-vin-search__input");
      await page.type("input.csu-vin-search__input", vins[i]);

      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button.btn--main"));
        if (buttons.length === 1) {
          buttons[0].click();
        } else if (buttons.length === 2) {
          buttons[1].click();
        }
      })

      // await page.focus("button.btn--main");
      // await page.click("button.btn--main");

      await page.waitForSelector("a.thumbnail-wrapper__link");

      await page.evaluate(() => {
        const thumbnails = Array.from(
          document.querySelectorAll("a.thumbnail-wrapper__link")
        );
        if (thumbnails.length === 1) {
          thumbnails[0].click();
        } else if (thumbnails.length === 2) {
          thumbnails[1].click();
        } else if (thumbnails.length === 3) {
          thumbnails[2].click();
        } else if (thumbnails.length === 4) {
          thumbnails[4].click();
        }
      });

      await page.waitForNavigation({
        waitUntil: "networkidle2",
      });

      while (await page.$("h1.side-container__title--lost")) {
        console.log("found");
        await page.goBack();
        await page.waitForSelector("a.thumbnail-wrapper__link");
        await page.evaluate(() => {
          const thumbnails = Array.from(
            document.querySelectorAll("a.thumbnail-wrapper__link")
          );
          if (thumbnails.length === 2) {
            thumbnails[0].click();
          }
        });
      }

      // if (await page.waitForXPath('//h1[contains(text(), "lost")]')) {
      //   await page.goBack();
      //   await page.waitForSelector("a.thumbnail-wrapper__link");
      //   await page.evaluate(() => {
      //     const thumbnails = Array.from(
      //       document.querySelectorAll("a.thumbnail-wrapper__link")
      //     );
      //     if (thumbnails.length === 2) {
      //       thumbnails[0].click();
      //     } else {
      //       thumbnails[0].click();
      //     }
      //   });
      // } else {
      //   await page.waitForSelector("span.icon-TR-Font_Accordion");
      // }

      // await page.waitForSelector(".side-container__title");
      // await page.waitForSelector(".side-container__title--lost");

      // const status = await page.$x("//h1[contains(., 'lost')]");

      // if (status[0]) {
      //   // console.log("h1 is here");
      //   await page.goBack();
      //   await page.waitForSelector("a.thumbnail-wrapper__link");
      //   await page.evaluate(() => {
      //     const thumbnails = Array.from(
      //       document.querySelectorAll("a.thumbnail-wrapper__link")
      //     );
      //     if (thumbnails.length === 2) {
      //       thumbnails[0].click();
      //     }
      //   });
      // }

      await page.waitForSelector("span.icon-TR-Font_Accordion");
      await page.click("span.icon-TR-Font_Accordion");

      await page.waitForSelector("ul.details-section__list-two-column");

      const check = await page.$x("//div[contains(., 'Out of Prov/State')]");
      //returns array, so i need to select the first element [0] to get the div with the text 'Out of Prov/State', or else it will take every div

      if (check[0]) {
        await page.goBack();
        await page.waitForSelector(".csu-search-form__input");
        const oop = await page.evaluate(() => {
          const outofprov = document.querySelector(".csu-search-form__input");
          return outofprov.value;
        });
        console.log(oop);
        await fs.appendFile("oop.csv", `"${oop}"\n`);
        await page.goto("https://app.traderev.com/#!/activity", {
          waitUntil: "networkidle0",
        });
      } else {
        console.log("going back");
        await page.goto("https://app.traderev.com/#!/activity", {
          waitUntil: "networkidle0",
        });
      }
    }
    await browser.close();
  } catch (e) {
    console.log("our error", e);
  }
})();
