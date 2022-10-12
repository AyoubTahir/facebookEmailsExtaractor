const extractEmails = async (page, linkToExtarct, numberOfPostsToExtract) => {
  await page.goto(linkToExtarct, { waitUntil: "load" });

  await page.waitForTimeout(5000);

  console.log("Extracting Emails from the list");

  let emails = [];

  for (let i = 2; i <= numberOfPostsToExtract + 2; i++) {
    try {
      let selector =
        "div.x1xfsgkm.x1gan7if.xqmdsaz.x1miatn0.x193iq5w.x9f619 div.x193iq5w.x1xwk8fm:nth-child(1) > :nth-child(" +
        i +
        ")";

      await page.waitForSelector(selector);

      await page.evaluate((sel) => {
        document.querySelector(sel).scrollIntoView({ behavior: "smooth" });
      }, selector);

      try {
        //click comments
        await page.waitForSelector(
          selector +
            " div.x6s0dn4.x78zum5.x2lah0s.x17rw0jw div.xnfveip span span",
          { timeout: 5000 }
        );
        await page.click(
          selector +
            " div.x6s0dn4.x78zum5.x2lah0s.x17rw0jw div.xnfveip span span"
        );

        try {
          //click view more comments
          await page.waitForSelector(
            selector +
              " div.x1jx94hy.x12nagc div.x78zum5.x1iyjqo2.x21xpn4.x1n2onr6 span.x78zum5.x1w0mnb.xeuugli span",
            { timeout: 5000 }
          );
          await page.click(
            selector +
              " div.x1jx94hy.x12nagc div.x78zum5.x1iyjqo2.x21xpn4.x1n2onr6 span.x78zum5.x1w0mnb.xeuugli span"
          );
        } catch (err) {
          console.log("No more comments to view");
        }

        await page.waitForTimeout(5000);

        const rawEmails = await page.evaluate((sel) => {
          const items = Array.from(
            document.querySelectorAll(
              sel +
                " div.x10wlt62.x6ikm8r.x9jhf4c.x30kzoy.x13lgxp2.x168nmei div.x1jx94hy.x12nagc ul div[style='text-align: start;']"
            )
          );
          return items
            .map((item) => item.innerText)
            .filter((item) => item.includes("@"));
        }, selector);

        //rawEmails.filter((item) => item.innerText.includes("@"));

        emails = [...emails, ...rawEmails];
      } catch (error) {
        console.log("This post dosent have comments");
      }
    } catch (errors) {
      console.log("this the last post");
      break;
    }
  }

  let cleanEmailList = [];

  emails.forEach((email) => {
    cleanEmailList = [
      ...cleanEmailList,
      ...email.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi),
    ];
  });

  return cleanEmailList;

  //return await scrapeInfiniteScrollItems(page, numberOfPostsToExtract);
};

const scrapeInfiniteScrollItems = async (page, itemTargetCount) => {
  let items = [];

  let previousHeight;

  try {
    while (itemTargetCount > items.length) {
      items = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll(
            "div.x1xfsgkm.x1gan7if.xqmdsaz.x1miatn0.x193iq5w.x9f619 div.x193iq5w.x1xwk8fm div.x1ja2u2z.xh8yej3.x1n2onr6.x1yztbdb"
          )
        );
        return items.map(
          (cleanedItem) => cleanedItem.querySelector("a div div div").innerText
        );
      });

      previousHeight = await page.evaluate(
        "document.documentElement.scrollHeight"
      );
      await page.evaluate(
        "window.scrollTo(0, document.documentElement.scrollHeight)"
      );
      await page.waitForFunction(
        `document.documentElement.scrollHeight > ${previousHeight}`,
        { timeout: 5000 }
      );
      await page.waitForTimeout(1000);
    }
  } catch (err) {}

  console.log(items.length + " username extracted");

  return items;
};

export default extractEmails;
