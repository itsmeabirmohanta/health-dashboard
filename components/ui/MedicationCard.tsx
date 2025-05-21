"use client";

import React, { useState } from 'react';
import { Medication } from '@/types';
import { Pill, CheckCircle, AlertCircle, Bell, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isFuture, parseISO } from 'date-fns';

interface MedicationCardProps {
  medications: Medication[];
  className?: string;
  onMarkAsTaken?: (id: string, taken: boolean) => void; // Mock handler
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medications, className, onMarkAsTaken }) => {
  const [medList, setMedList] = useState(medications);

  const handleToggleTaken = (id: string) => {
    setMedList(prevMeds => 
      prevMeds.map(med => 
        med.id === id ? { ...med, takenToday: !med.takenToday } : med
      )
    );
    if (onMarkAsTaken) {
        const updatedMed = medList.find(m => m.id === id);
        if (updatedMed) {
            onMarkAsTaken(id, !updatedMed.takenToday); // Call mock handler with new state
        }
    }
  };

  const upcomingMedications = medList
    .filter(med => med.nextReminder && (isToday(parseISO(med.nextReminder)) || isFuture(parseISO(med.nextReminder))))
    .sort((a, b) => parseISO(a.nextReminder!).getTime() - parseISO(b.nextReminder!).getTime());

  if (!upcomingMedications || upcomingMedications.length === 0) {
    return (
      <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Pill className="w-5 h-5 mr-2 text-teal-500" />
          Medication Reminders
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming medication reminders.</p>
      </div>
    );
  }

  return (
    <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Pill className="w-5 h-5 mr-2 text-teal-500" />
        Medication Reminders
      </h2>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {upcomingMedications.map(med => {
          const reminderDate = parseISO(med.nextReminder!);
          const isDueToday = isToday(reminderDate);
          
          return (
            <div key={med.id} className={cn(
              "p-3 rounded-lg flex items-start gap-3", 
              med.takenToday && isDueToday ? "bg-green-50/70 dark:bg-green-800/30 opacity-70" : "bg-white/40 dark:bg-gray-700/50"
            )}>
              <div className={cn(
                "p-1.5 rounded-full mt-0.5",
                med.takenToday && isDueToday ? "bg-green-500/20" : "bg-teal-500/20"
              )}>
                {med.takenToday && isDueToday ? 
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> : 
                  <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                }
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                    <span className={cn(
                        "font-medium text-sm",
                        med.takenToday && isDueToday ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-800 dark:text-white"
                    )}>{med.name}</span>
                    {isDueToday && (
                        <button 
                            onClick={() => handleToggleTaken(med.id)}
                            title={med.takenToday ? "Mark as Not Taken" : "Mark as Taken"}
                            className={cn(
                                "p-1 rounded-md transition-colors",
                                med.takenToday ? "hover:bg-yellow-100 dark:hover:bg-yellow-700" : "hover:bg-green-100 dark:hover:bg-green-700"
                            )}
                        >
                            {med.takenToday ? 
                                <AlertCircle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" /> : 
                                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                            }
                        </button>
                    )}
                </div>
                <p className={cn(
                    "text-xs",
                    med.takenToday && isDueToday ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
                )}>
                  {med.dosage} - {med.frequency}
                </p>
                <p className={cn(
                    "text-xs mt-0.5 flex items-center gap-1",
                    med.takenToday && isDueToday ? "text-gray-400 dark:text-gray-500" :
                    isDueToday ? "text-teal-600 dark:text-teal-400 font-medium" : "text-gray-500 dark:text-gray-400"
                )}>
                    <CalendarClock className="w-3 h-3" />
                    {isDueToday ? `Today at ${format(reminderDate, 'h:mm a')}` : format(reminderDate, 'MMM d, h:mm a')}
                </p>
                {med.instructions && !med.takenToday && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{med.instructions}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 