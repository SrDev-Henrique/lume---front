import { BackButton } from "@/components/back-button";

export default function SchedulesPage() {
  return (
    <div className="relative h-screen w-full p-4 pt-16">
      <div className="absolute top-4 left-4 z-50 w-fit">
        <BackButton href="/" />
      </div>
      <h1 className="font-bold text-3xl text-primary-foreground">Escalas</h1>
    </div>
  );
}
