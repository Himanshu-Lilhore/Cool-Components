// usage :
{
    /* 
    <div className="w-max heroText opacity-0 mob:hidden">
        <HeroButton
            widthVw={29}
            heightVw={4.1}
            duration={4}
            color="#D58300"
            title="Raised $2M to Build India’s #1 UG Platform"
        />
    </div>
    <div className="w-max heroText opacity-0 mob:block hidden">
        <div className="hidden mob:block">
            <HeroButtonMobile
                widthVw={87}
                heightVw={12}
                duration={4}
                color="#D58300"
                title="Raised $2M to Build India’s #1 UG Platform"
                view="mobile"
            />
        </div>
    </div> 
*/
}

import Image from "next/image";
import twoSparkles from "@/public/coolAssets/twoSparkles.png";
import Link from "next/link";

const HeroButton = ({ widthVw, heightVw, duration, color, title }) => {
    const viewBoxW = widthVw * 10;
    const viewBoxH = heightVw * 10;
    const inset = 5; // defines stroke width
    const pathD = `
    M ${inset},${inset}
    H ${viewBoxW - inset}
    V ${viewBoxH - inset}
    H ${inset}
    V ${inset}
  `.trim();

    return (
        <Link
            href=""
            target="_blank"
            className="relative bg-[#404040] rounded-[1.25vw] flex items-center justify-center overflow-hidden"
            style={{
                width: `${widthVw}vw`,
                height: `${heightVw}vw`,
                padding: "1px", // defines thickness (of border)
            }}
        >
            <div
                className="flex gap-2 z-20 relative
             bg-[#212121] w-full h-full rounded-[1.25vw] items-center justify-center"
            >
                <div className="relative w-[1.8vw] h-[1.8vw]">
                    <Image src={twoSparkles} alt="logo" />
                </div>
                <div className="text-[#FFFFFF] text-[1.2vw] font-montreal-regular">{title}</div>
            </div>
            {/* SVG overlay */}
            <svg
                className="absolute inset-0 z-10"
                width="100%"
                height="100%"
                viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                preserveAspectRatio="none"
            >
                <path
                    id="borderPath"
                    d={pathD}
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
                <TrailDots
                    count={15}
                    baseRadius={8}
                    color={color}
                    duration={duration}
                    trailFraction={0.008}
                />
            </svg>
        </Link>
    );
};
export default HeroButton;

export const TrailDots = ({ count, baseRadius, color, duration, trailFraction }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                const begin = (i * trailFraction * duration).toFixed(2) + "s";
                const r = baseRadius;
                const opacity = +((1 - i / (count - 1)) * 0.98 + 0.02).toFixed(2); // fade from 1.00 at i=0 to 0.02 at i=count-1
                return (
                    <circle key={i} r={r} fill={color} opacity={opacity}>
                        <animateMotion
                            dur={`${duration}s`}
                            repeatCount="indefinite"
                            rotate="auto"
                            begin={begin}
                        >
                            <mpath xlinkHref="#borderPath" />
                        </animateMotion>
                    </circle>
                );
            })}
        </>
    );
};
