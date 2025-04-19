import { MealPlanList } from './MealPlanList';

export const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Meal Plans</h1>
      <MealPlanList />
    </div>
  );
}; 