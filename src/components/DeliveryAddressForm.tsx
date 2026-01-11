'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DeliveryAddressFormProps {
  address: string;
  setAddress: (address: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function DeliveryAddressForm({ address, setAddress, notes, setNotes }: DeliveryAddressFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">Delivery Address *</Label>
        <Textarea
          id="address"
          placeholder="Enter your full delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="notes">Delivery Notes (optional)</Label>
        <Input
          id="notes"
          placeholder="e.g., Ring doorbell, leave at door"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
