import React, { useState } from 'react';

interface CreditRiskForm {
  creditLimit: number;
  age: number;
  billAmount: number;
  paymentAmount: number;
}

const CreditRiskPredictor: React.FC = () => {
  const [formData, setFormData] = useState<CreditRiskForm>({
    creditLimit: 0,
    age: 0,
    billAmount: 0,
    paymentAmount: 0,
  });
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction('');

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: [
            formData.creditLimit,
            formData.age,
            formData.billAmount,
            formData.paymentAmount,
          ],
        }),
      });

      const data = await response.json();
      setPrediction(data.prediction[0] === 1 ? 'High Risk of Default' : 'Low Risk of Default');
    } catch (error) {
      setPrediction('Error making prediction');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Credit Risk Predictor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="creditLimit" className="block text-sm font-medium mb-1">
            Credit Limit
          </label>
          <input
            type="number"
            id="creditLimit"
            name="creditLimit"
            value={formData.creditLimit}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="billAmount" className="block text-sm font-medium mb-1">
            Bill Amount
          </label>
          <input
            type="number"
            id="billAmount"
            name="billAmount"
            value={formData.billAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="paymentAmount" className="block text-sm font-medium mb-1">
            Payment Amount
          </label>
          <input
            type="number"
            id="paymentAmount"
            name="paymentAmount"
            value={formData.paymentAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Predicting...' : 'Predict Risk'}
        </button>
      </form>

      {prediction && (
        <div className="mt-6 p-4 rounded-md" style={{
          backgroundColor: prediction.includes('High') ? '#f8d7da' : '#d4edda',
          color: prediction.includes('High') ? '#721c24' : '#155724',
        }}>
          <h3 className="font-bold">Prediction Result:</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default CreditRiskPredictor;
