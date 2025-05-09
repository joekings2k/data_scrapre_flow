
export const LogLevel =["info","error","warning"] as const
export type LogLevel = (typeof LogLevel)[number]
export  type LogFunction = (message:string) => void
export type Log = {
  message: string;
  level:LogLevel
  timestamp: Date

}
export type LogCollector = {
  getAll ():Log[]
} &{
  [k in LogLevel] :LogFunction
}