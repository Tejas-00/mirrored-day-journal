
import { useState, useEffect } from "react";
import DiaryForm from "@/components/DiaryForm";
import DiaryEntries from "@/components/DiaryEntries";
import EditDiaryForm from "@/components/EditDiaryForm";
import { DiaryEntry } from "@/types/diary";
import { saveDiaryEntries, getDiaryEntries } from "@/utils/storage";

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEntry = (updatedEntry: DiaryEntry) => {
    const updatedEntries = entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    setEntries(updatedEntries);
    saveDiaryEntries(updatedEntries);
    setEditingEntry(null);
    setIsEditDialogOpen(false);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingEntry(null);
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
          <DiaryEntries entries={entries} onEdit={handleEditEntry} />
        </div>
        
        <EditDiaryForm 
          entry={editingEntry}
          open={isEditDialogOpen}
          onClose={closeEditDialog}
          onSave={handleUpdateEntry}
        />
      </div>
    </div>
  );
};

export default Index;
