import { Log, LogCollector, LogFunction, LogLevel } from "@/types/log";

export function createLogCollector():LogCollector{
  const logs:Log[]=[]
  const getAll =()=>logs
  const logFunction = {} as Record<LogLevel,LogFunction>
  LogLevel.forEach(level=>(logFunction[level]= (message:string)=>{
    logs.push({message,level,timestamp:new Date()})
  }) )
  return {
getAll,
...logFunction,
  }

}