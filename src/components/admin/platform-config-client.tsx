'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Save, AlertTriangle, ShieldCheck, ToggleLeft, ToggleRight, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { updatePlatformConfig, updateSaaSPlan } from '@/app/actions/admin-actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PlatformConfigClient({ initialConfig, saasPlans }: { initialConfig: any, saasPlans: any[] }) {
  const [config, setConfig] = useState(initialConfig || {});
  const [isSaving, setIsSaving] = useState(false);
  const [plans, setPlans] = useState(saasPlans || []);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handleSave = async () => {
    if (!config.id) {
      alert("Database table missing! Please run SQL script.");
      return;
    }
    
    setIsSaving(true);
    const result = await updatePlatformConfig(config.id, {
      feature_upi_autopay: config.feature_upi_autopay,
      feature_multi_branch: config.feature_multi_branch,
      feature_whatsapp_marketing: config.feature_whatsapp_marketing,
      maintenance_mode: config.maintenance_mode
    });
    
    setIsSaving(false);
    if (result?.error) {
      alert(result.error);
    } else {
      alert("Platform configuration saved!");
    }
  };

  const toggleSetting = (key: string) => {
    setConfig({ ...config, [key]: !config[key] });
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    setIsSaving(true);
    const result = await updateSaaSPlan(editingPlan.id, {
      name: editingPlan.name,
      price: parseInt(editingPlan.price),
      member_limit: parseInt(editingPlan.member_limit),
      whatsapp_limit: parseInt(editingPlan.whatsapp_limit)
    });
    
    setIsSaving(false);
    if (result?.error) {
      alert(result.error);
    } else {
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
      setEditingPlan(null);
      alert("SaaS Plan updated successfully!");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Platform Configuration</h2>
          <p className="text-slate-500">Manage SaaS plans, feature flags, and platform settings</p>
        </div>
        <Button 
          className="bg-slate-900 hover:bg-slate-800"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <ToggleRight className="h-5 w-5 text-blue-500" />
              Feature Flags
            </CardTitle>
            <CardDescription>Enable or disable beta features platform-wide</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">UPI Autopay (Beta)</h4>
                <p className="text-sm text-slate-500 max-w-sm">Allow customers to setup eMandates via Razorpay UPI Autopay.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => toggleSetting('feature_upi_autopay')}
                className={config.feature_upi_autopay ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "text-slate-500"}
              >
                {config.feature_upi_autopay ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <h4 className="font-semibold text-slate-900">Multi-branch Support</h4>
                <p className="text-sm text-slate-500 max-w-sm">Enable the multi-branch selector for enterprise customers.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => toggleSetting('feature_multi_branch')}
                className={config.feature_multi_branch ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "text-slate-500"}
              >
                {config.feature_multi_branch ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <h4 className="font-semibold text-slate-900">WhatsApp Marketing Broadcasts</h4>
                <p className="text-sm text-slate-500 max-w-sm">Allow gyms to send bulk promotional messages (costs extra).</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => toggleSetting('feature_whatsapp_marketing')}
                className={config.feature_whatsapp_marketing ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "text-slate-500"}
              >
                {config.feature_whatsapp_marketing ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-500" />
                SaaS Plan Editor
              </CardTitle>
              <CardDescription>Manage your pricing tiers and limits dynamically</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              {plans.map((plan: any) => (
                <div key={plan.id} className={`p-4 border rounded-lg ${plan.is_popular ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{plan.name}</h4>
                      <p className="text-sm text-slate-500">₹{plan.price}/month</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600"
                      onClick={() => setEditingPlan(plan)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                  <p className="text-xs text-slate-600">Limits: {plan.member_limit} Members, {plan.whatsapp_limit} WhatsApp msgs</p>
                </div>
              ))}

            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm ring-1 border-orange-200 bg-orange-50/50">
            <CardContent className="p-4 flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-orange-500 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-900">Platform Maintenance Mode</h4>
                <p className="text-sm text-orange-800 mt-1">Enabling this will lock out all gym owners from logging in while you perform database migrations. Do not use lightly.</p>
                <Button 
                  variant="outline" 
                  onClick={() => toggleSetting('maintenance_mode')}
                  className={`mt-3 ${config.maintenance_mode ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-50'}`}
                >
                  {config.maintenance_mode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit SaaS Plan</DialogTitle>
          <DialogDescription>Modify pricing and limitations for {editingPlan?.name}</DialogDescription>
        </DialogHeader>
        {editingPlan && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input 
                value={editingPlan.name} 
                onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Price (₹/month)</Label>
              <Input 
                type="number"
                value={editingPlan.price} 
                onChange={e => setEditingPlan({...editingPlan, price: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Member Limit</Label>
                <Input 
                  type="number"
                  value={editingPlan.member_limit} 
                  onChange={e => setEditingPlan({...editingPlan, member_limit: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Msg Limit</Label>
                <Input 
                  type="number"
                  value={editingPlan.whatsapp_limit} 
                  onChange={e => setEditingPlan({...editingPlan, whatsapp_limit: e.target.value})} 
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleSavePlan} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
