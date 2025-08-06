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
  itemsCount: number;
  visibleItemsCount?: number;
  renderItem: (item: T) => ReactNode;
  getData: (startIndex: number, limit: number) => Promise<T[]>;
}

const OVERVIEW_START_INDEX_DEFAULT = 0;

export const VirtualScroller_My = <T,>({
  itemHeight = 20,
  items,
  visibleItemsCount = 5,
  paddingItemsCount = 2,
  startIndexDefault = 0,
  renderItem,
  getData,
  itemsCount,
}: IVirtualScroller_My<T>) => {
  const [innerItems, setInnerItems] = useState<T[]>(items);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    itemsCount
  );

  const overviewHeight = itemHeight * visibleItemsCount;
  const realHeight = itemHeight * itemsCount;

  const topOffsetPx = paddingStartIndex * itemHeight;
  const bottomOffsetPx = realHeight - paddingEndIndex * itemHeight;

  const onScrollOverview = (event: UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    // если элемент полностью не проскролен, то не будем считать его проскроленным
    const scrolledItems = Math.floor(scrollTop / itemHeight);
    setOverviewStartIndex(scrolledItems);
  };

  useEffect(() => {
    if (isLoading || !innerItems.length) return;

    // paddingEndIndex - 1 > innerItems.length = как только скроллим на пустоту, то делаем запрос
    if (paddingEndIndex - 1 > innerItems.length) {
      const threshold = 10;
      setIsLoading(true);
      getData(innerItems.length, threshold)
        .then((fetchedItems) => {
          setInnerItems((oldItems) => [...oldItems, ...fetchedItems]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [innerItems.length, isLoading, paddingEndIndex]);

  useEffect(() => {
    setInnerItems(items);
  }, [items]);

  useEffect(() => {
    if (overviewRef.current && innerItems.length > 0) {
      const scrollTopDefault = startIndexDefault * itemHeight;
      overviewRef.current.scrollTop = scrollTopDefault;
    }
  }, [innerItems.length, itemHeight, startIndexDefault]);

  return (
    <div
      ref={overviewRef}
      onScroll={onScrollOverview}
      style={{ height: overviewHeight }}
      className={styles.viewport}
    >
      <div style={{ height: topOffsetPx }} />
      {innerItems.slice(paddingStartIndex, paddingEndIndex).map(renderItem)}
      <div style={{ height: bottomOffsetPx }} />
    </div>
  );
};
