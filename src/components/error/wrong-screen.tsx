"use client";

import { FC } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface IWrongPage {
  onNavigate: () => void;
  btnLoading: boolean;
}

export const WrongPage: FC<IWrongPage> = ({ onNavigate, btnLoading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* Reason */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">Access Denied</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            You do not have access to this screen!
          </h2>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-lg">
          The page you&apos;re trying to access is restricted.You do not have
          the right permissions to access it.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={onNavigate}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            {btnLoading ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            {btnLoading ? "Redirecting..." : "Redirect"}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
};
