import { UserSettingsForm } from "./UserSettingsForm";
import { useUserSettings } from "../hooks/useUserSettings";

interface UserSettingsFormLoaderProps {
  turnOff: () => void;
}

export function UserSettingsFormLoader({ turnOff }: UserSettingsFormLoaderProps) {
  const userSettings = useUserSettings();

  return userSettings ? (
    <UserSettingsForm userSettings={userSettings} turnOff={turnOff} />
  ) : (
    <div>Now Loading...</div>
  );
}
