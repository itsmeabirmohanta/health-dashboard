"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";

interface FHIRValidationError {
  field: string;
  message: string;
}

export default function StandardsPage() {
  const [validationErrors, setValidationErrors] = useState<FHIRValidationError[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [messageCount, setMessageCount] = useState(247);
  const [successRate, setSuccessRate] = useState(99.8);

  const sampleFHIRPatient = {
    resourceType: "Patient",
    id: "example",
    text: {
      status: "generated",
      div: "<div>John Doe</div>"
    },
    active: true,
    name: [
      {
        use: "official",
        family: "Doe",
        given: ["John"]
      }
    ],
    gender: "male",
    birthDate: "1974-12-25",
    address: [
      {
        use: "home",
        type: "physical",
        text: "123 Health St"
      }
    ]
  };

  const handleExportFHIR = async () => {
    setIsExporting(true);
    try {
      // Simulate FHIR export
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessageCount(prev => prev + 1);
      // Simulate success rate calculation
      const newRate = (successRate * messageCount + 100) / (messageCount + 1);
      setSuccessRate(Number(newRate.toFixed(1)));
    } catch (error) {
      setValidationErrors([{
        field: "export",
        message: "Failed to export FHIR resource"
      }]);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFHIR = async () => {
    setIsImporting(true);
    try {
      // Simulate FHIR import validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessageCount(prev => prev + 1);
      // Simulate validation error
      if (Math.random() > 0.8) {
        throw new Error("Validation failed");
      }
      // Simulate success rate calculation
      const newRate = (successRate * messageCount + 100) / (messageCount + 1);
      setSuccessRate(Number(newRate.toFixed(1)));
    } catch (error) {
      setValidationErrors([{
        field: "import",
        message: "Invalid FHIR resource format"
      }]);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">FHIR/HL7 Integration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FHIR Resources */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">FHIR Resources</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-700 dark:text-blue-300">Patient Resource</h3>
              <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded overflow-auto text-sm">
                {JSON.stringify(sampleFHIRPatient, null, 2)}
              </pre>
            </div>

            {validationErrors.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="font-medium text-red-700 dark:text-red-300">Validation Errors</h3>
                <ul className="mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600 dark:text-red-400">
                      {error.field}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                onClick={handleExportFHIR}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  'Export FHIR'
                )}
              </button>
              <button 
                className={`px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                onClick={handleImportFHIR}
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Importing...
                  </>
                ) : (
                  'Import FHIR'
                )}
              </button>
            </div>
          </div>
        </Card>

        {/* HL7 Messages */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">HL7 Messages</h2>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-medium text-purple-700 dark:text-purple-300">ADT Message</h3>
              <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded overflow-auto text-sm font-mono">
{`MSH|^~\\&|SENDING_APP|SENDING_FAC|REC_APP|REC_FAC|20240320||ADT^A01|MSG00001|P|2.3
EVN|A01|20240320
PID|||12345^^^MR||DOE^JOHN^^^^||19741225|M`}
              </pre>
            </div>

            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                Send HL7
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                Receive HL7
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Integration Status */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">FHIR Server</h3>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Connected</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">HL7 Interface</h3>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Active</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Messages Today</h3>
          <div className="text-2xl font-bold">{messageCount}</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <div className="text-2xl font-bold text-green-500">{successRate}%</div>
        </Card>
      </div>
    </div>
  );
} 