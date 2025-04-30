
import React from "react";
import { DiaryEntry } from "@/types/diary";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface DiaryEntriesProps {
  entries: DiaryEntry[];
}

const DiaryEntries: React.FC<DiaryEntriesProps> = ({ entries }) => {
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        <p>No diary entries yet. Start by creating your first entry above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {sortedEntries.map((entry, index) => {
        const isEven = index % 2 === 0;
        
        return (
          <Card 
            key={entry.id} 
            className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-diary-accent/20"
          >
            <CardContent className="p-0">
              <div className={`grid grid-cols-1 md:grid-cols-2 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                <div className={`h-64 md:h-auto ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                  <img 
                    src={entry.imageUrl} 
                    alt={`Diary entry for ${format(entry.date, "PPP")}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className={`p-6 flex flex-col justify-between bg-white ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                  <div>
                    <h3 className="text-xl font-semibold text-diary-primary mb-2">
                      {format(entry.date, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {entry.content}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DiaryEntries;
