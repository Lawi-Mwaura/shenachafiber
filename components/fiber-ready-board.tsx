import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

type FiberReadyBoardProps = {
  compact?: boolean;
};

export function FiberReadyBoard({ compact = false }: FiberReadyBoardProps) {
  return (
    <section
      className={compact ? "fiber-ready-section is-compact" : "fiber-ready-section"}
      aria-labelledby={compact ? "fiber-ready-title-service" : "fiber-ready-title-home"}
    >
      <a
        className="fiber-ready-board-visual"
        href="/fiber-ready-board.pdf"
        target="_blank"
        rel="noreferrer"
        aria-label="Open the Shenacha internet-fibre-ready premises board as a PDF"
      >
        <Image
          src="/images/fiber-ready-board.avif"
          alt="Shenacha Fiber Solutions board displayed at internet-fibre-ready premises"
          width={860}
          height={1216}
          sizes="(max-width: 760px) 88vw, 390px"
        />
      </a>

      <div className="fiber-ready-board-copy">
        <p className="eyebrow">LOOK FOR THIS BOARD</p>
        <h2 id={compact ? "fiber-ready-title-service" : "fiber-ready-title-home"}>
          How to know your building is internet-ready.
        </h2>
        <p className="fiber-ready-lede">
          If you see this Shenacha board at your premises, the building has been marked as internet-fibre ready. Share the building name and your unit details so the team can confirm the connection available to you.
        </p>

        <ol className="fiber-ready-steps" aria-label="What to do when you see the board">
          <li><span>01</span><strong>Spot the Shenacha board at the premises</strong></li>
          <li><span>02</span><strong>Share the building name, area and apartment</strong></li>
          <li><span>03</span><strong>We confirm the connection and next step</strong></li>
        </ol>

        <div className="fiber-ready-actions">
          <a className="fiber-ready-pdf-link" href="/fiber-ready-board.pdf" target="_blank" rel="noreferrer">
            View the full board <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
