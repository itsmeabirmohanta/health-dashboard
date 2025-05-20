import { ScheduleActivity } from "@/components/ui/ScheduleCard";
import { addDays, addHours, setHours, setMinutes } from "date-fns";

// Helper to create a time at specific hours and minutes on a given date
const createTimeOn = (date: Date, hours: number, minutes: number): Date => {
  const newDate = new Date(date);
  return setMinutes(setHours(newDate, hours), minutes);
};

// Function to generate schedule activities spanning multiple days
export const generateScheduleActivities = (): ScheduleActivity[] => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);
  const yesterday = addDays(today, -1);
  
  return [
    // Today's activities
    {
      id: "1",
      title: "Morning Workout",
      time: "07:30 AM",
      details: "Strength training • 45 min",
      status: "completed",
      type: "workout",
      date: createTimeOn(today, 7, 30)
    },
    {
      id: "2",
      title: "Team Meeting",
      time: "10:00 AM",
      details: "Project updates",
      status: "completed",
      type: "other",
      date: createTimeOn(today, 10, 0)
    },
    {
      id: "3",
      title: "Lunch Break Run",
      time: "12:30 PM",
      details: "3.3 miles • Outdoor",
      status: "in-progress",
      type: "run",
      date: createTimeOn(today, 12, 30)
    },
    {
      id: "4",
      title: "Physical Therapy",
      time: "16:00 PM",
      details: "Knee rehabilitation",
      status: "upcoming",
      type: "other",
      date: createTimeOn(today, 16, 0)
    },
    {
      id: "5",
      title: "Evening Yoga",
      time: "19:30 PM",
      details: "Relaxation • 30 min",
      status: "upcoming",
      type: "workout",
      date: createTimeOn(today, 19, 30)
    },
    {
      id: "6",
      title: "Sleep Analysis",
      time: "23:00 PM",
      details: "8+ hours • Target",
      status: "upcoming",
      type: "sleep",
      date: createTimeOn(today, 23, 0)
    },
    
    // Tomorrow's activities
    {
      id: "7",
      title: "Running Session",
      time: "06:30 AM",
      details: "5K • Interval training",
      status: "upcoming",
      type: "run",
      date: createTimeOn(tomorrow, 6, 30)
    },
    {
      id: "8",
      title: "HIIT Workout",
      time: "17:00 PM",
      details: "High intensity • 20 min",
      status: "upcoming",
      type: "workout",
      date: createTimeOn(tomorrow, 17, 0)
    },
    
    // Day after tomorrow
    {
      id: "9",
      title: "Recovery Day",
      time: "10:00 AM",
      details: "Light activity only",
      status: "upcoming",
      type: "other",
      date: createTimeOn(dayAfter, 10, 0)
    },
    {
      id: "10",
      title: "Sleep Analysis",
      time: "22:30 PM",
      details: "9 hours • Target",
      status: "upcoming",
      type: "sleep",
      date: createTimeOn(dayAfter, 22, 30)
    },
    
    // Yesterday's activities
    {
      id: "11",
      title: "Morning Swim",
      time: "08:00 AM",
      details: "30 minutes • 20 laps",
      status: "completed",
      type: "workout",
      date: createTimeOn(yesterday, 8, 0)
    },
    {
      id: "12",
      title: "Evening Walk",
      time: "18:30 PM",
      details: "2 miles • Easy pace",
      status: "completed",
      type: "run",
      date: createTimeOn(yesterday, 18, 30)
    },
  ];
};

// Export a pre-generated set of activities
export const scheduleActivities = generateScheduleActivities(); 