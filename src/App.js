import React, { useState } from 'react';

export default function NebulaOneROICalculator() {
  const [inputs, setInputs] = useState({
    beds: '',
    sanitationCost: '',
    outbreaksPerYear: '',
    outbreakCost: '',
    staffCount: '',
    sickDays: '',
    workersComp: '',
    customCost: '',
    leaseCost: 750,
    purchaseCost: 12000,
    email: ''
  });

  const [view, setView] = useState('lease');
  const [savingsRate, setSavingsRate] = useState(0.3);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setInputs({
      beds: '',
      sanitationCost: '',
      outbreaksPerYear: '',
      outbreakCost: '',
      staffCount: '',
      sickDays: '',
      workersComp: '',
      customCost: '',
      leaseCost: 750,
      purchaseCost: 12000,
      email: ''
    });
    setSavingsRate(0.3);
    setView('lease');
  };

  const calculateSavings = () => {
    const monthlyOutbreakCost = (inputs.outbreaksPerYear * inputs.outbreakCost) / 12 || 0;
    const additionalCosts = parseFloat(inputs.customCost || 0);
    const totalSanitation = parseFloat(inputs.sanitationCost || 0) + monthlyOutbreakCost + additionalCosts;
    const estimatedSavings = totalSanitation * savingsRate;

    const leaseROI = ((estimatedSavings * 12) - inputs.leaseCost * 12) / (inputs.leaseCost * 12);
    const purchaseROI = ((estimatedSavings * 12) - inputs.purchaseCost) / inputs.purchaseCost;

    return { estimatedSavings, leaseROI, purchaseROI };
  };

  const { estimatedSavings, leaseROI, purchaseROI } = calculateSavings();

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! We’ll follow up at: ${inputs.email}`);
  };

  return (
    <div className="max-w-xl mx-auto p-4 rounded-2xl shadow bg-white">
      <h2 className="text-xl font-bold mb-4">NebulaOne ROI Calculator</h2>

      <form className="grid gap-4">
        {["beds", "sanitationCost", "outbreaksPerYear", "outbreakCost", "staffCount", "sickDays", "workersComp", "customCost"].map((field) => (
          <input
            key={field}
            type="number"
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={inputs[field]}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        ))}
      </form>

      <div className="mt-4">
        <label className="block font-medium mb-1">Estimated Savings Rate (%)</label>
        <select
          value={savingsRate}
          onChange={(e) => setSavingsRate(parseFloat(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {[0.1, 0.2, 0.3, 0.4].map((rate) => (
            <option key={rate} value={rate}>{rate * 100}%</option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          type="button"
          className={`px-4 py-2 rounded ${view === 'lease' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('lease')}
        >
          Lease ROI
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${view === 'purchase' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('purchase')}
        >
          Purchase ROI
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>

      <div className="mt-6">
        <p><strong>Estimated Monthly Savings:</strong> ${estimatedSavings.toFixed(2)}</p>
        {view === 'lease' ? (
          <>
            <p><strong>Annual ROI (Lease):</strong> {(leaseROI * 100).toFixed(1)}%</p>
            <p><strong>Lease Cost (Monthly):</strong> ${inputs.leaseCost}</p>
          </>
        ) : (
          <>
            <p><strong>Annual ROI (Purchase):</strong> {(purchaseROI * 100).toFixed(1)}%</p>
            <p><strong>Purchase Cost (One-Time):</strong> ${inputs.purchaseCost}</p>
          </>
        )}
      </div>

      <form className="mt-6" onSubmit={handleLeadSubmit}>
        <label className="block font-medium mb-1">Request a Callback</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={inputs.email}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-2"
        />
        <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
