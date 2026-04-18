import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Store, ArrowRight, ArrowLeft, Check, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { DBUser } from '@/lib/supabase';
import { toast } from 'sonner';

interface AssignmentData {
  id: string;
  rep_id: string;
  account_id: string;
  assigned_at: string;
  is_primary: boolean;
}

interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  salesRep?: DBUser | null;
  allAccounts?: DBUser[];
  existingAssignments?: AssignmentData[];
  onAssignmentsChanged?: (assignments: AssignmentData[]) => void;
  mode?: 'to-rep' | 'to-account';
}

export function AssignmentDialog({
  isOpen,
  onClose,
  salesRep = null,
  allAccounts = [],
  existingAssignments = [],
  onAssignmentsChanged,
  mode = 'to-rep'
}: AssignmentDialogProps) {
  const [activeTab, setActiveTab] = useState<'wholesalers' | 'distributors'>('wholesalers');
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [localAssignments, setLocalAssignments] = useState<AssignmentData[]>(existingAssignments);

  // Sync with parent assignments when they change
  useEffect(() => {
    setLocalAssignments(existingAssignments);
  }, [existingAssignments]);

  const title = mode === 'to-rep' && salesRep
    ? `Manage Assignments for ${salesRep.business_name || salesRep.email}`
    : 'Manage Assignments';

  const description = mode === 'to-rep' && salesRep
    ? `Assign or remove accounts for ${salesRep.email}`
    : '';

  // Filter accounts by type
  const wholesalerAccounts = allAccounts.filter((a) => a.role === 'wholesaler');
  const distributorAccounts = allAccounts.filter((a) => a.role === 'distributor');

  // Get currently assigned accounts for this rep
  const getAssignedAccountIds = (repId: string) => {
    return localAssignments
      .filter((a) => a.rep_id === repId)
      .map((a) => a.account_id);
  };

  const assignedAccountIds = salesRep ? getAssignedAccountIds(salesRep.id) : [];

  // Split into assigned and unassigned for each type
  const getAssignedAccounts = (accounts: DBUser[]) => {
    return accounts.filter((a) => assignedAccountIds.includes(a.id));
  };

  const getUnassignedAccounts = (accounts: DBUser[]) => {
    return accounts.filter((a) => !assignedAccountIds.includes(a.id));
  };

  const handleToggleAdd = (id: string) => {
    setSelectedToAdd((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleRemove = (id: string) => {
    setSelectedToRemove((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!salesRep) return;
    setSaving(true);

    try {
      // Get current user session for assigned_by
      const { data: { session } } = await supabase.auth.getSession();
      const assignedBy = session?.user?.id || null;

      // 1. Remove unselected assignments
      if (selectedToRemove.length > 0) {
        // Delete from rep_account_assignments
        const { error: deleteError } = await supabase
          .from('rep_account_assignments')
          .delete()
          .eq('rep_id', salesRep.id)
          .in('account_id', selectedToRemove);

        if (deleteError) {
          // If table doesn't exist yet, just update local state
          if (deleteError.code === '42P01') {
            toast.error('Assignment table not ready. Please apply the database migration first.');
            setSaving(false);
            return;
          }
          toast.error('Failed to remove assignments: ' + deleteError.message);
          setSaving(false);
          return;
        }
      }

      // 2. Add new assignments
      if (selectedToAdd.length > 0) {
        const newAssignments = selectedToAdd.map((accountId) => ({
          rep_id: salesRep.id,
          account_id: accountId,
          assigned_by: assignedBy,
          is_primary: true,
        }));

        const { error: insertError } = await supabase
          .from('rep_account_assignments')
          .insert(newAssignments);

        if (insertError) {
          if (insertError.code === '42P01') {
            toast.error('Assignment table not ready. Please apply the database migration first.');
            setSaving(false);
            return;
          }
          toast.error('Failed to add assignments: ' + insertError.message);
          setSaving(false);
          return;
        }
      }

      // 3. Refresh assignments from DB
      const { data: refreshedAssignments, error: refreshError } = await supabase
        .from('rep_account_assignments')
        .select('*');

      if (!refreshError && refreshedAssignments) {
        setLocalAssignments(refreshedAssignments);
        onAssignmentsChanged?.(refreshedAssignments);
      }

      toast.success('Assignments updated', {
        description: `Added ${selectedToAdd.length}, Removed ${selectedToRemove.length}`,
      });

      setSelectedToAdd([]);
      setSelectedToRemove([]);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save assignments');
    }

    setSaving(false);
  };

  const filterBySearch = (items: DBUser[]) => {
    if (!searchQuery) return items;
    return items.filter(
      (item) =>
        (item.business_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.city?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#150f24] border border-white/10 text-white max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Store className="w-5 h-5 text-[#9a02d0]" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        {mode === 'to-rep' && salesRep && (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'wholesalers' | 'distributors')}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="bg-[#0a0514] border border-white/10">
              <TabsTrigger
                value="wholesalers"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9a02d0] data-[state=active]:to-[#44f80c] data-[state=active]:text-white"
              >
                Wholesalers ({getAssignedAccounts(wholesalerAccounts).length} assigned)
              </TabsTrigger>
              <TabsTrigger
                value="distributors"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9a02d0] data-[state=active]:to-[#44f80c] data-[state=active]:text-white"
              >
                Distributors ({getAssignedAccounts(distributorAccounts).length} assigned)
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#0a0514] border-white/10 text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            <TabsContent value="wholesalers" className="flex-1 overflow-hidden flex gap-4 mt-0 px-4 pb-4">
              <AssignmentPanel
                title="Available to Assign"
                icon={<ArrowRight className="w-4 h-4 text-[#44f80c]" />}
                badgeColor="bg-[#44f80c]/20 text-[#44f80c]"
                accounts={filterBySearch(getUnassignedAccounts(wholesalerAccounts))}
                selectedIds={selectedToAdd}
                onToggle={handleToggleAdd}
                checkboxColor="data-[state=checked]:bg-[#44f80c] data-[state=checked]:border-[#44f80c]"
                emptyMessage="No unassigned wholesalers"
              />
              <AssignmentPanel
                title="Currently Assigned"
                icon={<ArrowLeft className="w-4 h-4 text-red-400" />}
                badgeColor="bg-[#9a02d0]/20 text-[#9a02d0]"
                accounts={filterBySearch(getAssignedAccounts(wholesalerAccounts))}
                selectedIds={selectedToRemove}
                onToggle={handleToggleRemove}
                checkboxColor="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                emptyMessage="No assigned wholesalers"
              />
            </TabsContent>

            <TabsContent value="distributors" className="flex-1 overflow-hidden flex gap-4 mt-0 px-4 pb-4">
              <AssignmentPanel
                title="Available to Assign"
                icon={<ArrowRight className="w-4 h-4 text-[#44f80c]" />}
                badgeColor="bg-[#44f80c]/20 text-[#44f80c]"
                accounts={filterBySearch(getUnassignedAccounts(distributorAccounts))}
                selectedIds={selectedToAdd}
                onToggle={handleToggleAdd}
                checkboxColor="data-[state=checked]:bg-[#44f80c] data-[state=checked]:border-[#44f80c]"
                emptyMessage="No unassigned distributors"
              />
              <AssignmentPanel
                title="Currently Assigned"
                icon={<ArrowLeft className="w-4 h-4 text-red-400" />}
                badgeColor="bg-[#9a02d0]/20 text-[#9a02d0]"
                accounts={filterBySearch(getAssignedAccounts(distributorAccounts))}
                selectedIds={selectedToRemove}
                onToggle={handleToggleRemove}
                checkboxColor="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                emptyMessage="No assigned distributors"
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <div className="text-sm text-gray-400">
            {selectedToAdd.length > 0 && (
              <span className="text-[#44f80c]">{selectedToAdd.length} to add</span>
            )}
            {selectedToAdd.length > 0 && selectedToRemove.length > 0 && (
              <span className="mx-2">•</span>
            )}
            {selectedToRemove.length > 0 && (
              <span className="text-red-400">{selectedToRemove.length} to remove</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedToAdd.length === 0 && selectedToRemove.length === 0 || saving}
              className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Users className="w-4 h-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component for assignment panels
interface AssignmentPanelProps {
  title: string;
  icon: React.ReactNode;
  badgeColor: string;
  accounts: DBUser[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  checkboxColor: string;
  emptyMessage: string;
}

function AssignmentPanel({ title, icon, badgeColor, accounts, selectedIds, onToggle, checkboxColor, emptyMessage }: AssignmentPanelProps) {
  return (
    <div className="flex-1 bg-[#0a0514] rounded-lg border border-white/10 overflow-hidden flex flex-col">
      <div className="p-3 border-b border-white/10 bg-[#150f24]">
        <h4 className="text-white font-medium flex items-center gap-2">
          {icon}
          {title}
          <Badge className={`ml-auto ${badgeColor}`}>
            {accounts.length}
          </Badge>
        </h4>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center gap-3 p-3 bg-[#150f24] rounded-lg hover:bg-white/5 transition-colors"
          >
            <Checkbox
              checked={selectedIds.includes(account.id)}
              onCheckedChange={() => onToggle(account.id)}
              className={`border-white/20 ${checkboxColor}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{account.business_name || '—'}</p>
              <p className="text-gray-400 text-sm">{account.city && account.state ? `${account.city}, ${account.state}` : account.email}</p>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
}
