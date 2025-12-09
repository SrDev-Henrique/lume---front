import { Calendar } from "@/components/calendar";
import { GreetingsByTime } from "@/components/greetings-by-time";
import { UserImage } from "@/components/profile/user-image";
import { Card, CardContent } from "@/components/ui/card";
import { UserOnboardProfile } from "@/components/user-onboard-profile";

// Todo: Fix grid layout issues

export default function Home() {
  return (
    <div className="scrollbar-hide h-screen overflow-y-auto pt-5">
      <div className="grid h-full w-full grid-cols-1 grid-rows-4 gap-4 p-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="row-span-1 p-6 md:col-span-3 xl:col-span-4">
          <div className="flex flex-col justify-between">
            <GreetingsByTime />
          </div>
        </div>
        <div className="row-span-1 flex flex-col justify-between gap-4 xl:row-span-3">
          <UserOnboardProfile />
          <div className="relative size-full overflow-hidden rounded-xl">
            <UserImage />
          </div>
        </div>
        <Card className="scrollbar-hide col-span-2 row-span-3 h-full overflow-y-auto rounded-3xl p-0 xl:col-span-3">
          <CardContent className="p-0">
            <Calendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
