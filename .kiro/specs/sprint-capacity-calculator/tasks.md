# Implementation Plan: Sprint Capacity Calculator

## Overview

This implementation plan breaks down the Sprint Capacity Calculator into discrete, manageable coding tasks. The approach follows a layered architecture: first establishing project structure and core types, then building state management, followed by component development, and finally integration and testing. Each task builds on previous work with no orphaned code.

---

## Tasks

- [ ] 1. Project Setup and Core Infrastructure
  - [x] 1.1 Initialize Vite project with React 18, TypeScript, and Tailwind CSS
    - Create new Vite project with React template
    - Configure TypeScript strict mode
    - Set up Tailwind CSS with responsive breakpoints
    - Configure build output and development server
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 1.2 Create core type definitions and interfaces
    - Define TeamMember, TimeEntry, Config, StoryPointScale interfaces
    - Define AppState, TeamMemberCapacity, TeamCapacitySummary types
    - Define AppAction union type for reducer actions
    - Create constants file with DEFAULT_CONFIG
    - _Requirements: 1.1, 3.2, 4.1, 5.1_

  - [x] 1.3 Set up project directory structure
    - Create src/components, src/hooks, src/utils, src/context directories
    - Create src/types for type definitions
    - Create src/constants for default values
    - _Requirements: 12.1_

- [ ] 2. State Management and Storage Layer
  - [x] 2.1 Implement localStorage manager utility
    - Create saveState, loadState, clearState functions
    - Implement versioned storage key (sprint-capacity-calculator:v1)
    - Add error handling for quota exceeded and JSON parse errors
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 11.2_

  - [x] 2.2 Create AppContext and useAppContext hook
    - Define AppContext with state and dispatch
    - Create useAppContext custom hook for accessing context
    - Export context and hook for use in components
    - _Requirements: 1.3, 2.3, 4.3, 5.3_

  - [x] 2.3 Implement reducer function with all action handlers
    - Handle ADD_TEAM_MEMBER, REMOVE_TEAM_MEMBER, UPDATE_TEAM_MEMBER_NAME
    - Handle ADD_LEAVE, UPDATE_LEAVE, REMOVE_LEAVE
    - Handle ADD_MEETING, UPDATE_MEETING, REMOVE_MEETING
    - Handle UPDATE_BASE_HOURS, UPDATE_STORY_POINT_SCALE
    - Handle CLEAR_ALL_DATA, LOAD_STATE actions
    - _Requirements: 1.1, 1.5, 6.3, 7.2, 8.5, 8.6, 16.3_

  - [x] 2.4 Create App root component with Context Provider
    - Initialize state from localStorage on mount
    - Set up useEffect to sync state to localStorage (debounced 100ms)
    - Render AppContext.Provider wrapping all child components
    - _Requirements: 10.1, 10.2, 10.3, 13.1, 13.2_

- [ ] 3. Core Calculation Utilities
  - [x] 3.1 Implement capacity calculation functions
    - Create calculateTeamMemberCapacity function
    - Create calculateTeamCapacitySummary function
    - Implement clamping to zero for negative capacity
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3_

  - [x] 3.2 Implement story point conversion functions
    - Create convertHoursToStoryPoints function (rounds to nearest point)
    - Create convertStoryPointsToHours function
    - Support custom story point scales
    - _Requirements: 3.1, 3.3, 3.4, 3.5_

  - [x] 3.3 Create validation utility functions
    - Implement validateHours (non-negative number)
    - Implement validateBaseHours (positive number)
    - Implement validateStoryPointValue (positive number)
    - Implement validateTeamMemberName (non-empty string)
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 3.4 Create CSV export utility function
    - Implement generateCSV function to format capacity data
    - Implement downloadCSV function to trigger browser download
    - Include timestamp in filename (sprint-capacity-YYYY-MM-DD.csv)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 4. Team Input Components
  - [x] 4.1 Create TeamMemberCard component
    - Display team member name with editable input
    - Show leave and meeting occurrence lists
    - Display running totals for leave and meeting hours
    - Include delete member button
    - _Requirements: 6.1, 7.1, 8.1, 8.2, 8.3, 8.4_

  - [x] 4.2 Create LeaveOccurrenceRow component
    - Display single leave entry with hours input
    - Include delete button for removing occurrence
    - Implement real-time validation
    - _Requirements: 8.2, 8.5, 15.1, 15.2_

  - [x] 4.3 Create MeetingOccurrenceRow component
    - Display single meeting entry with hours input
    - Include delete button for removing occurrence
    - Implement real-time validation
    - _Requirements: 8.3, 8.5, 15.1, 15.2_

  - [x] 4.4 Create TeamMemberList component
    - Render list of TeamMemberCard components
    - Include "Add Team Member" button
    - Handle adding new team members with unique IDs
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 4.5 Create TeamInputSection component
    - Wrap TeamMemberList component
    - Provide section header and layout
    - _Requirements: 6.1, 7.1, 8.1_

