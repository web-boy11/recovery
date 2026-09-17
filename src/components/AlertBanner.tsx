export default function AlertBanner() {
  return (
    <div className="bg-[#fff3cd] text-[#664d03]">
      <div className="mx-auto flex max-w-7xl items-start gap-3 border-b border-[#ffecb5] px-4 py-3">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#664d03]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
        <div className="text-sm">
          <span className="font-bold uppercase tracking-wide">Critical Advisory:</span>{" "}
          If you have been asked to pay fees, taxes, or "recovery charges" via wire
          transfer, gift cards, or cryptocurrency before receiving recovered funds,
          you are being targeted in a <em>secondary scam</em>. The FBI does not charge
          victims for fund recovery.{" "}
          <a href="#faq" className="font-semibold text-[#664d03] underline">
            Learn more
          </a>
          .
        </div>
      </div>
    </div>
  );
}
