import type { Slot } from "../types";
import { SLOT_WINDOWS, TIME_SLOTS } from '../services/timeSlotService';

export const slots: Slot[] = [...TIME_SLOTS];
export const slotWindows = SLOT_WINDOWS;

export const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
