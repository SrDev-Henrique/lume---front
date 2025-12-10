import { Calendar } from "@/components/calendar";
import { GreetingsByTime } from "@/components/greetings-by-time";
import { LoadingSession } from "@/components/loading-session";
import { UserImage } from "@/components/profile/user-image";
import { UserOnboardProfile } from "@/components/profile/user-onboard-profile";
import { Card, CardContent } from "@/components/ui/card";

// Todo: Fix grid layout issues

export default function Home() {
  return (
    <div className="scrollbar-hide h-screen overflow-y-auto pt-5">
      <LoadingSession />
      <div className="flex h-full w-full flex-col gap-4 p-4">
        <div className="w-full p-6">
          <div className="flex flex-col justify-between">
            <GreetingsByTime />
          </div>
        </div>
        <div className="flex h-full min-h-0 w-full items-start gap-4">
          <div className="flex w-fit flex-col justify-between gap-4">
            <UserOnboardProfile />
            <div className="relative size-full overflow-hidden rounded-xl">
              <UserImage />
            </div>
          </div>
          <Card className="scrollbar-hide h-full flex-1 overflow-y-auto rounded-3xl p-0">
            <CardContent className="p-0">
              <Calendar />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
