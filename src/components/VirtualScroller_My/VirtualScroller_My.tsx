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
  paddingItemsCount?: number;
  startIndexDefault?: number;

  items: T[]; // начальные данные
  itemsCount: number;
  visibleItemsCount?: number;
  renderItem: (item: T) => ReactNode;
  getData: (startIndex: number, limit: number) => Promise<T[]>;
}

const OVERVIEW_START_INDEX_DEFAULT = 0;

// Можно вынести в пропсы при необходимости
const MAX_FETCH_SIZE = 10;
const MAX_CACHE_SIZE = 20;

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
  const [itemCache, setItemCache] = useState<Map<number, T>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

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
    const scrolledItems = Math.floor(scrollTop / itemHeight);
    setOverviewStartIndex(scrolledItems);
  };

  // Инициализируем кэш начальными данными
  useEffect(() => {
    const initialCache = new Map<number, T>();
    items.forEach((item, index) => {
      initialCache.set(index, item);
    });
    setItemCache(initialCache);
  }, [items]);

  // Подгрузка блока данных, если не хватает
  useEffect(() => {
    if (isLoading) return;

    let needFetch = false;
    let fetchStart = 0;

    for (let i = paddingStartIndex; i < paddingEndIndex; i++) {
      if (!itemCache.has(i)) {
        needFetch = true;
        // ищем начало блока
        // Пример:
        // i = 38, b = 10; floor(38 / 10) * 10 = 30	[30–39]
        fetchStart = Math.floor(i / MAX_FETCH_SIZE) * MAX_FETCH_SIZE;
        break;
      }
    }

    if (needFetch) {
      const fetchLimit = Math.min(MAX_FETCH_SIZE, itemsCount - fetchStart);
      setIsLoading(true);
      getData(fetchStart, fetchLimit)
        .then((fetchedItems) => {
          setItemCache((oldCache) => {
            const newCache = new Map(oldCache);
            fetchedItems.forEach((item, idx) => {
              newCache.set(fetchStart + idx, item);
            });
            return newCache;
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [
    paddingStartIndex,
    paddingEndIndex,
    itemCache,
    isLoading,
    getData,
    itemsCount,
  ]);

  // Очистка устаревшего кэша, если его слишком много
  useEffect(() => {
    const minKeep = Math.max(0, overviewStartIndex - MAX_CACHE_SIZE / 2);
    const maxKeep = Math.min(
      itemsCount,
      overviewStartIndex + MAX_CACHE_SIZE / 2
    );

    setItemCache((oldCache) => {
      const newCache = new Map<number, T>();
      for (let i = minKeep; i < maxKeep; i++) {
        const item = oldCache.get(i);
        if (item !== undefined) {
          newCache.set(i, item);
        }
      }
      return newCache;
    });
  }, [overviewStartIndex, itemsCount]);

  // Установка scrollTop при первом рендере
  // useEffect(() => {
  //   if (overviewRef.current && itemCache.size > 0) {
  //     const scrollTopDefault = startIndexDefault * itemHeight;
  //     overviewRef.current.scrollTop = scrollTopDefault;
  //   }
  // }, [itemCache.size, itemHeight, startIndexDefault]);

  console.log(Array.from(itemCache.values()));

  // Генерация видимых элементов
  const renderedItems: ReactNode[] = [];
  for (let i = paddingStartIndex; i < paddingEndIndex; i++) {
    const item = itemCache.get(i);
    renderedItems.push(
      <div key={i} style={{ height: itemHeight }}>
        {item !== undefined ? renderItem(item) : null}
      </div>
    );
  }

  return (
    <div
      ref={overviewRef}
      onScroll={onScrollOverview}
      style={{ height: overviewHeight }}
      className={styles.viewport}
    >
      <div style={{ height: topOffsetPx }} />
      {renderedItems}
      <div style={{ height: bottomOffsetPx }} />
    </div>
  );
};
