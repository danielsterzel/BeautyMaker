import {
  ArrowRight,
  Camera,
  ChartColumn,
  CircleStar,
  FlaskConical,
  Heart,
  Layers,
  Sparkle,
} from "lucide-react";

export function Purpose() {
  return (
    <div className="px-8 h-[65vh] w-full">
      <div
        className="
        select-none
        grid grid-cols-[1fr_1fr]  items-center"
      >
        <div>
          <Header />

          <div className="flex flex-col gap-3">
            <div className="group bg-peach/50  hover:bg-peach tranistion-colors duration-300
             p-3 rounded-lg flex gap-10 items-center ">
              <div className="bg-offwhite rounded-lg p-2">
                <Layers
                  className="transitioon-colors duration-300
                w-10 h-10 text-tertiary group-hover:text-honey"
                  strokeWidth={1.0}
                />
              </div>

              <Goal
                title="Personalized and evolving"
                text="Recommendations adjust to your skin's responses, goals and
              tolerance."
              />
            </div>
            <div className="group bg-peach/50  hover:bg-peach tranistion-colors duration-300
             p-3 rounded-lg flex gap-10 items-center ">
              <div className="bg-offwhite rounded-lg p-2">
                <FlaskConical
                  className="transitioon-colors duration-300
                w-10 h-10 text-tertiary group-hover:text-honey"
                  strokeWidth={1.0}
                />
              </div>
              <Goal
                title="Evidence-based and transparent"
                text="Explore ingredients, see how they interact and follow
          experiments with clear, data-informed insights"
              />
            </div>
            <div
              className="group bg-peach/50 hover:bg-peach tranistion-colors duration-300
             p-3 rounded-lg flex gap-10 items-center "
            >
              <div className="bg-offwhite rounded-lg p-2 ">
                <Heart
                  className="
                transitioon-colors duration-300
                w-10 h-10 text-tertiary group-hover:text-honey"
                  strokeWidth={1.0}
                />
              </div>
              <Goal
                title="A supportive approach"
                text="We focus on healthy, realistic progress and aim to
          reduce the risk of body dysmorphia and unrealistic expectations"
              />
            </div>
          </div>
        </div>
        <div className="relative flex flex-col items-center">some images</div>
      </div>

      <div className="p-12">
        <div className="bg-tertiary h-px w-full" />

        <div className="py-12 flex items-start gap-10">
          <p className="text-sm text-secondary uppercase tracking-widest whitespace-nowrap shrink-0 self-center">
            THE PROGRESS OVER TIME
          </p>
          {/* Step 1 */}
          <div className="flex flex-1 min-w-0 gap-3 items-start">
            <Camera
              className="w-8 h-8 shrink-0 text-secondary"
              strokeWidth={1}
            />
            <div className="flex flex-col gap-1">
              <h4 className="text-md font-medium">1. Add a photo</h4>
              <p className="text-xs text-secondary">
                Check your skin and set a baseline.
              </p>
            </div>
          </div>

          <ArrowRight
            className="w-8 h-8 shrink-0 self-center text-secondary"
            strokeWidth={1}
          />

          {/* Step 2 */}
          <div className="flex flex-1 min-w-0 gap-3 items-start">
            <FlaskConical
              className="w-8 h-8 shrink-0 text-secondary"
              strokeWidth={1}
            />
            <div className="flex flex-col gap-1">
              <h4 className="text-md font-medium">2. Run an experiment</h4>
              <p className="text-xs text-secondary">
                Introduce a change, e.g. a new ingredient or concentration.
              </p>
            </div>
          </div>

          <ArrowRight
            className="w-8 h-8 shrink-0 self-center text-secondary"
            strokeWidth={1}
          />

          {/* Step 3 */}
          <div className="flex flex-1 min-w-0 gap-3 items-start">
            <ChartColumn
              className="w-8 h-8 shrink-0 text-secondary"
              strokeWidth={1}
            />
            <div className="flex flex-col gap-1">
              <h4 className="text-md font-medium">3. Track your progress</h4>
              <p className="text-xs text-secondary">
                See how your skin responds over time.
              </p>
            </div>
          </div>

          <ArrowRight
            className="w-8 h-8 shrink-0 self-center text-secondary"
            strokeWidth={1}
          />

          {/* Step 4 */}
          <div className="flex flex-1 min-w-0 gap-3 items-start">
            <Sparkle
              className="w-8 h-8 shrink-0 text-secondary"
              strokeWidth={1}
            />
            <div className="flex flex-col gap-1">
              <h4 className="text-md font-medium">4. Get updated guidance</h4>
              <p className="text-xs text-secondary">
                Recommendations evolve based on your results and goals.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-tertiary h-px w-full" />
      </div>
    </div>
  );
}

function Goal({ title, text }: Readonly<{ title: string; text: string }>) {
  return (
    <div className="flex flex-col gap-0">
      <h2 className="text-lg ">{title}</h2>
      <p className="text-secondary text-xs">{text}</p>
    </div>
  );
}

function Header() {
  return (
    <div className="py-14 flex flex-col gap-2 items-left">
      <div
        className="text-sm tracking-widest uppercase
            text-honey
            flex gap-2 items-center
            "
      >
        Our purpose
      </div>
      <h1 className="text-5xl max-w-xl">Long term Skincare</h1>
      <p className="text-secondary text-lg max-w-xl">
        Aurelia helps you understand your skin, build an effective routine and
        refine it over time - through real feedback, not guesswork
      </p>
    </div>
  );
}
