import { ArrowUpRight, Target } from "lucide-react";
import Link from "next/link";

/**
 * Custom basket builder card component
 * Highlighted CTA card with gradient styling
 * Navigates to custom basket builder page
 */
export function CustomBasketBuilderCard() {
  return (
    <Link href="/discover/create-basket" className="block">
      <div className="relative bg-gradient-to-r from-brand-gradient-from via-brand-gradient-via to-brand-gradient-to border-2 border-transparent bg-clip-padding rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 active:scale-[0.98] group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-border-from via-brand-border-via to-brand-border-to rounded-xl -z-10 opacity-60"></div>
        <div className="bg-bg-card rounded-xl p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-info-icon-bg to-brand-gradient-to rounded-lg flex items-center justify-center group-hover:from-info-border group-hover:to-brand-border-via transition-colors">
                <Target className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <h3 className="text-text-primary font-medium">
                  Create Custom Basket
                </h3>
                <p className="text-text-secondary text-sm">
                  Build personalized investment portfolios
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-accent-purple transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
