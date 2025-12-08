import { Calendar } from "@/components/calendar";
import { GreetingsByTime } from "@/components/greetings-by-time";
import { UserImage } from "@/components/profile/user-image";
import { Card, CardContent } from "@/components/ui/card";
import { UserOnboardProfile } from "@/components/user-onboard-profile";

// Todo: Fix grid layout issues

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto scrollbar-hide pt-5">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 grid-rows-4 gap-4 w-full h-full p-4">
        <div className="md:col-span-3 xl:col-span-4 row-span-1 p-6">
          <div className="flex flex-col justify-between">
            <GreetingsByTime />
          </div>
        </div>
        <div className="row-span-1 xl:row-span-3 flex flex-col gap-4 justify-between">
          <UserOnboardProfile />
          <div className="size-full rounded-xl relative overflow-hidden">
            <UserImage />
          </div>
        </div>
        <Card className="col-span-2 xl:col-span-3 h-full row-span-3 overflow-y-auto scrollbar-hide p-0 rounded-3xl">
          <CardContent className="p-0">
            <Calendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
