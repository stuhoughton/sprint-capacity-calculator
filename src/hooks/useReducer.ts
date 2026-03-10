import { AppState, AppAction, TeamMember } from '../types';
import { DEFAULT_CONFIG } from '../constants';

/**
 * Generate a unique ID using crypto.randomUUID or fallback
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Reducer function for managing application state
 * Handles all action types: team member operations, leave/meeting management,
 * configuration updates, and bulk operations
 *
 * @param state - Current application state
 * @param action - Action to process
 * @returns Updated application state
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ============ Team Member Actions ============

    case 'ADD_TEAM_MEMBER': {
      const newMember: TeamMember = {
        id: generateId(),
        name: action.payload.name,
        leaveOccurrences: [],
        meetingOccurrences: [],
      };
      return {
        ...state,
        teamMembers: [...state.teamMembers, newMember],
      };
    }

    case 'REMOVE_TEAM_MEMBER': {
      return {
        ...state,
        teamMembers: state.teamMembers.filter(
          (member) => member.id !== action.payload.memberId
        ),
      };
    }

    case 'UPDATE_TEAM_MEMBER_NAME': {
      return {
        ...state,
        teamMembers: state.teamMembers.map((member) =>
          member.id === action.payload.memberId
            ? { ...member, name: action.payload.name }
            : member
        ),
      };
    }

    // ============ Leave Actions ============

    case 'ADD_LEAVE': {
      return {
        ...state,
        teamMembers: state.teamMembers.map((member) =>
          member.id === action.payload.memberId
            ? {
                ...member,
                leaveOccurrences: [
                  ...member.leaveOccurrences,
                  {
                    id: generateId(),
                    hours: action.payload.hours,
                  },
                ],
              }
            : member
        ),
      };
    }

    case 'UPDATE_LEAVE': {
      return {
        ...state,
        teamMembers: state.teamMembers.map((member) =>
          member.id === action.payload.memberId
            ? {
                ...member,
                leaveOccurrences: member.leaveOccurrences.map((leave) =>
                  leave.id === action.payload.leaveId
                    ? { ...leave, hours: action.payload.hours }
                    : leave
                ),
              }
            : member
        ),
      };
    }

    case 'REMOVE_LEAVE': {
      return {
        ...state,
        teamMembers: state.teamMembers.map((member) =>
          member.id === action.payload.memberId
            ? {
                ...member,
                leaveOccurrences: member.leaveOccurrences.filter(
                  (leave) => leave.id !== action.payload.leaveId
                ),
              }
            : member
        ),
      };
    }

    // ============ Meeting Actions ============

    case 'ADD_MEETING': {
      return {
        ...state,
        teamMembers: state.teamMembers.map((member) =>
          member.id === action.payload.memberId
            ? {
                ...member,
                meetingOccurrences: [
                  ...member.meetingOccurrences,
                  {
                    id: generateId(),
                    hours: action.payload.hours,
                    name: action.payload.name,
                  },
                ],
              }
            : member
        ),
      };
    }

    case 'UPDATE_MEETING': {
      return {
        ...state,
        teamMembers: state.teamMembers.map((member) =>
          member.id === action.payload.memberId
            ? {
                ...member,
                meetingOccurrences: member.meetingOccurrences.map((meeting) =>
                  meeting.id === action.payload.meetingId
                    ? { 
                        ...meeting, 
                        hours: action.payload.hours,
                        name: action.payload.name,
                      }
                    : meeting
                ),
              }
            : member
        ),
      };
    }

    case 'REMOVE_MEETING': {
      return {
        ...state,
        teamMembers: state.teamMembers.map((member) =>
          member.id === action.payload.memberId
            ? {
                ...member,
                meetingOccurrences: member.meetingOccurrences.filter(
                  (meeting) => meeting.id !== action.payload.meetingId
                ),
              }
            : member
        ),
      };
    }

    // ============ Configuration Actions ============

    case 'UPDATE_BASE_HOURS': {
      return {
        ...state,
        config: {
          ...state.config,
          baseHours: action.payload.baseHours,
        },
      };
    }

    case 'UPDATE_STORY_POINT_SCALE': {
      return {
        ...state,
        config: {
          ...state.config,
          storyPointScale: action.payload.scale,
        },
      };
    }

    // ============ Bulk Actions ============

    case 'CLEAR_ALL_DATA': {
      return {
        teamMembers: [],
        config: DEFAULT_CONFIG,
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default: {
      // Exhaustiveness check - TypeScript will error if a case is missing
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}
