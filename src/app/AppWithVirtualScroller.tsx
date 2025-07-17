import styles from "./styles.module.scss";

import { VirtualScroller } from "../components";

const SETTINGS = {
  minIndex: 1,
  maxIndex: 16,
  startIndex: 6,
  itemHeight: 20,
  amount: 5,
  tolerance: 0,
};

export interface IItem {
  index: number;
  text: string;
}

const getData = (offset: number, limit: number): IItem[] => {
  const data = [];
  const start = Math.max(SETTINGS.minIndex, offset);
  const end = Math.min(offset + limit - 1, SETTINGS.maxIndex);
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      data.push({ index: i, text: `item ${i}` });
    }
  }
  return data;
};

const rowTemplate = (item: IItem) => (
  <div style={{ height: SETTINGS.itemHeight }} key={item.index}>
    {item.text}
  </div>
);

export const AppWithVirtualScroller = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div style={{ flexGrow: 1 }}>
          <VirtualScroller
            settings={SETTINGS}
            get={getData}
            row={rowTemplate}
          />
        </div>
      </div>
    </div>
  );
};
