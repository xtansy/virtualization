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
  // startIndexDefault = 0,
  renderItem,
  getData,
  itemsCount,
}: IVirtualScroller_My<T>) => {
  const [innerItems, setInnerItems] = useState<Map<number, T>>(
    new Map(items.map((item, index) => [index, item]))
  );
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

  // подзагрузка нижних элементов
  useEffect(() => {
    if (isLoading || !innerItems.size) return;

    const maxInnerItemIndex = Math.max(...innerItems.keys());

    // paddingEndIndex - 1 > innerItems.length = как только скроллим на пустоту, то делаем запрос
    if (paddingEndIndex - 1 > maxInnerItemIndex) {
      const threshold = 10;
      setIsLoading(true);
      getData(maxInnerItemIndex + 1, threshold)
        .then((fetchedItems) => {
          const fetchedItemsMap = new Map(
            fetchedItems.map((item, index) => [
              index + maxInnerItemIndex + 1,
              item,
            ])
          );
          setInnerItems((oldMap) => {
            const newCache = new Map([...oldMap, ...fetchedItemsMap]);
            console.log(newCache);
            return newCache;
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [innerItems.size, isLoading, paddingEndIndex]);

  console.log(Array.from(innerItems.values()));

  // удаление верхних элементов с кеша
  // useEffect(() => {
  //   const MAX_CACHE_SIZE = 5;

  //   if (paddingStartIndex - 1 >= MAX_CACHE_SIZE) {

  //   }
  // }, [paddingStartIndex]);

  useEffect(() => {
    setInnerItems(new Map(items.map((item, index) => [index, item])));
  }, [items]);

  // useEffect(() => {
  //   if (overviewRef.current && innerItems.size > 0 && startIndexDefault) {
  //     const scrollTopDefault = startIndexDefault * itemHeight;
  //     overviewRef.current.scrollTop = scrollTopDefault;
  //   }
  // }, [innerItems.size, itemHeight, startIndexDefault]);

  return (
    <div
      ref={overviewRef}
      onScroll={onScrollOverview}
      style={{ height: overviewHeight }}
      className={styles.viewport}
    >
      <div style={{ height: topOffsetPx }} />
      {Array.from(innerItems.values())
        .slice(paddingStartIndex, paddingEndIndex)
        .map(renderItem)}
      <div style={{ height: bottomOffsetPx }} />
    </div>
  );
};
