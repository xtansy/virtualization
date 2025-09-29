import styles from "./styles.module.scss";

import { VirtualScroller } from "../components";
// import { generateMockArrayData, type IArrayItemMock } from "../utils";
// import { getRows, type IUser } from "../api";
// const getData = async (startIndex: number, limit: number) => {
//   const data = await getRows({ _start: startIndex, _limit: limit });
//   return data;
// };

// const MOCK_ITEMS: IArrayItemMock[] = generateMockArrayData(ITEMS_COUNT);
// const renderItem = (item: IUser) => {
//   return (
//     <div className={styles.item} style={{ height: ITEM_HEIGHT }} key={item.id}>
//       #{item.id} {item.username}
//     </div>
//   );
// };

const ITEM_HEIGHT = 50;
const ITEMS_COUNT = 1_000;
const items = Array.from({ length: ITEMS_COUNT }, (_, i) => `Item ${i}`);

const renderItem = (item: string) => (
  <div key={item} style={{ height: ITEM_HEIGHT }}>
    {item}
  </div>
);

export const AppWithMyScroller = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div style={{ flexGrow: 1 }}>
          <VirtualScroller
            items={items}
            itemsCount={ITEMS_COUNT}
            itemHeight={ITEM_HEIGHT}
            renderItem={renderItem}
          />
        </div>
      </div>
    </div>
  );
};
