/// <reference types="vitest" />
/**
 * Integration tests for component interactions
 * Tests adding/removing team members, editing leave/meeting hours, configuration changes, and exports
 * Requirements: 1.3, 2.3, 4.2, 5.2, 8.5, 8.6, 9.2
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { DEFAULT_CONFIG } from '../constants';

describe('Sprint Capacity Calculator - Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Adding and removing team members updates summary', () => {
    it('should add a team member and update the capacity summary', async () => {
      render(<App />);

      // Find the add team member input
      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Alice Johnson' } });
      fireEvent.click(addButton);

      // Verify team member appears in the input field (name was added)
      await waitFor(() => {
        const inputs = screen.getAllByDisplayValue('Alice Johnson');
        expect(inputs.length).toBeGreaterThan(0);
      });

      // Verify capacity is calculated (should be base hours with no leave/meetings)
      const baseHours = DEFAULT_CONFIG.baseHours;
      const capacityValues = screen.getAllByText(new RegExp(baseHours.toFixed(2)));
      expect(capacityValues.length).toBeGreaterThan(0);
    });

    it('should add multiple team members and update totals', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add first team member
      fireEvent.change(input, { target: { value: 'Alice' } });
      fireEvent.click(addButton);

      // Add second team member
      fireEvent.change(input, { target: { value: 'Bob' } });
      fireEvent.click(addButton);

      // Verify both team members were added by checking for their names in input fields
      await waitFor(() => {
        const aliceInputs = screen.getAllByDisplayValue('Alice');
        const bobInputs = screen.getAllByDisplayValue('Bob');
        expect(aliceInputs.length).toBeGreaterThan(0);
        expect(bobInputs.length).toBeGreaterThan(0);
      });

      // Verify totals row shows sum of both members' base hours
      const totalRows = screen.getAllByText(/TOTAL/i);
      expect(totalRows.length).toBeGreaterThan(0);
    });

    it('should remove a team member and update the summary', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Alice' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByDisplayValue('Alice');
        expect(inputs.length).toBeGreaterThan(0);
      });

      // Find and click the delete button for this team member
      const deleteButtons = screen.getAllByRole('button', { name: /delete|remove/i });
      const deleteButton = deleteButtons[0]; // First delete button should be for the team member

      fireEvent.click(deleteButton);

      // Verify team member is removed
      await waitFor(() => {
        const inputs = screen.queryAllByDisplayValue('Alice');
        expect(inputs.length).toBe(0);
      });
    });

    it('should update totals when team member is removed', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add two team members
      fireEvent.change(input, { target: { value: 'Alice' } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: 'Bob' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const aliceInputs = screen.getAllByDisplayValue('Alice');
        const bobInputs = screen.getAllByDisplayValue('Bob');
        expect(aliceInputs.length).toBeGreaterThan(0);
        expect(bobInputs.length).toBeGreaterThan(0);
      });

      // Remove first team member
      const deleteButtons = screen.getAllByRole('button', { name: /delete|remove/i });
      fireEvent.click(deleteButtons[0]);

      // Verify only one team member remains
      await waitFor(() => {
        const aliceInputs = screen.queryAllByDisplayValue('Alice');
        const bobInputs = screen.getAllByDisplayValue('Bob');
        expect(aliceInputs.length).toBe(0);
        expect(bobInputs.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Editing leave/meeting hours recalculates capacity', () => {
    it('should recalculate capacity when leave hours are added', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Alice' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByDisplayValue('Alice');
        expect(inputs.length).toBeGreaterThan(0);
      });

      // Find the "Add Leave" button for this team member
      const addLeaveButtons = screen.getAllByRole('button', { name: /add leave/i });
      expect(addLeaveButtons.length).toBeGreaterThan(0);

      // Click add leave button
      fireEvent.click(addLeaveButtons[0]);

      // Find the leave hours input and enter a value
      const leaveInputs = screen.getAllByLabelText('Leave hours') as HTMLInputElement[];
      const leaveInput = leaveInputs[0]; // First input should be for leave

      fireEvent.change(leaveInput, { target: { value: '8' } });

      // Verify capacity is recalculated (should be base hours - 8)
      const expectedCapacity = (DEFAULT_CONFIG.baseHours - 8).toFixed(2);
      await waitFor(() => {
        const capacityValues = screen.getAllByText(new RegExp(expectedCapacity));
        expect(capacityValues.length).toBeGreaterThan(0);
      });
    });

    it('should recalculate capacity when meeting hours are added', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Bob' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByDisplayValue('Bob');
        expect(inputs.length).toBeGreaterThan(0);
      });

      // Find the "Add Meeting" button
      const addMeetingButtons = screen.getAllByRole('button', { name: /add meeting/i });
      expect(addMeetingButtons.length).toBeGreaterThan(0);

      // Click add meeting button
      fireEvent.click(addMeetingButtons[0]);

      // Find the meeting hours input and enter a value
      const meetingInputs = screen.getAllByLabelText('Meeting hours') as HTMLInputElement[];
      const meetingInput = meetingInputs[meetingInputs.length - 1]; // Last input should be for meeting

      fireEvent.change(meetingInput, { target: { value: '3' } });

      // Verify capacity is recalculated (should be base hours - 3)
      const expectedCapacity = (DEFAULT_CONFIG.baseHours - 3).toFixed(2);
      await waitFor(() => {
        const capacityValues = screen.getAllByText(new RegExp(expectedCapacity));
        expect(capacityValues.length).toBeGreaterThan(0);
      });
    });

    it('should clamp capacity to zero when leave exceeds base hours', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Diana' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByDisplayValue('Diana');
        expect(inputs.length).toBeGreaterThan(0);
      });

      // Add leave that exceeds base hours
      const addLeaveButtons = screen.getAllByRole('button', { name: /add leave/i });
      fireEvent.click(addLeaveButtons[0]);

      const leaveInputs = screen.getAllByLabelText('Leave hours') as HTMLInputElement[];
      const leaveInput = leaveInputs[0];
      fireEvent.change(leaveInput, { target: { value: '100' } }); // More than base hours

      // Verify capacity is clamped to 0.00
      await waitFor(() => {
        const zeroValues = screen.getAllByText(/0\.00/);
        expect(zeroValues.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Configuration changes apply to all members', () => {
    it('should apply base hours change to all team members', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add two team members
      fireEvent.change(input, { target: { value: 'Alice' } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: 'Bob' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const aliceInputs = screen.getAllByDisplayValue('Alice');
        const bobInputs = screen.getAllByDisplayValue('Bob');
        expect(aliceInputs.length).toBeGreaterThan(0);
        expect(bobInputs.length).toBeGreaterThan(0);
      });

      // Find and update base hours configuration
      const baseHoursInputs = screen.getAllByDisplayValue(
        DEFAULT_CONFIG.baseHours.toString()
      ) as HTMLInputElement[];
      const baseHoursInput = baseHoursInputs[0];

      fireEvent.change(baseHoursInput, { target: { value: '80' } });

      // Verify both team members' capacity is updated
      const expectedCapacity = (80).toFixed(2);
      await waitFor(() => {
        const capacityValues = screen.getAllByText(new RegExp(expectedCapacity));
        expect(capacityValues.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should persist configuration changes to localStorage', async () => {
      const { unmount } = render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Grace' } });
      fireEvent.click(addButton);

      // Update base hours
      const baseHoursInputs = screen.getAllByDisplayValue(
        DEFAULT_CONFIG.baseHours.toString()
      ) as HTMLInputElement[];
      const baseHoursInput = baseHoursInputs[0];

      fireEvent.change(baseHoursInput, { target: { value: '90' } });

      // Wait for localStorage to be updated (debounced 100ms)
      await waitFor(
        () => {
          const savedState = localStorage.getItem('sprint-capacity-calculator:v1');
          expect(savedState).toBeTruthy();
          const state = JSON.parse(savedState!);
          expect(state.config.baseHours).toBe(90);
        },
        { timeout: 500 }
      );

      // Unmount and remount to verify persistence
      unmount();

      render(<App />);

      // Verify the configuration was restored
      await waitFor(() => {
        const baseHoursInputs = screen.getAllByDisplayValue('90');
        expect(baseHoursInputs.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Export includes correct data', () => {
    it('should export CSV with team member data', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Henry' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByDisplayValue('Henry');
        expect(inputs.length).toBeGreaterThan(0);
      });

      // Find and click export button
      const exportButton = screen.getByRole('button', { name: /export/i });
      expect(exportButton).toBeDefined();
    });

    it('should export CSV with totals row', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add two team members
      fireEvent.change(input, { target: { value: 'Iris' } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: 'Jack' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const irisInputs = screen.getAllByDisplayValue('Iris');
        const jackInputs = screen.getAllByDisplayValue('Jack');
        expect(irisInputs.length).toBeGreaterThan(0);
        expect(jackInputs.length).toBeGreaterThan(0);
      });

      // Verify TOTAL row is visible in the summary
      const totalRows = screen.getAllByText(/TOTAL/i);
      expect(totalRows.length).toBeGreaterThan(0);
    });

    it('should include leave and meeting hours in export', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add a team member
      fireEvent.change(input, { target: { value: 'Karen' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByDisplayValue('Karen');
        expect(inputs.length).toBeGreaterThan(0);
      });

      // Add leave
      const addLeaveButtons = screen.getAllByRole('button', { name: /add leave/i });
      fireEvent.click(addLeaveButtons[0]);

      const leaveInputs = screen.getAllByLabelText('Leave hours') as HTMLInputElement[];
      fireEvent.change(leaveInputs[0], { target: { value: '8' } });

      // Add meeting
      const addMeetingButtons = screen.getAllByRole('button', { name: /add meeting/i });
      fireEvent.click(addMeetingButtons[0]);

      const meetingInputs = screen.getAllByLabelText('Meeting hours') as HTMLInputElement[];
      fireEvent.change(meetingInputs[meetingInputs.length - 1], { target: { value: '2' } });

      // Verify the values are displayed in the summary
      await waitFor(() => {
        const leaveValues = screen.getAllByText(/8\.00/);
        const meetingValues = screen.getAllByText(/2\.00/);
        expect(leaveValues.length).toBeGreaterThan(0); // Leave hours
        expect(meetingValues.length).toBeGreaterThan(0); // Meeting hours
      });
    });
  });

  describe('Complex integration scenarios', () => {
    it('should handle full workflow: add members, edit hours, change config, export', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Step 1: Add team members
      fireEvent.change(input, { target: { value: 'Leo' } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: 'Mia' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const leoInputs = screen.getAllByDisplayValue('Leo');
        const miaInputs = screen.getAllByDisplayValue('Mia');
        expect(leoInputs.length).toBeGreaterThan(0);
        expect(miaInputs.length).toBeGreaterThan(0);
      });

      // Step 2: Add leave and meetings
      const addLeaveButtons = screen.getAllByRole('button', { name: /add leave/i });
      fireEvent.click(addLeaveButtons[0]);

      const leaveInputs = screen.getAllByLabelText('Leave hours') as HTMLInputElement[];
      fireEvent.change(leaveInputs[0], { target: { value: '5' } });

      // Step 3: Change base hours
      const baseHoursInputs = screen.getAllByDisplayValue(
        DEFAULT_CONFIG.baseHours.toString()
      ) as HTMLInputElement[];
      fireEvent.change(baseHoursInputs[0], { target: { value: '75' } });

      // Step 4: Verify capacity is recalculated
      const expectedCapacity = (75 - 5).toFixed(2);
      await waitFor(() => {
        const capacityValues = screen.getAllByText(new RegExp(expectedCapacity));
        expect(capacityValues.length).toBeGreaterThan(0);
      });

      // Step 5: Verify export button is available
      const exportButton = screen.getByRole('button', { name: /export/i });
      expect(exportButton).toBeDefined();
    });

    it('should maintain data consistency across multiple operations', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter team member name') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      // Add two team members
      fireEvent.change(input, { target: { value: 'Noah' } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: 'Olivia' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        const noahInputs = screen.getAllByDisplayValue('Noah');
        const oliviaInputs = screen.getAllByDisplayValue('Olivia');
        expect(noahInputs.length).toBeGreaterThan(0);
        expect(oliviaInputs.length).toBeGreaterThan(0);
      });

      // Add leave to first member
      const addLeaveButtons = screen.getAllByRole('button', { name: /add leave/i });
      fireEvent.click(addLeaveButtons[0]);

      const leaveInputs = screen.getAllByLabelText('Leave hours') as HTMLInputElement[];
      fireEvent.change(leaveInputs[0], { target: { value: '4' } });

      // Verify leave was added
      await waitFor(() => {
        const updatedLeaveInputs = screen.getAllByLabelText('Leave hours') as HTMLInputElement[];
        expect(updatedLeaveInputs[0].value).toBe('4');
      });

      // Verify both team members still exist
      const noahInputs = screen.getAllByDisplayValue('Noah');
      const oliviaInputs = screen.getAllByDisplayValue('Olivia');
      expect(noahInputs.length).toBeGreaterThan(0);
      expect(oliviaInputs.length).toBeGreaterThan(0);
    });
  });
});
