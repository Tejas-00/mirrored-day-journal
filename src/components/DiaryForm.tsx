
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { DiaryEntry } from "@/types/diary";

interface DiaryFormProps {
  onSave: (entry: DiaryEntry) => void;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ onSave }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please write something about your day");
      return;
    }
    
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const entry: DiaryEntry = {
      id: uuidv4(),
      date,
      content,
      imageUrl: imagePreview as string
    };

    onSave(entry);
    
    // Reset form
    setContent("");
    setImage(null);
    setImagePreview(null);
    
    toast.success("Diary entry saved successfully");
  };

  return (
    <Card className="w-full border-diary-accent/20 shadow-md">
      <CardHeader className="bg-diary-secondary/20">
        <CardTitle className="text-diary-primary text-center">Add Today's Memory</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <div className="flex items-center justify-center">
                <label 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-diary-accent border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-diary-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-diary-primary">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">How was your day?</label>
            <Textarea
              placeholder="Write about your day..."
              className="min-h-[150px] border-diary-accent/30"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-diary-primary hover:bg-diary-accent text-white"
          >
            Save Memory
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiaryForm;
