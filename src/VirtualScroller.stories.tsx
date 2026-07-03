import type { Story } from "@ladle/react";

import { VirtualScroller } from "./VirtualScroller";

// Инлайн-генерация данных вместо json-server: стенд должен быть самодостаточным.
const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => `Item ${i}`);

const rowStyle = (height: number): React.CSSProperties => ({
  height,
  display: "flex",
  alignItems: "center",
  paddingLeft: 12,
  borderBottom: "1px solid #e2e2e2",
  boxSizing: "border-box",
});

const renderRow = (height: number) => (item: string) =>
  (
    <div key={item} style={rowStyle(height)}>
      {item}
    </div>
  );

/** Базовый случай — 1000 элементов, дефолтные пропсы. */
export const Basic: Story = () => {
  const items = makeItems(1000);
  return (
    <VirtualScroller
      items={items}
      itemsCount={items.length}
      itemHeight={40}
      visibleItemsCount={8}
      renderItem={renderRow(40)}
    />
  );
};

/** Пустой список — ничего не должно упасть. */
export const Empty: Story = () => (
  <VirtualScroller
    items={[]}
    itemsCount={0}
    itemHeight={40}
    renderItem={renderRow(40)}
  />
);

/** Один элемент — граничный случай. */
export const SingleItem: Story = () => {
  const items = makeItems(1);
  return (
    <VirtualScroller
      items={items}
      itemsCount={items.length}
      itemHeight={40}
      renderItem={renderRow(40)}
    />
  );
};

/** Большой список (100k) — проверка производительности виртуализации. */
export const LargeList: Story = () => {
  const items = makeItems(100_000);
  return (
    <VirtualScroller
      items={items}
      itemsCount={items.length}
      itemHeight={32}
      visibleItemsCount={12}
      renderItem={renderRow(32)}
    />
  );
};

/** Старт не с нуля: список открывается на элементе с индексом startIndexDefault. */
export const CustomStartIndex: Story = () => {
  const items = makeItems(1000);
  return (
    <VirtualScroller
      items={items}
      itemsCount={items.length}
      itemHeight={40}
      visibleItemsCount={8}
      startIndexDefault={500}
      renderItem={renderRow(40)}
    />
  );
};

/** Кастомные высота/окно/padding. */
export const CustomSizing: Story = () => {
  const items = makeItems(2000);
  return (
    <VirtualScroller
      items={items}
      itemsCount={items.length}
      itemHeight={64}
      visibleItemsCount={5}
      paddingItemsCount={4}
      renderItem={renderRow(64)}
    />
  );
};
