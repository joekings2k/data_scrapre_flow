import { ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSON";
import { AddPropertyToJSONTask } from "../task/AddPropertyTojson";
export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>
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
    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) {
      environment.log.error("input->propertyValue is not defined");
      return false;
    }
    const parsedJson = JSON.parse(jsonData);
    parsedJson[propertyName] = propertyValue;
    environment.setOutput("Updated JSON", JSON.stringify(parsedJson));
    return true;
  } catch (error: any) {
    environment.log.error(`Error in ADD_PROPERTY_TO_JSON: ${error.message}`);
    return false;
  }
}
