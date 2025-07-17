export const generateMockTableData = (
  rowsCount: number,
  cellsCount: number
) => {
  return Array(rowsCount)
    .fill(null)
    .map((_, rowIndex) => {
      return Array(cellsCount)
        .fill(null)
        .map((_, cellIndex) => rowIndex * 10 + cellIndex);
    });
};

export interface IArrayItemMock {
  id: number;
  text: string;
}
export const generateMockArrayData = (
  arrayLength: number = 20
): IArrayItemMock[] => {
  return Array(arrayLength)
    .fill(null)
    .map((_, index) => ({ id: index, text: `элемент ${index}` }));
};