- [ ] 5. Capacity Summary Components
  - [x] 5.1 Create CapacityTable component
    - Display table with columns: Name, Base Hours, Leave Hours, Meeting Hours, Available Capacity
    - Include totals row with sum calculations
    - Implement responsive design (card-based on mobile, table on desktop)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 12.4, 12.5_

  - [x] 5.2 Create ViewToggle component
    - Toggle between hours and story points view
    - Update displayed values based on selection
    - _Requirements: 3.1_

  - [x] 5.3 Create CapacitySummarySection component
    - Render ViewToggle and CapacityTable
    - Pass capacity data to table
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 6. Configuration Components
  - [x] 6.1 Create BaseHoursInput component
    - Display editable field for base hours
    - Show default value (72.34)
    - Implement validation and error display
    - Dispatch UPDATE_BASE_HOURS action on change
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 15.3_

  - [x] 6.2 Create StoryPointScaleInput component
    - Display editable fields for each story point value (1, 3, 5, 8, 10)
    - Show default mappings
    - Implement validation for positive numbers
    - Dispatch UPDATE_STORY_POINT_SCALE action on change
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 15.3_

  - [x] 6.3 Create ConfigurationSection component
    - Render BaseHoursInput and StoryPointScaleInput
    - Display validation error messages
    - Implement collapsible layout on mobile
    - _Requirements: 4.1, 5.1, 12.1, 12.2, 12.3, 14.3_

- [ ] 7. Action Bar and Utility Components
  - [x] 7.1 Create ExportButton component
    - Display export to CSV button
    - Call generateCSV and downloadCSV on click
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 7.2 Create ClearButton component
    - Display clear all data button
    - Show confirmation dialog before clearing
    - Dispatch CLEAR_ALL_DATA action on confirmation
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 7.3 Create ActionBar component
    - Render ExportButton and ClearButton
    - Provide layout and spacing
    - _Requirements: 9.1, 16.1_

  - [x] 7.4 Create Header component
    - Display application title and description
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 7.5 Create Footer component
    - Display version and info
    - _Requirements: 14.1, 14.2_

- [ ] 8. Layout and Integration
  - [x] 8.1 Create MainContainer component
    - Arrange TeamInputSection, CapacitySummarySection, ConfigurationSection, ActionBar
    - Implement responsive grid layout (mobile-first)
    - _Requirements: 12.1, 12.4, 12.5, 14.1, 14.2_

  - [x] 8.2 Wire all components into App root
    - Render Header, MainContainer, Footer
    - Ensure all components receive context and props correctly
    - Test data flow from input to summary to export
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4_

- [ ] 9. Styling and Responsive Design
  - [x] 9.1 Apply Tailwind CSS styling to all components
    - Implement mobile-first responsive design
    - Use consistent color scheme and typography
    - Ensure 44x44px minimum touch targets on mobile
    - Ensure 16px minimum font size on mobile inputs
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 14.1, 14.2, 14.3, 14.4_

  - [x] 9.2 Implement responsive breakpoints
    - Mobile layout (< 640px): single column, card-based
    - Tablet layout (640px - 1024px): two-column
    - Desktop layout (≥ 1024px): three-column or full table
    - _Requirements: 12.1, 12.4, 12.5_

- [ ] 10. Checkpoint - Core Functionality Complete
  - Ensure all components render without errors
  - Verify data flows correctly from input to summary
  - Test capacity calculations with sample data
  - Verify localStorage persistence works
  - Ask the user if questions arise

