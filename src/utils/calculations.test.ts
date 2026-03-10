/// <reference types="vitest" />
/**
 * Unit and property-based tests for capacity calculation utilities
 * Tests individual and team capacity calculations with various inputs
 */

import {
  calculateTeamMemberCapacity,
  calculateTeamCapacitySummary,
} from './calculations';
import { TeamMember } from '../types/index';
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// Helper function to create a team member
function createTeamMember(
  id: string,
  name: string,
  leaveHours: number[] = [],
  meetingHours: number[] = []
): TeamMember {
  return {
    id,
    name,
    leaveOccurrences: leaveHours.map((hours, idx) => ({
      id: `leave-${idx}`,
      hours,
    })),
    meetingOccurrences: meetingHours.map((hours, idx) => ({
      id: `meeting-${idx}`,
      hours,
    })),
  };
}

describe('calculateTeamMemberCapacity', () => {
  describe('basic capacity calculation', () => {
    it('should calculate capacity with leave and meetings', () => {
      const member = createTeamMember('1', 'Alice', [8, 4], [2, 1.5]);
      const result = calculateTeamMemberCapacity(member, 72.34);

      expect(result.totalLeaveHours).toBe(12);
      expect(result.totalMeetingHours).toBe(3.5);
      expect(result.availableCapacity).toBe(56.84);
    });
  });

  describe('decimal value support', () => {
    it('should support decimal values for all inputs', () => {
      const member = createTeamMember('1', 'Alice', [1.5, 2.25], [0.5, 1.25]);
      const result = calculateTeamMemberCapacity(member, 72.5);

      expect(result.baseHours).toBe(72.5);
      expect(result.totalLeaveHours).toBe(3.75);
      expect(result.totalMeetingHours).toBe(1.75);
      expect(result.availableCapacity).toBeCloseTo(67, 1);
    });
  });

  describe('capacity clamping to zero', () => {
    it('should clamp negative capacity to zero', () => {
      const member = createTeamMember('1', 'Alice', [40, 40], []);
      const result = calculateTeamMemberCapacity(member, 72.34);

      expect(result.availableCapacity).toBe(0);
    });

    it('should not clamp positive capacity', () => {
      const member = createTeamMember('1', 'Alice', [10], [5]);
      const result = calculateTeamMemberCapacity(member, 72.34);

      expect(result.availableCapacity).toBe(57.34);
    });
  });

  describe('edge cases', () => {
    it('should handle empty team members array', () => {
      const members: TeamMember[] = [];
      const result = calculateTeamCapacitySummary(members, 72.34);

      expect(result.members).toHaveLength(0);
      expect(result.totals.baseHours).toBe(0);
      expect(result.totals.totalAvailableCapacity).toBe(0);
    });

    it('should handle multiple team members with mixed data', () => {
      const members = [
        createTeamMember('1', 'Alice', [8, 4], [2, 1.5]),
        createTeamMember('2', 'Bob', [4], [1]),
        createTeamMember('3', 'Charlie', [0], [3]),
      ];
      const result = calculateTeamCapacitySummary(members, 72.34);

      expect(result.members).toHaveLength(3);
      expect(result.totals.baseHours).toBe(217.02);
      expect(result.totals.totalLeaveHours).toBe(16);
      expect(result.totals.totalMeetingHours).toBe(7.5);
    });
  });

  describe('property-based tests', () => {
    it('Property 1: Capacity is always non-negative', () => {
      // **Validates: Requirements 1.2**
      fc.assert(
        fc.property(
          fc.array(fc.float({ min: 0, max: 100, noNaN: true }), { minLength: 0, maxLength: 10 }),
          fc.array(fc.float({ min: 0, max: 100, noNaN: true }), { minLength: 0, maxLength: 10 }),
          fc.float({ min: 0, max: 1000, noNaN: true }),
          (leaveHours: number[], meetingHours: number[], baseHours: number) => {
            const member = createTeamMember('1', 'Test', leaveHours, meetingHours);
            const result = calculateTeamMemberCapacity(member, baseHours);
            expect(result.availableCapacity).toBeGreaterThanOrEqual(0);
          }
        )
      );
    });

    it('Property 2: Capacity equals base hours minus leave and meetings', () => {
      // **Validates: Requirements 1.1, 1.3, 1.4**
      fc.assert(
        fc.property(
          fc.array(fc.float({ min: 0, max: 100 }), { minLength: 0, maxLength: 5 }),
          fc.array(fc.float({ min: 0, max: 100 }), { minLength: 0, maxLength: 5 }),
          fc.float({ min: 0, max: 1000 }),
          (leaveHours: number[], meetingHours: number[], baseHours: number) => {
            const member = createTeamMember('1', 'Test', leaveHours, meetingHours);
            const result = calculateTeamMemberCapacity(member, baseHours);

            const totalLeave = leaveHours.reduce((a: number, b: number) => a + b, 0);
            const totalMeetings = meetingHours.reduce((a: number, b: number) => a + b, 0);
            const expectedCapacity = Math.max(0, baseHours - totalLeave - totalMeetings);

            expect(result.availableCapacity).toBe(expectedCapacity);
          }
        )
      );
    });

    it('Property 3: Totals equal sum of individual occurrences', () => {
      // **Validates: Requirements 1.5**
      fc.assert(
        fc.property(
          fc.array(fc.float({ min: 0, max: 100 }), { minLength: 0, maxLength: 10 }),
          fc.array(fc.float({ min: 0, max: 100 }), { minLength: 0, maxLength: 10 }),
          (leaveHours: number[], meetingHours: number[]) => {
            const member = createTeamMember('1', 'Test', leaveHours, meetingHours);
            const result = calculateTeamMemberCapacity(member, 72.34);

            const expectedLeaveTotal = leaveHours.reduce((a: number, b: number) => a + b, 0);
            const expectedMeetingTotal = meetingHours.reduce((a: number, b: number) => a + b, 0);

            expect(result.totalLeaveHours).toBe(expectedLeaveTotal);
            expect(result.totalMeetingHours).toBe(expectedMeetingTotal);
          }
        )
      );
    });
  });
});

