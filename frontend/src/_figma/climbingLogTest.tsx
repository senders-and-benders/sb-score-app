import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { CalendarDays, MapPin, Mountain, Link, Edit, Trash2, Plus } from 'lucide-react';
import { ClimbEntryForm } from './climbingLogForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

export interface ClimbEntry {
  id: string;
  date: string;
  grade: string;
  attempts: number;
  gym: string;
  area: string;
  wall: string;
  type: 'bouldering' | 'ropes';
}

export function ClimbingLog() {
  const [entries, setEntries] = useState<ClimbEntry[]>([
    {
      id: '1',
      date: '2025-08-15',
      grade: 'V4',
      attempts: 3,
      gym: 'Central Rock Gym',
      area: 'Main Cave',
      wall: 'Overhang Wall',
      type: 'bouldering'
    },
    {
      id: '2',
      date: '2025-08-12',
      grade: '5.10a',
      attempts: 2,
      gym: 'Vertical World',
      area: 'Lead Cave',
      wall: 'North Face',
      type: 'ropes'
    },
    {
      id: '3',
      date: '2025-08-10',
      grade: 'V6',
      attempts: 8,
      gym: 'Brooklyn Boulders',
      area: 'Comp Wall',
      wall: 'Dynamic Section',
      type: 'bouldering'
    },
    {
      id: '4',
      date: '2025-08-08',
      grade: '5.11b',
      attempts: 4,
      gym: 'Movement Climbing',
      area: 'Sport Wall',
      wall: 'Crimpy Corner',
      type: 'ropes'
    },
    {
      id: '5',
      date: '2025-08-05',
      grade: 'V3',
      attempts: 2,
      gym: 'Central Rock Gym',
      area: 'Beginner Area',
      wall: 'Slab Wall',
      type: 'bouldering'
    },
    {
      id: '6',
      date: '2025-08-03',
      grade: '5.9',
      attempts: 1,
      gym: 'Local Crag',
      area: 'Outdoor',
      wall: 'Main Wall',
      type: 'ropes'
    },
    {
      id: '7',
      date: '2025-08-01',
      grade: 'V5',
      attempts: 6,
      gym: 'Brooklyn Boulders',
      area: 'Advanced Section',
      wall: 'Roof Problem',
      type: 'bouldering'
    },
    {
      id: '8',
      date: '2025-07-30',
      grade: '5.10c',
      attempts: 3,
      gym: 'Vertical World',
      area: 'Lead Cave',
      wall: 'Technical Wall',
      type: 'ropes'
    },
    {
      id: '9',
      date: '2025-07-28',
      grade: 'V4',
      attempts: 5,
      gym: 'Movement Climbing',
      area: 'Boulder Cave',
      wall: 'Power Wall',
      type: 'bouldering'
    },
    {
      id: '10',
      date: '2025-07-25',
      grade: '5.11a',
      attempts: 7,
      gym: 'Central Rock Gym',
      area: 'Advanced Area',
      wall: 'Endurance Wall',
      type: 'ropes'
    },
    {
      id: '11',
      date: '2025-07-22',
      grade: 'V2',
      attempts: 1,
      gym: 'Brooklyn Boulders',
      area: 'Warm-up Area',
      wall: 'Easy Wall',
      type: 'bouldering'
    },
    {
      id: '12',
      date: '2025-07-20',
      grade: '5.8',
      attempts: 1,
      gym: 'Vertical World',
      area: 'Beginner Wall',
      wall: 'Practice Area',
      type: 'ropes'
    },
    {
      id: '13',
      date: '2025-07-18',
      grade: 'V7',
      attempts: 12,
      gym: 'Movement Climbing',
      area: 'Competition Wall',
      wall: 'Project Area',
      type: 'bouldering'
    },
    {
      id: '14',
      date: '2025-07-15',
      grade: '5.12a',
      attempts: 8,
      gym: 'Local Crag',
      area: 'Outdoor',
      wall: 'Steep Wall',
      type: 'ropes'
    },
    {
      id: '15',
      date: '2025-07-12',
      grade: 'V1',
      attempts: 1,
      gym: 'Central Rock Gym',
      area: 'Kids Area',
      wall: 'Fun Wall',
      type: 'bouldering'
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ClimbEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(entries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = entries.slice(startIndex, endIndex);

  // Pagination info
  const showingStart = entries.length > 0 ? startIndex + 1 : 0;
  const showingEnd = Math.min(endIndex, entries.length);

  const handleAddEntry = (entry: Omit<ClimbEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setEntries([newEntry, ...entries]);
    setIsFormOpen(false);
    // Reset to first page to show the new entry
    setCurrentPage(1);
  };

  const handleEditEntry = (entry: ClimbEntry) => {
    setEntries(entries.map(e => e.id === entry.id ? entry : e));
    setEditingEntry(null);
    setIsFormOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    const newEntries = entries.filter(e => e.id !== id);
    setEntries(newEntries);
    
    // Adjust current page if necessary
    const newTotalPages = Math.ceil(newEntries.length / entriesPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const openEditForm = (entry: ClimbEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGradeColor = (grade: string, type: 'bouldering' | 'ropes') => {
    if (type === 'bouldering') {
      // V-scale coloring
      if (grade.includes('V0') || grade.includes('V1') || grade.includes('V2')) return 'bg-green-100 text-green-800';
      if (grade.includes('V3') || grade.includes('V4') || grade.includes('V5')) return 'bg-yellow-100 text-yellow-800';
      if (grade.includes('V6') || grade.includes('V7') || grade.includes('V8')) return 'bg-orange-100 text-orange-800';
      return 'bg-red-100 text-red-800';
    } else {
      // YDS coloring
      if (grade.includes('5.6') || grade.includes('5.7') || grade.includes('5.8')) return 'bg-green-100 text-green-800';
      if (grade.includes('5.9') || grade.includes('5.10')) return 'bg-yellow-100 text-yellow-800';
      if (grade.includes('5.11') || grade.includes('5.12')) return 'bg-orange-100 text-orange-800';
      return 'bg-red-100 text-red-800';
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Climbing Log</h1>
          <p className="text-muted-foreground">Track your climbing progress and achievements</p>
        </div>
        <Button onClick={openAddForm} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Climb
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="p-12 text-center">
          <Mountain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">No climbs logged yet</h3>
          <p className="text-muted-foreground mb-4">Start tracking your climbing progress by adding your first climb.</p>
          <Button onClick={openAddForm}>Add Your First Climb</Button>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {showingStart}–{showingEnd} of {entries.length} climbs
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            {currentEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {entry.type === 'bouldering' ? (
                          <Mountain className="w-5 h-5 text-primary" />
                        ) : (
                          <Link className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getGradeColor(entry.grade, entry.type)}>
                            {entry.grade}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {entry.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {formatDate(entry.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {entry.gym}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditForm(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Climb Entry</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this climb entry? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Attempts</p>
                      <p>{entry.attempts}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Area</p>
                      <p>{entry.area}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Wall</p>
                      <p>{entry.wall}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="capitalize">{entry.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {generatePageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page as number);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <ClimbEntryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEntry(null);
        }}
        onSave={editingEntry ? handleEditEntry : handleAddEntry}
        initialData={editingEntry}
      />
    </div>
  );
}