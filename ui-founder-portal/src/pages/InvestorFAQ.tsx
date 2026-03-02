import PageHeader from '../components/PageHeader';
import FAQAccordion from '../components/FAQAccordion';
import { faqCategories } from '../data/faq';

export default function InvestorFAQ() {
  return (
    <div>
      <PageHeader title="Investor FAQ" subtitle="20 questions across 7 categories" />
      <FAQAccordion categories={faqCategories} />
    </div>
  );
}
