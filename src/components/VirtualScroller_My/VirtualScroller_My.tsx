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
  const [topOtopffsetPx, setTopOffsetPx] = useState<number>(0);

  const [overviewStartIndex, setOverviewStartIndex] = useState<number>(
    OVERVIEW_START_INDEX_DEFAULT
  );

  const overviewHeight = itemHeight * visibleItemsCount;

  const onScrollOverview = (event: UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;

    const scrolledItems = Math.floor(scrollTop / itemHeight); // если элемент полностью не проскролен, то вернет -1
    // const scrolledItemsRound = Math.round(scrollTop / itemHeight); // если элемент проскролен на 0.8(не полностью), то будет считать, что проскролили его уже

    setTopOffsetPx(scrolledItems * itemHeight);
    setOverviewStartIndex(scrolledItems);
  };

  return (
    <div
      onScroll={onScrollOverview}
      style={{ height: overviewHeight }}
      className={styles.viewport}
    >
      <div style={{ height: topOtopffsetPx }} />
      {items.slice(overviewStartIndex).map(renderItem)}
    </div>
  );
};
