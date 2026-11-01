import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import { ScientificCluster } from "../ScientificCluster";
import { useOnboarding } from "../OnboardingContext";
import { ShieldCheckIcon, ArrowRight, ArrowUpRight, Smile } from "lucide-react";


export function Inital() {
  const { currentStep, setCurrentStep } = useOnboarding();

  return (
    <ProtectedRoute>
      <div className="px-16  flex flex-col min-h-screen gap-6">
        <div className="grid grid-cols-2 items-start gap-12 pt-36">
          <div className="flex flex-col gap-12">
            <Header />
            <DermatologistNotice />
          </div>
          <div className="bg-peach rounded-2xl w-full min-w-0 flex flex-col gap-2">
            <div className="w-128 self-center py-6">
              <ScientificCluster />
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-tertiary" />
        <ContinueOnboarding
          nextPage={() => setCurrentStep((prev) => prev + 1)}
        />
      </div>
    </ProtectedRoute>
  );
}


function DermatologistNotice() {
  return (
    <div className="bg-charcoal text-white p-4 rounded-2xl flex flex-col gap-4">
      <div>
        <div className="w-full flex items-center justify-between gap-2">
          <div
            className="text-xs text-green-300 flex items-center gap-2 w-fit uppercase 
                tracking-widest rounded-lg"
          >
            <ShieldCheckIcon className="w-6 h-6" strokeWidth={2.0} />
            Important note on your care
          </div>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-col gap-4 items-left">
        <h2 className="font-bold text-lg">Your dermatologist comes first.</h2>
        <p className="text-xs text-tertiary max-w-3xl">
          Following a dermatologist's advice or using prescribed treatments? Let
          us know. Aurelia is designed to complement your care, never replace or
          interfere with it.
        </p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="tracking-widest text-deep-champagne uppercase text-sm">
        Questions
      </p>
      <h1 className="pt-2 flex gap-2 items-center text-4xl font-medium">
        It's Great to see You join us <Smile className="w-8 h-8" />
      </h1>
      <p className="pt-2 w-2xl text-secondary">
        Here we will ask you a couple of questions regarding your skin, current
        routine, preferred products or products that definitely are out of the
        question.
      </p>
    </div>
  );
}

function ContinueOnboarding({nextPage}: {nextPage: () => void}) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col gap-2 items-left">
        <h1 className="text-4xl font-medium">A little about the Process</h1>
        <p className="text-md text-secondary">Aurelia will ask you a couple of questions about your skin, regarding 
          how dry it feels after cleansing, how it feels during the midday, whether you have any particular concerns to target 
          and your preferences regarding the cosmetics consistency, ingredients whilst including your dermatologist advice. 
        </p>
        <p className="tracking-widest uppercase text-deep-champagne">estmiated completion time: 5 - 10 minutes</p>
        <button 
        onClick={nextPage}
        className="mt-2 
        cursor-pointer
        w-fit flex gap-2 items-center bg-charcoal text-white rounded-2xl px-4 py-1">
          Continue to questions
          <ArrowRight className=" h-8 w-8" strokeWidth={1.0} />
        </button>
      </div>
    </div>
  );
}

