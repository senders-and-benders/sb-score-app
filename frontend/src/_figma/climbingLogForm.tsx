import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { ClimbEntry } from './ClimbingLog';

interface ClimbEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: ClimbEntry | Omit<ClimbEntry, 'id'>) => void;
  initialData?: ClimbEntry | null;
}

export function ClimbEntryForm({ isOpen, onClose, onSave, initialData }: ClimbEntryFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    grade: '',
    attempts: 1,
    gym: '',
    area: '',
    wall: '',
    type: 'bouldering' as 'bouldering' | 'ropes'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        grade: initialData.grade,
        attempts: initialData.attempts,
        gym: initialData.gym,
        area: initialData.area,
        wall: initialData.wall,
        type: initialData.type
      });
    } else {
      // Reset form for new entry
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        date: today,
        grade: '',
        attempts: 1,
        gym: '',
        area: '',
        wall: '',
        type: 'bouldering'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (formData.attempts < 1) newErrors.attempts = 'Attempts must be at least 1';
    if (!formData.gym.trim()) newErrors.gym = 'Gym is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.wall.trim()) newErrors.wall = 'Wall is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (initialData) {
        onSave({ ...initialData, ...formData });
      } else {
        onSave(formData);
      }
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const boulderingGrades = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
  const ropeGrades = ['5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d', '5.15a', '5.15b', '5.15c'];

  const availableGrades = formData.type === 'bouldering' ? boulderingGrades : ropeGrades;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Climb Entry' : 'Add New Climb'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
                className={errors.date ? 'border-destructive' : ''}
              />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="attempts">Attempts</Label>
              <Input
                id="attempts"
                type="number"
                min="1"
                value={formData.attempts}
                onChange={(e) => updateFormData('attempts', parseInt(e.target.value) || 1)}
                className={errors.attempts ? 'border-destructive' : ''}
              />
              {errors.attempts && <p className="text-sm text-destructive mt-1">{errors.attempts}</p>}
            </div>
          </div>

          <div>
            <Label>Climb Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => updateFormData('type', value)}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bouldering" id="bouldering" />
                <Label htmlFor="bouldering">Bouldering</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ropes" id="ropes" />
                <Label htmlFor="ropes">Ropes</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="grade">Grade</Label>
            <Select value={formData.grade} onValueChange={(value) => updateFormData('grade', value)}>
              <SelectTrigger className={errors.grade ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {availableGrades.map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.grade && <p className="text-sm text-destructive mt-1">{errors.grade}</p>}
          </div>

          <div>
            <Label htmlFor="gym">Gym</Label>
            <Input
              id="gym"
              value={formData.gym}
              onChange={(e) => updateFormData('gym', e.target.value)}
              placeholder="e.g., Central Rock Gym"
              className={errors.gym ? 'border-destructive' : ''}
            />
            {errors.gym && <p className="text-sm text-destructive mt-1">{errors.gym}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => updateFormData('area', e.target.value)}
                placeholder="e.g., Main Cave"
                className={errors.area ? 'border-destructive' : ''}
              />
              {errors.area && <p className="text-sm text-destructive mt-1">{errors.area}</p>}
            </div>

            <div>
              <Label htmlFor="wall">Wall</Label>
              <Input
                id="wall"
                value={formData.wall}
                onChange={(e) => updateFormData('wall', e.target.value)}
                placeholder="e.g., Overhang Wall"
                className={errors.wall ? 'border-destructive' : ''}
              />
              {errors.wall && <p className="text-sm text-destructive mt-1">{errors.wall}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Climb
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}