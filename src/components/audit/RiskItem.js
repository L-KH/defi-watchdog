// src/components/audit/RiskItem.js
import React from 'react';

/**
 * Component for displaying a security risk finding from an audit
 */
export default function RiskItem({ risk }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded p-3">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{risk.title || 'Security Issue'}</span>
        <div className="flex items-center gap-2">
          {risk.tool && (
            <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-gray-800">
              {risk.tool}
            </span>
          )}
          <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${getSeverityColor(risk.severity)}`}>
            {risk.severity}
          </span>
        </div>
      </div>
      <p className="text-sm">{risk.description}</p>
      {risk.recommendation && (
        <p className="text-sm mt-2 text-gray-700">
          <span className="font-medium">Recommendation:</span> {risk.recommendation}
        </p>
      )}
    </div>
  );
}
