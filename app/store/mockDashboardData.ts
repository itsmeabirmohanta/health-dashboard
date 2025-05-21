import { Goal, NutritionSummary, LoggedMeal, MealItem, Medication, HydrationSummary, HydrationLog } from "@/types";
import { addHours, formatISO, subDays, addDays, setHours, setMinutes, startOfWeek, endOfWeek } from 'date-fns';

const today = new Date();

// --- Goals Data ---
export const mockGoals: Goal[] = [
  {
    id: 'goal1',
    type: 'steps',
    title: 'Daily Steps Challenge',
    targetValue: 10000,
    currentValue: 7500,
    unit: 'steps',
    startDate: formatISO(subDays(today, 7)),
    status: 'onTrack',
  },
  {
    id: 'goal2',
    type: 'activeMinutes',
    title: 'Weekly Active Minutes',
    targetValue: 150,
    currentValue: 90,
    unit: 'minutes',
    startDate: formatISO(startOfWeek(today, { weekStartsOn: 1 })),
    endDate: formatISO(endOfWeek(today, { weekStartsOn: 1 })),
    status: 'atRisk',
  },
  {
    id: 'goal3',
    type: 'hydration',
    title: 'Daily Hydration',
    targetValue: 2000,
    currentValue: 1200,
    unit: 'ml',
    startDate: formatISO(today),
    status: 'onTrack',
  },
  {
    id: 'goal4',
    type: 'sleepHours',
    title: 'Consistent Sleep',
    targetValue: 7.5,
    currentValue: 8,
    unit: 'hours',
    startDate: formatISO(subDays(today, 30)),
    status: 'achieved',
  },
];

// --- Nutrition Data ---
const breakfastItems: MealItem[] = [
  { id: 'item1', name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fats: 3, servingSize: '1 cup' },
  { id: 'item2', name: 'Blueberries', calories: 40, carbs: 10, servingSize: '1/2 cup' },
];
const lunchItems: MealItem[] = [
  { id: 'item3', name: 'Chicken Salad Sandwich', calories: 450, protein: 25, carbs: 40, fats: 20, servingSize: '1 sandwich' },
];
const dinnerItems: MealItem[] = [
  { id: 'item4', name: 'Salmon Fillet', calories: 300, protein: 30, fats: 18, servingSize: '150g' },
  { id: 'item5', name: 'Roasted Vegetables', calories: 120, carbs: 20, servingSize: '1 cup' },
];
const snackItems: MealItem[] = [ { id: 'item6', name: 'Apple', calories: 95, carbs: 25, servingSize: '1 medium' }];

export const mockNutritionSummary: NutritionSummary = {
  date: formatISO(today, { representation: 'date' }),
  totalCalories: breakfastItems.reduce((sum, i) => sum + i.calories, 0) +
                 lunchItems.reduce((sum, i) => sum + i.calories, 0) +
                 dinnerItems.reduce((sum, i) => sum + i.calories, 0) +
                 snackItems.reduce((sum, i) => sum + i.calories, 0),
  targetCalories: 2000,
  protein: breakfastItems.reduce((sum, i) => sum + (i.protein || 0), 0) +
           lunchItems.reduce((sum, i) => sum + (i.protein || 0), 0) +
           dinnerItems.reduce((sum, i) => sum + (i.protein || 0), 0) +
           snackItems.reduce((sum, i) => sum + (i.protein || 0), 0),
  carbs: breakfastItems.reduce((sum, i) => sum + (i.carbs || 0), 0) +
         lunchItems.reduce((sum, i) => sum + (i.carbs || 0), 0) +
         dinnerItems.reduce((sum, i) => sum + (i.carbs || 0), 0) +
         snackItems.reduce((sum, i) => sum + (i.carbs || 0), 0),
  fats: breakfastItems.reduce((sum, i) => sum + (i.fats || 0), 0) +
        lunchItems.reduce((sum, i) => sum + (i.fats || 0), 0) +
        dinnerItems.reduce((sum, i) => sum + (i.fats || 0), 0) +
        snackItems.reduce((sum, i) => sum + (i.fats || 0), 0),
  meals: [
    { id: 'meal1', type: 'breakfast', timestamp: formatISO(setHours(today, 8)), items: breakfastItems, totalCalories: breakfastItems.reduce((sum, i) => sum + i.calories, 0) },
    { id: 'meal2', type: 'lunch', timestamp: formatISO(setHours(today, 13)), items: lunchItems, totalCalories: lunchItems.reduce((sum, i) => sum + i.calories, 0) },
    { id: 'meal3', type: 'dinner', timestamp: formatISO(setHours(today, 19)), items: dinnerItems, totalCalories: dinnerItems.reduce((sum, i) => sum + i.calories, 0) },
    { id: 'meal4', type: 'snack', timestamp: formatISO(setHours(today, 16)), items: snackItems, totalCalories: snackItems.reduce((sum, i) => sum + i.calories, 0) },
  ],
};

// --- Medication Data ---
export const mockMedications: Medication[] = [
  {
    id: 'med1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily in the morning',
    instructions: 'Take with a full glass of water.',
    nextReminder: formatISO(setHours(setMinutes(addDays(today, 0),0), 8)), // Today 8:00 AM
    takenToday: true,
  },
  {
    id: 'med2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily with meals',
    instructions: 'Take with breakfast and dinner.',
    nextReminder: formatISO(setHours(setMinutes(addDays(today, 0),0), 19)), // Today 7:00 PM
    takenToday: false,
  },
  {
    id: 'med3',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    nextReminder: formatISO(setHours(setMinutes(addDays(today, 1), 0), 9)), // Tomorrow 9:00 AM
    takenToday: false,
  },
];

// --- Hydration Data ---
const hydrationLogsToday: HydrationLog[] = [
  { id: 'log1', timestamp: formatISO(setMinutes(setHours(today, 7), 30)), amount: 250, unit: 'ml' },
  { id: 'log2', timestamp: formatISO(setMinutes(setHours(today, 10), 0)), amount: 300, unit: 'ml' },
  { id: 'log3', timestamp: formatISO(setMinutes(setHours(today, 12), 15)), amount: 200, unit: 'ml' },
  { id: 'log4', timestamp: formatISO(setMinutes(setHours(today, 15), 45)), amount: 250, unit: 'ml' },
  { id: 'log5', timestamp: formatISO(setMinutes(setHours(today, 18), 0)), amount: 200, unit: 'ml' },
];

export const mockHydrationSummary: HydrationSummary = {
  date: formatISO(today, { representation: 'date' }),
  totalIntake: hydrationLogsToday.reduce((sum, log) => sum + log.amount, 0),
  targetIntake: 2500, // ml
  logs: hydrationLogsToday,
};

// Note: date-fns functions like startOfWeek, endOfWeek, setHours, setMinutes, etc.,
// are imported at the top of this file for use in generating mock data timestamps. 