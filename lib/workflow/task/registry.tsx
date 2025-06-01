import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./FIllInput";
import { ClickElementTask } from "./ClickElement";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebhookTask } from "./DeliverViaWebhook";
import { ExtractDataWithAITask } from "./ExtractDataWithAI";
import { ReadPropertyFromJSONTask } from "./ReadPropertyFromJSON";
import { AddPropertyToJSONTask } from "./AddPropertyTojson";
import { NavigateUrlTask } from "./NavigateUrl";
import { ScrollToElementTask } from "./ScrollToElement";


type Registery = {
  [k in TaskType]: WorkflowTask & { type: k };
};
export const TaskRegistry: Registery = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT:WaitForElementTask,
  DELIVER_VIA_WEBHOOK:DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI:ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON:ReadPropertyFromJSONTask,
  ADD_PROPERTY_TO_JSON:AddPropertyToJSONTask,
  NAVIGATE_URL:NavigateUrlTask,
  SCROLL_TO_ELEMENT:ScrollToElementTask,
};
