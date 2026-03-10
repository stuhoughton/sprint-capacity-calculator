import {
  TeamMember,
  TeamMemberCapacity,
  TeamCapacitySummary,
} from '../types/index';

/**
 * Calculates the available capacity for a single team member.
 *
 * Capacity = Base Hours - Total Leave Hours - Total Meeting Hours
 * If the result is negative, it is clamped to zero.
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 *
 * @param member - The team member to calculate capacity for
 * @param baseHours - The base working hours per sprint
 * @returns TeamMemberCapacity with calculated available capacity
 */
export function calculateTeamMemberCapacity(
  member: TeamMember,
  baseHours: number
): TeamMemberCapacity {
  // Sum all leave hours
  const totalLeaveHours = member.leaveOccurrences.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );

  // Sum all meeting hours
  const totalMeetingHours = member.meetingOccurrences.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );

  // Calculate available capacity and clamp to zero if negative
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

/**
 * Calculates the team capacity summary including totals.
 *
 * Validates: Requirements 2.1, 2.2, 2.3
 *
 * @param teamMembers - Array of team members
 * @param baseHours - The base working hours per sprint
 * @returns TeamCapacitySummary with individual and total capacity
 */
export function calculateTeamCapacitySummary(
  teamMembers: TeamMember[],
  baseHours: number
): TeamCapacitySummary {
  // Calculate capacity for each team member
  const members = teamMembers.map((member) =>
    calculateTeamMemberCapacity(member, baseHours)
  );

  // Calculate totals
  const totals = {
    baseHours: members.reduce((sum, m) => sum + m.baseHours, 0),
    totalLeaveHours: members.reduce((sum, m) => sum + m.totalLeaveHours, 0),
    totalMeetingHours: members.reduce((sum, m) => sum + m.totalMeetingHours, 0),
    totalAvailableCapacity: members.reduce(
      (sum, m) => sum + m.availableCapacity,
      0
    ),
  };

  return {
    members,
    totals,
  };
}
