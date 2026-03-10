# Sprint Capacity Calculator - Design Document

## Overview

The Sprint Capacity Calculator is a React-based web application that enables agile teams to accurately calculate available development capacity for sprint planning. The system accounts for annual leave, meetings, and other non-development time to prevent overcommitment and optimize resource utilization.

**Key Design Principles:**
- Mobile-first responsive design with touch-friendly inputs
- Real-time capacity recalculation (< 100ms) as users enter data
- Offline-first architecture using localStorage for persistence
- Professional, clean UI suitable for sprint planning meetings
- Extensible story point configuration for future methodology changes

**Technology Stack:**
- Frontend: React 18+ with TypeScript
- Styling: Tailwind CSS for responsive design
- State Management: React Context API + useReducer for predictable state updates
- Storage: Browser localStorage with JSON serialization
- Build: Vite for fast development and optimized production builds
- Deployment: Netlify with automatic deployments

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           UI Layer (React Components)                │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │ Team Input  │  │ Capacity     │  │ Config     │  │   │
│  │  │ Form        │  │ Summary      │  │ Panel      │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                   │
│                           │ (dispatch actions)                │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      State Management (Context + useReducer)         │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ AppState:                                    │   │   │
│  │  │ - teamMembers[]                              │   │   │
│  │  │ - config (baseHours, storyPointScale)        │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                   │
│                           │ (sync on change)                  │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Storage Layer (localStorage Manager)            │   │
│  │  - Serialize/deserialize state                       │   │
│  │  - Version management                               │   │
│  │  - Error handling                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                   │
│                           │                                   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Browser localStorage                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → Component captures input (Team Input Form, Config Panel)
2. **Action Dispatch** → Component dispatches action to reducer
3. **State Update** → Reducer updates application state
4. **Recalculation** → Derived calculations (capacity, totals) computed from state
5. **Persistence** → useEffect syncs state to localStorage
6. **UI Render** → Components re-render with updated state
7. **Export** → CSV export reads current state and generates file

---

## Components and Interfaces

### Component Hierarchy

```
App
├── Header
│   └── Title & Description
├── MainContainer
│   ├── TeamInputSection
│   │   ├── TeamMemberList
│   │   │   └── TeamMemberCard (repeating)
│   │   │       ├── NameInput
│   │   │       ├── LeaveSection
│   │   │       │   ├── LeaveOccurrenceList
│   │   │       │   │   └── LeaveOccurrenceRow (repeating)
│   │   │       │   ├── LeaveTotal
│   │   │       │   └── AddLeaveButton
│   │   │       ├── MeetingSection
│   │   │       │   ├── MeetingOccurrenceList
│   │   │       │   │   └── MeetingOccurrenceRow (repeating)
│   │   │       │   ├── MeetingTotal
│   │   │       │   └── AddMeetingButton
│   │   │       └── DeleteMemberButton
│   │   └── AddTeamMemberButton
│   ├── CapacitySummarySection
│   │   ├── ViewToggle (Hours/Story Points)
│   │   └── CapacityTable
│   │       ├── TableHeader
│   │       ├── TeamMemberRows (repeating)
│   │       └── TotalsRow
│   ├── ConfigurationSection
│   │   ├── BaseHoursConfig
│   │   ├── StoryPointScaleConfig
│   │   │   └── ScaleInput (repeating for each point value)
│   │   └── ValidationMessages
│   └── ActionBar
│       ├── ExportButton
│       └── ClearButton
└── Footer
    └── Version & Info
```

### Key Components

#### App (Root Component)
- Manages global state via Context + useReducer
- Initializes state from localStorage on mount
- Syncs state to localStorage on changes
- Renders main layout sections

#### TeamInputSection
- Displays list of team members
- Allows adding/removing team members
- Provides interface for editing leave and meeting occurrences
- Shows running totals for each team member

#### TeamMemberCard
- Displays single team member's data
- Editable name field
- Leave occurrences list with add/edit/remove
- Meeting occurrences list with add/edit/remove
- Delete member button

#### LeaveOccurrenceRow / MeetingOccurrenceRow
- Single input field for hours
- Delete button
- Real-time validation

#### CapacitySummarySection
- Toggle between hours and story points view
- Displays CapacityTable
- Shows totals row

#### CapacityTable
- Professional table layout
- Columns: Name, Base Hours, Leave Hours, Meeting Hours, Available Capacity
- Responsive: card-based on mobile, table on desktop
- Totals row with sum calculations

