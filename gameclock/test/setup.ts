import { vi } from 'vitest';

// Mock out functions not provided by JSDOM

vi.spyOn(window, 'confirm').mockImplementation(() => true);
