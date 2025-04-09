import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, CircularProgress, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PredictionFormState {
  creditLimit: string;
  age: string;
  billAmount: string;
  paymentAmount: string;
}

const RiskChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 'bold',
}));

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const PredictionForm: React.FC = () => {
  const [formState, setFormState] = useState<PredictionFormState>({
    creditLimit: '',
    age: '',
    billAmount: '',
    paymentAmount: '',
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [riskFactors, setRiskFactors] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setProbability(null);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: [
            Number(formState.creditLimit),
            Number(formState.age),
            Number(formState.billAmount),
            Number(formState.paymentAmount),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data.prediction) || !Array.isArray(data.probability)) {
        throw new Error('Invalid response format from server');
      }

      setPrediction(data.prediction[0]);
      setProbability(data.probability[0]);
      setRiskFactors(data.risk_factors);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Error making prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (prediction: number, probability: number) => {
    // For No Default cases (prediction === 0)
    if (prediction === 0) {
      if (probability < 0.1) return { level: 'Low', color: '#4CAF50' };
      if (probability < 0.3) return { level: 'Moderate', color: '#8BC34A' };
      if (probability < 0.5) return { level: 'High', color: '#FFC107' };
      return { level: 'Very High', color: '#F44336' };
    }
    
    // For Default cases (prediction === 1)
    if (probability > 0.8) return { level: 'Very High', color: '#C62828' };
    if (probability > 0.6) return { level: 'High', color: '#D32F2F' };
    if (probability > 0.4) return { level: 'Moderate', color: '#F44336' };
    return { level: 'Low', color: '#E57373' };
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Credit Risk Predictor
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Credit Limit ($)"
              name="creditLimit"
              value={formState.creditLimit}
              onChange={handleChange}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              helperText="Enter your credit limit amount"
            />

            <TextField
              required
              fullWidth
              label="Age (years)"
              name="age"
              value={formState.age}
              onChange={handleChange}
              type="number"
              InputProps={{ inputProps: { min: 18, max: 100 } }}
              helperText="Enter your age in years"
            />

            <TextField
              required
              fullWidth
              label="Bill Amount ($)"
              name="billAmount"
              value={formState.billAmount}
              onChange={handleChange}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              helperText="Enter your current bill amount"
            />

            <TextField
              required
              fullWidth
              label="Payment Amount ($)"
              name="paymentAmount"
              value={formState.paymentAmount}
              onChange={handleChange}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              helperText="Enter your last payment amount"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Predict Risk'}
            </Button>
          </Box>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {prediction !== null && probability !== null && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Typography 
                variant="h6" 
                align="center" 
                sx={{ 
                  color: getRiskLevel(prediction, probability).color,
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                {getRiskLevel(prediction, prediction === 0 ? probability : 1 - probability).level} Risk
              </Typography>

              <Box sx={{ display: 'grid', gap: 2, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                  <RiskChip
                    label={`Prediction: ${prediction === 1 ? 'Default' : 'No Default'}`}
                    color={prediction === 1 ? 'error' : 'success'}
                  />
                  <RiskChip
                    label={`Probability: ${(probability * 100).toFixed(1)}%`}
                    color={prediction === 1 ? 'error' : 'success'}
                  />
                  <RiskChip
                    label={`Confidence: ${(1 - probability).toFixed(1)}%`}
                    color={prediction === 1 ? 'error' : 'success'}
                  />
                </Box>

                {riskFactors && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    <Typography variant="subtitle1" align="center">
                      Risk Factors
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'grid', gap: 2, justifyContent: 'center' }}>
                      <RiskChip
                        label={`Payment Ratio: ${(riskFactors.payment_ratio * 100).toFixed(1)}%`}
                        color={riskFactors.payment_ratio >= 0 ? 'success' : 'error'}
                      />
                      <RiskChip
                        label={`Credit Utilization: ${(riskFactors.credit_utilization * 100).toFixed(1)}%`}
                        color={riskFactors.credit_utilization <= 0 ? 'success' : 'error'}
                      />
                      <RiskChip
                        label={`Credit Limit: ${riskFactors.credit_limit}`}
                        color={riskFactors.credit_limit >= 0 ? 'success' : 'error'}
                      />
                      <RiskChip
                        label={`Age: ${riskFactors.age}`}
                        color={riskFactors.age >= 0 ? 'success' : 'error'}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PredictionForm;
