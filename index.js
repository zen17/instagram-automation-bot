const puppeteer = require('puppeteer');
const config = require('./config/puppeteer.json');
const credentials = require('./config/credentials.json');
const choosePhoto = require('./scripts/choose-photo');
const path = require('path');

(async () => {

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(config.unsplash_base_url+ config.photo_category);

  const imageUrls = await page.evaluate(() => Array.from(document.images, e => e.src));
  await choosePhoto.choosePhotoAndDownload(imageUrls);

  await page.goto(config.instagram_base_url, {timeout: 60000});
  await page.emulate(puppeteer.devices['iPhone 6']);
  await page.click(config.selectors.first_login_button)
  await page.click(config.selectors.username_field);
  await page.keyboard.type(credentials.username);
  await page.click(config.selectors.password_field);
  await page.keyboard.type(credentials.password);
  await page.waitForTimeout(1000);
  await page.click(config.selectors.login_button);
  await page.waitForNavigation();
  await page.click(config.selectors.not_now_save_credentials_button);
  await page.waitForNavigation();
  const [fileChooser] = await Promise.all([page.waitForFileChooser(), page.click(config.selectors.post_photo_button),]);
  await fileChooser.accept([path.join(process.cwd(),'image.png')]);
  await page.waitForSelector(config.selectors.next_step_instagram)
  await page.click(config.selectors.next_step_instagram)
  await page.waitForTimeout(3000);
  await page.click(config.selectors.next_step_instagram)
  await page.waitForNavigation();
  await page.waitForTimeout(5000);
  await browser.close();
})();
