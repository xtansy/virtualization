# Virtualization-Lib

Лёгкая библиотека для виртуализации простых списков в React.

Решает проблему производительности при работе с большими списками, рендеря только видимые пользователю элементы.

[![npm](https://img.shields.io/npm/v/virtualization-lib)](https://www.npmjs.com/package/virtualization-lib)
[![GitHub](https://img.shields.io/badge/GitHub-xtansy-blue?logo=github)](https://github.com/xtansy/virtualization)
[![bundle size](https://img.shields.io/bundlephobia/minzip/virtualization-lib)](https://bundlephobia.com/package/virtualization-lib)
[![downloads](https://img.shields.io/npm/dm/virtualization-lib)](https://www.npmjs.com/package/virtualization-lib)

## Установка

```bash
npm i virtualization-lib
```

или

```bash
yarn add virtualization-lib
```

## Использование

```tsx
import { VirtualScroller } from "virtualization-lib";

const ITEM_HEIGHT = 50;
const ITEMS_COUNT = 1_000;
const items = Array.from({ length: ITEMS_COUNT }, (_, i) => `Item ${i}`);

const renderItem = (item: string) => (
  <div key={item} style={{ height: ITEM_HEIGHT }}>
    {item}
  </div>
);

export default function App() {
  return (
    <VirtualScroller
      items={items}
      itemsCount={ITEMS_COUNT}
      itemHeight={ITEM_HEIGHT}
      renderItem={renderItem}
    />
  );
}
```

## Параметры (props)

| Название            | Тип                     | По умолчанию | Описание                             |
| ------------------- | ----------------------- | ------------ | ------------------------------------ |
| `itemHeight`        | `number`                | `20`         | Высота одного элемента (px)          |
| `visibleItemsCount` | `number`                | `5`          | Количество видимых элементов         |
| `paddingItemsCount` | `number`                | `2`          | Кол-во доп. элементов сверху и снизу |
| `startIndexDefault` | `number`                | `0`          | Индекс элемента, с которого начать   |
| `overviewClassname` | `string`                | `undefined`  | Класс для контейнера                 |
| `items`             | `T[]`                   | `[]`         | Список элементов                     |
| `itemsCount`        | `number`                | `0`          | Количество элементов                 |
| `renderItem`        | `(item:T) => ReactNode` | —            | Функция отрисовки элемента           |

## Преимущества

- Лёгкая и быстрая, без лишних зависимостей
- Минималистичный API
- Гибкая - можно рендерить любые React-компоненты
- Поддержка стартового индекса

## Лицензия

MIT