#### ConfigurationSection
- Base hours input with validation
- Story point scale inputs (1pt, 3pt, 5pt, 8pt, 10pt)
- Validation error messages
- Collapsible on mobile

#### ActionBar
- Export to CSV button
- Clear all data button (with confirmation)

---

## Data Models

### Core Data Structures

```typescript
// Team Member
interface TeamMember {
  id: string;                    // UUID for unique identification
  name: string;                  // Team member name
  leaveOccurrences: TimeEntry[]; // Individual leave entries
  meetingOccurrences: TimeEntry[]; // Individual meeting entries
}

// Time Entry (for leave or meeting)
interface TimeEntry {
  id: string;                    // UUID for unique identification
  hours: number;                 // Hours (supports decimals)
  description?: string;          // Optional description
}

// Configuration
interface Config {
  baseHours: number;             // Hours per sprint (default: 72.34)
  storyPointScale: StoryPointScale;
}

// Story Point Scale Mapping
interface StoryPointScale {
  '1': number;                   // 1 point = X hours
  '3': number;                   // 3 points = X hours
  '5': number;                   // 5 points = X hours
  '8': number;                   // 8 points = X hours
  '10': number;                  // 10 points = X hours
}

// Application State
interface AppState {
  teamMembers: TeamMember[];
  config: Config;
}

// Derived Calculations (computed, not stored)
interface TeamMemberCapacity {
  id: string;
  name: string;
  baseHours: number;
  totalLeaveHours: number;
  totalMeetingHours: number;
  availableCapacity: number;    // baseHours - leave - meetings
  availableCapacityInPoints?: number; // Optional story point conversion
}

interface TeamCapacitySummary {
  members: TeamMemberCapacity[];
  totals: {
    baseHours: number;
    totalLeaveHours: number;
    totalMeetingHours: number;
    totalAvailableCapacity: number;
    totalAvailableCapacityInPoints?: number;
  };
}
```

### Default Configuration

```typescript
const DEFAULT_CONFIG: Config = {
  baseHours: 72.34,
  storyPointScale: {
    '1': 1,
    '3': 4,
    '5': 8,
    '8': 12,
    '10': 16,
  },
};
```

### State Actions (Reducer)

```typescript
type AppAction =
  // Team Member Actions
  | { type: 'ADD_TEAM_MEMBER'; payload: { name: string } }
  | { type: 'REMOVE_TEAM_MEMBER'; payload: { memberId: string } }
  | { type: 'UPDATE_TEAM_MEMBER_NAME'; payload: { memberId: string; name: string } }
  
  // Leave Actions
  | { type: 'ADD_LEAVE'; payload: { memberId: string; hours: number } }
  | { type: 'UPDATE_LEAVE'; payload: { memberId: string; leaveId: string; hours: number } }
  | { type: 'REMOVE_LEAVE'; payload: { memberId: string; leaveId: string } }
  
  // Meeting Actions
  | { type: 'ADD_MEETING'; payload: { memberId: string; hours: number } }
  | { type: 'UPDATE_MEETING'; payload: { memberId: string; meetingId: string; hours: number } }
  | { type: 'REMOVE_MEETING'; payload: { memberId: string; meetingId: string } }
  
  // Configuration Actions
  | { type: 'UPDATE_BASE_HOURS'; payload: { baseHours: number } }
  | { type: 'UPDATE_STORY_POINT_SCALE'; payload: { scale: StoryPointScale } }
  
  // Bulk Actions
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'LOAD_STATE'; payload: AppState };
```

---

## Key Algorithms

### Capacity Calculation

```typescript
function calculateTeamMemberCapacity(
  member: TeamMember,
  baseHours: number
): TeamMemberCapacity {
  const totalLeaveHours = member.leaveOccurrences.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );
  
  const totalMeetingHours = member.meetingOccurrences.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );
  
  const availableCapacity = Math.max(
    0,
    baseHours - totalLeaveHours - totalMeetingHours
  );
  
  return {
    id: member.id,
    name: member.name,
    baseHours,
    totalLeaveHours,
    totalMeetingHours,
    availableCapacity,
  };
}
```

**Key Points:**
- Capacity cannot be negative (clamped to 0)
- All hours support decimal values (e.g., 1.5 hours)
- Calculation is O(n) where n = number of occurrences per member
- Recalculation triggered on any input change

