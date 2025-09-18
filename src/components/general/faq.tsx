import { FC, ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  id: string;
  question: string;
  answer: string | ReactNode;
}

interface FAQProps {
  items: FAQItem[];
  className?: string;
  allowMultiple?: boolean;
  defaultValue?: string | string[];
}

const FAQ: FC<FAQProps> = ({
  items,
  className = "w-full",
  allowMultiple = false,
  defaultValue,
}) => {
  if (allowMultiple) {
    // For multiple accordion, defaultValue should be an array
    const multipleDefaultValue = Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
      ? [defaultValue]
      : undefined;

    return (
      <Accordion
        type="multiple"
        className={className}
        defaultValue={multipleDefaultValue}
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="2xl:text-lg text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              {typeof item.answer === "string" ? (
                <p className="2xl:text-lg text-balance">{item.answer}</p>
              ) : (
                item.answer
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  // For single accordion, defaultValue should be a string
  const singleDefaultValue = Array.isArray(defaultValue)
    ? defaultValue[0]
    : defaultValue;

  return (
    <Accordion
      type="single"
      collapsible
      className={className}
      defaultValue={singleDefaultValue}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="2xl:text-lg text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-300">
            {typeof item.answer === "string" ? (
              <p className="2xl:text-lg text-balance">{item.answer}</p>
            ) : (
              item.answer
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQ;
export type { FAQItem, FAQProps };
