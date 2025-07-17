import { createRoot } from "react-dom/client";
import { AppWithMyScroller } from "./app/AppWithMyScroller";
// import { AppWithVirtualScroller } from "./app/AppWithVirtualScroller";

createRoot(document.getElementById("root")!).render(<AppWithMyScroller />);
// createRoot(document.getElementById("root")!).render(<AppWithVirtualScroller />);
