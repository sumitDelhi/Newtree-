import React from "react";
import { useNavigate } from "react-router-dom";

interface ObjectiveCardProps {
  dailyObjective: number;
  monthlyObjective: number;
  yearlyObjective: number;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  dailyObjective,
  monthlyObjective,
  yearlyObjective,
}) => {
  // Mocked data for the progress bars
  const dailyProgress = 1090; // Example: Trees planted today
  const monthlyProgress = 219823; // Example: Trees planted this month
  const yearlyProgress = 2841460; // Example: Trees planted this year

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-post'); // Adjust the route to match your application's route for creating posts
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg my-4 md:my-6 w-full max-w-5xl shadow-lg border-2 border-primary">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-green-900">
            {dailyProgress.toLocaleString()}
          </h3>
          <p className="text-green-800">Trees planted today</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${(dailyProgress / dailyObjective) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Today's objective {dailyObjective.toLocaleString()}
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-green-900">
            {monthlyProgress.toLocaleString()}
          </h3>
          <p className="text-green-800">Trees planted this month</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${(monthlyProgress / monthlyObjective) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This month's objective {monthlyObjective.toLocaleString()}
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-green-900">
            {yearlyProgress.toLocaleString()}
          </h3>
          <p className="text-green-800">Trees planted this year</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${(yearlyProgress / yearlyObjective) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This year's objective {yearlyObjective.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-4 md:mt-6">
        <button
          className="bg-green-700 text-white py-2 px-4 rounded-full shadow-lg hover:bg-green-800 transition-colors"
          onClick={handleButtonClick}
        >
          Plant trees
        </button>
      </div>
    </div>
  );
};

export default ObjectiveCard;
