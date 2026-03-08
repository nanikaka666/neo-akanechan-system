import { ReactElement } from "react";

interface SingleItemViewProps {
  item: ReactElement;
}

export function SingleItemView({ item }: SingleItemViewProps) {
  return <div className="carousel-only-one-animation">{item}</div>;
}
