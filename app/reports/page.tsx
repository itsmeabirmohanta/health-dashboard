"use client";

import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart2, Filter, Share2, Printer } from 'lucide-react';

// Mock data - replace with actual data and generation logic
const mockReportTypes = [
  { id: 'weekly_summary', name: 'Weekly Health Summary', description: 'Overview of key metrics for the past week.' },
  { id: 'monthly_activity', name: 'Monthly Activity Report', description: 'Detailed log of all physical activities.' },
  { id: 'sleep_analysis', name: 'Sleep Analysis', description: 'In-depth look at sleep patterns and quality.' },
  { id: 'nutrition_overview', name: 'Nutrition Overview', description: 'Summary of dietary intake and habits.' },
];

const mockGeneratedReports = [
  { id: 'rep1', name: 'Weekly Summary - 2023-10-23', dateGenerated: '2023-10-23', type: 'Weekly Health Summary', format: 'PDF' },
  { id: 'rep2', name: 'Monthly Activity - Sep 2023', dateGenerated: '2023-10-01', type: 'Monthly Activity Report', format: 'CSV' },
  { id: 'rep3', name: 'Sleep Analysis - W40 2023', dateGenerated: '2023-10-09', type: 'Sleep Analysis', format: 'PDF' },
];

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState<string>(mockReportTypes[0]?.id || '');
  const [dateRange, setDateRange] = useState<{ start: string, end: string } | null>(null);
  const [generatedReports, setGeneratedReports] = useState(mockGeneratedReports);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert("Please select a report type.");
      return;
    }
    setIsGenerating(true);
    console.log(`Generating report: ${selectedReportType}, Date Range: ${JSON.stringify(dateRange)}`);
    // Simulate report generation
    setTimeout(() => {
      const reportName = mockReportTypes.find(rt => rt.id === selectedReportType)?.name || 'Custom Report';
      const newReport = {
        id: `rep${generatedReports.length + 1}`,
        name: `${reportName} - ${new Date().toISOString().split('T')[0]}`,
        dateGenerated: new Date().toISOString().split('T')[0],
        type: reportName,
        format: Math.random() > 0.5 ? 'PDF' : 'CSV',
      };
      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      alert('Report generated successfully (mock)!');
    }, 2000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileText className="w-8 h-8 mr-3 text-primary-500" /> Health Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Generate, view, and manage your health reports.</p>
      </header>

      {/* Report Generation Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <BarChart2 className="w-6 h-6 mr-2 text-green-500" /> Generate New Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
            <select 
              id="reportType" 
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="" disabled>Select a report type</option>
              {mockReportTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>
            {selectedReportType && (
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    {mockReportTypes.find(rt => rt.id === selectedReportType)?.description}
                 </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range (Optional)</label>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={dateRange?.start || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value, end: prev?.end || today }))}
                max={dateRange?.end || today}
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <input 
                type="date" 
                value={dateRange?.end || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value, start: prev?.start || '' }))}
                min={dateRange?.start || ''}
                max={today}
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating || !selectedReportType}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</>
          ) : (
            <><BarChart2 className="w-5 h-5" /> Generate Report</>
          )}
        </button>
      </section>

      {/* Previously Generated Reports */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-purple-500" /> Generated Reports
            </h2>
            <button className="mt-3 sm:mt-0 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                <Filter className="w-4 h-4" /> Filter Reports
            </button>
        </div>
        {generatedReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Report Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Generated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Format</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {generatedReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">{report.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{report.dateGenerated}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{report.type}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${report.format === 'PDF' ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300'}`}>
                            {report.format}
                        </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button title="Download" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button title="Share" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                         <button title="Print" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No reports generated yet.</p>
        )}
      </section>
    </div>
  );
} 