import Image from "next/image";

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
        className="fiber-ready-board-visual full-poster"
        href="/images/fiber-ready-board.png"
        target="_blank"
        rel="noreferrer"
        aria-label="Open the complete Shenacha internet-fibre-ready premises poster"
      >
        <Image
          src="/images/fiber-ready-board.png"
          alt="Complete Shenacha Fiber Solutions internet-fibre-ready premises poster"
          width={1324}
          height={1872}
          sizes="(max-width: 760px) 88vw, 390px"
        />
      </a>

      <div className="fiber-ready-board-copy">
        <p className="eyebrow">LOOK FOR THIS BOARD</p>
        <h2 id={compact ? "fiber-ready-title-service" : "fiber-ready-title-home"}>
          How to know your building is internet-ready.
        </h2>
        <p className="fiber-ready-lede">
          If you see this Shenacha board at your premises, share the building name and unit details so the team can manually confirm the connection available to you. Availability and timing are confirmed by the team.
        </p>

        <ol className="fiber-ready-steps" aria-label="What to do when you see the board">
          <li><span>01</span><strong>Spot the Shenacha board at the premises</strong></li>
          <li><span>02</span><strong>Share the building name, area and apartment</strong></li>
          <li><span>03</span><strong>We confirm the connection and next step</strong></li>
        </ol>

        <div className="fiber-ready-actions"><a className="fiber-ready-pdf-link" href="/images/fiber-ready-board.png" target="_blank" rel="noreferrer">View the full poster</a></div>
      </div>
    </section>
  );
}
