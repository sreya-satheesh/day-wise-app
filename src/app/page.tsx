import { PageHeader } from "@/components/daywise/page-header";
import Scheduler from "@/components/daywise/scheduler";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <PageHeader />
      <main className="flex-1">
        <Scheduler />
      </main>
    </div>
  );
}
