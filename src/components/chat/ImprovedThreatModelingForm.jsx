import React, { useState } from 'react';
import Button from '../common/Button';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  DocumentArrowUpIcon,
  ShieldExclamationIcon,
  WrenchIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ImprovedThreatModelingForm = ({ onSubmit }) => {
  const { darkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [threatModelingAnswers, setThreatModelingAnswers] = useState({});
  const [verificationAnswers, setVerificationAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  // Default threat modeling questions
  const threatModelingQuestions = [
    "Will this processor be deployed in safety-critical systems (e.g., automotive, medical)?",
    "Will this chip be exposed to public or user-controlled environments (e.g., consumer electronics, edge AI)?",
    "Is the processor deployed in a hostile environment where physical tampering is possible?",
    "Will the processor handle cryptographic computations?",
    "Is there a requirement for protection against unauthorized firmware modifications?",
    "Will the processor support multiple privilege levels and memory isolation?",
    "Are cryptographic keys stored in a dedicated secure enclave?",
    "Does the processor use logic obfuscation techniques to prevent netlist-level reverse engineering?",
    "Are debug interfaces permanently disabled or restricted in production?",
    "What is the technology node and foundry (e.g., 5nm TSMC, 22nm GlobalFoundries) used for manufacturing?",
    "Is the fabrication process performed at a trusted or untrusted foundry?",
    "Will the chip undergo 3rd-party IP integration?",
    "Is the RISC-V core developed in-house or sourced externally?",
    "Has the manufacturing process been secured against overproduction?",
    "Is there secure traceability for each chip batch (e.g., chip ID, digital signature)?",
    "Do you have arrangements for testing side-channel vulnerabilities (e.g., DPA, power analysis)?",
    "Do you have reverse engineering resistance validation setups (e.g., layout obfuscation audit, netlist analysis)?",
    "Do you have facilities for probing or semi-invasive attack testing (e.g., fault injection labs, EM probes)?"
  ];

  // Verification planning questions
  const verificationPlanningQuestions = [
    "Will security verification cover RTL, netlist, or both?",
    "Does your company have a dedicated team for formal verification, simulation, and emulation, or will additional hiring or outsourcing be required?",
    "How many engineers will be assigned to security verification, and what is their expertise level in these verification methods?",
    "What is your estimated timeline for completing security verification, and how does it fit within the overall verification schedule?",
    "How will time be distributed among formal verification, simulation, and emulation (e.g., percentage of total verification effort)?",
    "What percentage of the total verification budget is allocated for security verification?",
    "How are costs distributed between formal verification, simulation, and emulation, and are there cost-saving strategies in place?",
    "Which simulation tools are available in your verification environment, and do they support security testing effectively?",
    "Are any security-focused formal tools or lint tools available?",
    "Are post-silicon security validation or test hooks part of the plan?",
    "What emulation platforms does your company use, and do they meet project requirements?",
    "What is the expected simulation runtime, and how will you optimize performance for large-scale test cases?"
  ];
  
  // Initial threats that will be analyzed (known by the backend)
  const initialThreats = [
    "Side Channel Attack",
    "Fault Injection Attack",
    "Unauthorized Access",
    "Privilege Escalation",
    "Hardware Trojan",
    "Information Leakage",
    "Physical Tampering",
    "Memory Corruption"
  ];
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };
      reader.readAsText(file);
      
      // Clear any existing file upload error
      if (errors.asset_list) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.asset_list;
          return newErrors;
        });
      }
    }
  };

  // Handle answering a threat modeling question
  const handleThreatModelingAnswer = (questionIndex, answer) => {
    setThreatModelingAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  // Handle answering a verification planning question
  const handleVerificationAnswer = (questionIndex, answer) => {
    setVerificationAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };
  
  const validateCurrentStep = () => {
    const newErrors = {};
    
    // Validate based on current step
    if (currentStep === 1) {
      // Validate asset list file
      if (!fileContent) {
        newErrors.asset_list = 'Please upload an asset list JSON file';
      }
    } else if (currentStep === 2) {
      // Validate threat modeling answers - at least 75% of questions answered
      const answeredThreatQuestions = Object.keys(threatModelingAnswers).length;
      const minRequired = Math.ceil(threatModelingQuestions.length * 0.75);
      
      if (answeredThreatQuestions < minRequired) {
        newErrors.threatAnswers = `Please answer at least ${minRequired} of the questions (${answeredThreatQuestions}/${threatModelingQuestions.length} answered)`;
      }
    } else if (currentStep === 3) {
      // Validate verification answers - at least 75% of questions answered
      const answeredVerificationQuestions = Object.keys(verificationAnswers).length;
      const minRequired = Math.ceil(verificationPlanningQuestions.length * 0.75);
      
      if (answeredVerificationQuestions < minRequired) {
        newErrors.verificationAnswers = `Please answer at least ${minRequired} of the questions (${answeredVerificationQuestions}/${verificationPlanningQuestions.length} answered)`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateCurrentStep()) {
      // Convert the answer objects to arrays in the order of questions
      const threatAnswersArray = threatModelingQuestions.map((_, index) => 
        threatModelingAnswers[index] || ""
      );
      
      const verificationAnswersArray = verificationPlanningQuestions.map((_, index) => 
        verificationAnswers[index] || ""
      );
      
      // Make sure we're sending the correct format
      const submissionData = {
        asset_list: fileContent,  // This is the raw content of the file
        threat_modeling_answers: threatAnswersArray,
        verification_answers: verificationAnswersArray,
        initial_threats: initialThreats
      };
      
      console.log("Submitting threat modeling data:", submissionData);
      onSubmit(submissionData);
      setSubmitted(true);
    }
  };
  
  // Calculate step completion status
  const step1Complete = !!fileContent;
  const step2Complete = Object.keys(threatModelingAnswers).length >= Math.ceil(threatModelingQuestions.length * 0.75);
  const step3Complete = Object.keys(verificationAnswers).length >= Math.ceil(verificationPlanningQuestions.length * 0.75);
  
  // Determine if form is ready to submit
  const formIsValid = step1Complete && step2Complete && step3Complete;

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3, 4].map(step => {
          // Determine if step is active, completed, or neither
          const isActive = currentStep === step;
          const isCompleted = 
            (step === 1 && step1Complete) ||
            (step === 2 && step2Complete) ||
            (step === 3 && step3Complete) ||
            (step === 4 && false); // Always incomplete until submission
          
          return (
            <div key={step} className="flex items-center">
              {/* Step circle */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                ${isActive 
                  ? 'bg-primary-600 text-white' 
                  : isCompleted 
                    ? darkMode 
                      ? 'bg-primary-900 text-primary-300' 
                      : 'bg-primary-100 text-primary-600'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-gray-200 text-gray-600'
                }
              `}>
                {isCompleted ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              
              {/* Connector line (except after last step) */}
              {step < 4 && (
                <div className={`w-10 h-1 mx-1 
                  ${(isCompleted && (step + 1 === currentStep || !(step + 1 === 4)))
                    ? darkMode 
                      ? 'bg-primary-700' 
                      : 'bg-primary-300'
                    : darkMode 
                      ? 'bg-gray-700' 
                      : 'bg-gray-200'
                  }
                `}></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          // Step 1: Asset List Upload
          <div>
            <h4 className="text-lg font-medium mb-3">Upload Design Asset List</h4>
            <p className="mb-4 text-sm">
              Please upload a JSON file containing your design assets and security-critical components.
              This will be used to analyze potential threats and generate appropriate test plans.
            </p>
            
            <div className={`border-2 border-dashed rounded-lg p-6 ${
              errors.asset_list 
                ? 'border-red-500' 
                : fileContent
                  ? darkMode 
                    ? 'border-primary-600 bg-primary-900 bg-opacity-10' 
                    : 'border-primary-300 bg-primary-50'
                  : darkMode 
                    ? 'border-gray-700 hover:border-gray-600' 
                    : 'border-gray-300 hover:border-gray-400'
            } transition-colors duration-200`}>
              <input
                type="file"
                id="asset-list-file"
                onChange={handleFileChange}
                className="hidden"
                accept=".json"
              />
              
              <div className="flex flex-col items-center justify-center">
                {fileContent ? (
                  <>
                    <div className={`p-3 rounded-full mb-3 ${
                      darkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-600'
                    }`}>
                      <CheckCircleIcon className="h-8 w-8" />
                    </div>
                    <p className="font-medium mb-1">File uploaded successfully</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{fileName}</p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('asset-list-file').click()}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        darkMode 
                          ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Choose Different File
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`p-3 rounded-full mb-3 ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <DocumentArrowUpIcon className="h-8 w-8" />
                    </div>
                    <p className="font-medium mb-1">Drag and drop your JSON file here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">or click to browse files</p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('asset-list-file').click()}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        darkMode 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      Browse Files
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {errors.asset_list && (
              <p className="text-red-500 text-sm mt-2">{errors.asset_list}</p>
            )}
          </div>
        );
        
      case 2:
        return (
          // Step 2: Threat Modeling Questionnaire - Now with text inputs
          <div>
            <h4 className="text-lg font-medium mb-3">
              <div className="flex items-center">
                <ShieldExclamationIcon className="h-5 w-5 mr-2 text-primary-500" />
                <span>Threat Modeling Questionnaire</span>
              </div>
            </h4>
            <p className="mb-4 text-sm">
              Please answer the following questions about your hardware design to help identify potential security threats.
              Your answers will guide the threat modeling analysis.
            </p>
            
            {errors.threatAnswers && (
              <p className="text-red-500 text-sm mb-3">{errors.threatAnswers}</p>
            )}
            
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto pr-2">
              {threatModelingQuestions.map((question, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  threatModelingAnswers[index]
                    ? darkMode 
                      ? 'border-primary-700 bg-primary-900 bg-opacity-10' 
                      : 'border-primary-200 bg-primary-50'
                    : darkMode 
                      ? 'border-gray-700 bg-dark-200' 
                      : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="mb-2">{index + 1}. {question}</p>
                  <div>
                    <input
                      type="text"
                      value={threatModelingAnswers[index] || ''}
                      onChange={(e) => handleThreatModelingAnswer(index, e.target.value)}
                      className={`w-full p-2 rounded-md ${
                        darkMode 
                          ? 'bg-dark-100 border border-gray-700 text-white placeholder:text-gray-500' 
                          : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400'
                      }`}
                      placeholder="Type your answer here..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          // Step 3: Verification Planning Questionnaire
          <div>
            <h4 className="text-lg font-medium mb-3">
              <div className="flex items-center">
                <WrenchIcon className="h-5 w-5 mr-2 text-primary-500" />
                <span>Verification Planning Questionnaire</span>
              </div>
            </h4>
            <p className="mb-4 text-sm">
              Please answer the following questions about your verification environment and resources.
              This will help tailor the test plans to your specific capabilities.
            </p>
            
            {errors.verificationAnswers && (
              <p className="text-red-500 text-sm mb-3">{errors.verificationAnswers}</p>
            )}
            
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto pr-2">
              {verificationPlanningQuestions.map((question, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  verificationAnswers[index]
                    ? darkMode 
                      ? 'border-primary-700 bg-primary-900 bg-opacity-10' 
                      : 'border-primary-200 bg-primary-50'
                    : darkMode 
                      ? 'border-gray-700 bg-dark-200' 
                      : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="mb-2">{index + 1}. {question}</p>
                  <div>
                    <input
                      type="text"
                      value={verificationAnswers[index] || ''}
                      onChange={(e) => handleVerificationAnswer(index, e.target.value)}
                      className={`w-full p-2 rounded-md ${
                        darkMode 
                          ? 'bg-dark-100 border border-gray-700 text-white placeholder:text-gray-500' 
                          : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400'
                      }`}
                      placeholder="Type your answer here..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 4:
        return (
          // Step 4: Summary and Confirmation
          <div>
            <h4 className="text-lg font-medium mb-3">Confirm and Submit</h4>
            <p className="mb-4 text-sm">
              Please review your inputs before submitting. The threat modeling analysis will be performed
              based on the information you've provided.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg border ${
                darkMode ? 'border-gray-700 bg-dark-200' : 'border-gray-200 bg-gray-50'
              }`}>
                <h5 className="font-medium mb-2 flex items-center">
                  <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                  Asset List
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {fileName ? fileName : 'No file uploaded'}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                darkMode ? 'border-gray-700 bg-dark-200' : 'border-gray-200 bg-gray-50'
              }`}>
                <h5 className="font-medium mb-2 flex items-center">
                  <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                  Threat Modeling Questions
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Object.keys(threatModelingAnswers).length}/{threatModelingQuestions.length} questions answered
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                darkMode ? 'border-gray-700 bg-dark-200' : 'border-gray-200 bg-gray-50'
              }`}>
                <h5 className="font-medium mb-2 flex items-center">
                  <WrenchIcon className="h-4 w-4 mr-2" />
                  Verification Planning Questions
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Object.keys(verificationAnswers).length}/{verificationPlanningQuestions.length} questions answered
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              By submitting, you agree to process this data for threat modeling and test plan generation.
              This may take a few moments to complete.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Navigation buttons based on current step
  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-6">
        {/* Back button (hidden on first step) */}
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back
          </Button>
        ) : (
          <div></div> // Empty div to maintain layout
        )}
        
        {/* Next/Submit button */}
        {currentStep < 4 ? (
          <Button
            type="button"
            variant="primary"
            onClick={nextStep}
            disabled={
              (currentStep === 1 && !step1Complete) ||
              (currentStep === 2 && !step2Complete) ||
              (currentStep === 3 && !step3Complete)
            }
          >
            Next
            <ChevronRightIcon className="h-5 w-5 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            disabled={!formIsValid || submitted}
          >
            {submitted ? 'Processing...' : 'Submit for Analysis'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={`p-4 border rounded-lg ${
      darkMode ? 'bg-dark-100 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className="text-xl font-medium mb-2">Threat Modeling Analysis</h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Complete all steps to perform comprehensive threat modeling for your hardware design
      </p>
      
      {/* Step indicators */}
      {renderStepIndicators()}
      
      <form onSubmit={handleSubmit}>
        {/* Step content */}
        {renderStepContent()}
        
        {/* Navigation buttons */}
        {renderNavButtons()}
      </form>
    </div>
  );
};

export default ImprovedThreatModelingForm;