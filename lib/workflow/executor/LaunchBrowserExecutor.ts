import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { env } from "process";
export async function LaunchBrowserExecutor (environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
 try {
  const websiteUrl  = environment.getInput("Browser Url")
  
  const browser = await puppeteer.launch({
    headless: true
  });
  environment.log.info('Browser launched successfully');
  environment.setBrowser(browser)
  const page = await browser.newPage();
  console.log(`Navigating to ${websiteUrl}`);
  await page.goto(websiteUrl);
  environment.setPage(page)
  environment.log.info(`Browser navigated to ${websiteUrl}`);
  return true;
 } catch (error:any) {
  environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
  return false;
}
}