import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
export async function LaunchBrowserExecutor (environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
 try {
  const websiteUrl  = environment.getInput("Browser Url")
  console.log("Launching browser...",websiteUrl);
  const browser = await puppeteer.launch({
    headless: false,
  });
  await waitFor(3000)
  await browser.close();
  console.log("Browser launched successfully");
  return true;
 } catch (error) {
  console.log(error); 
  return false;
 }
}