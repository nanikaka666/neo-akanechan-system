import { OptionLabel } from "../../../types/competition";
import { ChatCommand } from "../../../types/chatCommand";
import { TextMessageChat } from "../../../types/liveChatItem";

export function parseChatCommand(text: TextMessageChat): ChatCommand | undefined {
  const maybeCommand = text.displayMessage.split(" ")[0].toLowerCase();
  if (!maybeCommand.startsWith("/")) {
    return undefined;
  }

  const maybeJoinCompetition = parseJoinCompetition(maybeCommand);
  if (maybeJoinCompetition !== undefined) {
    return {
      type: "joinCompetition",
      betTo: maybeJoinCompetition,
    };
  }

  return undefined;
}

function parseJoinCompetition(text: string) {
  const res = text.match(/^\/([a-h])$/);
  if (res === null) {
    return undefined;
  }
  return res[1] as OptionLabel;
}
