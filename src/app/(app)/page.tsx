import { Calendar } from "@/components/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { UserOnboardProfile } from "@/components/user-onboard-profile";

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto scrollbar-hide pt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 w-full h-full p-4">
        <div className="row-span-2">
          <UserOnboardProfile />
        </div>
        <Card className="col-span-2 h-full row-span-2 overflow-y-auto scrollbar-hide p-0 rounded-3xl">
          <CardContent className="p-0">
            <Calendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
