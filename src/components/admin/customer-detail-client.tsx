'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, Users, IndianRupee, Calendar, ExternalLink, Save, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomerDetailClient({ business, members, initialNotes, notesError }: { business: any, members: any[], initialNotes: any[], notesError: boolean }) {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Calculate stats
  const activeMembers = members.filter(m => m.status === 'Active');
  
  let mrr = 0;
  activeMembers.forEach(member => {
    let mrrMultiplier = 1;
    const cycle = member.billing_cycle?.toLowerCase() || 'monthly';
    const fee = member.fee_amount || 0;
    if (cycle.includes('3 month') || cycle.includes('quarterly')) mrrMultiplier = 1 / 3;
    else if (cycle.includes('6 month')) mrrMultiplier = 1 / 6;
    else if (cycle.includes('year') || cycle.includes('12 month')) mrrMultiplier = 1 / 12;
    else if (cycle.includes('week')) mrrMultiplier = 4;
    mrr += (fee * mrrMultiplier);
  });

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);
    const supabase = createClient();
    
    // We assume the user has created the admin_notes table!
    const { data, error } = await supabase
      .from('admin_notes')
      .insert([
        { business_id: business.id, note_text: newNote }
      ])
      .select()
      .single();

    if (error) {
      alert("Failed to save note. Did you run the SQL script to create the admin_notes table? Error: " + error.message);
    } else if (data) {
      setNotes([data, ...notes]);
      setNewNote('');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{business.name || 'Unnamed Business'}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 font-mono">
              <span>ID: {business.id}</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700">
            <ExternalLink className="mr-2 h-4 w-4" /> Impersonate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Users className="h-5 w-5 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800">{activeMembers.length}</span>
                <span className="text-xs text-slate-500">Active Members</span>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <IndianRupee className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800">₹{Math.round(mrr).toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-500">Volume MRR</span>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Calendar className="h-5 w-5 text-orange-500 mb-2" />
                <span className="text-base font-bold text-slate-800 mt-1">
                  {new Date(business.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
                <span className="text-xs text-slate-500">Joined Date</span>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-slate-900 text-white">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Building2 className="h-5 w-5 text-slate-400 mb-2" />
                <span className="text-2xl font-bold text-white">Free</span>
                <span className="text-xs text-slate-400">Current Plan</span>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline (Mock) */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div className="w-px h-full bg-slate-200 my-1"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Account Created</p>
                    <p className="text-xs text-slate-500">{new Date(business.created_at).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: CRM Notes */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                Internal CRM Notes
              </CardTitle>
              <CardDescription>Private notes visible only to Super Admins</CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 flex-1 flex flex-col">
              {notesError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 border border-red-100 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p><strong>Database missing:</strong> The <code>admin_notes</code> table has not been created in Supabase yet. Please run the SQL script to enable notes.</p>
                </div>
              )}

              <div className="space-y-3 mb-6 flex-1 overflow-y-auto min-h-[200px]">
                {notes.length === 0 ? (
                  <p className="text-sm text-slate-400 italic text-center py-8">No notes added yet.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-yellow-50/50 border border-yellow-100 p-3 rounded-lg text-sm">
                      <p className="text-slate-800 whitespace-pre-wrap">{note.note_text}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        {new Date(note.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto border-t border-slate-100 pt-4">
                <Textarea 
                  placeholder="Type an internal note about this business..." 
                  className="resize-none min-h-[100px] mb-3 text-sm"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  disabled={notesError}
                />
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800" 
                  onClick={handleSaveNote}
                  disabled={!newNote.trim() || isSaving || notesError}
                >
                  <Save className="mr-2 h-4 w-4" /> 
                  {isSaving ? 'Saving...' : 'Save Note'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
