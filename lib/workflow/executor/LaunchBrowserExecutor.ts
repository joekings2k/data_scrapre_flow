import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { env } from "process";
export async function LaunchBrowserExecutor (environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
 try {
  const websiteUrl  = environment.getInput("Browser Url")
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--proxy-server=brd.superproxy.io:33335"],
  });
  environment.log.info('Browser launched successfully');
  environment.setBrowser(browser)
  const page = await browser.newPage();
  await page.authenticate({
    username: "brd-customer-hl_36ae3361-zone-scrape_view",
    password: "c6cnl6qgqywo",
  });
  await page.goto(websiteUrl);
  environment.setPage(page)
  environment.log.info(`Browser navigated to ${websiteUrl}`);
  return true;
 } catch (error:any) {
  environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
  return false;
}
}