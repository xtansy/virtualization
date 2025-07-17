import styles from "./styles.module.scss";

import { VirtualScroller_My } from "../components";
import { generateMockArrayData, type IArrayItemMock } from "../utils";

const MOCK_ITEMS: IArrayItemMock[] = generateMockArrayData(100);

const ITEM_HEIGHT = 20;

const renderItem = (item: IArrayItemMock) => {
  return (
    <div className={styles.item} style={{ height: ITEM_HEIGHT }} key={item.id}>
      {item.text}
    </div>
  );
};

export const AppWithMyScroller = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div style={{ flexGrow: 1 }}>
          <VirtualScroller_My
            itemHeight={ITEM_HEIGHT}
            items={MOCK_ITEMS}
            renderItem={renderItem}
          />
        </div>
      </div>
    </div>
  );
};
