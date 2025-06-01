import { ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSON";
export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input->jsonData is not defined");
      return false;
    }
    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("input->propertyName is not defined");
      return false;
    }
    const parsedJson = JSON.parse(jsonData);
    const propertyValue = parsedJson[propertyName];
    if (!propertyValue) {
      environment.log.error("property not found in json");
      return false;
    }
    environment.setOutput("Property value", propertyValue);
    return true;
  } catch (error: any) {
    environment.log.error(`Error in READ_PROPERTY_FROM_JSON: ${error.message}`);
    return false;
  }
}
