export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  // NAVIGATE = "NAVIGATE",
  // CLICK = "CLICK",
  // SCROLL = "SCROLL",
  // SCRAPE = "SCRAPE",
}

export enum TaskParamType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
}

export interface TaskParam {
  name:string,
  type:TaskParamType,
  helperText?:string,
  required?:boolean,
  hideHandle?:boolean,
  value?:string
  [key:string]:any
}