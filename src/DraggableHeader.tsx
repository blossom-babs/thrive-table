import { flexRender, type Header } from "@tanstack/react-table";
import type { IPerson } from "./utils/types";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface DraggableHeaderProps {
  header: Header<IPerson, unknown>;
  reorderColumns: (draggedId: string, targetId: string) => void;
}
const DraggableHeader = ({ header, reorderColumns }: DraggableHeaderProps) => {
  const ref = useRef<HTMLTableCellElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN_HEADER",
    item: () => ({
      id: header.column.id,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN_HEADER",
    drop: (draggedItem: { id: string }) => {
      if (draggedItem.id !== header.column.id) {
        reorderColumns(draggedItem.id, header.column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <th
      ref={ref}
      style={{
        padding: "8px",
        border: "1px solid #ddd",
        textAlign: "left",
        background: isOver ? "#e6f7ff" : "#f8f8f8",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        boxSizing: "border-box",
        position: "relative",
      }}
      onClick={(e) => {
        if (!e.defaultPrevented) {
          header.column.getToggleSortingHandler()?.(e);
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {flexRender(header.column.columnDef.header, header.getContext())}
        {header.column.getIsSorted() && (
          <span style={{ marginLeft: "4px" }}>
            {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );
};

export default DraggableHeader;
