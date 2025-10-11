import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Heart, Clock } from "lucide-react";

interface UpsellDialogProps {
  open: boolean;
  onSelectDonation: (amount: number) => void;
  onDecline: () => void;
  isProcessing?: boolean;
}

export function UpsellDialog({ open, onSelectDonation, onDecline, isProcessing = false }: UpsellDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md sm:max-w-lg">
        <AlertDialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl sm:text-2xl">
            Wait! Your purchase has not completed yet
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-center text-sm sm:text-base space-y-2">
              <p className="font-semibold text-foreground">
                Would you like to add a $9 donation to support the Church of King Jesus?
              </p>
              <p className="text-sm text-muted-foreground">
                Your contribution helps spread divine consciousness and support our global peace mission.
              </p>
              <p className="text-xs text-muted-foreground italic">
                100% of proceeds go directly to building the Church of King Jesus
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-2 my-4">
          {/* Primary CTA - Add $9 Donation */}
          <Button
            variant="destructive"
            size="default"
            className="w-full text-base sm:text-lg font-bold shadow-xl hover:shadow-primary/50 transition-all animate-pulse"
            onClick={() => onSelectDonation(9)}
            disabled={isProcessing}
            data-testid="button-add-donation"
          >
            <Heart className="w-5 h-5 mr-2 fill-current" />
            Yes! Add $9 Donation ($13.95 total)
          </Button>

          {/* Secondary CTA - No Thanks */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            onClick={onDecline}
            disabled={isProcessing}
            data-testid="button-no-thanks"
          >
            {isProcessing ? "Processing..." : "No thanks, continue with $4.95 purchase"}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          This offer expires after checkout
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
}
