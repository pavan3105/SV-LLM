import React, { useState } from 'react';
import Button from '../common/Button';
import { useTheme } from '../../context/ThemeContext';

const MissingInputsForm = ({ missingInputs, onSubmit }) => {
  const { darkMode } = useTheme();
  const [inputs, setInputs] = useState({});
  
  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputs);
  };
  
  // Create a flat list of all unique missing fields
  const uniqueFields = new Set();
  Object.values(missingInputs).forEach(fields => {
    fields.forEach(field => uniqueFields.add(field));
  });
  
  return (
    <div className={`p-4 border rounded-lg ${
      darkMode ? 'bg-dark-100 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className="text-lg font-medium mb-4">Additional Information Needed</h3>
      <p className="mb-4">Please provide the following information to continue:</p>
      
      <form onSubmit={handleSubmit}>
        {Array.from(uniqueFields).map(field => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {field === 'design_spec' ? 'Design Specification' : 
               field === 'vulnerability' ? 'Vulnerability Details' : field}
            </label>
            {field === 'design_spec' ? (
              <textarea
                value={inputs[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-dark-200 border-gray-700' : 'bg-white border-gray-300'
                }`}
                rows={6}
              />
            ) : (
              <input
                type="text"
                value={inputs[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-dark-200 border-gray-700' : 'bg-white border-gray-300'
                }`}
              />
            )}
          </div>
        ))}
        
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default MissingInputsForm;