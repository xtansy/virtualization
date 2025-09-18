/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./styles.module.scss";
import {
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
  type UIEvent,
} from "react";
import type { IItem } from "../../app/AppWithVirtualScroller";

interface ISettings {
  minIndex: number;
  maxIndex: number;
  startIndex: number;
  itemHeight: number;
  amount: number;
  tolerance: number;
}

interface IVirtualScrollerProps {
  settings: ISettings;
  get: (offset: number, limit: number) => IItem[];
  row: (item: IItem) => ReactNode;
}

export const VirtualScroller_Old: FC<IVirtualScrollerProps> = ({
  settings,
  get,
  row,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<IItem[]>([]);

  const { minIndex, maxIndex, startIndex, itemHeight, amount, tolerance } =
    settings;

  // 1) height of the visible part of the viewport (px)
  const viewportHeight = amount * itemHeight;
  // 2) total height of rendered and virtualized items (px)
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
  // 3) single viewport outlet height, filled with rendered but invisible rows (px)
  const toleranceHeight = tolerance * itemHeight;
  // 4) all rendered rows height, visible part + invisible outlets (px)
  const bufferHeight = viewportHeight + 2 * toleranceHeight;
  // 5) number of items to be rendered, buffered dataset length (pcs)
  const bufferedItems = amount + 2 * tolerance;
  // 6) how many items will be virtualized above (pcs)
  const itemsAbove = startIndex - tolerance - minIndex;
  // 7) initial height of the top padding element (px)
  // const topPaddingHeight = itemsAbove * itemHeight;
  const [topPaddingHeight, setTopPaddingHeight] = useState<number>(
    itemsAbove * itemHeight
  );
  // 8) initial height of the bottom padding element (px)
  // const bottomPaddingHeight = totalHeight - topPaddingHeight;
  const [bottomPaddingHeight, setBottomPaddingHeight] = useState<number>(
    totalHeight - topPaddingHeight
  );
  // 9) initial scroll position (px)
  const initialPosition = topPaddingHeight + toleranceHeight;

  const runScroller = ({
    currentTarget: { scrollTop },
  }: UIEvent<HTMLDivElement>) => {
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    const data = get(index, bufferedItems);
    console.log("index = ", index);
    console.log("bufferedItems = ", bufferedItems);
    console.log("data = ", data);
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const bottomPaddingHeight = Math.max(
      totalHeight - topPaddingHeight - data.length * itemHeight,
      0
    );

    setTopPaddingHeight(topPaddingHeight);
    setBottomPaddingHeight(bottomPaddingHeight);
    setData(data);
  };

  useEffect(() => {
    // посмотреть, почему ругается на viewportRef?.current?.scrollTop
    if (viewportRef.current) {
      viewportRef.current.scrollTop = initialPosition;
    }

    if (initialPosition === 0) {
      runScroller({
        currentTarget: { scrollTop: 0 },
      } as UIEvent<HTMLDivElement>);
    }
  }, [initialPosition]);

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      style={{ height: viewportHeight }}
      onScroll={runScroller}
    >
      <div style={{ height: topPaddingHeight }} />
      {data.map(row)}
      <div style={{ height: bottomPaddingHeight }} />
    </div>
  );
};
