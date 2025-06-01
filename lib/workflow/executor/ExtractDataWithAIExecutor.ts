import { ExecutionEnvironment } from "@/types/executor";

import { ClickElementTask } from "../task/ClickElement";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";
export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials")
    if(!credentials){
      environment.log.error("input->credentials is not defined");
      return false;
    }
    const prompt = environment.getInput("Prompt")
    if(!prompt){
      environment.log.error("input->prompt is not defined");
      return false;
    }
    const content = environment.getInput("Content")
    if(!content){
      environment.log.error("input->content is not defined");
      return false;
    }
    // Get Credentials from DB
    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });
    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }
    const plainCredentialValue = symmetricDecrypt(credential.value);
    if(!plainCredentialValue){
      environment.log.error("cannot decrypt credential");
      return false;
    }
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: plainCredentialValue,
    });
    // const mockExtractedData = {
    //   usernameSelector: "#username",
    //   passwordSelector: "#password",
    //   loginButtonSelector:
    //     "body > div.container > form > input.btn.btn-primary",
    // };
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "you are a web scraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the promt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional text. Anayze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always valid JSON array without any surrounding text.Return only the JSON object. Do not include markdown formatting, language tags, or any other text",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { "type": "json_object" },
      temperature: 1,
      model: "deepseek-chat",
    });
    environment.log.info(`prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(`completion tokens: ${response.usage?.completion_tokens}`);
    const result = response.choices[0].message.content;
    if(!result){
      environment.log.error("no result from openai");
      return false;
    }
    environment.setOutput("Extracted data",result)
    
    return true;
  } catch (error: any) {
    environment.log.error(`Error in EXTRACT_DATA_WITH_AI: ${error.message}`);
    return false;
  }
}
