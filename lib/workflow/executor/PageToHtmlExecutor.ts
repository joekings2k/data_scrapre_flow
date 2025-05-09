import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { PageToHtmlTask } from "../task/PageToHtml";
export async function PageToHtmlExecutor (environment:ExecutionEnvironment<typeof PageToHtmlTask>):Promise<boolean>{
 try {
 const html  = await environment.getPage()!.content()
 environment.setOutput("Html",html)
  return true;
 } catch (error:any) {
  environment.log.error(`Error in PageToHtmlExecutor: ${error.message}`);
  return false;
 }
}