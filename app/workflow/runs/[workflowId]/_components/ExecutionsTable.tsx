import { getWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from  "@/components/ui/table"
type InitialDataType = Awaited<ReturnType<typeof getWorkflowExecutions>>
export default function ExecutionsTable({workflowId,initialData}:{workflowId:string,initialData:InitialDataType}) {
  const  query = useQuery({
    queryKey:["executions",workflowId],
    initialData,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  })
  return (
    
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className='h-full'>
        <TableHeader className='bg-muted'>
          <TableRow>
            <TableHead className='text-muted-foreground'>ID</TableHead>
            <TableHead className='text-muted-foreground'>Status</TableHead>
            <TableHead className='text-muted-foreground'>Consumed</TableHead>
            <TableHead className='text-muted-foreground'>Started At</TableHead>
          </TableRow>
        </TableHeader>

      </Table>
    </div>
  )
}
