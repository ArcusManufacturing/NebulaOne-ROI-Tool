import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function NebulaOneROICalculator() {
  const [inputs, setInputs] = useState({
    sanitationCost: '',
    outbreaksPerYear: '',
    outbreakCost: '',
    sickDays: '',
    workersComp: '',
    customCost: '',
    savingsRate: 0.3,
    leaseCost: 750,
    purchasePrice: 30000,
    email: ''
  });

  const [mode, setMode] = useState('lease');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === 'purchasePrice' ? Math.max(12000, value) : value
    }));
  };

  const reset = () => {
    setInputs({
      sanitationCost: '',
      outbreaksPerYear: '',
      outbreakCost: '',
      sickDays: '',
      workersComp: '',
      customCost: '',
      savingsRate: 0.3,
      leaseCost: 750,
      purchasePrice: 30000,
      email: ''
    });
    setMode('lease');
  };

  const baseline = (
    (+inputs.sanitationCost || 0) +
    (+inputs.outbreaksPerYear * +inputs.outbreakCost || 0) +
    (+inputs.s
