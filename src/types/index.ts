/**
 * Core type definitions and interfaces for Sprint Capacity Calculator
 */

/**
 * Represents a single time entry (leave or meeting occurrence)
 */
export interface TimeEntry {
  id: string;
  hours: number;
  description?: string;
}

/**
 * Represents a team member with their leave and meeting occurrences
 */
export interface TeamMember {
  id: string;
  name: string;
  leaveOccurrences: TimeEntry[];
  meetingOccurrences: TimeEntry[];
}

/**
 * Story point scale mapping (e.g., 1pt=1h, 3pt=4h, etc.)
 */
export interface StoryPointScale {
  '1': number;
  '3': number;
  '5': number;
  '8': number;
  '10': number;
}

/**
 * Application configuration
 */
export interface Config {
  baseHours: number;
  storyPointScale: StoryPointScale;
}

/**
 * Root application state
 */
export interface AppState {
  teamMembers: TeamMember[];
  config: Config;
}

/**
 * Calculated capacity for a single team member
 */
export interface TeamMemberCapacity {
  id: string;
  name: string;
  baseHours: number;
  totalLeaveHours: number;
  totalMeetingHours: number;
  availableCapacity: number;
  availableCapacityInPoints?: number;
}

/**
 * Summary of team capacity with totals
 */
export interface TeamCapacitySummary {
  members: TeamMemberCapacity[];
  totals: {
    baseHours: number;
    totalLeaveHours: number;
    totalMeetingHours: number;
    totalAvailableCapacity: number;
    totalAvailableCapacityInPoints?: number;
  };
}

/**
 * Union type for all reducer actions
 */
export type AppAction =
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
