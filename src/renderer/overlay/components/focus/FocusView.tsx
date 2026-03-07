import { useFocusItem } from "../hooks/useFocusItem";

export function FocusView() {
  const focusItem = useFocusItem();

  return (
    focusItem && (
      <div className="focus-view-container">
        <div className="focus-view" key={focusItem.id.id}>
          <div>
            <img src={focusItem.author.profileImageUrl} />
            <span>{focusItem.author.name}</span>
          </div>
          <div>{focusItem.displayMessage}</div>
        </div>
      </div>
    )
  );
}
