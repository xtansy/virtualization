import styles from "./styles.module.scss";

import { VirtualScroller_My } from "../components";
// import { generateMockArrayData, type IArrayItemMock } from "../utils";
import { getRows } from "../api";
import type { IUser } from "../api/types";
import { useEffect, useState } from "react";

// const MOCK_ITEMS: IArrayItemMock[] = generateMockArrayData(20);

const ITEM_HEIGHT = 50;

const renderItem = (item: IUser) => {
  return (
    <div className={styles.item} style={{ height: ITEM_HEIGHT }} key={item.id}>
      #{item.id} {item.username}
    </div>
  );
};

const getData = async (startIndex: number, limit: number) => {
  const data = await getRows({ _start: startIndex, _limit: limit });
  return data;
};

export const AppWithMyScroller = () => {
  const [initialItems, setInitialItems] = useState<IUser[]>([]);

  useEffect(() => {
    getData(0, 9).then((items) => setInitialItems(items));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div style={{ flexGrow: 1 }}>
          <VirtualScroller_My
            itemsCount={70}
            items={initialItems}
            getData={getData}
            itemHeight={ITEM_HEIGHT}
            renderItem={renderItem}
          />
        </div>
      </div>
    </div>
  );
};
