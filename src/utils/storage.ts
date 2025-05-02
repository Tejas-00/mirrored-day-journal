
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

// New function to export diary entries as a JSON file
export function exportDiaryEntries(): void {
  const entries = getDiaryEntries();
  if (entries.length === 0) return;
  
  const serialized = JSON.stringify(
    entries.map(entry => ({
      ...entry,
      date: entry.date.toISOString()
    })),
    null,
    2
  );
  
  // Create and trigger download
  const blob = new Blob([serialized], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diary-entries-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// New function to clear all diary entries
export function clearDiaryEntries(): void {
  localStorage.removeItem(STORAGE_KEY);
}
