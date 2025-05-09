import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { PageToHtmlTask } from "../task/PageToHtml";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";
export async function ExtractTextFromElementExecutor (environment:ExecutionEnvironment<typeof ExtractTextFromElementTask>):Promise<boolean>{
 try {
 const selector =environment.getInput("Selector")
 if(!selector){
  environment.log.error("selector is not defined");
  return false;
}
const html =environment.getInput("Html")
if(!html){
  environment.log.error("html is not defined");
  return false;
}
const $ = cheerio.load(html);
const element= $(selector);
if(!element){
  environment.log.error("element is not defined");
  return false;
}
const extractedText = $.text(element)
if (!extractedText){
  environment.log.error("element has no text");
  return false;
}
environment.setOutput("Extracted text",extractedText)
  return true;
 } catch (error:any) {
  environment.log.error(`Error in ExtractTextFromElementExecutor: ${error.message}`);
  return false;
 }
}