### Story Point Conversion

```typescript
function convertHoursToStoryPoints(
  hours: number,
  scale: StoryPointScale
): number {
  // Get all valid story point values sorted
  const points = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);
  
  // Find closest story point value
  let closest = points[0];
  let minDifference = Math.abs(scale[closest] - hours);
  
  for (const point of points) {
    const difference = Math.abs(scale[point] - hours);
    if (difference < minDifference) {
      minDifference = difference;
      closest = point;
    }
  }
  
  return closest;
}

function convertStoryPointsToHours(
  points: number,
  scale: StoryPointScale
): number {
  return scale[points] || 0;
}
```

**Key Points:**
- Rounds to nearest valid story point value
- Supports custom scales (not limited to Fibonacci)
- Bidirectional conversion

### Team Capacity Summary Calculation

```typescript
function calculateTeamCapacitySummary(
  teamMembers: TeamMember[],
  config: Config,
  includeStoryPoints: boolean = false
): TeamCapacitySummary {
  const members = teamMembers.map(member =>
    calculateTeamMemberCapacity(member, config.baseHours)
  );
  
  const totals = {
    baseHours: members.reduce((sum, m) => sum + m.baseHours, 0),
    totalLeaveHours: members.reduce((sum, m) => sum + m.totalLeaveHours, 0),
    totalMeetingHours: members.reduce((sum, m) => sum + m.totalMeetingHours, 0),
    totalAvailableCapacity: members.reduce((sum, m) => sum + m.availableCapacity, 0),
  };
  
  if (includeStoryPoints) {
    totals.totalAvailableCapacityInPoints = convertHoursToStoryPoints(
      totals.totalAvailableCapacity,
      config.storyPointScale
    );
    members.forEach(m => {
      m.availableCapacityInPoints = convertHoursToStoryPoints(
        m.availableCapacity,
        config.storyPointScale
      );
    });
  }
  
  return { members, totals };
}
```

---

## Storage Schema

### localStorage Structure

```json
{
  "sprint-capacity-calculator:v1": {
    "teamMembers": [
      {
        "id": "uuid-1",
        "name": "Alice Johnson",
        "leaveOccurrences": [
          { "id": "uuid-leave-1", "hours": 8 },
          { "id": "uuid-leave-2", "hours": 4 }
        ],
        "meetingOccurrences": [
          { "id": "uuid-meeting-1", "hours": 2 },
          { "id": "uuid-meeting-2", "hours": 1.5 }
        ]
      },
      {
        "id": "uuid-2",
        "name": "Bob Smith",
        "leaveOccurrences": [],
        "meetingOccurrences": [
          { "id": "uuid-meeting-3", "hours": 3 }
        ]
      }
    ],
    "config": {
      "baseHours": 72.34,
      "storyPointScale": {
        "1": 1,
        "3": 4,
        "5": 8,
        "8": 12,
        "10": 16
      }
    }
  }
}
```

### Storage Key Strategy

- **Key Format**: `sprint-capacity-calculator:v{version}`
- **Version**: Incremented when schema changes
- **Current Version**: v1
- **Migration Path**: Future versions can include migration logic to upgrade old data

### Storage Operations

```typescript
// Save state to localStorage
function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem('sprint-capacity-calculator:v1', serialized);
  } catch (error) {
    console.error('Failed to save state:', error);
    // Gracefully handle quota exceeded or other errors
  }
}

// Load state from localStorage
function loadState(): AppState | null {
  try {
    const serialized = localStorage.getItem('sprint-capacity-calculator:v1');
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load state:', error);
    return null;
  }
}

// Clear all data
function clearState(): void {
  try {
    localStorage.removeItem('sprint-capacity-calculator:v1');
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
}
```

---

## Responsive Design

### Breakpoints (Tailwind CSS)

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: ≥ 1024px (xl, 2xl)

### Layout Strategies

#### Mobile (< 640px)
- Single column layout
- Team members displayed as cards (one per row)
- Collapsible sections for configuration
- Large touch targets (44x44px minimum)
- Font size: 16px minimum for inputs
- Horizontal scrolling for capacity table (or card-based view)

#### Tablet (640px - 1024px)
- Two-column layout possible
- Team input on left, summary on right
- Configuration panel below
- Larger font sizes (14-16px)

