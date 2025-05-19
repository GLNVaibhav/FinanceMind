"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileUploader } from "@/components/dashboard/file-uploader"
import { LucideFileText } from "lucide-react"

export default function BankReconciliationPage() {
  const [selectedAccount, setSelectedAccount] = useState("chase")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Bank Reconciliation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Select an account to reconcile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={selectedAccount === "chase" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedAccount("chase")}
                >
                  Chase Business
                </Button>
                <Button
                  variant={selectedAccount === "amex" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedAccount("amex")}
                >
                  American Express
                </Button>
                <Button
                  variant={selectedAccount === "wells" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedAccount("wells")}
                >
                  Wells Fargo
                </Button>
                <Button
                  variant={selectedAccount === "boa" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedAccount("boa")}
                >
                  Bank of America
                </Button>
              </div>

              <div className="mt-6">
                <Label>Import Statement</Label>
                <FileUploader
                  icon={<LucideFileText className="h-8 w-8 text-gray-400" />}
                  title="Upload Bank Statement"
                  description="Upload CSV or PDF statement"
                  acceptedFileTypes=".csv,.pdf,.ofx,.qfx"
                  compact
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Chase Business Account</CardTitle>
                  <CardDescription>Reconciliation for period ending May 31, 2025</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="may2025">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="may2025">May 2025</SelectItem>
                      <SelectItem value="apr2025">April 2025</SelectItem>
                      <SelectItem value="mar2025">March 2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Reconcile</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="unmatched" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="unmatched">Unmatched Transactions</TabsTrigger>
                  <TabsTrigger value="matched">Matched Transactions</TabsTrigger>
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                </TabsList>

                <TabsContent value="unmatched">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>05/12/2025</TableCell>
                          <TableCell>Office Supplies Inc</TableCell>
                          <TableCell>$245.67</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Unmatched</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Match
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/15/2025</TableCell>
                          <TableCell>Cloud Services Monthly</TableCell>
                          <TableCell>$189.99</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Unmatched</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Match
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/18/2025</TableCell>
                          <TableCell>Client Payment - ABC Corp</TableCell>
                          <TableCell>$1,250.00</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Unmatched</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Match
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="matched">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Matched Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>05/01/2025</TableCell>
                          <TableCell>Office Rent Payment</TableCell>
                          <TableCell>$2,500.00</TableCell>
                          <TableCell>
                            <Badge variant="success">Matched</Badge>
                          </TableCell>
                          <TableCell>05/02/2025</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/03/2025</TableCell>
                          <TableCell>Utility Bill Payment</TableCell>
                          <TableCell>$345.78</TableCell>
                          <TableCell>
                            <Badge variant="success">Matched</Badge>
                          </TableCell>
                          <TableCell>05/04/2025</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/05/2025</TableCell>
                          <TableCell>Client Payment - XYZ Ltd</TableCell>
                          <TableCell>$4,750.00</TableCell>
                          <TableCell>
                            <Badge variant="success">Matched</Badge>
                          </TableCell>
                          <TableCell>05/06/2025</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="all">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>05/01/2025</TableCell>
                          <TableCell>Office Rent Payment</TableCell>
                          <TableCell>$2,500.00</TableCell>
                          <TableCell>
                            <Badge variant="success">Matched</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/03/2025</TableCell>
                          <TableCell>Utility Bill Payment</TableCell>
                          <TableCell>$345.78</TableCell>
                          <TableCell>
                            <Badge variant="success">Matched</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/05/2025</TableCell>
                          <TableCell>Client Payment - XYZ Ltd</TableCell>
                          <TableCell>$4,750.00</TableCell>
                          <TableCell>
                            <Badge variant="success">Matched</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/12/2025</TableCell>
                          <TableCell>Office Supplies Inc</TableCell>
                          <TableCell>$245.67</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Unmatched</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/15/2025</TableCell>
                          <TableCell>Cloud Services Monthly</TableCell>
                          <TableCell>$189.99</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Unmatched</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>05/18/2025</TableCell>
                          <TableCell>Client Payment - ABC Corp</TableCell>
                          <TableCell>$1,250.00</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Unmatched</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium">Book Balance: $24,567.89</p>
                  <p className="text-sm font-medium">Bank Balance: $25,789.56</p>
                  <p className="text-sm font-medium text-red-500">Difference: $1,221.67</p>
                </div>
                <Button>Complete Reconciliation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
