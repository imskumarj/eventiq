import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye } from 'lucide-react';

const sponsorsData = [
  { id: 1, name: 'TechCorp Global', event: 'Tech Summit 2025', amount: 50000, boothVisits: 1240, leads: 89, roi: 340, status: 'Active' },
  { id: 2, name: 'DataFlow Systems', event: 'Data Conference', amount: 35000, boothVisits: 890, leads: 56, roi: 280, status: 'Active' },
  { id: 3, name: 'CloudAI Solutions', event: 'AI Expo Global', amount: 75000, boothVisits: 2100, leads: 142, roi: 420, status: 'Active' },
  { id: 4, name: 'NetSys Inc', event: 'DevOps World', amount: 25000, boothVisits: 560, leads: 34, roi: 190, status: 'Pending' },
  { id: 5, name: 'DevHub Platform', event: 'Cloud Innovation Forum', amount: 45000, boothVisits: 1100, leads: 78, roi: 310, status: 'Active' },
  { id: 6, name: 'ByteInc', event: 'Cybersecurity Week', amount: 30000, boothVisits: 750, leads: 48, roi: 260, status: 'Completed' },
];

export default function Sponsors() {
  const [search, setSearch] = useState('');

  const filtered = sponsorsData.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.event.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    if (status === 'Active') return 'bg-success/10 text-success';
    if (status === 'Pending') return 'bg-warning/10 text-warning';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sponsors</h1>
          <p className="text-muted-foreground text-sm mt-1">Track sponsor performance and ROI</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-accent text-accent-foreground hover:opacity-90"><Plus className="w-4 h-4" /> Add Sponsor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add New Sponsor</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Sponsor Name</Label><Input placeholder="Company name" /></div>
              <div className="space-y-2"><Label>Associated Event</Label><Input placeholder="Select event" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Sponsorship Amount</Label><Input type="number" placeholder="50000" /></div>
                <div className="space-y-2"><Label>Tier</Label><Input placeholder="Gold / Silver / Bronze" /></div>
              </div>
              <Button className="w-full gradient-accent text-accent-foreground hover:opacity-90">Add Sponsor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search sponsors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Sponsor</TableHead>
                <TableHead className="font-semibold">Event</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold text-right">Booth Visits</TableHead>
                <TableHead className="font-semibold text-right">Leads</TableHead>
                <TableHead className="font-semibold text-right">ROI</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sponsor) => (
                <TableRow key={sponsor.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">{sponsor.name}</TableCell>
                  <TableCell className="text-muted-foreground">{sponsor.event}</TableCell>
                  <TableCell className="text-right font-medium">${sponsor.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{sponsor.boothVisits.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{sponsor.leads}</TableCell>
                  <TableCell className="text-right font-semibold text-success">{sponsor.roi}%</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className={getStatusStyle(sponsor.status)}>{sponsor.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}
