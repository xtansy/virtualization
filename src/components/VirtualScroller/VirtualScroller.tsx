import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";

interface IVirtualScroller<T> {
  itemHeight?: number;
  visibleItemsCount?: number;
  paddingItemsCount?: number; // количество дополнительных элементов сверху и снизу по отдельности
  startIndexDefault?: number;
  overviewClassname?: string;

  items: T[];
  itemsCount: number;
  renderItem: (item: T) => ReactNode;
}

const OVERVIEW_START_INDEX_DEFAULT = 0;

export const VirtualScroller = <T,>({
  itemHeight = 20,
  items,
  visibleItemsCount = 5,
  paddingItemsCount = 2,
  startIndexDefault = 0,
  renderItem,
  itemsCount,
  overviewClassname,
}: IVirtualScroller<T>) => {
  const [innerItems, setInnerItems] = useState<T[]>(items);

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
      className={overviewClassname}
      ref={overviewRef}
      onScroll={onScrollOverview}
      style={{
        height: overviewHeight,
        overflowY: "auto",
      }}
    >
      <div style={{ height: topOffsetPx }} />
      {innerItems.slice(paddingStartIndex, paddingEndIndex).map(renderItem)}
      <div style={{ height: bottomOffsetPx }} />
    </div>
  );
};
