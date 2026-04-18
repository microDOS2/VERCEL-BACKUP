import { ShoppingCart, FileText, FileSignature, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-[#150f24] rounded-xl border border-white/10 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          <p className="text-gray-500 text-sm">{subtitle}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-[#44f80c] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-[#0a0514] rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#9a02d0]" />
        </div>
      </div>
    </div>
  );
}

export function DistributorStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Orders"
        value="24"
        subtitle="This month"
        icon={ShoppingCart}
        trend="+12% from last month"
      />
      <StatCard
        title="Pending Orders"
        value="3"
        subtitle="Awaiting fulfillment"
        icon={ShoppingCart}
      />
      <StatCard
        title="Open Invoices"
        value="$4,250.00"
        subtitle="Due within 30 days"
        icon={FileText}
      />
      <StatCard
        title="Pending Agreements"
        value="1"
        subtitle="Awaiting signature"
        icon={FileSignature}
      />
    </div>
  );
}