#### Desktop (≥ 1024px)
- Three-column layout: Input | Summary | Config
- Full table display for capacity summary
- Hover effects on interactive elements
- Optimized spacing and typography

### Responsive Components

```typescript
// Example: Capacity Table Responsive Layout

// Mobile: Card-based view
<div className="md:hidden space-y-4">
  {members.map(member => (
    <div key={member.id} className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">{member.name}</span>
        <span className="text-blue-600">{member.availableCapacity}h</span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <div>Base: {member.baseHours}h</div>
        <div>Leave: {member.totalLeaveHours}h</div>
        <div>Meetings: {member.totalMeetingHours}h</div>
      </div>
    </div>
  ))}
</div>

// Desktop: Table view
<div className="hidden md:block overflow-x-auto">
  <table className="w-full">
    {/* Table content */}
  </table>
</div>
```

---

## Input Validation

### Validation Rules

```typescript
interface ValidationRule {
  field: string;
  validate: (value: any) => boolean;
  errorMessage: string;
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    field: 'hours',
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    },
    errorMessage: 'Must be a non-negative number',
  },
  {
    field: 'baseHours',
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    errorMessage: 'Base hours must be a positive number',
  },
  {
    field: 'storyPointValue',
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    errorMessage: 'Story point value must be positive',
  },
  {
    field: 'teamMemberName',
    validate: (value) => typeof value === 'string' && value.trim().length > 0,
    errorMessage: 'Team member name is required',
  },
];
```

### Validation Behavior

- **Real-time validation**: Validate on blur and on change
- **Error display**: Show inline error messages below field
- **Empty fields**: Treat as zero for numeric fields
- **Prevent invalid saves**: Disable save/submit buttons if validation fails

---

## CSV Export

### Export Format

```csv
Team Member,Base Hours,Annual Leave Hours,Meeting Hours,Available Capacity
Alice Johnson,72.34,12,3.5,56.84
Bob Smith,72.34,0,3,69.34
Charlie Brown,72.34,8,5,59.34
TOTAL,217.02,20,11.5,185.52
```

### Export Implementation

```typescript
function generateCSV(summary: TeamCapacitySummary): string {
  const headers = [
    'Team Member',
    'Base Hours',
    'Annual Leave Hours',
    'Meeting Hours',
    'Available Capacity',
  ];
  
  const rows = summary.members.map(member => [
    member.name,
    member.baseHours.toFixed(2),
    member.totalLeaveHours.toFixed(2),
    member.totalMeetingHours.toFixed(2),
    member.availableCapacity.toFixed(2),
  ]);
  
  rows.push([
    'TOTAL',
    summary.totals.baseHours.toFixed(2),
    summary.totals.totalLeaveHours.toFixed(2),
    summary.totals.totalMeetingHours.toFixed(2),
    summary.totals.totalAvailableCapacity.toFixed(2),
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  return csv;
}

function downloadCSV(csv: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `sprint-capacity-${timestamp}.csv`;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use React.memo for components that don't need frequent re-renders
2. **useCallback**: Memoize event handlers to prevent unnecessary re-renders
3. **useMemo**: Cache expensive calculations (capacity summary)
4. **Debouncing**: Debounce localStorage writes (100ms) to avoid excessive I/O
5. **Lazy Rendering**: Virtualize long lists if team size exceeds 50 members

### Performance Targets

- **Initial Load**: < 1s
- **Capacity Recalculation**: < 100ms
- **Input Response**: < 50ms (no lag while typing)
- **CSV Export**: < 500ms
- **localStorage Sync**: Debounced to 100ms intervals

### Debounce Implementation

```typescript
function useDebouncedSave(state: AppState, delay: number = 100) {
  useEffect(() => {
    const timer = setTimeout(() => {
      saveState(state);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [state, delay]);
}
```

---

## Error Handling

### Error Scenarios

1. **localStorage Quota Exceeded**: Show warning, allow continued use with data loss on refresh
2. **Invalid JSON in localStorage**: Clear corrupted data, start fresh
3. **Validation Errors**: Show inline error messages, prevent invalid operations
4. **Export Failures**: Show error toast, allow retry

### Error Handling Strategy

```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof QuotaExceededError) {
    showWarning('Storage quota exceeded. Data may not persist.');
  } else if (error instanceof ValidationError) {
    showError(error.message);
  } else {
    showError('An unexpected error occurred.');
    console.error(error);
  }
}
```

