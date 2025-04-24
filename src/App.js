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
    (+inputs.sickDays * +inputs.workersComp || 0) +
    (+inputs.customCost || 0)
  );

  const savings = baseline * +inputs.savingsRate;
  const leaseAnnual = inputs.leaseCost * 12;
  const roiLease = ((savings - leaseAnnual) / leaseAnnual) * 100;
  const roiPurchase = ((savings - inputs.purchasePrice) / inputs.purchasePrice) * 100;
  const paybackMonthsLease = savings > 0 ? Math.ceil((leaseAnnual) / savings * 12) : 'N/A';
  const paybackMonthsPurchase = savings > 0 ? Math.ceil((inputs.purchasePrice) / savings * 12) : 'N/A';

  const chartData = {
    labels: ['Cost', 'Savings'],
    datasets: [
      {
        label: mode === 'lease' ? 'Lease vs Savings' : 'Purchase vs Savings',
        data: [
          mode === 'lease' ? leaseAnnual.toFixed(2) : inputs.purchasePrice.toFixed(2),
          savings.toFixed(2)
        ],
        backgroundColor: ['#2c3e50', '#1abc9c'],
      },
    ],
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <h1 style={{ color: '#0c3c78' }}>NebulaOne ROI Calculator</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setMode('lease')} style={{
          backgroundColor: mode === 'lease' ? '#0c3c78' : '#ddd',
          color: mode === 'lease' ? 'white' : '#000',
          padding: '0.5rem 1rem',
          border: 'none',
          marginRight: '1rem',
          borderRadius: '4px'
        }}>Lease ROI</button>

        <button onClick={() => setMode('purchase')} style={{
          backgroundColor: mode === 'purchase' ? '#0c3c78' : '#ddd',
          color: mode === 'purchase' ? 'white' : '#000',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px'
        }}>Purchase ROI</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <input name="sanitationCost" placeholder="Monthly Sanitation Cost" onChange={handleChange} value={inputs.sanitationCost} />
        <input name="outbreaksPerYear" placeholder="Outbreaks Per Year" onChange={handleChange} value={inputs.outbreaksPerYear} />
        <input name="outbreakCost" placeholder="Cost Per Outbreak" onChange={handleChange} value={inputs.outbreakCost} />
        <input name="sickDays" placeholder="Sick Days Per Year" onChange={handleChange} value={inputs.sickDays} />
        <input name="workersComp" placeholder="Cost Per Sick Day" onChange={handleChange} value={inputs.workersComp} />
        <input name="customCost" placeholder="Other Annual Cost" onChange={handleChange} value={inputs.customCost} />
        <select name="savingsRate" value={inputs.savingsRate} onChange={handleChange}>
          <option value={0.2}>20% Savings</option>
          <option value={0.3}>30% Savings</option>
          <option value={0.4}>40% Savings</option>
        </select>
        {mode === 'purchase' && (
          <input
            name="purchasePrice"
            placeholder="Purchase Price (Default: $30,000)"
            onChange={handleChange}
            value={inputs.purchasePrice}
            title="Retail price is $30,000 unless a lower amount is authorized by your representative."
          />
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={reset} style={{ padding: '0.5rem 1rem', backgroundColor: '#0c3c78', color: 'white', border: 'none', borderRadius: '5px' }}>Reset</button>
      </div>

      <div style={{ background: '#f0f4fb', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
        <h3>Summary</h3>
        <p><strong>Estimated Annual Savings:</strong> ${savings.toFixed(2)}</p>
        {mode === 'lease' ? (
          <>
            <p><strong>Annual ROI (Lease):</strong> {roiLease.toFixed(1)}%</p>
            <p><strong>Payback Period:</strong> {paybackMonthsLease} months</p>
            <p><strong>Lease Cost (Monthly):</strong> ${inputs.leaseCost}</p>
          </>
        ) : (
          <>
            <p><strong>Annual ROI (Purchase):</strong> {roiPurchase.toFixed(1)}%</p>
            <p><strong>Payback Period:</strong> {paybackMonthsPurchase} months</p>
            <p><strong>Purchase Price:</strong> ${inputs.purchasePrice}</p>
          </>
        )}
      </div>

      <div>
        <Bar data={chartData} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); console.log(inputs.email); }}>
        <h3 style={{ marginTop: '2rem' }}>Request a Callback</h3>
        <input
          name="email"
          placeholder="Enter your email"
          value={inputs.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#32a852', color: 'white', border: 'none', borderRadius: '5px' }}>Submit</button>
      </form>
    </div>
  );
}
