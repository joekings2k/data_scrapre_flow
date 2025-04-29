import { AppNodeMissingInputs } from "@/types/appNode";
import React, { createContext, Dispatch, ReactNode, SetStateAction, useReducer } from "react";


type FlowValidationContextType = {
  invalidInputs:AppNodeMissingInputs[]
  setInvalidInputs:Dispatch<SetStateAction<AppNodeMissingInputs[]>>
  clearErrors:()=>void
};

export const FlowValidationContext = React.createContext<FlowValidationContextType | null>(null)
export function FlowValidationContextProvider({children}:{children:React.ReactNode}){
  const [invalidInputs,setInvalidInputs] = React.useState<AppNodeMissingInputs[]>([])
  const clearErrors = React.useCallback(()=>{
    setInvalidInputs([])
  },[])
  return(
    <FlowValidationContext.Provider value={{
      invalidInputs,
      setInvalidInputs,
      clearErrors
    }}>
      {children}
    </FlowValidationContext.Provider>
  )
}











// // Action Types
// export enum FlowValidationActionType {
//   setInvalidInputs = "SetInvalidInputs",
//   clearErrors = "ClearErrors",
// }

// // Action Interface
// interface FlowValidationAction {
//   type: FlowValidationActionType;
//   payload?: AppNodeMissingInputs[];
// }

// // State Interface
// interface FlowValidationState {
//   invalidInputs: AppNodeMissingInputs[];
// }

// // Initial State
// const initialState: FlowValidationState = {
//   invalidInputs: [],
// };

// // Reducer
// const flowValidationReducer = (
//   state: FlowValidationState,
//   action: FlowValidationAction
// ): FlowValidationState => {
//   switch (action.type) {
//     case FlowValidationActionType.setInvalidInputs:
//       return {
//         ...state,
//         invalidInputs: action.payload || [],
//       };
//     case FlowValidationActionType.clearErrors:
//       return {
//         ...state,
//         invalidInputs: [],
//       };
//     default:
//       return state;
//   }
// };

// // Context
// export const FlowValidationContext = createContext<{
//   state: FlowValidationState;
//   dispatch: Dispatch<FlowValidationAction>;
// }>({
//   state: initialState,
//   dispatch: () => {},
// });

// // Provider Props
// interface Props {
//   children: ReactNode;
// }

// // Provider
// export const FlowValidationProvider: React.FC<Props> = ({ children }) => {
//   const [state, dispatch] = useReducer(flowValidationReducer, initialState);

//   return (
//     <FlowValidationContext.Provider value={{ state, dispatch }}>
//       {children}
//     </FlowValidationContext.Provider>
//   );
// };