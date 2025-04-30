
import { DiaryEntry } from "@/types/diary";

const STORAGE_KEY = "diaryEntries";

export function saveDiaryEntries(entries: DiaryEntry[]): void {
  const serialized = JSON.stringify(
    entries.map(entry => ({
      ...entry,
      date: entry.date.toISOString()
    }))
  );
  localStorage.setItem(STORAGE_KEY, serialized);
}

export function getDiaryEntries(): DiaryEntry[] {
  const entriesJson = localStorage.getItem(STORAGE_KEY);
  if (!entriesJson) return [];
  
  try {
    const parsed = JSON.parse(entriesJson);
    return parsed.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }));
  } catch (e) {
    console.error("Error parsing diary entries from storage:", e);
    return [];
  }
}
