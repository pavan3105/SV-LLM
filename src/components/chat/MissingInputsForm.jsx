import React, { useState } from 'react';
import Button from '../common/Button';
import { useTheme } from '../../context/ThemeContext';

const MissingInputsForm = ({ missingInputs, onSubmit }) => {
  const { darkMode } = useTheme();
  const [inputs, setInputs] = useState({});
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  
  // Enhanced vulnerability options for dropdown
  const vulnerabilityOptions = [
    // Side-channel related options
    { value: "Side Channel Attack", category: "Side Channels" },
    { value: "Timing Side-Channel", category: "Side Channels" },
    { value: "Power Analysis Attack", category: "Side Channels" },
    { value: "Electromagnetic Leakage", category: "Side Channels" },
    { value: "Cache Timing Attack", category: "Side Channels" },
    
    // Physical attacks
    { value: "Fault Injection", category: "Physical Attacks" },
    { value: "Laser Fault Injection", category: "Physical Attacks" },
    { value: "Voltage Glitching", category: "Physical Attacks" },
    { value: "Physical Probing", category: "Physical Attacks" },
    
    // Architecture-level threats
    { value: "Privilege Escalation", category: "Architecture" },
    { value: "Information Leakage", category: "Architecture" },
    { value: "Hardware Trojan", category: "Architecture" },
    { value: "Buffer Overflow", category: "Architecture" },
    { value: "Secure Boot Bypass", category: "Architecture" },
    
    // Memory-related attacks
    { value: "Rowhammer Attack", category: "Memory" },
    { value: "Cold Boot Attack", category: "Memory" },
    { value: "Memory Scanning", category: "Memory" },
    { value: "DMA Attack", category: "Memory" },
    
    // Protocol attacks
    { value: "Protocol Downgrade", category: "Protocol" },
    { value: "Replay Attack", category: "Protocol" },
    { value: "Man-in-the-Middle", category: "Protocol" }
  ];
  
  // Group vulnerability options by category
  const groupedOptions = vulnerabilityOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});
  
  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    
    // Clear the error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
        handleChange('design_spec', event.target.result);
      };
      reader.readAsText(file);
      
      // Clear any existing file upload error
      if (errors.design_spec) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.design_spec;
          return newErrors;
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Check if this is for security property generation
    const isSecurityPropertyGeneration = Object.keys(missingInputs).includes('security_property_generation');
    const isVulnerabilityDetection = Object.keys(missingInputs).includes('vulnerability_detection');
    
    // Check required fields based on the missingInputs
    Object.keys(missingInputs).forEach(intent => {
      missingInputs[intent].forEach(field => {
        if ((isSecurityPropertyGeneration || isVulnerabilityDetection) && field === 'design_spec' && !inputs[field]) {
          newErrors.design_spec = 'Please upload a design specification file';
        } else if ((isSecurityPropertyGeneration || isVulnerabilityDetection) && field === 'vulnerability' && !inputs[field]) {
          newErrors.vulnerability = 'Please select a vulnerability type';
        } else if (!inputs[field]) {
          newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(inputs);
    }
  };
  
  // Create a flat list of all unique missing fields
  const uniqueFields = new Set();
  Object.values(missingInputs).forEach(fields => {
    fields.forEach(field => uniqueFields.add(field));
  });
  
  // Check if security property generation intent is present
  const isSecurityPropertyGeneration = Object.keys(missingInputs).includes('security_property_generation');
  const isVulnerabilityDetection = Object.keys(missingInputs).includes('vulnerability_detection');
  
  return (
    <div className={`p-4 border rounded-lg ${
      darkMode ? 'bg-dark-100 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className="text-lg font-medium mb-4">Additional Information Needed</h3>
      
      {isSecurityPropertyGeneration && (
        <p className="mb-4">Please provide the following information to generate security properties for your design:</p>
      )}
      
      {isVulnerabilityDetection && (
        <p className="mb-4">Please provide the following information to analyze your design for vulnerabilities:</p>
      )}
      
      {!isSecurityPropertyGeneration && !isVulnerabilityDetection && (
        <p className="mb-4">Please provide the following information to continue:</p>
      )}
      
      <form onSubmit={handleSubmit}>
        {Array.from(uniqueFields).map(field => (
          <div key={field} className="mb-4">
            {(field === 'design_spec' && (isSecurityPropertyGeneration || isVulnerabilityDetection)) ? (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Design Specification (Upload File) <span className="text-red-500">*</span>
                </label>
                <div className={`border rounded-lg p-4 ${
                  errors.design_spec 
                    ? 'border-red-500' 
                    : darkMode ? 'border-gray-700 bg-dark-200' : 'border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="file"
                    id="design-spec-file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".v,.sv,.txt,.html,.rtl"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={() => document.getElementById('design-spec-file').click()}
                      className={`px-4 py-2 rounded-lg mb-2 ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      Choose File
                    </button>
                    <span className="text-sm">
                      {fileName ? fileName : 'No file chosen'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Upload Verilog (.v), SystemVerilog (.sv), or text files containing your design specification.
                    </p>
                    {errors.design_spec && (
                      <p className="text-red-500 text-xs mt-2">{errors.design_spec}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : field === 'vulnerability' && (isSecurityPropertyGeneration || isVulnerabilityDetection) ? (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Vulnerability/Threat Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={inputs[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    errors.vulnerability
                      ? 'border-red-500'
                      : darkMode 
                        ? 'bg-dark-200 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="" disabled>Select a vulnerability/threat type</option>
                  
                  {/* Group options by category */}
                  {Object.entries(groupedOptions).map(([category, options]) => (
                    <optgroup key={category} label={category}>
                      {options.map(option => (
                        <option key={option.value} value={option.value}>{option.value}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.vulnerability && (
                  <p className="text-red-500 text-xs mt-1">{errors.vulnerability}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {field === 'design_spec' ? 'Design Specification' : 
                   field === 'vulnerability' ? 'Vulnerability Details' : 
                   field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                   <span className="text-red-500">*</span>
                </label>
                {field === 'design_spec' ? (
                  <textarea
                    value={inputs[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      errors[field]
                        ? 'border-red-500'
                        : darkMode ? 'bg-dark-200 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    rows={6}
                  />
                ) : (
                  <input
                    type="text"
                    value={inputs[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      errors[field]
                        ? 'border-red-500'
                        : darkMode ? 'bg-dark-200 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                )}
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        <Button type="submit" variant="primary" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default MissingInputsForm;