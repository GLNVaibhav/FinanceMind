import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Invoice #1234 paid</p>
          <p className="text-sm text-muted-foreground">Client XYZ Ltd paid invoice #1234</p>
        </div>
        <div className="ml-auto font-medium">+$4,750.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Expense approved</p>
          <p className="text-sm text-muted-foreground">Office supplies expense approved</p>
        </div>
        <div className="ml-auto font-medium">-$245.67</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">New invoice created</p>
          <p className="text-sm text-muted-foreground">Invoice #1235 created for Client ABC Corp</p>
        </div>
        <div className="ml-auto font-medium">$3,200.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Bank reconciliation completed</p>
          <p className="text-sm text-muted-foreground">April 2025 bank reconciliation completed</p>
        </div>
        <div className="ml-auto font-medium text-green-500">Completed</div>
      </div>
    </div>
  )
}
