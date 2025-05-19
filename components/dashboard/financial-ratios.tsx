import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function FinancialRatios() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ratio</TableHead>
            <TableHead>Current Value</TableHead>
            <TableHead>Previous Period</TableHead>
            <TableHead>Industry Average</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Current Ratio</TableCell>
            <TableCell>2.5</TableCell>
            <TableCell>2.3</TableCell>
            <TableCell>2.0</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Good
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Quick Ratio</TableCell>
            <TableCell>1.8</TableCell>
            <TableCell>1.7</TableCell>
            <TableCell>1.5</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Good
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Debt-to-Equity</TableCell>
            <TableCell>0.6</TableCell>
            <TableCell>0.7</TableCell>
            <TableCell>0.5</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Average
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Gross Profit Margin</TableCell>
            <TableCell>42%</TableCell>
            <TableCell>40%</TableCell>
            <TableCell>38%</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Good
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Net Profit Margin</TableCell>
            <TableCell>18%</TableCell>
            <TableCell>16%</TableCell>
            <TableCell>15%</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Good
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Return on Assets</TableCell>
            <TableCell>12%</TableCell>
            <TableCell>11%</TableCell>
            <TableCell>10%</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Good
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Return on Equity</TableCell>
            <TableCell>22%</TableCell>
            <TableCell>20%</TableCell>
            <TableCell>18%</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Good
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
