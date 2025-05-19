import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export function EmployeePerformance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Sarah Miller</p>
            <p className="text-sm text-muted-foreground">Bookkeeping</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={94} className="w-[80px]" />
          <span className="text-sm font-medium">94%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>LT</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Lisa Thompson</p>
            <p className="text-sm text-muted-foreground">Bookkeeping</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={93} className="w-[80px]" />
          <span className="text-sm font-medium">93%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-sm text-muted-foreground">Accounting</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={88} className="w-[80px]" />
          <span className="text-sm font-medium">88%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Robert Kim</p>
            <p className="text-sm text-muted-foreground">Financial Analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={86} className="w-[80px]" />
          <span className="text-sm font-medium">86%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Michael Patel</p>
            <p className="text-sm text-muted-foreground">Financial Analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={80} className="w-[80px]" />
          <span className="text-sm font-medium">80%</span>
        </div>
      </div>
    </div>
  )
}
