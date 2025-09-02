import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface AccordionItem {
  trigger: {
    label: string;
    Icon: LucideIcon;
  };
  content: string[];
}

interface IAccordionComp {
  item: AccordionItem[];
}

const AccordionComp: FC<IAccordionComp> = ({ item }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      {item.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <div className="flex flex-row items-center gap-2">
              <item.trigger.Icon size={25} className="text-main-red/50" />
              <p className="font-bold lg:text-xl 2xl:text-3xl text-main-red/80">
                {item.trigger.label}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className={"flex flex-col gap-4"}>
            {item.content.map((content, index) => (
              <p key={index} className={"text-white"}>
                {content}
              </p>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComp;
