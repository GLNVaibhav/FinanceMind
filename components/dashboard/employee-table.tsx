import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function EmployeeTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Tasks Assigned</TableHead>
            <TableHead>Tasks Completed</TableHead>
            <TableHead>Productivity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">John Doe</TableCell>
            <TableCell>Accounting</TableCell>
            <TableCell>24</TableCell>
            <TableCell>21</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={88} className="w-[80px]" />
                <span className="text-sm">88%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                On Track
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Sarah Miller</TableCell>
            <TableCell>Bookkeeping</TableCell>
            <TableCell>18</TableCell>
            <TableCell>17</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={94} className="w-[80px]" />
                <span className="text-sm">94%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                On Track
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Robert Kim</TableCell>
            <TableCell>Financial Analysis</TableCell>
            <TableCell>22</TableCell>
            <TableCell>19</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={86} className="w-[80px]" />
                <span className="text-sm">86%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Attention Needed
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Lisa Thompson</TableCell>
            <TableCell>Bookkeeping</TableCell>
            <TableCell>15</TableCell>
            <TableCell>14</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={93} className="w-[80px]" />
                <span className="text-sm">93%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                On Track
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Michael Patel</TableCell>
            <TableCell>Financial Analysis</TableCell>
            <TableCell>20</TableCell>
            <TableCell>16</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={80} className="w-[80px]" />
                <span className="text-sm">80%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Attention Needed
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
