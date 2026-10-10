import type { ChoiceOption } from "./types";

type SingleChoiceProps = {
  options: ChoiceOption[];
  value?: string;
  onChange?: (value: string) => void;
};

export function SingleChoice({ options, value, onChange }: SingleChoiceProps) {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-2.5">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange?.(option.value)}
            className={`group flex min-h-14 cursor-pointer items-center justify-between gap-5 rounded-[1rem] border px-5 py-3 text-left transition ${
              selected
                ? "border-[#c99aaa] bg-gradient-to-r from-[#f8e8ee] via-[#fbf7fb] to-[#eef5f9] shadow-[0_9px_25px_rgba(106,76,89,0.08)]"
                : "border-black/[0.065] bg-white/65 hover:border-[#d6bac4] hover:bg-white"
            }`}
          >
            <span>
              <strong className="block text-[13px] font-normal text-[#51494a]">{option.label}</strong>
              {option.description ? <span className="mt-1 block text-[10px] font-normal text-[#a1989a]">{option.description}</span> : null}
            </span>
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${selected ? "border-[#bd839a] bg-[#bd839a]" : "border-[#d8d0d1] bg-white"}`}>
              {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type MultiChoiceProps = {
  options: ChoiceOption[];
  values: string[];
  onChange?: (values: string[]) => void;
  columns?: 2 | 3 | 4;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function MultiChoice({ options, values, onChange, columns = 3 }: MultiChoiceProps) {
  function toggle(value: string) {
    onChange?.(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  return (
    <div className={`mx-auto grid w-full max-w-4xl gap-3 ${columnClasses[columns]}`}>
      {options.map((option) => {
        const selected = values.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option.value)}
            className={`min-h-24 cursor-pointer rounded-[1.2rem] border p-4 text-left transition ${
              selected
                ? "border-[#c79baa] bg-gradient-to-br from-[#f7e4eb] to-[#eeeaf6] shadow-[0_10px_28px_rgba(106,76,89,0.08)]"
                : "border-black/[0.06] bg-white/65 hover:-translate-y-0.5 hover:border-[#d8bdc6] hover:bg-white"
            }`}
          >
            <span className="flex items-start justify-between gap-4">
              <span>
                <strong className="block text-[13px] font-normal text-[#51494a]">{option.label}</strong>
                {option.description ? <span className="mt-2 block text-[10px] font-normal leading-4 text-[#a1989a]">{option.description}</span> : null}
              </span>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[10px] ${selected ? "border-[#bd839a] bg-[#bd839a] text-white" : "border-[#d8d0d1]"}`}>{selected ? "✓" : ""}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

type TextAnswerProps = {
  defaultValue?: string;
  onBlur?: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
};

export function TextAnswer({ defaultValue, onBlur, placeholder, multiline = false }: TextAnswerProps) {
  const sharedClassName = "w-full rounded-[1.15rem] border border-black/[0.07] bg-white/70 px-5 py-4 text-[13px] font-normal leading-6 text-[#51494a] shadow-sm outline-none transition placeholder:text-[#b8afb1] focus:border-[#c69aaa] focus:bg-white focus:ring-4 focus:ring-[#ead9e0]/45";

  return multiline ? (
    <textarea defaultValue={defaultValue} onBlur={(event) => onBlur?.(event.target.value)} placeholder={placeholder} rows={4} className={`${sharedClassName} resize-none`} />
  ) : (
    <input defaultValue={defaultValue} onBlur={(event) => onBlur?.(event.target.value)} placeholder={placeholder} className={sharedClassName} />
  );
}
