
import { useState, useEffect } from "react";
import DiaryForm from "@/components/DiaryForm";
import DiaryEntries from "@/components/DiaryEntries";
import { DiaryEntry } from "@/types/diary";
import { saveDiaryEntries, getDiaryEntries } from "@/utils/storage";

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    // Load entries from local storage
    const savedEntries = getDiaryEntries();
    setEntries(savedEntries);
  }, []);

  const handleSaveEntry = (newEntry: DiaryEntry) => {
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveDiaryEntries(updatedEntries);
  };

  return (
    <div className="min-h-screen bg-diary-background">
      <div className="container py-10 space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-diary-primary mb-2">My Daily Diary</h1>
          <p className="text-gray-600">Capture your memories, one day at a time</p>
        </header>
        
        <DiaryForm onSave={handleSaveEntry} />
        
        <div className="pt-10">
          <h2 className="text-2xl font-semibold text-diary-primary mb-6">My Memories</h2>
          <DiaryEntries entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default Index;
