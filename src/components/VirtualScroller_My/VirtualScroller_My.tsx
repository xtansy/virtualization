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
  // startIndexDefault?: number;

  items: T[];
  itemsCount: number;
  visibleItemsCount?: number;
  renderItem: (item: T) => ReactNode;
  getData: (startIndex: number, limit: number) => Promise<T[]>;
}

const OVERVIEW_START_INDEX_DEFAULT = 0;

const FETCHING_SIZE = 10;

export const VirtualScroller_My = <T,>({
  itemHeight = 20,
  items,
  visibleItemsCount = 5,
  paddingItemsCount = 2,
  // startIndexDefault = 0,
  renderItem,
  getData,
  itemsCount,
}: IVirtualScroller_My<T>) => {
  const [cachedIndexToItemMap, setCachedIndexToItemMap] = useState<
    Map<number, T>
  >(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const overviewRef = useRef<HTMLDivElement>(null);

  const [overviewStartIndex, setOverviewStartIndex] = useState<number>(
    OVERVIEW_START_INDEX_DEFAULT
  );

  console.log(`overviewStartIndex = ${overviewStartIndex}`);

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
    setCachedIndexToItemMap(new Map(items.map((item, index) => [index, item])));
  }, [items]);

  useEffect(() => {
    if (isLoading) return;

    const isNeedFetch = !cachedIndexToItemMap.has(paddingEndIndex);

    console.log(`paddingEndIndex = ${paddingEndIndex}`);

    // if (!isNeedFetch) return;

    // setIsLoading(true);
    // getData(
    //   paddingEndIndex,
    //   Math.min(itemsCount - paddingEndIndex + 1, FETCHING_SIZE)
    // )
    //   .then((fetchedItems) => {
    //     setCachedIndexToItemMap((oldCachedMap) => {
    //       const fetchedItemsTuple: [number, T][] = fetchedItems.map(
    //         (item, index) => [index + paddingEndIndex, item]
    //       );
    //       const newCachedMap = new Map([
    //         ...oldCachedMap.entries(),
    //         ...fetchedItemsTuple,
    //       ]);
    //       return newCachedMap;
    //     });
    //   })
    //   .finally(() => setIsLoading(false));
  }, [paddingEndIndex]);

  console.log(Array.from(cachedIndexToItemMap.values()));

  const renderItems = () => {
    const items = [];
    for (let i = paddingStartIndex; i < paddingEndIndex; i++) {
      const item = cachedIndexToItemMap.get(i);
      if (item) {
        items.push(renderItem(item));
      }
    }
    return items;
  };

  return (
    <div
      ref={overviewRef}
      onScroll={onScrollOverview}
      style={{ height: overviewHeight }}
      className={styles.viewport}
    >
      <div style={{ height: topOffsetPx }} />
      {renderItems()}
      <div style={{ height: bottomOffsetPx }} />
    </div>
  );
};
