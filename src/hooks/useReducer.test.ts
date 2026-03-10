/// <reference types="vitest" />
/**
 * Unit tests for the appReducer function
 * Tests all action types and state immutability
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { appReducer } from './useReducer';
import { AppState, AppAction } from '../types';
import { DEFAULT_CONFIG } from '../constants';

// Helper to create initial state
function createInitialState(): AppState {
  return {
    teamMembers: [],
    config: DEFAULT_CONFIG,
  };
}

describe('appReducer', () => {
  let initialState: AppState;

  beforeEach(() => {
    initialState = createInitialState();
  });

  describe('ADD_TEAM_MEMBER', () => {
    it('should add a new team member with empty leave and meetings', () => {
      const action: AppAction = {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      };

      const newState = appReducer(initialState, action);

      expect(newState.teamMembers).toHaveLength(1);
      expect(newState.teamMembers[0].name).toBe('Alice');
      expect(newState.teamMembers[0].leaveOccurrences).toEqual([]);
      expect(newState.teamMembers[0].meetingOccurrences).toEqual([]);
      expect(newState.teamMembers[0].id).toBeDefined();
    });

    it('should generate unique IDs for each team member', () => {
      const action1: AppAction = {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      };
      const action2: AppAction = {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Bob' },
      };

      let state = appReducer(initialState, action1);
      state = appReducer(state, action2);

      expect(state.teamMembers[0].id).not.toBe(state.teamMembers[1].id);
    });

    it('should preserve existing team members', () => {
      const action1: AppAction = {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      };
      const action2: AppAction = {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Bob' },
      };

      let state = appReducer(initialState, action1);
      const firstMemberId = state.teamMembers[0].id;
      state = appReducer(state, action2);

      expect(state.teamMembers).toHaveLength(2);
      expect(state.teamMembers[0].id).toBe(firstMemberId);
      expect(state.teamMembers[0].name).toBe('Alice');
    });

    it('should not mutate original state', () => {
      const action: AppAction = {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      };

      const originalLength = initialState.teamMembers.length;
      appReducer(initialState, action);

      expect(initialState.teamMembers.length).toBe(originalLength);
    });
  });

  describe('REMOVE_TEAM_MEMBER', () => {
    it('should remove a team member by ID', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'REMOVE_TEAM_MEMBER',
        payload: { memberId },
      });

      expect(state.teamMembers).toHaveLength(0);
    });

    it('should preserve other team members', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      state = appReducer(state, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Bob' },
      });
      const aliceId = state.teamMembers[0].id;
      const bobId = state.teamMembers[1].id;

      state = appReducer(state, {
        type: 'REMOVE_TEAM_MEMBER',
        payload: { memberId: aliceId },
      });

      expect(state.teamMembers).toHaveLength(1);
      expect(state.teamMembers[0].id).toBe(bobId);
      expect(state.teamMembers[0].name).toBe('Bob');
    });

    it('should handle removing non-existent member gracefully', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });

      state = appReducer(state, {
        type: 'REMOVE_TEAM_MEMBER',
        payload: { memberId: 'non-existent-id' },
      });

      expect(state.teamMembers).toHaveLength(1);
    });
  });

  describe('UPDATE_TEAM_MEMBER_NAME', () => {
    it('should update team member name', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'UPDATE_TEAM_MEMBER_NAME',
        payload: { memberId, name: 'Alicia' },
      });

      expect(state.teamMembers[0].name).toBe('Alicia');
    });

    it('should preserve other team members', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      state = appReducer(state, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Bob' },
      });
      const aliceId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'UPDATE_TEAM_MEMBER_NAME',
        payload: { memberId: aliceId, name: 'Alicia' },
      });

      expect(state.teamMembers[0].name).toBe('Alicia');
      expect(state.teamMembers[1].name).toBe('Bob');
    });
  });

  describe('ADD_LEAVE', () => {
    it('should add leave occurrence to team member', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });

      expect(state.teamMembers[0].leaveOccurrences).toHaveLength(1);
      expect(state.teamMembers[0].leaveOccurrences[0].hours).toBe(8);
      expect(state.teamMembers[0].leaveOccurrences[0].id).toBeDefined();
    });

    it('should support decimal hours', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 4.5 },
      });

      expect(state.teamMembers[0].leaveOccurrences[0].hours).toBe(4.5);
    });

    it('should add multiple leave occurrences', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });
      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 4 },
      });

      expect(state.teamMembers[0].leaveOccurrences).toHaveLength(2);
      expect(state.teamMembers[0].leaveOccurrences[0].hours).toBe(8);
      expect(state.teamMembers[0].leaveOccurrences[1].hours).toBe(4);
    });

    it('should generate unique IDs for leave occurrences', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });
      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 4 },
      });

      const id1 = state.teamMembers[0].leaveOccurrences[0].id;
      const id2 = state.teamMembers[0].leaveOccurrences[1].id;
      expect(id1).not.toBe(id2);
    });
  });

  describe('UPDATE_LEAVE', () => {
    it('should update leave occurrence hours', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });
      const leaveId = state.teamMembers[0].leaveOccurrences[0].id;

      state = appReducer(state, {
        type: 'UPDATE_LEAVE',
        payload: { memberId, leaveId, hours: 6 },
      });

      expect(state.teamMembers[0].leaveOccurrences[0].hours).toBe(6);
    });

    it('should preserve other leave occurrences', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });
      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 4 },
      });
      const leaveId1 = state.teamMembers[0].leaveOccurrences[0].id;

      state = appReducer(state, {
        type: 'UPDATE_LEAVE',
        payload: { memberId, leaveId: leaveId1, hours: 10 },
      });

      expect(state.teamMembers[0].leaveOccurrences[0].hours).toBe(10);
      expect(state.teamMembers[0].leaveOccurrences[1].hours).toBe(4);
    });
  });

  describe('REMOVE_LEAVE', () => {
    it('should remove leave occurrence', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });
      const leaveId = state.teamMembers[0].leaveOccurrences[0].id;

      state = appReducer(state, {
        type: 'REMOVE_LEAVE',
        payload: { memberId, leaveId },
      });

      expect(state.teamMembers[0].leaveOccurrences).toHaveLength(0);
    });

    it('should preserve other leave occurrences', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });
      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 4 },
      });
      const leaveId1 = state.teamMembers[0].leaveOccurrences[0].id;

      state = appReducer(state, {
        type: 'REMOVE_LEAVE',
        payload: { memberId, leaveId: leaveId1 },
      });

      expect(state.teamMembers[0].leaveOccurrences).toHaveLength(1);
      expect(state.teamMembers[0].leaveOccurrences[0].hours).toBe(4);
    });
  });

  describe('ADD_MEETING', () => {
    it('should add meeting occurrence to team member', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 2 },
      });

      expect(state.teamMembers[0].meetingOccurrences).toHaveLength(1);
      expect(state.teamMembers[0].meetingOccurrences[0].hours).toBe(2);
      expect(state.teamMembers[0].meetingOccurrences[0].id).toBeDefined();
    });

    it('should support decimal hours', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 1.5 },
      });

      expect(state.teamMembers[0].meetingOccurrences[0].hours).toBe(1.5);
    });

    it('should add multiple meeting occurrences', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 2 },
      });
      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 1 },
      });

      expect(state.teamMembers[0].meetingOccurrences).toHaveLength(2);
      expect(state.teamMembers[0].meetingOccurrences[0].hours).toBe(2);
      expect(state.teamMembers[0].meetingOccurrences[1].hours).toBe(1);
    });
  });

  describe('UPDATE_MEETING', () => {
    it('should update meeting occurrence hours', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 2 },
      });
      const meetingId = state.teamMembers[0].meetingOccurrences[0].id;

      state = appReducer(state, {
        type: 'UPDATE_MEETING',
        payload: { memberId, meetingId, hours: 3 },
      });

      expect(state.teamMembers[0].meetingOccurrences[0].hours).toBe(3);
    });

    it('should preserve other meeting occurrences', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 2 },
      });
      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 1 },
      });
      const meetingId1 = state.teamMembers[0].meetingOccurrences[0].id;

      state = appReducer(state, {
        type: 'UPDATE_MEETING',
        payload: { memberId, meetingId: meetingId1, hours: 4 },
      });

      expect(state.teamMembers[0].meetingOccurrences[0].hours).toBe(4);
      expect(state.teamMembers[0].meetingOccurrences[1].hours).toBe(1);
    });
  });

  describe('REMOVE_MEETING', () => {
    it('should remove meeting occurrence', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 2 },
      });
      const meetingId = state.teamMembers[0].meetingOccurrences[0].id;

      state = appReducer(state, {
        type: 'REMOVE_MEETING',
        payload: { memberId, meetingId },
      });

      expect(state.teamMembers[0].meetingOccurrences).toHaveLength(0);
    });

    it('should preserve other meeting occurrences', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 2 },
      });
      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 1 },
      });
      const meetingId1 = state.teamMembers[0].meetingOccurrences[0].id;

      state = appReducer(state, {
        type: 'REMOVE_MEETING',
        payload: { memberId, meetingId: meetingId1 },
      });

      expect(state.teamMembers[0].meetingOccurrences).toHaveLength(1);
      expect(state.teamMembers[0].meetingOccurrences[0].hours).toBe(1);
    });
  });

  describe('UPDATE_BASE_HOURS', () => {
    it('should update base hours in config', () => {
      const action: AppAction = {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 80 },
      };

      const newState = appReducer(initialState, action);

      expect(newState.config.baseHours).toBe(80);
    });

    it('should support decimal base hours', () => {
      const action: AppAction = {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 72.5 },
      };

      const newState = appReducer(initialState, action);

      expect(newState.config.baseHours).toBe(72.5);
    });

    it('should preserve story point scale', () => {
      const action: AppAction = {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 80 },
      };

      const newState = appReducer(initialState, action);

      expect(newState.config.storyPointScale).toEqual(
        initialState.config.storyPointScale
      );
    });

    it('should preserve team members', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });

      state = appReducer(state, {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 80 },
      });

      expect(state.teamMembers).toHaveLength(1);
      expect(state.teamMembers[0].name).toBe('Alice');
    });
  });

  describe('UPDATE_STORY_POINT_SCALE', () => {
    it('should update story point scale', () => {
      const newScale = {
        '1': 2,
        '3': 5,
        '5': 10,
        '8': 15,
        '10': 20,
      };

      const action: AppAction = {
        type: 'UPDATE_STORY_POINT_SCALE',
        payload: { scale: newScale },
      };

      const newState = appReducer(initialState, action);

      expect(newState.config.storyPointScale).toEqual(newScale);
    });

    it('should preserve base hours', () => {
      const newScale = {
        '1': 2,
        '3': 5,
        '5': 10,
        '8': 15,
        '10': 20,
      };

      const action: AppAction = {
        type: 'UPDATE_STORY_POINT_SCALE',
        payload: { scale: newScale },
      };

      const newState = appReducer(initialState, action);

      expect(newState.config.baseHours).toBe(initialState.config.baseHours);
    });

    it('should preserve team members', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });

      const newScale = {
        '1': 2,
        '3': 5,
        '5': 10,
        '8': 15,
        '10': 20,
      };

      state = appReducer(state, {
        type: 'UPDATE_STORY_POINT_SCALE',
        payload: { scale: newScale },
      });

      expect(state.teamMembers).toHaveLength(1);
      expect(state.teamMembers[0].name).toBe('Alice');
    });
  });

  describe('CLEAR_ALL_DATA', () => {
    it('should clear all team members', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      state = appReducer(state, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Bob' },
      });

      state = appReducer(state, { type: 'CLEAR_ALL_DATA' });

      expect(state.teamMembers).toHaveLength(0);
    });

    it('should reset config to defaults', () => {
      let state = appReducer(initialState, {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 100 },
      });

      state = appReducer(state, { type: 'CLEAR_ALL_DATA' });

      expect(state.config).toEqual(DEFAULT_CONFIG);
    });

    it('should reset everything', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      state = appReducer(state, {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 100 },
      });

      state = appReducer(state, { type: 'CLEAR_ALL_DATA' });

      expect(state.teamMembers).toHaveLength(0);
      expect(state.config).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('LOAD_STATE', () => {
    it('should load complete state', () => {
      const newState: AppState = {
        teamMembers: [
          {
            id: 'member-1',
            name: 'Alice',
            leaveOccurrences: [{ id: 'leave-1', hours: 8 }],
            meetingOccurrences: [{ id: 'meeting-1', hours: 2 }],
          },
        ],
        config: {
          baseHours: 80,
          storyPointScale: {
            '1': 2,
            '3': 5,
            '5': 10,
            '8': 15,
            '10': 20,
          },
        },
      };

      const action: AppAction = {
        type: 'LOAD_STATE',
        payload: newState,
      };

      const result = appReducer(initialState, action);

      expect(result).toEqual(newState);
    });

    it('should completely replace state', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });

      const newState: AppState = {
        teamMembers: [
          {
            id: 'member-2',
            name: 'Bob',
            leaveOccurrences: [],
            meetingOccurrences: [],
          },
        ],
        config: DEFAULT_CONFIG,
      };

      state = appReducer(state, {
        type: 'LOAD_STATE',
        payload: newState,
      });

      expect(state.teamMembers).toHaveLength(1);
      expect(state.teamMembers[0].name).toBe('Bob');
      expect(state.teamMembers[0].id).toBe('member-2');
    });
  });

  describe('state immutability', () => {
    it('should not mutate state when adding team member', () => {
      const originalState = JSON.stringify(initialState);

      appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });

      expect(JSON.stringify(initialState)).toBe(originalState);
    });

    it('should not mutate state when updating config', () => {
      const originalState = JSON.stringify(initialState);

      appReducer(initialState, {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 100 },
      });

      expect(JSON.stringify(initialState)).toBe(originalState);
    });

    it('should not mutate team member arrays', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const originalTeamMembers = state.teamMembers;

      state = appReducer(state, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Bob' },
      });

      expect(originalTeamMembers).not.toBe(state.teamMembers);
    });

    it('should not mutate team member objects', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const originalMember = state.teamMembers[0];
      const memberId = originalMember.id;

      state = appReducer(state, {
        type: 'UPDATE_TEAM_MEMBER_NAME',
        payload: { memberId, name: 'Alicia' },
      });

      expect(originalMember.name).toBe('Alice');
      expect(state.teamMembers[0].name).toBe('Alicia');
    });

    it('should not mutate leave occurrences array', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 8 },
      });
      const originalLeaveArray = state.teamMembers[0].leaveOccurrences;

      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId, hours: 4 },
      });

      expect(originalLeaveArray).not.toBe(state.teamMembers[0].leaveOccurrences);
    });

    it('should not mutate meeting occurrences array', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      const memberId = state.teamMembers[0].id;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 2 },
      });
      const originalMeetingArray = state.teamMembers[0].meetingOccurrences;

      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId, hours: 1 },
      });

      expect(originalMeetingArray).not.toBe(state.teamMembers[0].meetingOccurrences);
    });

    it('should not mutate config object', () => {
      const originalConfig = initialState.config;

      appReducer(initialState, {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 100 },
      });

      expect(originalConfig.baseHours).toBe(72.34);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple operations in sequence', () => {
      let state = initialState;

      // Add two team members
      state = appReducer(state, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });
      state = appReducer(state, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Bob' },
      });

      const aliceId = state.teamMembers[0].id;
      const bobId = state.teamMembers[1].id;

      // Add leave and meetings
      state = appReducer(state, {
        type: 'ADD_LEAVE',
        payload: { memberId: aliceId, hours: 8 },
      });
      state = appReducer(state, {
        type: 'ADD_MEETING',
        payload: { memberId: bobId, hours: 2 },
      });

      // Update config
      state = appReducer(state, {
        type: 'UPDATE_BASE_HOURS',
        payload: { baseHours: 80 },
      });

      expect(state.teamMembers).toHaveLength(2);
      expect(state.teamMembers[0].leaveOccurrences).toHaveLength(1);
      expect(state.teamMembers[1].meetingOccurrences).toHaveLength(1);
      expect(state.config.baseHours).toBe(80);
    });

    it('should handle clearing and reloading state', () => {
      let state = appReducer(initialState, {
        type: 'ADD_TEAM_MEMBER',
        payload: { name: 'Alice' },
      });

      state = appReducer(state, { type: 'CLEAR_ALL_DATA' });
      expect(state.teamMembers).toHaveLength(0);

      const newState: AppState = {
        teamMembers: [
          {
            id: 'member-1',
            name: 'Bob',
            leaveOccurrences: [],
            meetingOccurrences: [],
          },
        ],
        config: DEFAULT_CONFIG,
      };

      state = appReducer(state, {
        type: 'LOAD_STATE',
        payload: newState,
      });

      expect(state.teamMembers).toHaveLength(1);
      expect(state.teamMembers[0].name).toBe('Bob');
    });
  });
});
