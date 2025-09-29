import styles from "./styles.module.scss";

import { VirtualScroller } from "../components";
// import { generateMockArrayData, type IArrayItemMock } from "../utils";

import { getRows, type IUser } from "../api";
import { useEffect, useState } from "react";
const getData = async (startIndex: number, limit: number) => {
  const data = await getRows({ _start: startIndex, _limit: limit });
  return data;
};

const ITEM_HEIGHT = 50;
const ITEMS_COUNT = 70;

// const MOCK_ITEMS: IArrayItemMock[] = generateMockArrayData(ITEMS_COUNT);

const renderItem = (item: IUser) => {
  return (
    <div className={styles.item} style={{ height: ITEM_HEIGHT }} key={item.id}>
      #{item.id} {item.username}
    </div>
  );
};

export const AppWithMyScroller = () => {
  const [items, setItems] = useState<IUser[]>([]);

  useEffect(() => {
    getData(0, 70).then((res) => setItems(res));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div style={{ flexGrow: 1 }}>
          <VirtualScroller
            overviewClassname={styles.overview}
            itemsCount={ITEMS_COUNT}
            items={items}
            itemHeight={ITEM_HEIGHT}
            renderItem={renderItem}
          />
        </div>
      </div>
    </div>
  );
};
