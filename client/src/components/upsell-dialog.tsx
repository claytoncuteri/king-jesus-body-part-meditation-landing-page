import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

// 5-pointed star SVG component for buttons (white outline, no fill)
function ButtonStar({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        fill="none"
        stroke="white" 
        strokeWidth="2"
      />
    </svg>
  );
}

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
              <ButtonStar className="w-8 h-8 text-primary" />
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
            <ButtonStar className="w-5 h-5 mr-2" />
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
