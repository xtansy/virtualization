// Подключает матчеры jest-dom (toBeInTheDocument, toHaveStyle и т.п.).
// Глобалы vitest выключены, поэтому расширяем expect вручную, а не через
// сайд-эффект импорта "@testing-library/jest-dom" (тот полагается на global expect).
import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
