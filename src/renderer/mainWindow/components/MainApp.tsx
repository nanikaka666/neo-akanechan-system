import { LiveStandBy } from "./liveStandBy/LiveStandBy";
import { LiveControlPanel } from "./liveControlPanel/LiveControlPanel";
import { AuthFlow } from "./auth/AuthFlow";
import { LiveSelection } from "./liveSelection/LiveSelection";
import { useMainAppPage } from "./hooks/useMainAppPage";

export function MainApp() {
  const mainAppPage = useMainAppPage();

  return mainAppPage ? (
    mainAppPage.type === "liveControlPanel" ? (
      <LiveControlPanel />
    ) : mainAppPage.type === "liveStandBy" ? (
      <LiveStandBy />
    ) : mainAppPage.type === "liveSelection" ? (
      <LiveSelection {...mainAppPage} />
    ) : (
      <AuthFlow />
    )
  ) : (
    <div>Now Loading...</div>
  );
}
