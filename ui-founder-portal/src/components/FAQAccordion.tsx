import { useState } from 'react';
import type { FAQCategory } from '../data/faq';

interface FAQAccordionProps {
  categories: FAQCategory[];
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-light-gray">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-4 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="font-sans font-medium text-navy pr-4 group-hover:text-gold transition-colors">
          {question}
        </span>
        <span className="text-medium-gray flex-shrink-0 mt-0.5 text-lg leading-none">
          {open ? '\u2212' : '+'}
        </span>
      </button>
      {open && (
        <div className="pb-4 pr-8 text-dark-text font-sans leading-relaxed text-[15px]">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQAccordion({ categories }: FAQAccordionProps) {
  return (
    <div className="space-y-10">
      {categories.map((cat) => (
        <section key={cat.title}>
          <h3 className="font-serif text-xl text-navy mb-4 uppercase tracking-wide">{cat.title}</h3>
          <div>
            {cat.items.map((item) => (
              <AccordionItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
