import Link from "next/link";

const BrandBlock = ({ compact = false }) => (
  <div style={{ display: "flex", alignItems: compact ? "center" : "flex-start", gap: compact ? 12 : 14 }}>
    <div>
      <h4 className={compact ? "text-xl mb-0" : "text-2xl mb-2"}>AthenaX</h4>
      {!compact && (
        <p className="text-sm max-w-xs" style={{ color: "#6B6B7A", lineHeight: 1.65, margin: 0 }}>
          Powered by{" "}
          <Link href="https://nouns.wtf" target="_blank" rel="noopener noreferrer">
            <img
              src="https://athenax.mypinx.store/Noggles.png"
              alt="Noggles Logo"
              width={100}
              height={70}
              className="inline-block mb-1 ml-1 h-4 w-auto"
            />
          </Link>
          <br />
          Building public goods on Ethereum.
        </p>
      )}
    </div>
  </div>
);

export default BrandBlock;
