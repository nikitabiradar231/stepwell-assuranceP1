import React from 'react';
import { CampaignStatus, CAMPAIGN_STATUS_LABELS } from '../config/contract';
import { Flame, CheckCircle2, XCircle, Award } from 'lucide-react';

interface StatusBadgeProps {
  status: CampaignStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const meta = CAMPAIGN_STATUS_LABELS[status] || CAMPAIGN_STATUS_LABELS[CampaignStatus.FUNDING];

  const getIcon = () => {
    switch (status) {
      case CampaignStatus.FUNDING:
        return <Flame className="w-4 h-4 text-amber-400 animate-pulse" />;
      case CampaignStatus.SUCCESS:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case CampaignStatus.FAILED:
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case CampaignStatus.COMPLETED:
        return <Award className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold tracking-wider uppercase ${meta.color}`}>
          {getIcon()}
          <span>{meta.label}</span>
        </div>
        <p className="text-xs text-slate-400">
          {meta.desc}
        </p>
      </div>

      <div className="text-[11px] text-slate-500 font-mono hidden md:block">
        State Index: {status}
      </div>
    </div>
  );
};
