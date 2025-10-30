import { useState } from "react";
import { ChannelRegistrationComplete } from "./ChannelRegistrationComplete";
import { ChannelRegistrationForm } from "./ChannelRegistrationForm";

export function ChannelRegistrationLoader() {
  const [isComplete, setIsComplete] = useState(false);

  return isComplete ? (
    <ChannelRegistrationComplete />
  ) : (
    <ChannelRegistrationForm setIsComplete={setIsComplete} />
  );
}
