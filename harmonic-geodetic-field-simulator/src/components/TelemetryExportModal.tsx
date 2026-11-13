/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HarmonicCalculationResult, SimulationParameters, GeodeticNode } from '../types/harmonics';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

interface TelemetryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SimulationParameters;
  results: HarmonicCalculationResult;
  selectedNode: GeodeticNode | null;
}

export const TelemetryExportModal: React.FC<TelemetryExportModalProps> = ({
  isOpen,
  onClose,
  params,
  results,
  selectedNode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportData = {
    metadata: {
      title: "Captain Bruce Cathie Unified Field Telemetry",
      timestamp: new Date().toISOString(),
      latticeFramework: "21,600 Arc-Minute Cuboctahedron / 120-Polytope Dual Matrix",
    },
    simulationParameters: params,
    selectedNode: selectedNode ? {
      name: selectedNode.name,
      coordinates: {
        latitudeDeg: selectedNode.latitude,
        longitudeDeg: selectedNode.longitude,
        arcMinuteLat: selectedNode.arcMinuteLat,
        arcMinuteLon: selectedNode.arcMinuteLon,
      },
      harmonicFrequency: selectedNode.harmonicFrequency,
      polyhedronType: selectedNode.polyhedronType,
      fieldDensityMultiplier: selectedNode.fieldDensityMultiplier,
    } : "Global Matrix Average",
    harmonicUnifiedFieldMetrics: {
      lightSpeedTheoreticalGridNmS: results.cTheoreticalGrid,
      lightSpeedLocalEffectiveGridNmS: results.cLocalEffectiveGrid,
      lightSpeedStandardEquivalentMS: results.cStandardEquivalentMs,
      cathieMassEquation_m: results.cathieMass,
      cathieUnifiedEnergy_E: results.cathieEnergy,
      einsteinReferenceEnergy_E0: results.einsteinEnergyStandard,
      reciprocalGravityIndex: results.reciprocalGravityHarmonic,
      gravitationalRefractionIndex_n: results.gravitationalRefractionIndex,
      phaseDisplacementVelocityNmS: results.phaseDisplacementVelocity,
      zeroTimeCoherencePercent: results.zeroTimePotentialScore,
    },
    maxwellianWaveCavity: {
      energyDensityJoulesPerM3: results.maxwellEnergyDensityJoulesPerM3,
      poyntingVectorMagnitudeWattsPerM2: results.poyntingVectorMagnitude,
      standingWaveResonanceNm: results.standingWaveWavelengthNm,
      octaveSubdivision: results.harmonicOctaveNumber,
    },
  };

  const jsonString = JSON.stringify(exportData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cathie_telemetry_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Harmonic Telemetry Export (JSON)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-y-auto flex-1">
          <pre className="leading-relaxed whitespace-pre-wrap">{jsonString}</pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-slate-800 bg-slate-950">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
