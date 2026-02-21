import { useFocusItem } from "./hooks/useFocusItem";

export function FocusView() {
  const focusItem = useFocusItem();

  return (
    focusItem && (
      <div className="focus-view">
        <div>
          <img src={focusItem.author.profileImageUrl} />
          <span>{focusItem.author.name}</span>
        </div>
        <div>{focusItem.displayMessage}</div>
      </div>
    )
  );
}
