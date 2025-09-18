import { FC } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

interface IImpactCard {
  Icon: LucideIcon;
  label: string;
  content: string;
}

const ImpactCard: FC<IImpactCard> = ({ Icon, label, content }) => {
  return (
    <Card className="p-4 rounded-lg bg-gray-50/50 shadow-md space-y-5 border-none">
      <div className="bg-main-red/10 dark:bg-green-900/20 rounded-2xl w-fit p-4">
        <Icon size={20} className="text-main-red" />
      </div>
      <div className={"space-y-3"}>
        <p className={"font-bold text-lg lg:text-xl 2xl:text-2xl"}>{label}</p>
        <p className={"font-light text-sm lg:text-base 2xl:text-lg"}>
          {content}
        </p>
      </div>
    </Card>
  );
};

export default ImpactCard;
