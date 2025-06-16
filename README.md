# User Table Implementation with Virtualization, Sorting & Reordering

This project implements a table component in React + Typescript that handles large datasets efficiently with virtualization, column sorting, and drag-and-drop column reordering.

## Project Structure

### Components and Utilities

| Component/Utility | Description |
|-------------------|-------------|
| `src/utils/generateData.ts` | Generates 500+ rows of fake user data using Faker.js |
| `src/App.tsx` | Main entry point that renders the DataTable component |
| `src/components/DataTable.tsx` | Main table component with virtualization, sorting, and column reordering |
| `src/components/DraggableHeader.tsx` | Header component enabling drag-and-drop column reordering |
| `src/utils/types.ts` | TypeScript type definitions |

### Key Features
- Generates 500+ rows of realistic fake data
- Virtualization for smooth scrolling with large datasets
- Column sorting with visual indicators
- Drag-and-drop column reordering
- Computed columns (Full Name, Days Since Registered)
- Responsive design
- Type-safe implementation

## Technology Choices

| Library | Purpose | Why Chosen |
|---------|---------|------------|
| **@tanstack/react-table** | Headless table utility | Provides flexible, lightweight table state management without imposing UI constraints |
| **@tanstack/react-virtual** | Virtualization | Efficiently renders only visible rows for optimal performance with large datasets |
| **react-dnd** | Drag-and-drop functionality | Robust library for implementing drag-and-drop interfaces with good React integration |
| **react-dnd-html5-backend** | HTML5 drag-and-drop backend | Provides native browser drag-and-drop capabilities |
| **@faker-js/faker** | Data generation | Industry standard for generating realistic fake data |

## Get Started

```bash
npm install
npm run dev
```

## Implementation Details

### Data Generation (`generateData.ts`)
```ts
import { faker } from '@faker-js/faker';

export const generateUserData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    city: faker.location.city(),
    registeredDate: faker.date.past(),
  }));
};
```

### Virtualization
The table implements virtualization using `@tanstack/react-virtual` to only render visible rows. This provides:

- Smooth scrolling performance with 500+ rows
- Minimal memory usage
- Efficient DOM management

Key implementation:

```tsx
const rowVirtualizer = useVirtualizer({
  getScrollElement: () => tableContainerRef.current,
  count: rows.length,
  estimateSize: () => 50,
  overscan: 10,
});
```

### Column Reordering
Drag-and-drop column reordering is implemented using `react-dnd`:

```tsx
const DraggableHeader = ({ header, reorderColumns }) => {
  const [{ isDragging }, drag] = useDrag({ /* ... */ });
  const [{ isOver }, drop] = useDrop({ /* ... */ });
  
  return (
    <th ref={drag(drop(ref))}>
      {/* Header content */}
    </th>
  );
};
```

### Sorting
All columns are sortable with custom sorting functions for computed columns:

```tsx
{
  id: "fullName",
  header: "Full Name",
  sortingFn: (rowA, rowB) => {
    const fullNameA = `${rowA.original.firstName} ${rowA.original.lastName}`;
    const fullNameB = `${rowB.original.firstName} ${rowB.original.lastName}`;
    return fullNameA.localeCompare(fullNameB);
  },
}
```

## Performance Considerations

### Virtualization Strategy
- Only renders 15 rows at a time (plus overscan)
- Uses transform positioning for smooth scrolling
- Maintains correct scroll height with a spacer element
- Adjustable overscan for balance between performance and scroll smoothness

### Efficient Updates
- Memoized components prevent unnecessary re-renders
- Column definitions memoized with `useMemo`
- Sorting happens before virtualization for optimal performance

## Customization

The table can be easily customized by:

1. Modifying column definitions in `DataTable.tsx`
2. Adjusting styling in the component files
3. Changing virtualization settings (overscan, row height)
4. Adding new computed columns

## Future Improvements

1. Row selection
2. Pagination options
3. Filtering capabilities
4. Accessibility improvements