describe('calculateTeamCapacitySummary', () => {
  describe('basic team summary', () => {
    it('should calculate summary for multiple team members', () => {
      const members = [
        createTeamMember('1', 'Alice', [8], [2]),
        createTeamMember('2', 'Bob', [4], [1]),
        createTeamMember('3', 'Charlie', [0], [3]),
      ];
      const result = calculateTeamCapacitySummary(members, 72.34);

      expect(result.members).toHaveLength(3);
      expect(result.totals.baseHours).toBe(217.02);
      expect(result.totals.totalLeaveHours).toBe(12);
      expect(result.totals.totalMeetingHours).toBe(6);
      expect(result.totals.totalAvailableCapacity).toBe(199.02);
    });
  });

  describe('totals calculation', () => {
    it('should sum all values correctly', () => {
      const members = [
        createTeamMember('1', 'Alice', [8, 4], [2, 1.5]),
        createTeamMember('2', 'Bob', [6], [3]),
      ];
      const result = calculateTeamCapacitySummary(members, 72.34);

      expect(result.totals.baseHours).toBe(144.68);
      expect(result.totals.totalLeaveHours).toBe(18);
      expect(result.totals.totalMeetingHours).toBe(6.5);
      expect(result.totals.totalAvailableCapacity).toBe(120.18);
    });
  });

  describe('decimal support', () => {
    it('should handle decimal base hours', () => {
      const members = [createTeamMember('1', 'Alice', [], [])];
      const result = calculateTeamCapacitySummary(members, 72.5);

      expect(result.totals.baseHours).toBe(72.5);
    });

    it('should handle decimal leave and meeting hours', () => {
      const members = [
        createTeamMember('1', 'Alice', [1.5, 2.25], [0.75, 1.25]),
      ];
      const result = calculateTeamCapacitySummary(members, 72.34);

      expect(result.totals.totalLeaveHours).toBe(3.75);
      expect(result.totals.totalMeetingHours).toBe(2);
    });
  });

  describe('property-based tests', () => {
    it('Property 2: State round-trip consistency', () => {
      // **Validates: Requirements 2.1, 2.2, 2.3**
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 }),
          fc.float({ min: 0, max: 1000 }),
          (memberCount: number, baseHours: number) => {
            const members = Array.from({ length: memberCount }, (_, i) =>
              createTeamMember(`${i}`, `Member${i}`, [], [])
            );
            const result = calculateTeamCapacitySummary(members, baseHours);

            expect(result.members).toHaveLength(memberCount);
            expect(result.totals.baseHours).toBe(memberCount * baseHours);
            expect(result.totals.totalLeaveHours).toBe(0);
            expect(result.totals.totalMeetingHours).toBe(0);
            expect(result.totals.totalAvailableCapacity).toBe(memberCount * baseHours);
          }
        )
      );
    });

    it('Property 3: Team totals equal sum of individual capacities', () => {
      // **Validates: Requirements 2.1, 2.2**
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.array(fc.float({ min: 0, max: 100 }), { maxLength: 5 }),
              fc.array(fc.float({ min: 0, max: 100 }), { maxLength: 5 })
            ),
            { minLength: 1, maxLength: 10 }
          ),
          fc.float({ min: 0, max: 1000 }),
          (memberData: Array<[number[], number[]]>, baseHours: number) => {
            const members = memberData.map((data: [number[], number[]], i: number) =>
              createTeamMember(`${i}`, `Member${i}`, data[0], data[1])
            );
            const result = calculateTeamCapacitySummary(members, baseHours);

            const sumCapacities = result.members.reduce(
              (sum, m) => sum + m.availableCapacity,
              0
            );
            expect(result.totals.totalAvailableCapacity).toBe(sumCapacities);
          }
        )
      );
    });
  });
});
