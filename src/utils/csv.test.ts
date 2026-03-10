import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateCSV, downloadCSV } from './csv';
import { TeamCapacitySummary } from '../types/index';

describe('CSV Export Utilities', () => {
  describe('generateCSV', () => {
    it('should generate CSV with correct headers and data', () => {
      const summary: TeamCapacitySummary = {
        members: [
          {
            id: '1',
            name: 'Alice Johnson',
            baseHours: 72.34,
            totalLeaveHours: 12,
            totalMeetingHours: 3.5,
            availableCapacity: 56.84,
          },
          {
            id: '2',
            name: 'Bob Smith',
            baseHours: 72.34,
            totalLeaveHours: 0,
            totalMeetingHours: 3,
            availableCapacity: 69.34,
          },
        ],
        totals: {
          baseHours: 144.68,
          totalLeaveHours: 12,
          totalMeetingHours: 6.5,
          totalAvailableCapacity: 126.18,
        },
      };

      const csv = generateCSV(summary);
      const lines = csv.split('\n');

      expect(lines[0]).toBe(
        'Team Member,Base Hours,Annual Leave Hours,Meeting Hours,Available Capacity'
      );
      expect(lines[1]).toBe('Alice Johnson,72.34,12.00,3.50,56.84');
      expect(lines[2]).toBe('Bob Smith,72.34,0.00,3.00,69.34');
      expect(lines[3]).toBe('TOTAL,144.68,12.00,6.50,126.18');
    });

    it('should format decimal values with 2 decimal places', () => {
      const summary: TeamCapacitySummary = {
        members: [
          {
            id: '1',
            name: 'Charlie',
            baseHours: 72.345,
            totalLeaveHours: 8.567,
            totalMeetingHours: 5.123,
            availableCapacity: 58.655,
          },
        ],
        totals: {
          baseHours: 72.345,
          totalLeaveHours: 8.567,
          totalMeetingHours: 5.123,
          totalAvailableCapacity: 58.655,
        },
      };

      const csv = generateCSV(summary);
      const lines = csv.split('\n');

      expect(lines[1]).toBe('Charlie,72.34,8.57,5.12,58.66');
    });
  });

  describe('downloadCSV', () => {
    let mockLink: any;
    let appendChildSpy: any;
    let removeChildSpy: any;

    beforeEach(() => {
      // Create a mock link element
      mockLink = {
        setAttribute: vi.fn(),
        click: vi.fn(),
        style: {},
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockReturnValue(mockLink as any);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockReturnValue(mockLink as any);

      // Mock URL methods
      vi.stubGlobal('URL', {
        createObjectURL: vi.fn(() => 'blob:mock-url'),
        revokeObjectURL: vi.fn(),
      });

      // Mock Blob
      vi.stubGlobal('Blob', class Blob {
        constructor(public parts: any[], public options: any) {}
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a download link with correct filename format', () => {
      const csv = 'Team Member,Base Hours\nAlice,72.34';
      downloadCSV(csv);

      const setAttributeCalls = mockLink.setAttribute.mock.calls;

      // Check that setAttribute was called with download attribute
      const downloadCall = setAttributeCalls.find((call: any) => call[0] === 'download');
      expect(downloadCall).toBeDefined();

      // Verify filename format: sprint-capacity-YYYY-MM-DD.csv
      const filename = downloadCall[1];
      expect(filename).toMatch(/^sprint-capacity-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('should set href attribute on the link', () => {
      const csv = 'Team Member,Base Hours\nAlice,72.34';
      downloadCSV(csv);

      const setAttributeCalls = mockLink.setAttribute.mock.calls;

      const hrefCall = setAttributeCalls.find((call: any) => call[0] === 'href');
      expect(hrefCall).toBeDefined();
      expect(hrefCall[1]).toBe('blob:mock-url');
    });

    it('should hide the link element', () => {
      const csv = 'Team Member,Base Hours\nAlice,72.34';
      downloadCSV(csv);

      expect(mockLink.style.visibility).toBe('hidden');
    });

    it('should append link to body, click it, and remove it', () => {
      const csv = 'Team Member,Base Hours\nAlice,72.34';
      downloadCSV(csv);

      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    });

    it('should create blob with correct CSV content', () => {
      const csv = 'Team Member,Base Hours\nAlice,72.34';
      const BlobSpy = vi.fn();
      vi.stubGlobal('Blob', BlobSpy);

      downloadCSV(csv);

      // Verify Blob was called with the CSV content
      expect(BlobSpy).toHaveBeenCalledWith([csv], {
        type: 'text/csv;charset=utf-8;',
      });
    });

    it('should revoke object URL after download', () => {
      const csv = 'Team Member,Base Hours\nAlice,72.34';
      const URLMock = (globalThis as any).URL;

      downloadCSV(csv);

      expect(URLMock.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should generate filename with current date', () => {
      const csv = 'Team Member,Base Hours\nAlice,72.34';

      downloadCSV(csv);

      const setAttributeCalls = mockLink.setAttribute.mock.calls;
      const downloadCall = setAttributeCalls.find((call: any) => call[0] === 'download');

      // Verify filename contains a date in YYYY-MM-DD format
      expect(downloadCall[1]).toMatch(/^sprint-capacity-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it('should handle CSV with multiple rows', () => {
      const csv = `Team Member,Base Hours,Annual Leave Hours,Meeting Hours,Available Capacity
Alice Johnson,72.34,12.00,3.50,56.84
Bob Smith,72.34,0.00,3.00,69.34
TOTAL,144.68,12.00,6.50,126.18`;

      const BlobSpy = vi.fn();
      vi.stubGlobal('Blob', BlobSpy);

      downloadCSV(csv);

      expect(BlobSpy).toHaveBeenCalled();
    });
  });
});
