import BudgetIcon from "@/components/icons/BudgetIcon";
import DebtIcon from "@/components/icons/DebtIcon";
import GoalsIcon from "@/components/icons/GoalsIcon";
import InsuranceIcon from "@/components/icons/InsuranceIcon";
import InvestmentIcon from "@/components/icons/InvestmentIcon";
import PlanningIcon from "@/components/icons/PlanningIcon";
import SavingIcon from "@/components/icons/SavingIcon";
import { cn } from "@/lib/utils";
import { ElementType } from "react";

type CheckItemProps = {
  Icon: ElementType;
  header: string;
  desc: string;
};

const CheckItem = ({ Icon, header, desc }: CheckItemProps) => {
  return (
    <div className="flex items-center gap-5">
      <div>
        <Icon className="size-12" />
      </div>
      <div>
        <h3 className="text-primary-main-light text-base font-medium">
          {header}
        </h3>
        <p className="text-xs">{desc}</p>
      </div>
    </div>
  );
};

const ticks = ["01", "02", "03", "04", "05"];

const TickItem = ({ bgColorClassName = "bg-white", question = "" }) => {
  return (
    <div
      className={cn(
        "border-primary-paper rounded-md border-2 px-2 py-1 text-[0.6rem]",
        bgColorClassName,
      )}
    >
      <p className="">{question}</p>
      <div className="mt-1 flex justify-between">
        {ticks.map((tick) => (
          <span
            className="border-brand-teal rounded-md border bg-white px-1 py-[3px]"
            key={tick}
          >
            {tick}
          </span>
        ))}
      </div>
      <div className="mt-1 flex justify-between">
        <div>Poor</div>
        <div>Excellent</div>
      </div>
    </div>
  );
};

const financialLevels = [
  {
    range: "30 to 35",
    name: "Financial Monk",
    meaning: "Your financial wisdom and discipline are exemplary.",
  },
  {
    range: "25 to 30",
    name: "Financial Ninja",
    meaning: "You handle money with precision and agility.",
  },
  {
    range: "20 to 25",
    name: "Financial Explorer",
    meaning:
      "You have made good progress, but there is still more to discover.",
  },
  {
    range: "15 to 20",
    name: "Financial Novice",
    meaning:
      "With dedication and learning, you can improve your financial health.",
  },
  {
    range: "10 to 15",
    name: "Financial Adventurer",
    meaning:
      "It's time to stabilize your path and focus on building a financial foundation.",
  },
  {
    range: "Below 10",
    name: "Financial Newbie",
    meaning:
      "Embrace learning and seek guidance to start building a strong financial future.",
  },
];

export default function FinancialFitness() {
  return (
    <>
      <div className="flex gap-10">
        <div className="flex max-w-[400px]">
          <section>
            <h1 className="text-2xl">Financial Fitness Checklist</h1>
            <div className="mt-4 space-y-6">
              <CheckItem
                Icon={BudgetIcon}
                header="01. Budgeting and Tracking Expenses"
                desc="Track your income and expenses to stay within the target budget thereby making informed financial decisions."
              />
              <CheckItem
                Icon={InsuranceIcon}
                header="02. Insurance Coverage"
                desc="Ensure that you have a Term & Health Insurance. Term Insurance should be at least 10 times annual income and Health Insurance at least ₹5 Lakh."
              />
              <CheckItem
                Icon={DebtIcon}
                header="03. Debt Management"
                desc="The total Debt or EMI that you pay towards a loan or credit card bills should not exceed 40% of your net monthly income"
              />
              <CheckItem
                Icon={SavingIcon}
                header="04. Emergency Funds"
                desc="To safeguard your lifestyle keep 6 times the monthly expenses in cash or liquid funds."
              />
              <CheckItem
                Icon={PlanningIcon}
                header="05. Retirement Planning"
                desc="Your retirement fund should ideally be 30 times your annual expenses."
              />
              <CheckItem
                Icon={GoalsIcon}
                header="06. Financial Goals"
                desc="Execute a systematic investment plan for any specific goal like education, marriage, travel, buying a house etc to reduce the effect of inflation."
              />
              <CheckItem
                Icon={InvestmentIcon}
                header="07. Investment Knowledge"
                desc="Updating your knowledge according to the latest technological innovation and financial regulation is also an important aspect of overall financial fitness."
              />
            </div>
            <hr className="mt-10" />
          </section>
          <div className="from-brand-teal to-primary-main-light ml-6 h-[720px] w-[5px] bg-gradient-to-b" />
        </div>
        <div>
          <h1 className="text-xl">Financial Fitness Score</h1>
          <p className="text-[0.6rem]">
            Tick a score based on your current situations.
          </p>
          <div className="mt-2 space-y-2">
            <TickItem
              bgColorClassName="bg-primary-paper"
              question="I consistently track my income and expenses and stick to a budget."
            />
            <TickItem question="I have an emergency fund that covers at least 3-6 months of living expenses." />
            <TickItem
              bgColorClassName="bg-primary-paper"
              question="I regularly make payments on my debts and avoid taking on high-interest debt."
            />
            <TickItem question="I contribute regularly to my retirement savings and have a clear plan for retirement." />
            <TickItem
              bgColorClassName="bg-primary-paper"
              question="I have adequate insurance coverage to protect myself and my assets."
            />
            <TickItem question="I understand the basics of investing and have a diversified investment portfolio." />
            <TickItem
              bgColorClassName="bg-primary-paper"
              question="I have set financial goals and am actively working towards them."
            />
            <div className="border-primary-paper text-primary-main-light rounded-md border p-1 pl-2 font-medium">
              Total Score
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium">What does your score mean?</h3>
      </div>
      <table className="text-[0.75rem]">
        <tbody>
          {financialLevels.map((level, index) => (
            <tr key={index}>
              <td className="text-primary-main-light pt-1 pr-1">
                {level.range}
              </td>
              <td className="text-primary-main-light pr-3">{level.name}</td>
              <td>{level.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