- [ ] 11. Testing and Quality Assurance
  - [x] 11.1 Write unit tests for calculation utilities
    - Test calculateTeamMemberCapacity with various inputs
    - Test capacity clamping to zero
    - Test decimal value support
    - Test calculateTeamCapacitySummary totals
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 2.1, 2.2_

  - [x] 11.2 Write unit tests for story point conversion
    - Test convertHoursToStoryPoints rounding
    - Test convertStoryPointsToHours inverse mapping
    - Test custom story point scales
    - _Requirements: 3.1, 3.3, 3.4, 3.5_

  - [x] 11.3 Write unit tests for validation functions
    - Test validateHours with valid/invalid inputs
    - Test validateBaseHours with positive/negative values
    - Test validateStoryPointValue
    - Test validateTeamMemberName
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 11.4 Write unit tests for localStorage manager
    - Test saveState and loadState round-trip
    - Test error handling for quota exceeded
    - Test JSON parse error handling
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 11.5 Write unit tests for CSV export
    - Test generateCSV format and content
    - Test filename generation with timestamp
    - Test totals row calculation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

  - [x] 11.6 Write unit tests for reducer
    - Test all action types
    - Test state immutability
    - Test action payload handling
    - _Requirements: 1.1, 1.5, 6.3, 7.2, 8.5, 8.6, 16.3_

  - [x] 11.7 Write integration tests for component interactions
    - Test adding/removing team members updates summary
    - Test editing leave/meeting hours recalculates capacity
    - Test configuration changes apply to all members
    - Test export includes correct data
    - _Requirements: 1.3, 2.3, 4.2, 5.2, 8.5, 8.6, 9.2_

  - [x] 11.8 Write property tests for capacity calculations
    - **Property 1: Capacity is always non-negative**
    - **Validates: Requirements 1.2**
    - Test that capacity never goes below zero regardless of input

  - [x] 11.9 Write property tests for data persistence
    - **Property 2: State round-trip consistency**
    - **Validates: Requirements 10.1, 10.2, 10.3**
    - Test that saved and loaded state are identical

  - [x] 11.10 Write property tests for story point conversion
    - **Property 3: Story point conversion is reversible**
    - **Validates: Requirements 3.4, 3.5**
    - Test that converting hours to points and back yields original value (within rounding)

- [x] 12. Final Checkpoint - All Tests Pass
  - Ensure all unit tests pass
  - Ensure all integration tests pass
  - Ensure all property tests pass
  - Verify no console errors or warnings
  - Ask the user if questions arise

- [ ] 13. Build and Deployment Preparation
  - [x] 13.1 Configure Vite production build
    - Optimize bundle size
    - Enable minification and tree-shaking
    - Configure source maps for debugging
    - _Requirements: 12.1_

  - [x] 13.2 Create deployment configuration for Netlify
    - Create netlify.toml with build command and publish directory
    - Configure environment variables if needed
    - _Requirements: 12.1_

  - [x] 13.3 Verify production build works correctly
    - Build production bundle
    - Test production build locally
    - Verify all features work in production build
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4_

---

## Implementation Notes

- **Incremental Development**: Each task builds on previous work. Complete tasks in order to avoid dependencies.
- **Testing Strategy**: Unit tests validate individual functions, integration tests validate component interactions, property tests validate universal correctness properties.
- **Optional Testing**: Tasks marked with `*` are optional test-related tasks. Core implementation tasks (without `*`) must be completed.
- **Responsive Design**: Mobile-first approach ensures usability on all devices. Test on actual mobile devices when possible.
- **Performance**: Debounce localStorage writes (100ms) to avoid excessive I/O. Capacity recalculation should complete within 100ms.
- **Error Handling**: All user inputs are validated. Invalid inputs show error messages and prevent invalid operations.
- **Accessibility**: Ensure 44x44px touch targets, 16px minimum font on mobile, clear labels, and semantic HTML.

---

## Requirements Traceability

All 16 requirements are covered by implementation tasks:

- **Req 1** (Individual Capacity): Tasks 3.1, 3.3, 11.1
- **Req 2** (Team Summary): Tasks 5.1, 5.3, 11.7
- **Req 3** (Story Points): Tasks 3.2, 5.2, 11.2, 11.10
- **Req 4** (Base Hours Config): Tasks 6.1, 11.7
- **Req 5** (Story Point Scale Config): Tasks 6.2, 11.7
- **Req 6** (Add Members): Tasks 4.4, 11.7
- **Req 7** (Remove Members): Tasks 4.1, 11.7
- **Req 8** (Edit Members): Tasks 4.1, 4.2, 4.3, 11.7
- **Req 9** (CSV Export): Tasks 3.4, 7.1, 11.5
- **Req 10** (Local Storage): Tasks 2.1, 2.3, 11.4
- **Req 11** (Offline Support): Tasks 2.1, 2.4, 11.4
- **Req 12** (Mobile Design): Tasks 9.1, 9.2, 11.7
- **Req 13** (Instant Recalc): Tasks 2.3, 2.4, 13.1
- **Req 14** (Professional Design): Tasks 9.1, 9.2
- **Req 15** (Input Validation): Tasks 3.3, 4.2, 4.3, 6.1, 6.2, 11.3
- **Req 16** (Clear Data): Tasks 7.2, 11.7
