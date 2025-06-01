import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { PageToHtmlTask } from "../task/PageToHtml";
import { FillInputTask } from "../task/FIllInput";
import { env } from "process";
import { waitFor } from "@/lib/helper/waitFor";
export async function FillInputsExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector is not defined");
      return false;
    }
    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input->value is not defined");
      return false;
    }
    await environment.getPage()!.type(selector, value);
    return true;
  } catch (error: any) {
    environment.log.error(`Error in FillInputsExecutor: ${error.message}`);
    return false;
  }
}
