'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Mail, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Trainer' | 'Receptionist' | 'Admin';
  status: 'Active' | 'Invited';
}

const initialStaff: StaffMember[] = [
  { id: '1', name: 'Vikram Singh', email: 'vikram.trainer@example.com', role: 'Trainer', status: 'Active' },
  { id: '2', name: 'Sneha Rao', email: 'sneha.desk@example.com', role: 'Receptionist', status: 'Active' },
  { id: '3', name: 'Rohan Desai', email: 'rohan.d@example.com', role: 'Trainer', status: 'Invited' },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Trainer' });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email) return;
    
    const member: StaffMember = {
      id: Math.random().toString(),
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role as 'Trainer' | 'Receptionist' | 'Admin',
      status: 'Invited',
    };
    
    setStaff([member, ...staff]);
    setNewStaff({ name: '', email: '', role: 'Trainer' });
    setIsAddOpen(false);
    alert(`Invitation sent to ${member.email}`);
  };

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 text-sm">Manage access for your trainers and receptionists.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700" />}>
            <Plus className="mr-2 h-4 w-4" /> Invite Staff
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a new team member</DialogTitle>
              <DialogDescription>
                They will receive an email with instructions to log in.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. John Doe" 
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role / Permissions</Label>
                <select 
                  id="role"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                >
                  <option value="Trainer">Trainer (Can view members, mark attendance)</option>
                  <option value="Receptionist">Receptionist (Can add members, collect payments)</option>
                  <option value="Admin">Admin (Full access)</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStaff} className="bg-blue-600 hover:bg-blue-700">Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{staff.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{staff.filter(s => s.status === 'Invited').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-gray-900">
                      {s.name}
                    </TableCell>
                    <TableCell className="text-gray-500">{s.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={s.role === 'Admin' ? 'border-red-200 text-red-700 bg-red-50' : 'bg-gray-50'}>
                        {s.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {s.status === 'Active' 
                        ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge> 
                        : <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Invited</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {s.role !== 'Admin' && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemove(s.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
