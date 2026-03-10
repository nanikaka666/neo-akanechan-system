import { useState } from "react";

export function useIsSubscriberCountGoalAccomplished() {
  const [isAccomplished, setIsAccomplished] = useState(false);
  const subscriberCountGoalAccomplishFunc = () => setIsAccomplished((_) => true);

  return [isAccomplished, subscriberCountGoalAccomplishFunc] as const;
}
