import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface UpsellDialogProps {
  open: boolean;
  onSelectDonation: (amount: number) => void;
  onDecline: () => void;
}

const donationAmounts = [5, 10, 15, 25, 100, 200];

export function UpsellDialog({ open, onSelectDonation, onDecline }: UpsellDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            Wait! Before We Complete Your Purchase...
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Would you like to add a donation to King Jesus Church? Your contribution helps us spread divine consciousness and support our ministry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid grid-cols-3 gap-3 my-6">
          {donationAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="h-16 text-lg font-semibold"
              onClick={() => onSelectDonation(amount)}
              data-testid={`button-donate-${amount}`}
            >
              ${amount}
            </Button>
          ))}
        </div>

        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          <AlertDialogAction
            className="w-full"
            onClick={onDecline}
            data-testid="button-no-thanks"
          >
            No Thanks, Complete Purchase
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
