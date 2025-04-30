
import { useState, useEffect } from "react";
import DiaryForm from "@/components/DiaryForm";
import DiaryEntries from "@/components/DiaryEntries";
import DiarySearch from "@/components/DiarySearch";
import EditDiaryForm from "@/components/EditDiaryForm";
import { DiaryEntry } from "@/types/diary";
import { saveDiaryEntries, getDiaryEntries } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load entries from local storage
    const savedEntries = getDiaryEntries();
    setEntries(savedEntries);
    setFilteredEntries(savedEntries);
  }, []);

  const handleSaveEntry = (newEntry: DiaryEntry) => {
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    setFilteredEntries(isSearchActive ? filteredEntries : updatedEntries);
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
    
    // If search is active, update filtered entries too
    if (isSearchActive) {
      setFilteredEntries(filteredEntries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
    } else {
      setFilteredEntries(updatedEntries);
    }
    
    saveDiaryEntries(updatedEntries);
    setEditingEntry(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    
    // Update filtered entries too
    if (isSearchActive) {
      setFilteredEntries(filteredEntries.filter(entry => entry.id !== id));
    } else {
      setFilteredEntries(updatedEntries);
    }
    
    saveDiaryEntries(updatedEntries);
    toast({
      title: "Memory deleted",
      description: "Your diary entry has been deleted successfully.",
    });
  };

  const handleSearch = (query: string, date: Date | undefined) => {
    let results = [...entries];
    
    // Filter by text content if query exists
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(entry => 
        entry.content.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by date if selected
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      
      results = results.filter(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === searchDate.getTime();
      });
    }
    
    setFilteredEntries(results);
    setIsSearchActive(true);
    
    // Show a message if no results found
    if (results.length === 0) {
      toast({
        title: "No memories found",
        description: "Try a different search term or date.",
      });
    } else {
      toast({
        title: `Found ${results.length} ${results.length === 1 ? 'memory' : 'memories'}`,
        description: "Search completed successfully.",
      });
    }
  };
  
  const handleClearSearch = () => {
    setFilteredEntries(entries);
    setIsSearchActive(false);
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
        
        <div className="pt-5">
          <DiarySearch onSearch={handleSearch} onClear={handleClearSearch} />
        </div>
        
        <div className="pt-5">
          <h2 className="text-2xl font-semibold text-diary-primary mb-6">
            {isSearchActive ? "Search Results" : "My Memories"}
          </h2>
          <DiaryEntries 
            entries={filteredEntries} 
            onEdit={handleEditEntry} 
            onDelete={handleDeleteEntry}
          />
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
