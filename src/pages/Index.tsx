
import { useState, useEffect } from "react";
import DiaryForm from "@/components/DiaryForm";
import DiaryEntries from "@/components/DiaryEntries";
import DiarySearch from "@/components/DiarySearch";
import EditDiaryForm from "@/components/EditDiaryForm";
import { DiaryEntry } from "@/types/diary";
import { 
  saveDiaryEntries, 
  getDiaryEntries, 
  exportDiaryEntries, 
  clearDiaryEntries
} from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Database } from "lucide-react";

const Index = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
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

  const handleExportData = () => {
    exportDiaryEntries();
    toast({
      title: "Data exported",
      description: "Your diary entries have been exported as a JSON file.",
    });
  };

  const handleClearData = () => {
    clearDiaryEntries();
    setEntries([]);
    setFilteredEntries([]);
    toast({
      title: "Data cleared",
      description: "All diary entries have been deleted from local storage.",
    });
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-diary-primary">
              {isSearchActive ? "Search Results" : "My Memories"}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowDataManagement(!showDataManagement)}
            >
              <Database className="h-4 w-4" />
              {showDataManagement ? "Hide Data Options" : "Data Options"}
            </Button>
          </div>
          
          {showDataManagement && (
            <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-diary-primary mb-4">Manage Your Data</h3>
              <p className="text-gray-600 mb-4">
                Your diary entries are stored securely in your browser's local storage. 
                From here you can export or clear all your data.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleExportData}
                  disabled={entries.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled={entries.length === 0}
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete all your diary entries from local storage.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearData} className="bg-red-500 hover:bg-red-600">
                        Yes, delete everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h4 className="font-medium text-diary-primary mb-2">About Local Storage</h4>
                <p className="text-sm text-gray-600">
                  Your diary entries are stored in your browser's local storage. This means:
                </p>
                <ul className="list-disc text-sm text-gray-600 pl-5 mt-2 space-y-1">
                  <li>Data persists even when you close the browser</li>
                  <li>Data is only stored on this device and browser</li>
                  <li>Clearing browser data will erase your diary entries</li>
                  <li>Storage capacity is limited (typically 5-10MB)</li>
                </ul>
              </div>
            </div>
          )}
          
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
