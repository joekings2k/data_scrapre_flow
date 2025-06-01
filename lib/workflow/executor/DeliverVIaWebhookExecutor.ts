import { ExecutionEnvironment } from "@/types/executor";

import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";
export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input->targetUrl is not defined");
      return false;
    }
    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input->body is not defined");
      return false;
    }
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Request failed with status code ${statusCode}`);
      return false;
    }
    const reponseBody = await response.json();
    environment.log.info(`Request succeeded with response body ${JSON.stringify(reponseBody,null,4)}`);
    return true;
  } catch (error: any) {
    environment.log.error(`Error in ClickElementExecutor: ${error.message}`);
    return false;
  }
}
