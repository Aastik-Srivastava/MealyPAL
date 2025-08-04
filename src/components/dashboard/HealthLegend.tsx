import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export const HealthLegend: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-[#A8FFBA]/20 p-4 mb-6">
      <h3 className="text-sm font-medium text-white mb-3">Health Indicators Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* High Sugar Warning */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          <span className="text-white">High Sugar</span>
        </div>
        
        {/* Lactose Warning */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3 w-3 text-sky-400" />
          <span className="text-white">Lactose</span>
        </div>
        
        {/* Gluten Warning */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3 w-3 text-purple-400" />
          <span className="text-white">Gluten</span>
        </div>
        
        {/* PCOS Friendly */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white">PCOS-Friendly</span>
        </div>
        
        {/* Gut Wreaker */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-white">Gut-Wrecking</span>
        </div>
        
        {/* Thyroid Friendly */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-white">Thyroid-Friendly</span>
        </div>
      </div>
    </div>
  );
}; 