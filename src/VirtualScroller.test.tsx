import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";

import { VirtualScroller } from "./VirtualScroller";

// Глобалы отключены (vitest без globals), поэтому auto-cleanup RTL не подключается — чистим сами.
afterEach(cleanup);

const CLASS = "scroller";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => `Item ${i}`);

const renderScroller = (props: {
  itemsCount: number;
  itemHeight?: number;
  visibleItemsCount?: number;
  paddingItemsCount?: number;
  startIndexDefault?: number;
}) => {
  const items = makeItems(props.itemsCount);
  const view = render(
    <VirtualScroller
      items={items}
      overviewClassname={CLASS}
      renderItem={(item) => (
        <div key={item} data-testid="row">
          {item}
        </div>
      )}
      {...props}
    />
  );
  const scroller = view.container.querySelector(`.${CLASS}`) as HTMLElement;
  const rows = () =>
    Array.from(view.container.querySelectorAll('[data-testid="row"]')).map(
      (el) => el.textContent
    );
  return { ...view, scroller, rows };
};

// В jsdom нет layout, поэтому scrollTop задаём вручную через target scroll-эвента.
const scrollTo = (scroller: HTMLElement, scrollTop: number) =>
  fireEvent.scroll(scroller, { target: { scrollTop } });

describe("VirtualScroller", () => {
  it("пустой список не рендерит ни одного элемента", () => {
    const { rows } = renderScroller({ itemsCount: 0 });
    expect(rows()).toHaveLength(0);
  });

  it("на старте рендерит окно = visibleItemsCount + нижний padding (верхний обрезан нулём)", () => {
    // startIndex=0: paddingStart=max(0-2,0)=0, paddingEnd=min(0+5+2,100)=7 → 7 элементов
    const { rows } = renderScroller({
      itemsCount: 100,
      itemHeight: 20,
      visibleItemsCount: 5,
      paddingItemsCount: 2,
    });
    expect(rows()).toEqual([
      "Item 0",
      "Item 1",
      "Item 2",
      "Item 3",
      "Item 4",
      "Item 5",
      "Item 6",
    ]);
  });

  it("при скролле рендерит правильный срез вокруг видимого окна", () => {
    // scrollTop=200, itemHeight=20 → scrolledItems=10
    // paddingStart=max(10-2,0)=8, paddingEnd=min(10+5+2,100)=17 → Item 8..16
    const { scroller, rows } = renderScroller({
      itemsCount: 100,
      itemHeight: 20,
      visibleItemsCount: 5,
      paddingItemsCount: 2,
    });
    scrollTo(scroller, 200);
    const result = rows();
    expect(result[0]).toBe("Item 8");
    expect(result[result.length - 1]).toBe("Item 16");
    expect(result).toHaveLength(9);
  });

  it("не выходит за границы списка при скролле в самый низ", () => {
    // максимально валидный scrollTop = (100-5)*20 = 1900 → scrolledItems=95
    // paddingEnd=min(95+5+2,100)=100 (клип по itemsCount) → последний Item 99, Item 100 нет
    const { scroller, rows } = renderScroller({
      itemsCount: 100,
      itemHeight: 20,
      visibleItemsCount: 5,
      paddingItemsCount: 2,
    });
    scrollTo(scroller, (100 - 5) * 20);
    const result = rows();
    expect(result[result.length - 1]).toBe("Item 99");
    expect(result).not.toContain("Item 100");
  });

  it("startIndexDefault выставляет начальный scrollTop контейнера", () => {
    const { scroller } = renderScroller({
      itemsCount: 100,
      itemHeight: 20,
      startIndexDefault: 50,
    });
    // 50 * 20 = 1000
    expect(scroller.scrollTop).toBe(1000);
  });
});
