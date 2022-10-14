import { promises } from "fs";

const extractEmails = async (page, linkToExtarct, numberOfPostsToExtract) => {
  await page.goto(linkToExtarct.link, { waitUntil: "load" });

  await page.waitForTimeout(5000);

  console.log("Extracting Emails from the list");

  let emails = [];
  let oldNumberOfEmailsExtarcted = 0;
  let startFrom = linkToExtarct.startFrom;
  let activatePostition = linkToExtarct.activatePostition;
  let j = 0;

  if (!activatePostition) startFrom = 1;

  for (let i = startFrom; i <= numberOfPostsToExtract; i++) {
    let selector =
      "div.x1xfsgkm.x1gan7if.xqmdsaz.x1miatn0.x193iq5w.x9f619 div.x193iq5w.x1xwk8fm:nth-child(1) > :nth-child(" +
      i +
      ")";
    if (j < 7 && !activatePostition) {
      try {
        await page.waitForSelector(selector);

        await page.evaluate((sel) => {
          document.querySelector(sel).scrollIntoView({ behavior: "smooth" });
        }, selector);

        try {
          await page.waitForTimeout(5000);
          //click comments
          await page.waitForSelector(
            selector +
              " div.x6s0dn4.x78zum5.x2lah0s.x17rw0jw div.xnfveip span span",
            { timeout: 2000 }
          );
          await page.click(
            selector +
              " div.x6s0dn4.x78zum5.x2lah0s.x17rw0jw div.xnfveip span span"
          );

          try {
            //click to see all comments
            await page.waitForSelector(
              selector +
                " div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg div.x9f619.x1n2onr6.x1ja2u2z.xt0psk2.xuxw1ft",
              { timeout: 3000 }
            );
            await page.evaluate((sel) => {
              var scrollDiv = document.querySelector(sel).offsetTop;
              window.scrollTo({ top: scrollDiv + 500, behavior: "smooth" });
            }, selector);
            await page.waitForTimeout(2000);
            await page.click(
              selector +
                " div.x6s0dn4.x78zum5.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xe0p6wg div.x9f619.x1n2onr6.x1ja2u2z.xt0psk2.xuxw1ft"
            );

            //click all comments
            await page.waitForSelector(
              "div.x1n2onr6.x1fayt1i.xcxhlts div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6 :nth-child(1) > :nth-child(3)",
              { timeout: 3000 }
            );
            await page.waitForTimeout(2000);
            await page.click(
              "div.x1n2onr6.x1fayt1i.xcxhlts div.x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6 :nth-child(1) > :nth-child(3)"
            );
          } catch (er) {}

          j++;

          let morecomment = true;

          while (morecomment) {
            try {
              //click view more comments
              await page.waitForSelector(
                selector +
                  " div.x1jx94hy.x12nagc div.x78zum5.x1iyjqo2.x21xpn4.x1n2onr6 span.x78zum5.x1w0mnb.xeuugli span",
                { timeout: 5000 }
              );

              await page.evaluate((sel) => {
                const replay = document.querySelector(
                  sel +
                    " div.x1jx94hy.x12nagc div.x78zum5.x1iyjqo2.x21xpn4.x1n2onr6 span.x78zum5.x1w0mnb.xeuugli span"
                );
                if (replay && replay.innerText.includes("Hide")) {
                  replay.remove();
                }
              }, selector);

              await page.waitForTimeout(2000);
              await page.click(
                selector +
                  " div.x1jx94hy.x12nagc div.x78zum5.x1iyjqo2.x21xpn4.x1n2onr6 span.x78zum5.x1w0mnb.xeuugli span"
              );
            } catch (err) {
              morecomment = false;
              console.log("No (more comments) to view in this post");
            }
          }

          await page.waitForTimeout(5000);

          const rawEmails = await page.evaluate((sel) => {
            const items = Array.from(
              document.querySelectorAll(
                sel +
                  " div.x10wlt62.x6ikm8r.x9jhf4c.x30kzoy.x13lgxp2.x168nmei div.x1jx94hy.x12nagc ul li:not([class]) div.x1iorvi4.xjkvuk6.x1lliihq span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u"
              )
            );

            return items
              .map((it) =>
                it.innerText.replace(/[^\x20-\x7E]/gim, " ").toString()
              )
              .filter((item) => item.includes("@"));
          }, selector);

          rawEmails.forEach((rawEmail) => {
            try {
              emails = [
                ...emails,
                ...rawEmail.match(
                  /([A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z0-9._-]+)/gi
                ),
              ];
            } catch (err) {
              emails = [...emails, rawEmail];
              console.log("cant match this string");
            }
          });

          if (emails.length > oldNumberOfEmailsExtarcted) {
            console.log(
              emails.length -
                oldNumberOfEmailsExtarcted +
                " emails extracted from post number " +
                i
            );
            console.log(emails.length + " total emails extracted");

            oldNumberOfEmailsExtarcted = emails.length;

            await promises.writeFile(
              "./" + linkToExtarct.name + ".txt",
              emails.map((email) => email + "\n")
            );
          } else {
            console.log("0 emails found in post number " + i);
          }
        } catch (error) {
          console.log("This post dosent have comments");
        }
      } catch (errors) {
        console.log("this the last post");
        break;
      }
    } else {
      activatePostition = false;
      j = -1;
      await page.goto(linkToExtarct.link, { waitUntil: "load" });
      await page.waitForTimeout(5000);
      await infiniteScrollItems(page, selector);
      i--;
    }
  }

  console.log(
    "-->finished extracting " +
      linkToExtarct.name +
      " group and " +
      emails.length +
      " emails found "
  );
};

const infiniteScrollItems = async (page, selector) => {
  let previousHeight;
  while (true) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      await page.evaluate((selector) => {
        document.querySelector(selector).scrollIntoView({ behavior: "smooth" });
      }, selector);
      break;
    } catch (err) {
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
    }
  }
};

export default extractEmails;
