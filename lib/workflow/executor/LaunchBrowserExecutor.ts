import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
export async function LaunchBrowserExecutor (environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
 try {
  const websiteUrl  = environment.getInput("Browser Url")
  console.log("Launching browser...",websiteUrl);
  const browser = await puppeteer.launch({
    headless: true
  });
  environment.setBrowser(browser)
  const page = await browser.newPage();
  await page.goto(websiteUrl);
  environment.setPage(page)
  console.log("Browser launched successfully");
  
  return true;
 } catch (error:any) {
  environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
  return false;
}
}