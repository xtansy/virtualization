import styles from "./styles.module.scss";

import { type FC } from "react";

interface ITableProps {
  data: number[][];
}

const generateRandomNumber = (min = 0, max = 1_000) => {
  return ~~(Math.random() * (max - min + 1)) + min;
};

const ROW_HEIGHT = 40;

const VISIBLE_ROWS = 5;

export const Table: FC<ITableProps> = ({ data }) => {
  return (
    <div
      style={{
        height: VISIBLE_ROWS * ROW_HEIGHT + 1,
        overflow: "auto",
        width: "fit-content",
      }}
    >
      <table>
        <tbody>
          {data.map((row) => (
            <tr key={generateRandomNumber()} style={{ height: ROW_HEIGHT }}>
              {row.map((cell) => (
                <td className={styles.td} key={generateRandomNumber()}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
