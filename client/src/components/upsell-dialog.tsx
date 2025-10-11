import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";

interface UpsellDialogProps {
  open: boolean;
  onSelectDonation: (amount: number) => void;
  onDecline: () => void;
  isProcessing?: boolean;
}

export function UpsellDialog({ open, onSelectDonation, onDecline, isProcessing = false }: UpsellDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-10 h-10 text-primary fill-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl md:text-3xl">
            Special One-Time Offer!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base md:text-lg space-y-3">
            <p className="font-semibold text-foreground">
              Support King Jesus Church with a $9 donation and receive an <span className="text-primary">exclusive bonus</span>:
            </p>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="font-bold text-primary">Extended Guided Meditation Audio</p>
              </div>
              <p className="text-sm text-muted-foreground">
                45-minute deep prosperity consciousness activation (Value: $19.99)
              </p>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Your contribution helps spread divine consciousness and support our global peace mission.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3 my-6">
          {/* Primary CTA - Add $9 Donation */}
          <Button
            variant="destructive"
            size="lg"
            className="w-full h-16 text-lg md:text-xl font-bold shadow-2xl hover:shadow-primary/50 transition-all animate-pulse"
            onClick={() => onSelectDonation(9)}
            disabled={isProcessing}
            data-testid="button-add-donation"
          >
            <Heart className="w-6 h-6 mr-2 fill-current" />
            Yes! Add $9 Donation & Get Bonus ($13.95 total)
          </Button>

          {/* Secondary CTA - No Thanks */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            onClick={onDecline}
            disabled={isProcessing}
            data-testid="button-no-thanks"
          >
            {isProcessing ? "Processing..." : "No thanks, continue with $4.95 purchase"}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          ⏰ This offer expires after checkout • Only available for today's buyers
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
}
