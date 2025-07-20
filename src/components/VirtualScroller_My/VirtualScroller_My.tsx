import styles from "./styles.module.scss";

import { useState, type ReactNode, type UIEvent } from "react";

interface IVirtualScroller_My<T> {
  itemHeight?: number;
  paddingItemsCount?: number; // количество дополнительных элементов сверху и снизу по отдельности

  items: T[];
  visibleItemsCount?: number;
  renderItem: (item: T) => ReactNode;
}

const OVERVIEW_START_INDEX_DEFAULT = 0;

export const VirtualScroller_My = <T,>({
  itemHeight = 20,
  items,
  visibleItemsCount = 5,
  renderItem,
}: IVirtualScroller_My<T>) => {
  const [topOffsetPx, setTopOffsetPx] = useState<number>(0);

  const [overviewStartIndex, setOverviewStartIndex] = useState<number>(
    OVERVIEW_START_INDEX_DEFAULT
  );

  const overviewHeight = itemHeight * visibleItemsCount;
  const realHeight = itemHeight * items.length;

  const overviewEndIndex = overviewStartIndex + visibleItemsCount;

  const bottomOffsetPx = realHeight - topOffsetPx - overviewHeight;

  const onScrollOverview = (event: UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;

    const scrolledItems = Math.floor(scrollTop / itemHeight); // если элемент полностью не проскролен, то не будем считать его проскроленным

    setTopOffsetPx(scrolledItems * itemHeight);
    setOverviewStartIndex(scrolledItems);
  };

  return (
    <div
      onScroll={onScrollOverview}
      style={{ height: overviewHeight }}
      className={styles.viewport}
    >
      <div style={{ height: topOffsetPx }} />
      {items.slice(overviewStartIndex, overviewEndIndex).map(renderItem)}
      <div style={{ height: bottomOffsetPx }} />
    </div>
  );
};
