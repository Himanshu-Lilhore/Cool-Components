// usage : <Comets count={20} />
import Image from "next/image";
import { useMemo } from "react";

export default function Comets({ count }) {
    const comets = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => {
                let x1, x2, y1, y2;
                x1 = Math.random() * 120;
                x2 = x1 - 50;
                if (i < 3) {
                    y1 = -50 + Math.random() * 50;
                } else {
                    y1 = Math.random() * 1000;
                }
                y2 = y1 + 100;
                return {
                    id: i,
                    xStart: x1,
                    xEnd: x2,
                    yStart: y1,
                    yEnd: y2,
                    duration: 6 + Math.random() * 6,
                    delay: (i < 3 ? Math.random() : 1.5) + Math.random() * 4,
                };
            }),
        [count]
    );

    return (
        <>
            <div className="comet-container curson-none mob:hidden">
                {comets.map(({ id, xStart, xEnd, yStart, yEnd, duration, delay }) => (
                    <div
                        key={id}
                        className="comet hue-rotate-270"
                        style={{
                            "--x-start": `${xStart}vw`,
                            "--x-end": `${xEnd}vw`,
                            "--y-start": `${yStart}vh`,
                            "--y-end": `${yEnd}vh`,
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                        }}
                    >
                        <Image src="/coolAssets/comet.png" alt="comet" fill />
                    </div>
                ))}
            </div>

            <style jsx>{`
                .comet-container {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: 0;
                }
                .comet {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 3vw;
                    height: 3vw;
                    opacity: 0;
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                @keyframes fall {
                    0% {
                        opacity: 0;
                        transform: translate(var(--x-start), var(--y-start));
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translate(var(--x-end), var(--y-end));
                    }
                }
            `}</style>
        </>
    );
}
