const puppeteer = require('puppeteer')

const test = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    'https://angular-6-registration-login-example.stackblitz.io/register'
  )
  let bodyHTML = await page.evaluate(() => document.body.innerHTML)
  console.log(bodyHTML)
  await page.waitFor('#promptToRun')
  let button = await page.evaluate(() => [
    ...document.querySelectorAll('button'),
  ])
  console.log(button)
  await page.evaluate(() => [...document.querySelectorAll('button')][0].click())
  console.log('dimos click')

  await page.waitFor('app')
  bodyHTML = await page.evaluate(() => document.body.innerHTML)
  console.log('tigre este de aca', bodyHTML)
  await browser.close()
}

test()
