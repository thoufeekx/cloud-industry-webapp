import React from 'react';
import CreditRiskPredictor from '../components/CreditRiskPredictor';

const PredictorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Credit Risk Analysis</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreditRiskPredictor />
        </div>
      </main>
    </div>
  );
};

export default PredictorPage;
