import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatFirebaseDate } from "@/lib/date-utils";
import { Badge } from "@/components/ui/badge";
import { Building2, ImageIcon, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SuccessStory, Issue } from "@/common/types";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface AddSuccessStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  sucessData: SuccessStory | null;
  issues: Issue[];
}

const ViewSuccessStoryModal: FC<AddSuccessStoryModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  sucessData,
  issues,
}) => {
  const getIssueTitle = (issueId: string) => {
    const issue = issues.find((i) => i.id === issueId);
    return issue?.title || "Unknown Issue";
  };

  if (!sucessData) return;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-width">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row justify-between pt-5">
              <p>{sucessData.issueTitle}</p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Completed
              </Badge>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Building2 className="w-4 h-4 mr-1" />
              {sucessData.orphanageName}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {sucessData.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Impact</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {sucessData.impact}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Related Issue</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {getIssueTitle(sucessData.issueId)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Beneficiaries:</span>
                  <span className="font-medium">
                    {sucessData.beneficiaries}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">
                    ${sucessData.cost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium">
                    {formatFirebaseDate(sucessData.completedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Timeline</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="font-medium">
                    {formatFirebaseDate(sucessData.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium">
                    {formatFirebaseDate(sucessData.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {sucessData.images && sucessData.images.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Images ({sucessData.images.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {sucessData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${sucessData.title} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}/{sucessData.images.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button variant="outline" className="flex-1" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Story
            </Button>
            <ConfirmationDialog
              title="Delete Success Story"
              description={`Are you sure you want to delete "${sucessData.title}"? This action cannot be undone.`}
              onConfirm={() => {
                onDelete(sucessData.id);
              }}
              variant="destructive"
            >
              <Button variant="destructive" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Story
              </Button>
            </ConfirmationDialog>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSuccessStoryModal;
