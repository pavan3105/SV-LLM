import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  ArrowDownTrayIcon, 
  DocumentTextIcon, 
  ShieldExclamationIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ThreatModelingResultsDisplay = ({ results }) => {
  const { darkMode } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);
  const [showFullContent, setShowFullContent] = useState({});
  
  // Handle missing or invalid results
  if (!results || Object.keys(results).length === 0) {
    return null;
  }

  // Extract data from results
  const refinedThreats = results.refined_threats || [];
  const testPlansContent = results.test_plans_flow_2_content || [];
  const threatPlansContent = results.threat_specific_test_plans_content || [];
  
  // Helper function to download text content
  const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Function to download all files as a ZIP
  const downloadAllAsZip = () => {
    const zip = new JSZip();
    
    // Create folders for different types of content
    const threatAssessmentFolder = zip.folder("Threat Assessment");
    const securityTestPlansFolder = zip.folder("Security Test Plans");
    const threatSpecificPlansFolder = zip.folder("Threat Specific Plans");
    
    // Add refined threats as JSON file
    if (refinedThreats && refinedThreats.length > 0) {
      threatAssessmentFolder.file(
        "refined_threats.json", 
        JSON.stringify(refinedThreats, null, 2)
      );
    }
    
    // Add all security test plans
    if (testPlansContent && testPlansContent.length > 0) {
      testPlansContent.forEach((plan, index) => {
        securityTestPlansFolder.file(
          plan.filename || `test_plan_${index + 1}.md`, 
          plan.content
        );
      });
    }
    
    // Add all threat-specific test plans
    if (threatPlansContent && threatPlansContent.length > 0) {
      threatPlansContent.forEach((plan, index) => {
        threatSpecificPlansFolder.file(
          plan.filename || `threat_plan_${index + 1}.md`, 
          plan.content
        );
      });
    }
    
    // Generate the zip file
    zip.generateAsync({ type: "blob" })
      .then(content => {
        // Use file-saver to save the zip
        saveAs(content, "threat_modeling_results.zip");
      })
      .catch(error => {
        console.error("Error creating ZIP file:", error);
        alert("Failed to create ZIP file. Please try downloading files individually.");
      });
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Toggle display of full content
  const toggleFullContent = (id) => {
    setShowFullContent(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="my-4 threat-modeling-results">
      <h3 className="text-lg font-bold mb-4">Threat Modeling Results</h3>
      
      {/* Refined Threats Section */}
      {refinedThreats.length > 0 && (
        <div className={`mb-4 rounded-lg border overflow-hidden ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${
              darkMode ? 'bg-dark-100' : 'bg-gray-50'
            }`}
            onClick={() => toggleSection('threats')}
          >
            <div className="flex items-center">
              <ShieldExclamationIcon className="h-5 w-5 mr-2 text-primary-500" />
              <h3 className="font-medium">Refined Threat Assessment</h3>
            </div>
            {expandedSection === 'threats' ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </div>
          
          {expandedSection === 'threats' && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-3">
                <p className="text-sm mb-2">
                  Based on the analysis, the following threats were identified as most relevant:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {refinedThreats.map((threat, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded-lg border ${
                        darkMode ? 'border-gray-700 bg-dark-200' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          darkMode ? 'bg-red-400' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">{threat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => downloadTextFile(JSON.stringify(refinedThreats, null, 2), 'refined_threats.json')}
                  className={`px-2 py-1 rounded-md text-xs flex items-center ${
                    darkMode 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                  Download JSON
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Test Plans Section */}
      {testPlansContent.length > 0 && (
        <div className={`mb-4 rounded-lg border overflow-hidden ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${
              darkMode ? 'bg-dark-100' : 'bg-gray-50'
            }`}
            onClick={() => toggleSection('testPlans')}
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-500" />
              <h3 className="font-medium">Security Test Plans</h3>
            </div>
            {expandedSection === 'testPlans' ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </div>
          
          {expandedSection === 'testPlans' && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm mb-3">
                The following security test plans were generated based on the analysis:
              </p>
              
              <div className="space-y-2 mb-3">
                {testPlansContent.map((plan, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded-lg border ${
                      darkMode ? 'border-gray-700 bg-dark-200' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Test Plan {index + 1}</h4>
                      <div className="flex space-x-1">
                        <button
                          className={`p-1 rounded-md ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          title="View/Hide Content"
                          onClick={() => toggleFullContent(`plan-${index}`)}
                        >
                          <EyeIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => downloadTextFile(plan.content, plan.filename || `test_plan_${index + 1}.md`)}
                          className={`p-1 rounded-md ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {plan.filename || `test_plan_${index + 1}.md`}
                    </p>
                    
                    {showFullContent[`plan-${index}`] && (
                      <div className={`mt-2 p-2 rounded text-xs overflow-x-auto max-h-48 ${
                        darkMode ? 'bg-dark-300 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <pre className="whitespace-pre-wrap">{plan.content}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    testPlansContent.forEach((plan, index) => {
                      downloadTextFile(plan.content, plan.filename || `test_plan_${index + 1}.md`);
                    });
                  }}
                  className={`px-2 py-1 rounded-md text-xs flex items-center ${
                    darkMode 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                  Download All Plans
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Threat-specific Test Plans */}
      {threatPlansContent.length > 0 && (
        <div className={`mb-4 rounded-lg border overflow-hidden ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${
              darkMode ? 'bg-dark-100' : 'bg-gray-50'
            }`}
            onClick={() => toggleSection('threatPlans')}
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-500" />
              <h3 className="font-medium">Threat-Specific Test Plans</h3>
            </div>
            {expandedSection === 'threatPlans' ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </div>
          
          {expandedSection === 'threatPlans' && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm mb-3">
                The following threat-specific test plans were generated:
              </p>
              
              <div className="space-y-2 mb-3">
                {threatPlansContent.map((plan, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded-lg border ${
                      darkMode ? 'border-gray-700 bg-dark-200' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{plan.name || `Threat Plan ${index + 1}`}</h4>
                      <div className="flex space-x-1">
                        <button
                          className={`p-1 rounded-md ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          title="View/Hide Content"
                          onClick={() => toggleFullContent(`threat-${index}`)}
                        >
                          <EyeIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => downloadTextFile(plan.content, plan.filename || `threat_plan_${index + 1}.md`)}
                          className={`p-1 rounded-md ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {plan.filename || `threat_plan_${index + 1}.md`}
                    </p>
                    
                    {showFullContent[`threat-${index}`] && (
                      <div className={`mt-2 p-2 rounded text-xs overflow-x-auto max-h-48 ${
                        darkMode ? 'bg-dark-300 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <pre className="whitespace-pre-wrap">{plan.content}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    threatPlansContent.forEach((plan, index) => {
                      downloadTextFile(plan.content, plan.filename || `threat_plan_${index + 1}.md`);
                    });
                  }}
                  className={`px-2 py-1 rounded-md text-xs flex items-center ${
                    darkMode 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                  Download All Threat Plans
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* All Downloads button - Now with ZIP functionality */}
      <div className="flex justify-center">
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
            darkMode 
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          onClick={downloadAllAsZip}
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
          Download All Results (ZIP)
        </button>
      </div>
    </div>
  );
};

export default ThreatModelingResultsDisplay;