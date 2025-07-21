import styles from "./styles.module.scss";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";

interface IVirtualScroller_My<T> {
  itemHeight?: number;
  paddingItemsCount?: number; // количество дополнительных элементов сверху и снизу по отдельности
  startIndexDefault?: number;

  items: T[];
  visibleItemsCount?: number;
  renderItem: (item: T) => ReactNode;
}

const OVERVIEW_START_INDEX_DEFAULT = 0;

export const VirtualScroller_My = <T,>({
  itemHeight = 20,
  items,
  visibleItemsCount = 5,
  paddingItemsCount = 2,
  startIndexDefault = OVERVIEW_START_INDEX_DEFAULT,
  renderItem,
}: IVirtualScroller_My<T>) => {
  const overviewRef = useRef<HTMLDivElement>(null);

  const [overviewStartIndex, setOverviewStartIndex] = useState<number>(
    OVERVIEW_START_INDEX_DEFAULT
  );

  const paddingStartIndex = Math.max(
    overviewStartIndex - paddingItemsCount,
    OVERVIEW_START_INDEX_DEFAULT
  );
  const paddingEndIndex = Math.min(
    overviewStartIndex + visibleItemsCount + paddingItemsCount,
    items.length
  );

  const overviewHeight = itemHeight * visibleItemsCount;
  const realHeight = itemHeight * items.length;

  const topOffsetPx = paddingStartIndex * itemHeight;
  const bottomOffsetPx = realHeight - paddingEndIndex * itemHeight;

  const onScrollOverview = (event: UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    // если элемент полностью не проскролен, то не будем считать его проскроленным
    const scrolledItems = Math.floor(scrollTop / itemHeight);
    setOverviewStartIndex(scrolledItems);
  };

  useEffect(() => {
    if (overviewRef.current && startIndexDefault) {
      const scrollTopDefault = startIndexDefault * itemHeight;
      overviewRef.current.scrollTop = scrollTopDefault;
    }
  }, [itemHeight, startIndexDefault]);

  return (
    <div
      ref={overviewRef}
      onScroll={onScrollOverview}
      style={{ height: overviewHeight }}
      className={styles.viewport}
    >
      <div style={{ height: topOffsetPx }} />
      {items.slice(paddingStartIndex, paddingEndIndex).map(renderItem)}
      <div style={{ height: bottomOffsetPx }} />
    </div>
  );
};
