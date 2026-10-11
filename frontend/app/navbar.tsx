import Link from "next/link";

export function Navbar() {
  return (
    <header className="relative z-20 mx-auto mt-4 flex min-h-[4.5rem] w-[calc(100%-1.5rem)] max-w-[1460px] items-center justify-between rounded-[1.35rem] border border-white/[0.08] bg-[#202022] px-5 shadow-[0_18px_45px_rgba(32,24,27,0.22)] backdrop-blur-xl sm:w-[calc(100%-3rem)] sm:px-7">
      <a
        href="#top"
        className="text-xl font-bold tracking-[-0.06em] text-[#fffdfb]"
        aria-label="BeautyMaker home"
      >
        BeautyMaker
        <span className="ml-1 align-top text-sm text-[var(--accent)]">✦</span>
      </a>
      <nav
        className="hidden items-center gap-9 text-[12px] font-normal text-[#d8d0d1] md:flex"
        aria-label="Main navigation"
      >
        <NavLink href={"how"} tag={"How it Works"} />
        <NavLink href={"personality"} tag={"Conversation modes"} />
        <NavLink href={"care"} tag={"Our promise"} />
      </nav>
      {/* <Link
        href="/questionnaire"
        className="rounded-[0.9rem] border border-[#c6999d]/70 bg-[#aa7c80] px-4 py-3 text-[11px] font-medium text-white shadow-[0_8px_22px_rgba(150,101,110,0.2)] transition hover:-translate-y-0.5 hover:bg-[#bd8a90] sm:px-5"
      >
        <span className="sm:hidden">Start</span>
        <span className="hidden sm:inline">Start your skin story</span>
      </Link> */}
      <div className="flex gap-4">
        <HeaderActionLink href={"/questionnaire"} tag={"Start your skin story"} smallTag={"Start"} variant={"primary"}/>
        <HeaderActionLink href={"/login"} tag={"Login to your account"} variant={"secondary"}/>
      </div>
    </header>
  );
}

function HeaderActionLink({href, tag, smallTag, variant}: Readonly<{href: string, tag: string, smallTag?: string, variant: "primary" | "secondary"}>)
{
  return (

    (<Link href={href}
    className={`
      rounded-[0.9rem]
      border  px-4 py-3 text-[11px]
      font-medium sm:px-5 transition  
      duration-200
      ${variant === "primary" ? "border-[#c6999d]/70 bg-[#aa7c80]  text-white shadow-[0_8px_22px_rgba(150,101,110,0.2)] hover:bg-[#bd8a90]" 
        : "border-white text-black bg-white hover:bg-white/95 "}
      `}
    >
      <span className="sm:hidden">{smallTag}</span>
      <span className="hidden sm:inline">{tag}</span>
    </Link>)

  );
}

function NavLink({ href, tag }: Readonly<{ href: string; tag: string }>) {
  return (
    <a
      className="p-2 scroll-smooth rounded-xl transition hover:text-black hover:bg-white duration-300 font-medium"
      href={`#${href}`}
    >
      {tag}
    </a>
  );
}
